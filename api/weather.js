import { API_KEY } from '../constants';
import axios from 'axios';

const forecastEndpoint = params=>`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=yes`
const locationEndpoint = params=>`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`


const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }
    try{
        const res = await axios.request(options);
        // console.log(res.data)
        return res.data
    } catch(err){
        console.log('error: ',err);
        return null;
    }
}

export const fetchWeatherForecast = params => {
    return apiCall(forecastEndpoint(params));
}

export const fetchLocations = params => {
    return apiCall(locationEndpoint(params));
}