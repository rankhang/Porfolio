
export const environment = {
  firebase: {
    projectId: 'portfolio-a20d3',
    appId: '1:282877145756:web:07265f6e99d69e3017f359',
    databaseURL: 'https://portfolio-a20d3-default-rtdb.firebaseio.com',
    storageBucket: 'portfolio-a20d3.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyBfSzbYUs1znH5a6xImSlQgDWr1fTiArXA',
    authDomain: 'portfolio-a20d3.firebaseapp.com',
    messagingSenderId: '282877145756',
    measurementId: 'G-XYB5N1YS0H',
  },
  production: true,
  VERSION: require('../../package.json').version,
  firebaseConfig: {
    apiKey: "AIzaSyBfSzbYUs1znH5a6xImSlQgDWr1fTiArXA",
    authDomain: "portfolio-a20d3.firebaseapp.com",
    projectId: "portfolio-a20d3",
    storageBucket: "portfolio-a20d3.appspot.com",
    messagingSenderId: "282877145756",
    appId: "1:282877145756:web:07265f6e99d69e3017f359",
    measurementId: "G-XYB5N1YS0H"
  }
};

// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


let firebaseApp;
// Initialize Firebase
try{
  firebaseApp = getApp();
}catch(e){
  firebaseApp = initializeApp(environment.firebase);
}
const analytics = getAnalytics(firebaseApp);
// Initialize Firebase
// const firebase = require('firebase/app').default
// let firebaseApp;
// if (!firebase.apps.length) {
//   firebaseApp = firebase.initializeApp(environment.firebaseConfig)
// }
// const analytics = getAnalytics(firebaseApp);
// const app = initializeApp(environment.firebaseConfig);
// getApps().length === 0 ? initializeApp(environment.firebaseConfig) : getApp();


