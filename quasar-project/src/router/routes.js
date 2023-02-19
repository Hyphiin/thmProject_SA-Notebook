import MainLayout from "../layouts/MainLayout.vue";
import MainPage from "../pages/MainPage.vue";
import AllSTT from "../pages/AllSTT.vue";
import NEWRecipe from "../pages/NEW_AddRecipePage_STT1.vue";
import AddRecipePage_STT2 from "../pages/NEW_AddRecipePage_STT2.vue";
// import AddRecipePage_STT3 from "../pages/AddRecipePage_STT3.vue";
import AddRecipePage_STT4 from "../pages/NEW_AddRecipePage_STT1.vue";
import AddRecipePage_STT5 from "../pages/NEW_AddRecipePage_STT3.vue";
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
        path: "/add-recipe-STT3",
        name: "addRecipe_STT3",
        component: AddRecipePage_STT4,
      },
      {
        path: "/add-recipe-STT4",
        name: "addRecipe_STT4",
        component: AddRecipePage_STT4,
      },
      {
        path: "/add-recipe-STT5",
        name: "addRecipe_STT5",
        component: AddRecipePage_STT5,
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
