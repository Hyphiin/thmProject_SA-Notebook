<template>
  <div class="container">
    <div class="showTextDiv flex no-wrap">
      <div class="flex column items-center">
        <q-label>Speech To Text 4</q-label>
        <div id="p-tagDiv4" class="tagDiv4 p-tagDiv4"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref, onMounted, watch, onUnmounted } from "vue";
import { socket } from "../boot/ezglobals";

const DOWNSAMPLING_WORKER = "../boot/downsampling_worker.js";


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
      emit("sendTextData", { data: recordingData.value, stt: 4 });
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
 * STT4
 */
 let connect;
 const socket1 = socket;

onMounted(() => {
  tagDiv = document.querySelector(".p-tagDiv4");
  connect = socket1.connect("http://localhost:4000", (e) => {
    connected.value = true;
  });
  console.log(connected.value);

  connect.on("recognize", (results) => {
    console.log("recognized:", results);
    onResult(results.text);
  });

  connect.on("disconnect", () => {
    console.log("socket disconnected");
    connected.value = false;
    stopRecording();
  });
});

let p = document.createElement("p");
let tagDiv = document.querySelector(".p-tagDiv4");

let mediaStream;
let mediaStreamSource;
let processor;
let audioContext;
let recognitionOutput = [];

const startMicrophone = () => {
  audioContext = new AudioContext();

  const success = (stream) => {
    console.log("started recording");
    mediaStream = stream;
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    processor = createAudioProcessor(audioContext, mediaStreamSource);
    mediaStreamSource.connect(processor);
  };

  const fail = (e) => {
    console.error("recording failure", e);
  };

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then(success)
      .catch(fail);
  } else {
    navigator.getUserMedia(
      {
        video: false,
        audio: true,
      },
      success,
      fail
    );
  }
};

const createAudioProcessor = (audioContext, audioSource) => {
  processor = audioContext.createScriptProcessor(4096, 1, 1);

  const sampleRate = audioSource.context.sampleRate;

  let downsampler = new Worker(
    new URL("../downsampling_worker.js", import.meta.url)
  );
  downsampler.postMessage({ command: "init", inputSampleRate: sampleRate });
  downsampler.onmessage = (e) => {
    //if (connected.value) {
    let string;
    connect.emit("stream-data", e.data.buffer);
  };

  processor.onaudioprocess = (event) => {
    var data = event.inputBuffer.getChannelData(0);
    downsampler.postMessage({ command: "process", inputFrame: data });
  };

  processor.shutdown = () => {
    processor.disconnect();
    //onaudioprocess = null;
  };

  processor.connect(audioContext.destination);

  return processor;
};

const stopMicrophone = () => {
  if (mediaStream) {
    mediaStream.getTracks()[0].stop();
  }
  if (mediaStreamSource) {
    mediaStreamSource.disconnect();
  }
  if (processor) {
    processor.shutdown();
  }
  if (audioContext) {
    audioContext.close();
  }
};

const recording = ref(false);
const connected = ref(false);

const toggleRecording = () => {
  if (recording.value === true) {
    recording.value = false;
    stopMicrophone();
  } else {
    recording.value = true;
    tagDiv = document.querySelector(".p-tagDiv4");
    startMicrophone();
  }
};

const onResult = (text) => {
    console.log(text);
    p.innerHTML = p.innerHTML + ' ' + text;
      tagDiv.appendChild(p);
      recordingData.value =  recordingData.value + ' ' + text;
  }

const resetText = () => {
  p.innerHTML = "";
  recordingData.value = "";

  recording.value = false;
};

onUnmounted(() => {
  console.log("Unmounted STT4");
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
        .tagDiv4 {
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
