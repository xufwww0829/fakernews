import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import StoriesView from "./views/StoriesView.vue";
import StoryView from "./views/StoryView.vue";
import UserView from "./views/UserView.vue";
import SubmitView from "./views/SubmitView.vue";
import LoginView from "./views/LoginView.vue";
import "./style.css";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/top" },
    { path: "/:type(top|new|best|ask|show)", component: StoriesView },
    { path: "/story/:id", component: StoryView },
    { path: "/user/:id", component: UserView },
    { path: "/submit", component: SubmitView },
    { path: "/login", component: LoginView },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

createApp(App).use(router).mount("#app");
