<template>
  <div class="container">
    <div class="showTextDiv flex no-wrap">
      <div class="flex column items-center">
        <q-label>Speech To Text 1</q-label>
        <div id="p-tagDiv" class="tagDiv p-tagDiv"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref, onMounted } from "vue";

/**
 * props
 */
const props = defineProps({
  toggleRecording: {
    type: Boolean,
    required: true,
  },
  resetRecording: {
    type: Boolean,
    required: true,
  },
});

watch(
  () => props.toggleRecording,
  (newValue) => {
    console.log("toggleRecording", newValue);
    if (newValue === true) {
      toggleRecording();
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.resetRecording,
  (newValue) => {
    console.log("resetRecording", newValue);
    if (newValue === true) {
      resetText();
    }
  },
  { deep: true, immediate: true }
);

/**
 * emits
 */
const emit = defineEmits(["sendTextData"]);

/**
 * recipe data
 */
const recordingData = ref("");

/**
 * STT1
 */
onMounted(() => {
  tagDiv = document.querySelector(".p-tagDiv");
});

let p = document.createElement("p");

let tagDiv = document.querySelector(".p-tagDiv");

window.SpeechRecognition = window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition(window.webkitSpeechRecognition);
const startDic = ref(false);
const recording = ref(false);
const result = ref(null);

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

const resetText = () => {
  result.value = null;
  p.innerHTML = "";

  recordingData.value = "";

  startDic.value = false;
  recognitionEnded.value = true;
  recognition.onend = null;
  recognition.stop();
  recording.value = false;
};

function onEnd() {
  console.log("Speech recognition has stopped. Starting again ...");
  recognition.start();
}

function onSpeak(e) {
  p.innerHTML = p.innerHTML + e.results[e.results.length - 1][0].transcript;
  recordingData.value = recordingData.value + p.innerHTML;
  tagDiv.appendChild(p);
  emit("sendTextData", recordingData.value);
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
