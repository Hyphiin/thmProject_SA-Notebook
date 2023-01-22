import MainLayout from "../layouts/MainLayout.vue";
import MainPage from "../pages/MainPage.vue";
import AddRecipePageSTT_All from "../pages/AddRecipePage_STTAll.vue";
import AddRecipePage_STT1 from "../pages/AddRecipePage_STT1.vue";
import NEWRecipe from "../pages/NEW_AddRecipePage_STT1.vue";
import AddRecipePage_STT2 from "../pages/AddRecipePage_STT2.vue";
// import AddRecipePage_STT3 from "../pages/AddRecipePage_STT3.vue";

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
        path: "/add-recipe-STT_All",
        name: "addRecipeSTT_All",
        component: AddRecipePageSTT_All,
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
      // {
      //   path: "/add-recipe-STT3",
      //   name: "addRecipe_STT3",
      //   component: AddRecipePage_STT3,
      // },
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
