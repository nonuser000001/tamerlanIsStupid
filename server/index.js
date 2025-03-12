const express = require('express');
const router = require("./routes");
const connectDb = require('./lib/connect.js');
const cookieParser =require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    cors({
        origin: ['http://localhost:5173','http://localhost:5174', 'https://node-js-ovqm.onrender.com'],
        credentials:true,
    })
);
app.use('/api',router)
console.log(process.env.DB_URL)

app.listen(3000, () => {
    connectDb();
    console.log('server is running on http://localhost:3000');
});