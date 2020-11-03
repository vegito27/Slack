  import firebase from 'firebase/app'
  import "firebase/auth" 
  import "firebase/database"
  import "firebase/storage"

  var firebaseConfig = {
    apiKey: "AIzaSyD4OQBlhFcAJN8ysCtedFF2VIQxAI0DDGQ",
    authDomain: "slack-3ac4c.firebaseapp.com",
    databaseURL: "https://slack-3ac4c.firebaseio.com",
    projectId: "slack-3ac4c",
    storageBucket: "slack-3ac4c.appspot.com",
    messagingSenderId: "545706062267",
    appId: "1:545706062267:web:1860c3159747661fea149e",
    measurementId: "G-GMFRYM7T0W"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase
