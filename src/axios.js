import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://baje724.ir/api'
});

// instance.interceptors.request...

export default instance;