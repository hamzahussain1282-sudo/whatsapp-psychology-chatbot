import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home.vue";
import About from "../views/about.vue"; // Capital A

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/home", component: Home },
    { path: "/about", component: About },
    { path: "/", redirect: "/home" }, // default route
  ],
});

export default router;
