
import { getIdToken, onAuthStateChanged } from 'firebase/auth';
import { doc, getFirestore, updateDoc, getDoc, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';
import { $auth } from './../boot/firebase';
// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  example: unknown;
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> =
  Symbol('vuex-key');

export default store(function (/* { ssrContext } */) {
  const Store = createStore<StateInterface>({
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });

  onAuthStateChanged($auth, (user) => {
    // console.log(Store)
    if (user && $auth.currentUser) {
      // console.log(user)
      const { displayName, email, uid, photoURL } = user;
      const cleanedUser = { displayName, email, photoURL, uid };
      Store.commit('auth/setUser', cleanedUser);
      getIdToken($auth.currentUser, /* forceRefresh */ true)
        .then((idToken) => {
          Store.commit('auth/setIdToken', idToken);
          if (Store.state.projects.project.id) {
            Store.dispatch(
              'transactions/fetchTransactions',
              Store.state.projects.project.id
            );
          }
          Store.commit('auth/setUserLoadStatus', true);
        })
        .catch((err) => console.log(err));
      getDoc(doc(getFirestore(), `/users/${cleanedUser.uid}`))
        .then((userSnap: DocumentSnapshot<DocumentData> as User) => {
          if (
            cleanedUser.displayName !== userSnap.displayName ||
            cleanedUser.photoURL !== userSnap.photoURL
          ) {
            updateDoc(doc(getFirestore(), `/users/${cleanedUser.uid}`), {
              photoURL: cleanedUser.photoURL,
              name: cleanedUser.displayName,
            }).catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    } else {
      Store.commit('auth/setUser', {});
      Store.commit('auth/setUserLoadStatus', true);
    }
  });

  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}
