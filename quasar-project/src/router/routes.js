import MainLayout from "../layouts/MainLayout.vue";
import MainPage from "../pages/MainPage.vue";
import AddRecipePage from "../pages/AddRecipePage-DSOne.vue";

const routes = [
  {
    path: "/",
    name: "mainlayout",
    component: MainLayout,
    children: [
      {
        path: "/",
        name: "mainpage",
        component: MainPage,
      },
      {
        path: "/add-recipe",
        name: "addRecipe",
        component: AddRecipePage,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
