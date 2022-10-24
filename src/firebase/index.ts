import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';
import { firebaseConfig } from './config';

/**
 * @summary firebaseの初期化
 * @see https://firebase.google.com/docs/web/setup?sdk_version=v9#add-sdks-initialize
 * @todo
 * ```
 * import { initializeApp } from 'firebase/app';
 * ```
 */
firebase.initializeApp(firebaseConfig);

// 以下便利機能宣言
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase.functions();
export const FirebaseTimestamp = firebase.firestore.Timestamp;
