import { defineStore } from "pinia";
import { ref } from "vue";

export const useStoreGeneral = defineStore("generalStore", () => {
  const activeStore = ref("");

  /**
   * actions
   */
  const changeActiveStore = async (newActiveStore) => {
    activeStore.value = newActiveStore;
  };

  return {
    activeStore,
    changeActiveStore,
  };
});
