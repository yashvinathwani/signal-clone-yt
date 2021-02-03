import * as firebase from 'firebase';
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA_bCkIg4jSUBcpriRV9I9xCzRcsZom5yY",
    authDomain: "signal-clone-yt-36d43.firebaseapp.com",
    projectId: "signal-clone-yt-36d43",
    storageBucket: "signal-clone-yt-36d43.appspot.com",
    messagingSenderId: "435265181198",
    appId: "1:435265181198:web:f3dd6aca62ea5de25f4e5f"
};

let app;

if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db , auth}