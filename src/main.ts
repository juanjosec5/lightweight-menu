import { createApp } from 'vue';
import './style.css';
import './theme.css';
import './plugins/fontawesome';

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import App from './App.vue';

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
