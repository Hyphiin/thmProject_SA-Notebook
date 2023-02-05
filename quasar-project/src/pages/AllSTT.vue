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
            <div class="flex column items-center">
              <q-label>Speech To Text 1</q-label>
              <div id="p-tagDiv1" class="p-tagDiv"></div>
            </div>
            <div class="flex column items-center">
              <q-label>Speech To Text 2</q-label>
              <div id="p-tagDiv2" class="p-tagDiv"></div>
            </div>
            <div class="flex column items-center">
              <q-label>Speech To Text 3</q-label>
              <div id="p-tagDiv3" class="p-tagDiv"></div>
            </div>
          </div>
        </div>
        <div class="flex row q-mt-lg">
          <q-btn
            dense
            class="showTextDiv_btn q-mr-md"
            color="primary"
            outline
            label="Zurücksetzen"
            @click="resetText"
          />
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
 * STT1
 */
onMounted(() => {
  tagDiv = document.querySelector(".p-tagDiv");
});

let p = document.createElement("p");

let tagDiv = document.querySelector(".p-tagDiv");

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();
const startDic = ref(false);
const recording = ref(false);
const result1 = ref(null);

const recognitionEnded = ref(false);

recognition.continuous = true;

function toggleRecording() {
  if (recording.value) {
    recognition.onend = null;
    recognition.stop();
    recording.value = false;
  } else {
    tagDiv = document.querySelector(".p-tagDiv");
    recognition.onend = onEnd;
    recognition.start();
    recording.value = true;
  }
}

const nextRecording = () => {
  result1.value = null;
  p.innerHTML = "";

  recordingData1.value = "";

  startDic.value = false;
  recognitionEnded.value = true;
  recognition.onend = null;
  recognition.stop();
  recording.value = false;
};

const resetText = () => {
  result1.value = null;
  p.innerHTML = "";
  recordingData1.value = "";
};

function onEnd() {
  console.log("Speech recognition has stopped. Starting again ...");
  recognition.start();
}

function onSpeak(e) {
  p.innerHTML = p.innerHTML + e.results[e.results.length - 1][0].transcript;
  recordingData1.value = recordingData1.value + p.innerHTML;
  tagDiv.appendChild(p);
}

recognition.addEventListener("result", onSpeak);
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
