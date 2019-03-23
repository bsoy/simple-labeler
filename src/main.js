import Vue from 'vue'
import {Option, Select, Popover, Button, Dialog, Steps, Step, Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vuescroll from 'vuescroll/dist/vuescroll-native';

import App from './App.vue'
import './assets/styles/global.scss'

Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'small' }
Vue.use(Option)
Vue.use(Select)
Vue.use(Popover)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Steps)
Vue.use(Step)
Vue.component(Message.name, Message)
Vue.prototype.$message = Message;

Vue.use(vuescroll, {
  ops: {
    vuescroll: {},
    scrollPanel: {},
    rail: {},
    bar: {
      background: '#a8a8a8',
      onlyShowBarOnScroll: false
    }
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
