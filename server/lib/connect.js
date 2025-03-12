const mongoose = require('mongoose');

const connectDb = () => {
    mongoose.connect(process.env.DB_URL);
    const database = mongoose.connection;

    database.on('error', (error) => {
        console.log('Database connection error', error);
    });
    
    database.once('open', () => {
        console.log('Connected to the database');
    });
};

module.exports = connectDb;