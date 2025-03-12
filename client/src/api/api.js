import axios from 'axios';
const baseURL = process.env.NODE_ENV === 'production' 
? '/api' 
: 'http://localhost:3000/api';


export default axios.create({

    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});