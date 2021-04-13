import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://baje724.ir/api'
});

// instance.interceptors.request...

instance.defaults.headers.common = {'Authorization':localStorage.getItem("token")};

export default instance;