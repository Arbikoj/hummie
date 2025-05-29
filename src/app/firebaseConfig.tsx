import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
    apiKey: 'AIzaSyDNstxcXCu-2jCn2lgsyPZsOyI_pJVSO5g',
    authDomain: 'rtcmonitor.firebaseapp.com',
    databaseURL: 'https://rtcmonitor-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'rtcmonitor',
    storageBucket: 'rtcmonitor.firebasestorage.app',
    messagingSenderId: '554545015281',
    appId: '1:554545015281:web:e6acb9c5ae59a794bdbc50',
    measurementId: 'G-PG4TQ1E28R',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
