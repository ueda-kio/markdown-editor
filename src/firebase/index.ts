// import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';
// import 'firebase/storage';
// import 'firebase/functions';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

/**
 * @summary firebaseの初期化
 * @see https://firebase.google.com/docs/web/setup?sdk_version=v9#add-sdks-initialize
 * @todo
 * ```
 * import { initializeApp } from 'firebase/app';
 * ```
 */
const firebaseApp = initializeApp(firebaseConfig);

// 以下便利機能宣言
const provider = new GoogleAuthProvider();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
// export const storage = firebase.storage();
// export const functions = firebase.functions();
// export const FirebaseTimestamp = firebase.firestore.Timestamp;
