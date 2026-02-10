import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import App from "../App.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/mandelbrot",
  },
  {
    path: "/:formulaId/:presetId?",
    name: "fractal",
    component: App,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
