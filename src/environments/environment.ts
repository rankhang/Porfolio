// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
  production: false,
  VERSION: require('../../package.json').version
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import * as firebase from "firebase/compat";
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
// const app = initializeApp(environment.firebaseConfig);
// getApps().length === 0 ? initializeApp(environment.firebaseConfig) : getApp();
