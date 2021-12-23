import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  {
    path: '/cart',
    component: () => import('layouts/private.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/cart.vue'),
        beforeEnter: () => isAdmin(),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;

async function isAdmin() {
  const user = await AuthUser();
  if (!user) return { name: 'login' };

  // const res = await getDoc(doc(getFirestore(), `/admins/${user.uid}`)).catch(
  //   (err: any) => {
  //     console.log(err);
  //     return { name: 'login' };
  //   }
  // );
  // console.log(res)
  // if (!res || !res.exists()) return { name: 'dashboard' };
  // if (res) {
  //   if (res.get('permission') !== 'admin') return { name: 'dashboard' };
  // }
  return;
}

async function isLoggedIn(to: any, from: any) {
  const user = await AuthUser();
  if (!user) return { name: 'login' };
}

function AuthUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        resolve(false);
      } else {
        resolve(user);
      }
    });
  });
}
function getDoc(arg0: any) {
  throw new Error('Function not implemented.');
}

function doc(arg0: any, arg1: string): any {
  throw new Error('Function not implemented.');
}

function getFirestore(): any {
  throw new Error('Function not implemented.');
}

function onAuthStateChanged(arg0: any, arg1: (user: any) => void) {
  throw new Error('Function not implemented.');
}

function getAuth(): any {
  throw new Error('Function not implemented.');
}
