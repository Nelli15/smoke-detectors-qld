import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  browserSessionPersistence,
  browserPopupRedirectResolver,
  connectAuthEmulator,
} from 'firebase/auth';
import {
  initializeFirestore,
  enableMultiTabIndexedDbPersistence,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// import { Platform } from 'quasar'

// eslint-disable-next-line prefer-const
let firestoreSettings: unknown = {};

const config = {
  apiKey: 'AIzaSyD35VxqB01D-d1wxvixZONVK7GL8pGGk2Q',
  authDomain: 'smoke-detectors-qld.firebaseapp.com',
  projectId: 'smoke-detectors-qld',
  storageBucket: 'smoke-detectors-qld.appspot.com',
  messagingSenderId: '350089064821',
  appId: '1:350089064821:web:343673992ab75525ace33c',
};

const firebaseApp = initializeApp(config);

const storageApp = getStorage(firebaseApp);

if (location.hostname === 'localhost') {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(
      location.hostname === 'localhost'
        ? 'DDA53510-942D-473A-8575-012F37921DE5'
        : '6LejSkAdAAAAAEfqCCBf4ZLbERkaRKIIRHQF2sH5'
    ),
  });
} else {
  const appCheck = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(
      '6LejSkAdAAAAAEfqCCBf4ZLbERkaRKIIRHQF2sH5'
    ),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true,
  });
}

if (location.hostname === 'localhost') {
  // firestoreSettings.host = 'localhost:8080';
  firestoreSettings.ssl = false;
  firestoreSettings.experimentalAutoDetectLongPolling = true;
  connectFunctionsEmulator(getFunctions(firebaseApp), 'localhost', 5001);
  // useDatabaseEmulator(dbApp, "localhost", "9000")
  connectStorageEmulator(storageApp, 'localhost', 9199);
}
// firestoreSettings.experimentalAutoDetectLongPolling = true;
// firestoreSettings.cacheSizeBytes = CACHE_SIZE_UNLIMITED;
if (window.Cypress) {
  // Needed for Firestore support in Cypress (see https://github.com/cypress-io/cypress/issues/6350)
  firestoreSettings.experimentalForceLongPolling = true;
}

const db = initializeFirestore(firebaseApp, firestoreSettings); // .settings(firestoreSettings)
connectFirestoreEmulator(db, 'localhost', 8080);
const funcs = getFunctions();
// if (process.env.PROD) {
enableMultiTabIndexedDbPersistence(db).catch(function (err) {
  console.log(err);
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
    console.log(err);
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
    console.log(err);
  }
});
// }

const authApp = initializeAuth(firebaseApp, {
  persistence: browserSessionPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});

if (location.hostname === 'localhost') {
  connectAuthEmulator(authApp, 'http://127.0.0.1:9099');
}

export const $firebase = firebaseApp;
export const $auth = authApp;

export default {
  $firebase,
  $auth,
};
