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
import { ref, onMounted, watch, onUnmounted } from "vue";

/**
 * props
 */
const props = defineProps({
  toggleRecording: {
    type: Boolean,
    required: true,
  },
  saveBtnPushed: {
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
    if (newValue === true) {
      toggleRecording();
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.saveBtnPushed,
  (newValue) => {
    if (newValue === true) {
      emit("sendTextData", { data: recordingData.value, stt: 1 });
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.resetRecording,
  (newValue) => {
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

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
let recognition = new SpeechRecognition();
const recording = ref(false);

recognition.continuous = true;

function onEnd() {
  console.log("Speech recognition has stopped.");
}

function onSpeak(e) {
  p.innerHTML = p.innerHTML + e.results[e.results.length - 1][0].transcript;
  recordingData.value = recordingData.value + p.innerHTML;
  tagDiv.appendChild(p);
}

recognition.addEventListener("result", onSpeak);

function toggleRecording() {
  console.log("recording.value");
  if (recording.value === true) {
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
  p.innerHTML = "";

  recordingData.value = "";

  recognition.onend = null;
  recognition.stop();
  recording.value = false;
};

onUnmounted(() => {
  console.log("Unmounted STT 1");
  recognition.removeEventListener("result", () => {});
  recognition.removeEventListener("end", () => {});
  recognition.stop();
});
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
