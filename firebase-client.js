// Firebase connection for Digital Agency by Chandan Das
const firebaseConfig = {
  apiKey: "AIzaSyAPX-F-CpUVmyn_RlF8My6pzY_QGM4XunU",
  authDomain: "digital-agency-by-chandan-das.firebaseapp.com",
  projectId: "digital-agency-by-chandan-das",
  storageBucket: "digital-agency-by-chandan-das.firebasestorage.app",
  messagingSenderId: "576373782793",
  appId: "1:576373782793:web:7ddd852c3c90d78acd7bd8",
  measurementId: "G-E35HVVTKBG"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
