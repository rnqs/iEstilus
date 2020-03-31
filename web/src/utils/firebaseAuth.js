import firebase from "firebase";

const config = {
  apiKey: "AIzaSyAPRadddDRJAa52z81-DqRfD5LTxNbGI2E",
  authDomain: "tcc-f-18eb7.firebaseapp.com",
  databaseURL: "https://tcc-f-18eb7.firebaseio.com",
  projectId: "tcc-f-18eb7",
  storageBucket: "tcc-f-18eb7.appspot.com",
  messagingSenderId: "917597430031",
  appId: "1:917597430031:web:0915d1fa1fd62477f41e7a",
  measurementId: "G-DHXSQBG6YK"
};

const firebaseApp = firebase.initializeApp(config);

const firebaseAuth = firebaseApp.auth();

firebaseAuth.languageCode = 'pt';

export default firebaseAuth;
