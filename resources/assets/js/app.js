
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import moment from 'moment';
import { Form, HasError, AlertError } from 'vform';


window.Form = Form; // Form指import的Form,window.Form,F要大寫,Users.vue在NewForm時才會成功
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)


import VueRouter from 'vue-router'
Vue.use(VueRouter)

// https://router.vuejs.org/guide/#javascript
// 將const改成let
let routes = [
    { path: '/dashboard', component: require('./components/Dashboard.vue') },
    { path: '/users', component: require('./components/Users.vue') },
    { path: '/profile', component: require('./components/Profile.vue') }
]

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

// 在.vue檔案中,只要調用upText,就能將字母第一個字顯示改成大寫
Vue.filter('upText', function (text) {
    // https://vuejs.org/v2/guide/filters.html#ad
    return text.charAt(0).toUpperCase() + text.slice(1)
});

Vue.filter('myDate',function (created) {
    return moment(created).format('MMMM Do YYYY');
})

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));

const app = new Vue({
    el: '#app',
    router
});
