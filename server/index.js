const express = require('express');
const router = require('./routes');
const connectDB = require('./lib/connect');
const cookieParser = require('cookie-parser'); 
const cors = require('cors');

const app = express();
app.use(cookieParser());
app.use(express.json());

// localhost:3000/api/sign-in
// localhost:3000/api/add-income

app.use(
  cors({  
  origin: ['http://localhost:5173', 'https://node-js-ovqm.onrender.com'],
    credentials: true,
  })
)


app.use('/api',router);

app.listen(3000, () => {
  connectDB();
  console.log('Server is running on http://localhost:3000');
});

