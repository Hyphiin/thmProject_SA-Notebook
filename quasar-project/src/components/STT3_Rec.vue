<template>
  <div class="container">
    <div class="showTextDiv flex no-wrap">
      <div class="flex column items-center">
        <q-label>Speech To Text 3</q-label>
        <div id="p-tagDiv3" class="tagDiv3 p-tagDiv3"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref, onMounted, watch, onUnmounted } from "vue";
import RecordRTC from "recordrtc";

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
      emit("sendTextData", { data: recordingData.value, stt: 3 });
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
  tagDiv = document.querySelector(".p-tagDiv3");
});

let p = document.createElement("p");
let tagDiv = document.querySelector(".p-tagDiv3");

// Start the speech recognition
let socket;
let recorder;

const run = async () => {
  // get session token from backend
  const response = await fetch("http://localhost:8000");
  const data = await response.json();

  if (data.error) {
    alert(data.error);
  }

  const { token } = data;

  // establish wss with AssemblyAI at 16000 sample rate
  socket = new WebSocket(
    `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
  );

  // handle incoming messages to display transcription to the DOM
  const texts = {};
  socket.onmessage = (message) => {
    let msg = "";
    const res = JSON.parse(message.data);
    texts[res.audio_start] = res.text;

    const keys = Object.keys(texts);
    keys.sort((a, b) => a - b);
    for (const key of keys) {
      if (texts[key]) {
        msg = msg + ` ${texts[key]}`;
      }
    }
    p.innerHTML = msg;
    recordingData.value = msg;
    tagDiv.appendChild(p);
  };

  // handle error
  socket.onerror = (event) => {
    console.error(event);
    socket.close();
  };

  // handle socket close
  socket.onclose = (event) => {
    console.log(event);
    socket = null;
  };

  var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;

  // handle socket open
  socket.onopen = () => {
    // begin recording
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recorder = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm;codecs=pcm", // endpoint requires 16bit PCM audio
          recorderType: StereoAudioRecorder,
          language: "de",
          timeSlice: 250, // set 250 ms intervals of data
          desiredSampRate: 16000,
          numberOfAudioChannels: 1, // real-time requires only one channel
          bufferSize: 4096,
          audioBitsPerSecond: 128000,
          ondataavailable: (blob) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64data = reader.result;

              // audio data must be sent as a base64 encoded string
              if (socket) {
                socket.send(
                  JSON.stringify({
                    audio_data: base64data.split("base64,")[1],
                  })
                );
              }
            };
            reader.readAsDataURL(blob);
          },
        });

        recorder.startRecording();
      })
      .catch((err) => console.error(err));
  };
};

const recording = ref(false);

const toggleRecording = () => {
  if (recording.value === true) {
    recording.value = false;
    if (recorder) {
      recorder.pauseRecording();
      recorder = null;
    }
    if (socket) {
      socket.send(JSON.stringify({ terminate_session: true }));
      socket.close();
      socket = null;
    }
  } else {
    recording.value = true;
    tagDiv = document.querySelector(".p-tagDiv3");
    run();
  }
};

const resetText = () => {
  p.innerHTML = "";
  recordingData.value = "";

  recording.value = false;
};

onUnmounted(() => {
  console.log("Unmounted STT 3");

  if (recorder) {
    recorder.pauseRecording();
    recorder = null;
  }

  if (socket) {
    socket.send(JSON.stringify({ terminate_session: true }));
    socket.close();
    socket = null;
  }
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
        .tagDiv3 {
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
