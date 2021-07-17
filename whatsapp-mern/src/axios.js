import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:21125', //if launch on heroku then paste here backend url
});

export default instance;