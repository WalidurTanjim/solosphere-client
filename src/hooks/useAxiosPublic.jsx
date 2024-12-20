import axios from 'axios';
import React from 'react';

const axiosPublic = axios.create({
    baseURL: import.meta.end.VITE_backend_url
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;