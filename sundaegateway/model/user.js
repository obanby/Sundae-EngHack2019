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

module.exports.signUpUser = (phone, name, location, password, callback) => {
  firebase.database().ref(`users/user:${phone}`).set({
    phone: phone,
    name: name,
    location: location,
    password: password,
  })
  .then(_ => console.log("All gotchi!"))
  .catch(err => console.error(err));
}

module.exports.writeUserData = (phone, msg) => {
  // TODO: validate user exeist
  return firebase.database().ref(`users/user:${phone}/message`).child(msg.timeStamp).set({
    text: msg.text,
    timeStamp: msg.timeStamp,
  });
}

module.exports.getUserMsgs = (phone) => {
  // TODO: Check how to handle errors
  return new Promise((resolve, reject) => {
    firebase.database().ref(`users/user:${phone}/message`).on('value', (data) => {
      let messages = data.val();
      let keys = Object.keys(messages);
      const newMsgs = keys.map((key) => {
        return {
          text: messages[key].text,
          timeStamp: messages[key].timeStamp,
        }
      });
      console.log(newMsgs, '111s');
      resolve(newMsgs);
    });
  });
}

// ! TODO
module.exports.getUsers = (callback) => {
  firebase.database().ref('users').on(`value`, gotDataforUsers, errData);
}

module.exports.findUserbyPhone = (phone, callback) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref(`users/user:${phone}`).on(`value`, (data) => {
      let user = data.val();
      resolve(user);
    }, (err) => reject(err));
  });
}

 // test
const gotDataforUsers = (data) => {
  // console.log(data.val());
  let users = data.val();
  let keys = Object.keys(users);
  console.log(keys);
  return keys
}
