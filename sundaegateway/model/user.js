// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");


const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "sundae-d9273.firebaseapp.com",
  databaseURL: "https://sundae-d9273.firebaseio.com",
  projectId: "sundae-d9273",
  storageBucket: "sundae-d9273.appspot.com",
  messagingSenderId: "231094936316",
  appId: "1:231094936316:web:b53836dff50a28fa"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// console.log(firebase);

// Get a reference to the database service
var database = firebase.database();

module.exports.signUpUser = (phone, name, location, password) => {
  firebase.database().ref(`users/user:${phone}`).set({
    phone: phone,
    name: name,
    location: location,
    password: password,
  });
}

module.exports.writeUserData = (phone, msg) => {
  firebase.database().ref(`users/user:${phone}/message`).child(msg.timeStamp).set({
    text: msg.text,
    timeStamp: msg.timeStamp,
  });
}

module.exports.getUserMsg = (phone) => {
  firebase.database().ref(`users/user:${phone}/message`).on('value', (data) => {
    // const msg = value.val();
    // console.log(msg);
    let messages = data.val();
    let keys = Object.keys(messages);
    // console.log(keys);
    const newMsgs = keys.map((key) => {
      return {
        text: messages[key].text,
        timeStamp: messages[key].timeStamp,
      }
    });
    console.log(newMsgs);
    return newMsgs;
  });
}

// ! TODO
module.exports.getUsers = () => {
  firebase.database().ref('users').on(`value`, gotDataforUsers, errData);
}

module.exports.findUserbyPhone = (phone) => {
  firebase.database().ref(`users/user:${phone}`).on(`value`, gotData, errData);
}

 // test
const gotDataforUsers = (data) => {
  // console.log(data.val());
  let users = data.val();
  let keys = Object.keys(users);
  console.log(keys);
  return keys
}

const gotData = (data) => {
  // console.log(data.val());
  let user = data.val();
  console.log(user);
  return user;
//   let keys = Object.keys(users);
//   const newUser = {
//       name: user[]
//   }
}

const errData = (err) => {
  console.log(err);
  console.log('err');
}