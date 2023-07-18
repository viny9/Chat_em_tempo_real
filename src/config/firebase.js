import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCLyrD_VtYwZ3QNr64l6DZ_LHACa7tpPGU",
    authDomain: "whatsappdatabase-d497f.firebaseapp.com",
    databaseURL: "https://whatsappdatabase-d497f-default-rtdb.firebaseio.com",
    projectId: "whatsappdatabase-d497f",
    storageBucket: "whatsappdatabase-d497f.appspot.com",
    messagingSenderId: "145883508274",
    appId: "1:145883508274:web:78ce13eecfd2be3447562b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { database, auth, storage, }