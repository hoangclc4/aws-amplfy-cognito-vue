import Vue from 'vue';
import App from './App.vue';
import * as AmplifyModules from 'aws-amplify';
import { AmplifyPlugin } from 'aws-amplify-vue';
import awsconfig from './aws-exports';
AmplifyModules.Amplify.configure(awsconfig);

import {
  AmazonAIPredictionsProvider,
  Predictions,
} from '@aws-amplify/predictions';
Predictions.addPluggable(new AmazonAIPredictionsProvider());
Vue.use(AmplifyPlugin, AmplifyModules);

Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
}).$mount('#app');
