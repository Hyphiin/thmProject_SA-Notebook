import MainLayout from "../layouts/MainLayout.vue";
import MainPage from "../pages/MainPage.vue";
import AllSTT from "../pages/AllSTT.vue";
import NEWRecipe from "../pages/NEW_AddRecipePage_STT1.vue";
import AddRecipePage_STT2 from "../pages/AddRecipePage_STT2.vue";
import ShowRecipePage from "../pages/ShowRecipePage.vue";

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
        path: "/all-STT",
        name: "allSTT",
        component: AllSTT,
      },
      {
        path: "/add-recipe-STT1",
        name: "NEWRecipe",
        component: NEWRecipe,
      },
      {
        path: "/add-recipe-STT2",
        name: "addRecipe_STT2",
        component: AddRecipePage_STT2,
      },
      {
        path: "/show-recipe/:id",
        name: "show_recipe",
        component: ShowRecipePage,
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
