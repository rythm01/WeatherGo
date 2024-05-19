import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useState } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../theme'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'
import { debounce } from 'lodash'
import { fetchLocations, fetchWeatherForecast } from '../api/weather'
import * as Progress from 'react-native-progress'

import { weatherImages } from '../constants'
import { getData, storeData } from '../utils/asyncStorage'


export default function HomeScreen() {
    const [showSearch, setShowSearch] = useState(false)
    const [showLoading, setShowLoading] = useState(true)
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});

    useEffect(() => {
        fetchMyAppData();
    }, [])

    const fetchMyAppData = async () => {
        let myCity = await getData('city');
        let cityName = 'Ahmedabad'

        if (myCity) cityName = myCity;
        fetchWeatherForecast({
            cityName,
            days: '7'
        }).then(data => {
            setWeather(data);
            setShowLoading(false)
        })
    }

    const handleSearch = value => {
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then(data => {
                setLocations(data)
            })
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])

    const handleLocation = (loc) => {
        // console.log('location: ', loc)
        setLocations([]);
        setShowSearch(false)
        setShowLoading(true)
        fetchWeatherForecast({
            cityName: loc.name,
            days: '7'
        }).then(data => {
            // console.log(data)
            setWeather(data);
            setShowLoading(false)
            storeData('city', loc.name)
        })
    }

    const { current, location, forecast } = weather;

    return (
        <View className='flex-1 relative'>
            <StatusBar style='light' />
            <Image source={require('../assets/images/bg.png')} className='absolute h-full w-full' />
            {
                showLoading ? (
                    <View className='flex-1 flex-row justify-center items-center'>
                        <Progress.CircleSnail thickness={10} size={140} color='#0bb3b2' />
                    </View>
                ) : (
                    <SafeAreaView className='flex flex-1'>
                        <View style={{ height: '7%' }} className='mx-4 relative z-50'>
                            <View className='flex-row justify-end items-center rounded-full mt-5'
                                style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}>
                                {
                                    showSearch ? (
                                        <TextInput
                                            onChangeText={handleTextDebounce}
                                            placeholder='Search city..'
                                            placeholderTextColor={'lightgray'}
                                            className='pl-6 h-10 flex-1 text-base text-white' />
                                    ) : null
                                }
                                <TouchableOpacity style={{ backgroundColor: theme.bgWhite(0.3) }}
                                    onPress={() => setShowSearch(!showSearch)}
                                    className='rounded-full p-3 m-1'>
                                    <MagnifyingGlassIcon size='25' color='white' />
                                </TouchableOpacity>
                            </View>
                            {
                                locations.length > 0 && showSearch ? (
                                    <View className='absolute w-full bg-gray-300 top-20 rounded-3xl'>
                                        {
                                            locations.map((loc, index) => {
                                                let showBorder = index + 1 != locations.length;
                                                let borderClass = showBorder ? 'border-b-2 border-b-gray-400' : '';

                                                return (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => handleLocation(loc)}
                                                        className={'flex-row items-center border-0 p-3 px-4 mb-1' + borderClass}
                                                    >
                                                        <MapPinIcon size='20' color='gray' />
                                                        <Text> {loc?.name} {loc?.country}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                ) : null
                            }
                        </View>
                        <View className='mx-4 flex justify-around flex-1 mb-2'>
                            <Text className='text-white text-center text-2xl font-bold' >
                                {location?.name},
                                <Text className='text-gray-300 text-center text-lg font-semibold' >
                                    {" " + location?.country}
                                </Text>
                            </Text>

                            {/* <View className='flex-row justify-center'>
                                <Image source={weatherImages[current?.condition?.text]} className='w-52 h-52'
                                />
                            </View> */}
                            <View >
                                <Text className='text-center font-bold text-white text-6xl ml-5'>
                                    {current?.temp_c}&#176;
                                </Text>
                                <Text className='text-center text-white text-xl tracking-widest ml-5'>
                                    {current?.condition?.text}
                                </Text>
                            </View>
                            <View className='flex-row justify-between mx-4'>
                                <View className='flex-row space-x-2 items-center'>
                                    <Image source={require('../assets/icons/wind.png')} className='h-6 w-6' />
                                    <Text className='text-white font-semibold text-base'>
                                        {current?.wind_kph}Km
                                    </Text>
                                </View>
                                <View className='flex-row space-x-2 items-center'>
                                    <Image source={require('../assets/icons/drop.png')} className='h-6 w-6' />
                                    <Text className='text-white font-semibold text-base'>
                                        {current?.humidity}%
                                    </Text>
                                </View>
                                <View className='flex-row space-x-2 items-center'>
                                    <Image source={require('../assets/icons/sun.png')} className='h-6 w-6' />
                                    <Text className='text-white font-semibold text-base'>
                                        {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className='mb-2 space-y-3'>
                            <View className='flex-row items-center mx-5 space-x-2' >
                                <CalendarDaysIcon size='22' color='white' />
                                <Text className='text-white text-base'> Daily forecast </Text>
                            </View>
                            <ScrollView
                                horizontal
                                contentContainerStyle={{ paddingHorizontal: 15 }}
                                showsHorizontalScrollIndicator={false}
                            >
                                {
                                    forecast?.forecastday.map((item, index) => {
                                        let date = new Date(item.date);
                                        let options = { weekday: 'long' };
                                        let dayName = date.toLocaleDateString('en-US', options);
                                        dayName = dayName.split(',')[0]
                                        let conditionText = item?.day?.condition?.text;
                                        conditionText = conditionText.trim();
                                        return (
                                            <View
                                                key={index}
                                                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                                                style={{ backgroundColor: theme.bgWhite(0.15) }}
                                            >
                                                <Image source={weatherImages[conditionText]}
                                                    className='h-11 w-11'
                                                />
                                                <Text className='text-white'>{dayName}</Text>
                                                <Text className='text-white text-xl font-semibold'>{item?.day?.avgtemp_c}&#176;</Text>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </SafeAreaView >
                )
            }
        </View >
    )
}