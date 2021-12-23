<template>
  <div>
    <span>Logging out . . .</span>
  </div>
</template>
<script>
import { signOut, getAuth } from 'firebase/auth';
export default {
  mounted() {
    signOut(getAuth()).then(() => {
      window.location.href = '/login';
    });
  },
};
</script>
