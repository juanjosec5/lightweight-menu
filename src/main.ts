import { createApp } from 'vue';
import './style.css';
import './theme.css';
import './plugins/fontawesome';

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import App from './App.vue';
import { i18n } from './i18n';

createApp(App).use(i18n).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
