const mongoose = require('mongoose');
const Places = require('../models/places');
const cities = require('./cities')
const {places, descriptors} = require('./seedsHelper')
mongoose.connect('mongodb://localhost:27017/bonfire');

const db = mongoose.connection;

db.on("error", console.error.bind(console,"connection error: "));
db.once("open", ()=>{
    console.log('databases connection from seeds/index')
});

const sample = (array)=> array[Math.floor(Math.random()*array.length)];

const seedDb = async ()=>{
    await Places.deleteMany({})
    for(let i=0; i<250; i++){
        const rand = Math.floor(Math.random() * 1000)
        const price  = Math.floor(Math.random() *20)+10;
        const p = new Places({
            title: `${sample(descriptors)} ${sample(places)}`,
            location:`${cities[rand].city},${cities[rand].state}`,
            images : [ { url : "https://res.cloudinary.com/dcc6h5ouf/image/upload/v1650116468/BonFire/lsitmjqztttomijxjyci.webp", filename : "BonFire/lsitmjqztttomijxjyci",  }, { url : "https://res.cloudinary.com/dcc6h5ouf/image/upload/v1650116467/BonFire/fnimbjqzrrwgsg7j0o2m.jpg", filename: "BonFire/fnimbjqzrrwgsg7j0o2m" } ],
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis distinctio molestias, mollitia neque iusto ipsa repellat deleniti consequuntur quis delectus sit nobis eveniet. Commodi, repellat quaerat! Necessitatibus illo eligendi animi.",
            price:`${price}`,
            author:'62591427f95f1dd33e40752b',
            geometry:{ type: "Point", coordinates : [ cities[rand].longitude,cities[rand].latitude ] }
        });
        await p.save();
    }
}

seedDb().then(()=>{
    db.close();
})