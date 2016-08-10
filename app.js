import Rx from 'rx';
import Vue from 'vue';
import VueRx from 'vue-rx';

import {Client} from 'theseus';
import {Http} from 'any-http-reqwest';

import apiUriByEnv from './config/media-api.js';


Vue.use(VueRx, Rx)

const client = new Client({
    promise: Promise,
    http: new Http({
        withCredentials: true
    })
});
  
const MediaApi = {      
  quotas: function quotas() {
    const apiUrl = apiUriByEnv["PROD"];
    const api = client.resource(apiUrl);

    return Rx.Observable.fromPromise(
      api.get()
    );
  }
};

const usageQuotaValuesObservable = MediaApi.quotas().map((o) => {
	var quotas = []; 
	Object.keys(o.data.store).forEach(function (key) {
		var obj = o.data.store[key];
		obj.id = key;
		obj.percent = (obj.fractionOfQuota * 100).toFixed(2);

		
		quotas.push(obj)
	});
	console.log(quotas);
	return quotas; 
});

new Vue({
  el: '#app',
  data: {
    message: usageQuotaValuesObservable 
  }
})
