import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBwDO2cteqEHgaUawz3JyADkzFSr6X5ces',
    authDomain: 'fir-realtime-test-162df.firebaseapp.com',
    databaseURL: 'https://fir-realtime-test-162df-default-rtdb.firebaseio.com',
    projectId: 'fir-realtime-test-162df',
    storageBucket: 'fir-realtime-test-162df.appspot.com',
    messagingSenderId: '60015207114',
    appId: '1:60015207114:web:eb9481c9cf46df30ac8a33'
  })
}

export default firebase
