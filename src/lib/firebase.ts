import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';


const firebaseAppletConfig = {
  apiKey: "AIzaSyAWKM_ZyTo1Qcq1Wo8hg3Cbn-vxp1sgemI",
  authDomain: "esp32-4e7c2.firebaseapp.com",
  databaseURL: "https://esp32-4e7c2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp32-4e7c2",
  storageBucket: "esp32-4e7c2.firebasestorage.app",
  messagingSenderId: "1019802145943",
  appId: "1:1019802145943:web:a69c7610559df8bc9745d2",
  measurementId: "G-2C1GPZSQEZ"
};
const app = initializeApp(firebaseAppletConfig);

export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);
