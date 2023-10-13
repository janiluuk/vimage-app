<template>
  <Toast></Toast>
    <div v-for="notification in notes">
      <Notification
        :key="notification.id"
        :notification="notification"
      ></Notification>
    </div>
</template>


<script>
import { mapGetters } from 'vuex';
import * as notificationGetters from '@/store/modules/notification/types/getters';
import Notification from '@/components/notification/Notification.vue';

export default {
  name: 'NotificationsComponent',
  components: { Notification },
  computed: {
    ...mapGetters('notification', {
      notes: notificationGetters.GET_NOTIFICATIONS
    })
  }
};
</script>

<style scoped>
.notifications-list {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
