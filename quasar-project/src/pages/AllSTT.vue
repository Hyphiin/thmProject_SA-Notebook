<template>
  <div class="container-all">
    <q-btn color="primary" outline class="q-ma-md" to="/">Abbrechen</q-btn>
    <div class="flex justify-center q-pa-md container-all_content">
      <div class="texts flex column content-center q-ma-md items-center">
        <p class="to-do-text">Mit der Aufnahme starten</p>
        <div class="btnDiv">
          <div class="recBtn flex justify-center">
            <q-btn
              size="32px"
              round
              stack
              color="accent"
              :icon="recording === false ? 'mic' : 'mic_off'"
              @click="toggleRecording"
            >
              <q-tooltip anchor="center right" self="center start">
                {{
                  recording === false ? "Aufnahme starten" : "Aufnahme stoppen"
                }}
              </q-tooltip>
            </q-btn>
          </div>
          <div class="showTextDiv flex no-wrap">
            <q-label>Speech To Text 1</q-label>
            <div id="p-tagDiv1" class="p-tagDiv"></div>
            <div id="p-tagDiv2" class="p-tagDiv"></div>
            <div id="p-tagDiv3" class="p-tagDiv"></div>
          </div>
        </div>

        <q-btn
          dense
          class="showTextDiv_btn"
          color="primary"
          label="Speichern"
          @click="saveRecording"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref } from "vue";
import { Notify } from "quasar";
import { useRouter } from "vue-router";
import { useStoreAllRecordings } from "src/stores/storeAllRecordings";

/**
 * router
 */
const router = useRouter();

/**
 * store
 */
const storeRecordings = useStoreAllRecordings();

/**
 * recipe data
 */
const recordingData = ref("");

/**
 * save in store
 */
const onSubmit = () => {
  if (title.value === null) {
    Notify.create({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      position: "top",
      message: "Das Rezept braucht mindestens einen Titel",
    });
  } else {
    storeRecordings.addRecordings({
      recordingData,
    });

    Notify.create({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      position: "top",
      message: `Rezept '${title.value}' wurde gespeichert!`,
    });
    router.back();
  }
};

/**
 * reset all
 */
const onReset = () => {
  title.value = null;
  servings.value = null;
};
</script>

<style lang="scss">
.container-all {
  min-height: 80vh;

  .container-all_content {
    box-sizing: unset;

    .btnDiv {
      display: flex;
      flex-direction: column;
      width: 80%;
      .showTextDiv {
        display: flex;
        align-items: center;
        justify-content: center;
        .p-tagDiv {
          margin: 10px;
          padding: 20px;
          box-shadow: 2px 2px 10px rgb(197, 197, 197);
          border-radius: 5px;
          font-family: "Times New Roman", Times, serif;
          font-weight: 500;
          font-size: 18px;
          min-width: 240px;
          min-height: 200px;
          text-align: center;
          background-color: var(--q-secondary);
        }
      }
    }
  }
}
</style>
