const mongoose = require("mongoose");
require('dotenv').config();

function DbConnect(){
    const DB_URL = process.env.DB_URL;
    
    mongoose.connect(DB_URL, {
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
        //useFindAndModify: false,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
        console.log('MongoDB connected successfully');
    });
}

module.exports = DbConnect;