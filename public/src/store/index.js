import vue from 'vue';
import vuex from 'vuex';
import axios from 'axios';
import router from '../router/index';
import authStore from './auth-store'


var geocode = axios.create({
    baseURL: "https://maps.googleapis.com/maps/api/geocode/json?address=",
    // timeout: 3000
});

var serverAPI = axios.create({
    baseURL: "//localhost:3000/api/",
    // timeout: 3000,
    withCredentials: true
})

var placesAPI = axios.create({
    baseURL: 'https://maps.googleapis.com/maps/api/place/nearbysearch',
    timeout: 3000
})

// var directions = axios.create({
//     baseURL: "https://www.google.com/maps/embed/v1/directions?key=AAIzaSyDncWlc5Zb37QYDvrCT88Dybb6KsHwZ9HQ&origin=",
//     timeout: 3000
// })
var distanceAPI = axios.create({
    baseURL: 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=',
    // timeout: 3000
})

var apiKey = "&key=AIzaSyCRj2cIdsswa8ob1lrGiHco48vVlV_mW0U"
var baseMap = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyCRj2cIdsswa8ob1lrGiHco48vVlV_mW0U&origin="

vue.use(vuex);

export default new vuex.Store({
    state: {
        user: {},
        map: {},
        voyage: {
            origin: {
                lat: 0,
                lng: 0
            },
            destination: {
                lat: 0,
                lng: 0
            }
        },
        midway: {},
        roadMidway: {},
        options: [],
        midWayResults: [],
        roadResults: [],
        originAddress: '',
        destinationAddress: ''
    },
    modules: {
        authStore
    },
    mutations: {
        setMapOrigin(state, payload) {
            console.log("this is our SETMAP PAYLOAD ORIGIN!", payload)
            vue.set(state.voyage.origin, "lat", payload.lat)
            vue.set(state.voyage.origin, "lng", payload.lng)
        },
        setMapDestination(state, payload) {
            console.log("this is our SETMAP PAYLOAD DESTINATION!", payload)
            vue.set(state.voyage.destination, "lat", payload.lat)
            vue.set(state.voyage.destination, "lng", payload.lng)
        },
        updateUser(state, payload) {
            state.user = payload
        },
        setMidway(state, payload){
            console.log('setMIDWAY,', payload)
            state.midway = payload
        },
        setRoadMidway(state, payload){
            state.roadMidway = payload
        },
        setResults(state, payload){
            state.midWayResults = payload
        },
        setRoadResults(state, payload){
            state.roadResults = payload
        },
        setOriginAddress(state, payload){
            state.originAddress = payload
        },
        setDestinationAddress(state, payload){
            state.destinationAddress = payload
        }
    },
    actions: {
        //direction actions
        getTripOrigin({ commit, dispatch }, payload) {
            return new Promise((resolve, reject)=>{
                geocode.get(payload.origin + apiKey).then(res => {
                    var data = res.data.results[0]
                    commit('setOriginAddress', data.formatted_address)
                    commit('setMapOrigin', { lat: data.geometry.location.lat, lng: data.geometry.location.lng})
                    resolve({ lat: data.geometry.location.lat, lng: data.geometry.location.lng })
                })
                    .catch(error => {
                        console.log(error)
                        reject()
                    })
            })
        },
        getTripDestination({ commit, dispatch }, payload) {
            return new Promise((resolve, reject)=>{
                geocode.get(payload.destination + apiKey).then(res => {
                    var data = res.data.results[0]
                    commit('setDestinationAddress', data.formatted_address)
                    commit('setMapDestination', { lat: data.geometry.location.lat, lng: data.geometry.location.lng })
                    resolve({ lat: data.geometry.location.lat, lng: data.geometry.location.lng })
                })
                    .catch(error => {
                        console.log(error)
                        reject()
                    })
                // commit('setMap', geocode + payload.origin + apiKey)

            })
        },
        getDistance({ commit, dispatch }, payload) {

            distanceAPI.get(payload.orgin.lat + ',' + payload.orgin.lng + '&destinations=' + payload.destination.lat + ',' + payload.destination.lng + apiKey)
                .then(res => {
                    console.log('DISTANCE DATA:', res.data)
                        // dispatch distance to another function that 
                })
        },
        getPlaces({ commit, dispatch }, payload) {
            serverAPI.post('google', payload)
                .then(res => {
                    console.log('GOOGLE PLACES RESULTS', res.data)
                    commit('setRoadResults', res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
});