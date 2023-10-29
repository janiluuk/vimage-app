<template>
  <div>Authorized by {{ provider }}</div>
</template>

<script>
import * as notificationActions from '@/store/modules/notification/types/actions';
import * as actions from '@/store/modules/auth/types/actions';
import { mapActions } from 'vuex';

export default {
  name: 'SocialiteAuth',
  props: ['provider'],
  methods: {
    ...mapActions('AuthService', {
      fetchLoggedUser: actions.FETCH_LOGGED_USER,
      login: actions.PROVIDER_CALLBACK
    }),
    ...mapActions('notification', {
      setErrorNotification: notificationActions.SET_ERROR_NOTIFICATION
    }),
    async loginUser() {

      
      await this.login({
        code: this.$route.query.code,
        scope: this.$route.query.scope,
        authuser: this.$route.query.authuser,
        provider: this.provider
      });

      await this.fetchLoggedUser();

      await this.$router.push({ name: 'Library' });
    }
  },
  mounted() {
    this.loginUser();
  }
};
</script>

<style scoped></style>
