<template>
  <div class="container-all">
    <q-btn color="primary" outline class="q-ma-md" to="/">Abbrechen</q-btn>
    <div class="flex justify-center q-pa-md container-all_content">
      <div class="texts flex column content-center q-ma-md items-center">
        <p class="to-do-text">Mit der Aufnahme starten</p>
        <div class="btnDiv">
          <div class="recBtn flex justify-center q-mb-lg">
            <q-btn
              size="32px"
              round
              stack
              color="accent"
              :icon="recording === false ? 'mic' : 'mic_off'"
              @click="recording = !recording"
            >
              <q-tooltip anchor="center right" self="center start">
                {{
                  recording === false ? "Aufnahme starten" : "Aufnahme stoppen"
                }}
              </q-tooltip>
            </q-btn>
          </div>
          <div class="showTextDiv flex no-wrap">
            <STT1Rec
              :toggle-recording="recording"
              :reset-recording="resetText"
              :save-btn-pushed="saveBtnPushed"
              @send-text-data="logTheshit"
            />
            <STT2Rec
              :toggle-recording="recording"
              :reset-recording="resetText"
              :save-btn-pushed="saveBtnPushed"
              @send-text-data="logTheshit"
            />
            <STT3Rec
              :toggle-recording="recording"
              :reset-recording="resetText"
              :save-btn-pushed="saveBtnPushed"
              @send-text-data="logTheshit"
            />
            <STT4Rec
              :toggle-recording="recording"
              :reset-recording="resetText"
              :save-btn-pushed="saveBtnPushed"
              @send-text-data="logTheshit"
            />
          </div>
        </div>
        <div class="flex row q-mt-lg">
          <q-btn
            dense
            class="showTextDiv_btn q-mr-md"
            color="primary"
            outline
            label="Zurücksetzen"
            @click="resetTextFunction"
          />
          <q-btn
            dense
            class="showTextDiv_btn"
            color="primary"
            label="Speichern"
            @click="saveBtnFunction"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { useRouter } from "vue-router";
import { useStoreAllRecordings } from "src/stores/storeAllRecordings";
import STT1Rec from "../components/STT1_Rec.vue";
import STT2Rec from "../components/STT2_Rec.vue";
import STT3Rec from "../components/STT3_Rec.vue";
import STT4Rec from "../components/STT4_Rec.vue";

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
const recordingData1 = ref("");
const recordingData2 = ref("");
const recordingData3 = ref("");
const recordingData4 = ref("");

const recording = ref(false);
const saveBtnPushed = ref(false);
const resetText = ref(false);

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
      recordingData1,
      recordingData2,
      recordingData3,
      recordingData4,
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

const saveBtnFunction = () => {
  saveBtnPushed.value = !saveBtnPushed.value;
  recording.value = false;
};

const resetTextFunction = () => {
  resetText.value = !resetText.value;
  recording.value = false;
};

const logTheshit = (text) => {
  console.log("log it::::", text);
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
        .tagDiv {
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
