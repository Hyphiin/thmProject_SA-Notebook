<template>
  <q-btn color="primary" outline class="q-ma-md" to="/">Abbrechen</q-btn>
  <div class="content-div flex column q-pa-md content-center justify-between">
    <div v-if="recognitionEnded === false" class="texts flex column content-center q-ma-md justify-center">
      <p class="to-do-text">Mit der Rezepteingabe starten</p>
      <div v-if="startDic === true" class="btnDiv">
        <div class="recBtn flex justify-center">
          <q-btn size="32px" round stack color="accent" :icon="recording === false ? 'mic' : 'mic_off'"
            @click="toggleRecording">
            <q-tooltip anchor="center right" self="center start">
              {{
  recording === false ? "Aufnahme starten" : "Aufnahme stoppen"
              }}
            </q-tooltip>
          </q-btn>
        </div>
        <div class="showTextDiv flex no-wrap">
          <q-btn dense outline class="showTextDiv_btn" color="primary" label="Neu" @click="deleteTagText" />
          <div id="p-tagDiv" class="p-tagDiv"></div>
          <q-btn dense class="showTextDiv_btn" color="primary" label="Weiter" @click="nextRecording" />
        </div>
      </div>
      <q-btn color="accent" label="Starten" :class="startDic === false ? 'showStartBtn' : 'hideStartBtn'"
        @click="startRecipeDictation" />
    </div>

    <q-form v-if="recognitionEnded === true" @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <p>
        Das Rezept wurde erfolgreich erkannt, im unteren Formular kannst du
        alles noch mal prüfen.
      </p>
      <q-input filled v-model="title" label="Titel des Rezeptes" lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'Bitte trage einen Titel ein',
      ]" />
      <q-input filled v-model="servings" label="Für wie viele Personen" lazy-rules
        hint="Für wie viele Personen ist dieses Rezept?" />

      <q-input filled v-model="prepTime" label="Zubereitungszeit" lazy-rules
        hint="Wie lange dauert es dieses Rezept zu kochen?" />
      <div class="bg-grey-3 q-pa-md">
        <div class="newIngredient flex">
          <q-input filled v-model="newIngredient" label="Zutat" class="q-mr-sm" :error="displayErrorIngredients"
            error-message="Bitte ausfüllen" />
          <q-btn class="q-ml-sm" label="" icon="add" color="primary" style="max-height: 56px" @click="addIngredient" />
        </div>
        <div class="addIngredient flex justify-center"></div>
        <p class="text-subtitle1 q-mt-lg">Zutaten:</p>
        <div v-for="(ingredient, idx) in allIngredients" :key="idx" class="flex flex-col justify-between">
          <div>
            <span class="text-bold q-mr-md">{{ ingredient }}</span>
          </div>

          <q-btn flat round color="primary" icon="delete" size="sm" @click="deleteIngredient(idx)" />
        </div>
      </div>
      <div class="bg-grey-3 q-pa-md">
        <div class="newStep flex justify-between">
          <q-input filled type="textarea" v-model="newStep" :label="'Schritt ' + (allSteps.length + 1)" class="q-mr-sm"
            :error="displayErrorSteps" error-message="Bitte ausfüllen" style="min-width: 470px" />
          <q-btn label="" icon="add" color="primary" @click="addStep" style="max-height: 56px" />
        </div>
        <p class="text-subtitle1 q-mt-lg">Schritte:</p>
        <div v-for="(step, idx) in allSteps" :key="idx" class="flex flex-col justify-between">
          <div>
            <span class="text-bold q-mr-md">{{ idx + 1 }}.</span>
            <span> {{ step }}</span>
          </div>

          <q-btn flat round color="primary" icon="delete" size="sm" @click="deleteStep(idx)" />
        </div>
      </div>
      <div>
        <q-btn label="Speichern" type="submit" color="primary" />
        <q-btn label="Zurücksetzen" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref, onMounted, onUnmounted } from "vue";
import { Notify } from "quasar";
import { useStoreRecipes_STT3 } from "src/stores/storeRecipes_STT3";
import { useRouter } from "vue-router";

/**
 * router
 */
const router = useRouter();

/**
 * store
 */
const storeRecipes_STT3 = useStoreRecipes_STT3();

/**
 * recording
 */
let buttonEl = document.getElementsByClassName('q-icon notranslate material-icons');
let  titleEl = document.getElementById('real-time-title');

let isRecording = false;
let socket;
let recorder;

const run = async () => {
  isRecording = !isRecording;
  buttonEl.innerText = isRecording ? 'mic' : 'mic_off';
  //titleEl.innerText = isRecording ? 'Click stop to end recording!' : 'Click start to begin recording!'

  if (!isRecording) {

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
    // get session token from backend
    const response = await fetch('http://localhost:8000');
    const data = await response.json();

    if (data.error) {
      alert(data.error)
    }

    const { token } = data;

    // establish wss with AssemblyAI at 16000 sample rate
    socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

    // handle incoming messages to display transcription to the DOM
    const texts = {};
    socket.onmessage = (message) => {
      let msg = '';
      const res = JSON.parse(message.data);
      texts[res.audio_start] = res.text;
      const keys = Object.keys(texts);
      keys.sort((a, b) => a - b);
      for (const key of keys) {
        if (texts[key]) {
          msg += ` ${texts[key]}`;
        }
      }
      toDoText.innerText = msg;
    };

    // handle error
    socket.onerror = (event) => {
      console.error(event);
      socket.close();
    }

    // handle socket close
    socket.onclose = event => {
      console.log(event);
      socket = null;
    }

    // handle socket open
    socket.onopen = () => {
      // begin recording
      toDoText.style.display = '';
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          recorder = new RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
            recorderType: StereoAudioRecorder,
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
                  socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                }
              };
              reader.readAsDataURL(blob);
            },
          });

          recorder.startRecording();
        })
        .catch((err) => console.error(err));
    };
  }
};

/**
 * recipe data
 */
const title = ref(null);
const servings = ref(null);
const prepTime = ref(null);
/**
 * ingredients data
 */
const newIngredient = ref("");
const allIngredients = ref([]);

const addIngredient = () => {
  if (newIngredient.value !== "") {
    displayErrorIngredients.value = false;
    allIngredients.value.push(newIngredient.value);
    newIngredient.value = "";
  } else {
    displayErrorIngredients.value = true;
  }
};
const deleteIngredient = (idx) => {
  allIngredients.value.splice(idx, 1);
};
/**
 * steps data
 */
const newStep = ref("");
const allSteps = ref([]);

const addStep = () => {
  if (newStep.value !== "") {
    displayErrorStep.value = false;
    allSteps.value.push(newStep.value);
    newStep.value = "";
  } else {
    displayErrorStep.value = true;
  }
};
const deleteStep = (idx) => {
  allSteps.value.splice(idx, 1);
};

/**
 * helper vars
 */
const displayErrorIngredients = ref(false);
const displayErrorStep = ref(false);
const options = ref(["g", "kg", "ml", "l", "Stk", "Pkg"]);

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
    storeRecipes_STT3.addRecipe({
      title: title.value,
      servings: servings.value,
      prepTime: prepTime.value,
      ingredients: allIngredients.value,
      prepSteps: allSteps.value,
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

/**
 * SpeechRecognition
 */

onMounted(() => {
  tagDiv = document.querySelector(".p-tagDiv");
  toDoText = document.querySelector(".to-do-text");
  buttonEl = document.getElementsByClassName('q-icon notranslate material-icons')[0];
  titleEl = document.getElementById('real-time-title');
  buttonEl.addEventListener('click', run());
});

let p = document.createElement("p");

let tagDiv = document.querySelector(".p-tagDiv");
let toDoText = document.querySelector(".to-do-text");

window.SpeechRecognition = window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();
const startDic = ref(false);
const recording = ref(false);
const results = ref(null);
const endResult = ref("");

const startedIngredientList = ref(false);
const startedSteps = ref(false);
const recognitionEnded = ref(false);

recognition.continuous = true;

const startRecipeDictation = () => {
  startDic.value = true;
  toDoText.innerText = "Wie ist der Titel des Rezeptes?";
  recognitionEnded.value = false;
};

function toggleRecording() {
  if (recording.value) {
    recognition.onend = null;
    recognition.stop();
    recording.value = false;
  } else {
    tagDiv = document.querySelector(".p-tagDiv");
    recognition.onend = onEnd;
    //recognition.start();
    recording.value = false;
  }
}

const nextRecording = () => {
  results.value = null;
  p.innerHTML = "";

  console.log("stop", endResult.value);
  if (startedIngredientList.value === false && startedSteps.value === false) {
    if (title.value === null) {
      title.value = endResult.value;
      endResult.value = "";
      toDoText.innerText = "Für wie viele Personen ist dieses Rezept?";
    } else if (title.value !== null && servings.value === null) {
      servings.value = endResult.value;
      endResult.value = "";
      toDoText.innerText = "Wie lange dauert die Zubereitung?";
    } else if (servings.value !== null && prepTime.value === null) {
      prepTime.value = endResult.value;
      endResult.value = "";
      toDoText.innerText =
        "Was sind die Zutaten? Sage diese im folgenden Format: '500 Gramm Tomaten' und trenne Sie jeweils mit einem lauten 'und'.";
      startedIngredientList.value = true;
    }
  } else if (startedIngredientList.value === true) {
    const tempIngridents = endResult.value.split(" und ");
    tempIngridents.forEach((ingredient) => {
      allIngredients.value.push(ingredient);
    });

    endResult.value = "";

    startedIngredientList.value = false;
    startedSteps.value = true;
    toDoText.innerText =
      "Was sind die Arbeitsschritte? Sage bitte vor jedem Schritt: 'Nächster Schritt'.";
    var child = tagDiv.lastElementChild;
    while (child) {
      tagDiv.removeChild(child);
      child = tagDiv.lastElementChild;
    }
  } else if (startedSteps.value === true) {
    const tempSteps = endResult.value.split(" nächster Schritt ");
    tempSteps.forEach((step) => {
      allSteps.value.push(step);
    });

    toDoText.innerText =
      "Vielen Dank! Das Rezept wurde erkannt! Drücke jetzt auf Speichern, um es in deinem Kochbuch aufzunehmen!";

    startedSteps.value = false;
    startDic.value = false;
    recognitionEnded.value = true;
    recognition.onend = null;
    recognition.stop();
    recording.value = false;
  }
};

const deleteTagText = () => {
  results.value = null;
  p.innerHTML = "";
};

function onEnd() {
  console.log("Speech recognition has stopped. Starting again ...");
  recognition.start();
}

function onSpeak(e) {
  results.value = e.results;
  if (startedIngredientList.value) {
    if (e.results[e.results.length - 1][0].transcript.includes("und")) {
      p = document.createElement("p");
      p.innerHTML = e.results[e.results.length - 1][0].transcript;
      endResult.value = endResult.value + p.innerHTML;
      tagDiv.appendChild(p);
    } else {
      p.innerHTML = p.innerHTML + e.results[e.results.length - 1][0].transcript;
      endResult.value = endResult.value + p.innerHTML;
      tagDiv.appendChild(p);
    }
  } else if (startedSteps.value) {
    if (
      e.results[e.results.length - 1][0].transcript.includes("nächster Schritt")
    ) {
      p = document.createElement("p");
      p.innerHTML = e.results[e.results.length - 1][0].transcript;
      endResult.value = endResult.value + p.innerHTML;
      tagDiv.appendChild(p);
    } else {
      p.innerHTML = p.innerHTML + e.results[e.results.length - 1][0].transcript;
      endResult.value = endResult.value + p.innerHTML;
      tagDiv.appendChild(p);
    }
  } else {
    console.log(e.results[e.results.length - 1][0].transcript);
    p.innerHTML = p.innerHTML + e.results[e.results.length - 1][0].transcript;
    endResult.value = endResult.value + p.innerHTML;
    tagDiv.appendChild(p);
  }
}

recognition.addEventListener("result", onSpeak);

onUnmounted(() => {
  console.log("Unmounted");
  recognitionEnded.value = true;
  recognition.removeEventListener("result", () => { });
  recognition.removeEventListener("end", () => { });
  recognition.stop();
});
</script>

<style lang="scss">
.content-div {
  min-height: 70vh;

  .showStartBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    padding: 0px 10px;
  }

  .hideStartBtn {
    display: none;
    width: fit-content;
    padding: 0px 10px;
  }

  .texts {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    .recBtn {
      margin-bottom: 20px;
    }

    .to-do-text {
      padding: 5px 10px;
      margin-bottom: 20px;
      font-weight: 400;
      font-size: larger;
    }

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
          min-width: 50%;
          width: 50%;
          min-height: 200px;
          text-align: center;
          background-color: var(--q-secondary);
        }

        .showTextDiv_btn {
          padding: 5px 10px;
          min-width: 70px;
          margin: 20px;
        }
      }
    }
  }
}
</style>
