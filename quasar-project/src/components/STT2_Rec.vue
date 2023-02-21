<template>
  <div class="container">
    <div class="showTextDiv flex no-wrap">
      <div class="flex column items-center">
        <q-label>Speech To Text 2</q-label>
        <div id="p-tagDiv2" class="tagDiv2 p-tagDiv2"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref, onMounted, watch, onUnmounted } from "vue";
import Artyom from "artyom.js";

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
      emit("sendTextData", { data: recordingData.value, stt: 2 });
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
 * STT2
 */

onMounted(() => {
  tagDiv = document.querySelector(".p-tagDiv2");
});

let p = document.createElement("p");
let tagDiv = document.querySelector(".p-tagDiv2");

const artyom = new Artyom();

// Start the speech recognition
artyom
  .initialize({
    lang: "de-DE",
  })
  .then(() => {
    console.log("Ready to work!");
  })
  .catch((err) => {
    console.error("Cannot initialize Artyom", err);
  });

var settings = {
  lang: "de-DE",
  continuous: true, // Don't stop never because i have https connection
  onResult: function (text) {
    console.log(text);
    if (text && text !== "" && text.length !== 0) {
      p.innerHTML = recordingData.value + text;
      tagDiv.appendChild(p);
    } else {
      recordingData.value = p.innerHTML;
    }
  },
  onStart: function () {
    console.log("Dictation started by the user");
  },
  onEnd: function () {
    console.log("Dictation stopped by the user");
  },
};

var UserDictation = ref(artyom.newDictation(settings));

const recording = ref(false);

const toggleRecording = () => {
  if (recording.value === true) {
    recording.value = false;
    UserDictation.value.stop();
  } else {
    recording.value = true;
    tagDiv = document.querySelector(".p-tagDiv2");
    UserDictation.value.start();
  }
};

const resetText = () => {
  p.innerHTML = "";
  recordingData.value = "";

  recording.value = false;
};

onUnmounted(() => {
  console.log("Unmounted STT2");
  artyom.fatality();
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
        .tagDiv2 {
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
