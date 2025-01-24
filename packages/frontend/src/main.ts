import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { createPinia } from "pinia";
import { configure } from "vee-validate";
import { createApp } from "vue";
import App from "~/App.vue";
import router from "~/router";
import "~/assets/styles.css";


const app = createApp(App);
const pinia = createPinia();

dayjs.extend(relativeTime);
configure({
  validateOnModelUpdate: false,
});

app.use(router);
app.use(pinia);
app.mount("#app");
