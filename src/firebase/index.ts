import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

/**
 * @summary initialize firebase
 * @see https://firebase.google.com/docs/web/setup?sdk_version=v9#add-sdks-initialize
 */
const firebaseApp = initializeApp(firebaseConfig);

// 以下便利機能宣言
const provider = new GoogleAuthProvider();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
// export const storage = firebase.storage();
// export const functions = firebase.functions();
// export const FirebaseTimestamp = firebase.firestore.Timestamp;
