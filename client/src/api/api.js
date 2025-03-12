import axios from 'axios';
const baseURL = process.env.NODE_ENV === 'production' 
? '/api' 
: 'https://tamerlanisstupid.onrender.com/api';


export default axios.create({

    baseURL: 'https://tamerlanisstupid.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
