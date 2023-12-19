import { createRouter, createWebHistory } from "vue-router"
import MapView from "../views/MapView.vue"
import ContributorsView from "../views/ContributorsView.vue"
import AddNadeView from "../views/AddNadeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/map/mirage",
    },
    {
      path: "/map/:mapname",
      name: "map",
      component: MapView,
    },
    {
      path: "/contributors",
      name: "contributors",
      component: ContributorsView,
    },
    {
      path: "/addnade",
      name: "addnade",
      component: AddNadeView,
    },
  ],
})

export default router
