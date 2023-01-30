<template>
  <q-btn class="q-ma-md" @click="endRecognition" to="/">Abbrechen</q-btn>
  <div class="content-div flex column q-pa-md content-center justify-between">
    <div
      v-if="recognitionEnded === false"
      class="texts flex column content-center q-ma-md"
    >
      <p class="to-do-text">Mit der Rezepteingabe starten</p>
      <q-btn
        :class="startDic === false ? 'showStartBtn' : 'hideStartBtn'"
        label="Starten"
        @click="startRecipeDictation"
      />
    </div>
    <div v-if="startDic === true">
      <q-btn
        :label="recording === false ? 'Starten' : 'Stoppen'"
        @click="toggleRecording"
      />
    </div>
    <q-form
      v-if="recognitionEnded === true"
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <p>
        Das Rezept wurde erfolgreich erkannt, im unteren Formular kannst du
        alles noch mal prüfen.
      </p>
      <q-input
        filled
        v-model="title"
        label="Titel des Rezeptes"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Bitte trage einen Titel ein',
        ]"
      />
      <q-input
        filled
        v-model="servings"
        label="Für wie viele Personen"
        lazy-rules
        hint="Für wie viele Personen ist dieses Rezept?"
      />

      <q-input
        filled
        v-model="prepTime"
        label="Zubereitungszeit"
        lazy-rules
        hint="Wie lange dauert es dieses Rezept zu kochen?"
      />
      <div class="bg-grey-3 q-pa-md">
        <div class="newIngredient flex">
          <q-input
            filled
            v-model="newIngredient"
            label="Zutat"
            class="q-mr-sm"
            :error="displayErrorIngredients"
            error-message="Bitte ausfüllen"
          />
          <q-btn
            class="q-ml-sm"
            label=""
            icon="add"
            color="primary"
            style="max-height: 56px"
            @click="addIngredient"
          />
        </div>
        <div class="addIngredient flex justify-center"></div>
        <p class="text-subtitle1 q-mt-lg">Zutaten:</p>
        <div
          v-for="(ingredient, idx) in allIngredients"
          :key="idx"
          class="flex flex-col justify-between"
        >
          <div>
            <span class="text-bold q-mr-md">{{ ingredient }}</span>
          </div>

          <q-btn
            flat
            round
            color="primary"
            icon="delete"
            size="sm"
            @click="deleteIngredient(idx)"
          />
        </div>
      </div>
      <div class="bg-grey-3 q-pa-md">
        <div class="newStep flex justify-between">
          <q-input
            filled
            type="textarea"
            v-model="newStep"
            :label="'Schritt ' + (allSteps.length + 1)"
            class="q-mr-sm"
            :error="displayErrorSteps"
            error-message="Bitte ausfüllen"
            style="min-width: 470px"
          />
          <q-btn
            label=""
            icon="add"
            color="primary"
            @click="addStep"
            style="max-height: 56px"
          />
        </div>
        <p class="text-subtitle1 q-mt-lg">Schritte:</p>
        <div
          v-for="(step, idx) in allSteps"
          :key="idx"
          class="flex flex-col justify-between"
        >
          <div>
            <span class="text-bold q-mr-md">{{ idx + 1 }}.</span>
            <span> {{ step }}</span>
          </div>

          <q-btn
            flat
            round
            color="primary"
            icon="delete"
            size="sm"
            @click="deleteStep(idx)"
          />
        </div>
      </div>
      <div>
        <q-btn label="Speichern" type="submit" color="primary" />
        <q-btn
          label="Zurücksetzen"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
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
import { useStoreRecipes_STT1 } from "src/stores/storeRecipes_STT1";
import { useStoreRecipes_STT2 } from "src/stores/storeRecipes_STT2";
import { useStoreRecipes_STT3 } from "src/stores/storeRecipes_STT3";
import { useRouter } from "vue-router";

/**
 * router
 */
const router = useRouter();

/**
 * store
 */
const storeRecipes_STT1 = useStoreRecipes_STT1();

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
const recognitionStarted = ref(false);
const siteOpen = ref(true);

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
    storeRecipes_STT1.addRecipe({
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
  texts = document.querySelector(".texts");
  toDoText = document.querySelector(".to-do-text");
});

let p = document.createElement("p");

let texts = document.querySelector(".texts");
let toDoText = document.querySelector(".to-do-text");

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();
const startDic = ref(false);
const recording = ref(false);
const results = ref(null);
const endResult = ref(null);

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
    results.value = null;
    p.innerHTML = "";

    console.log("stop", endResult.value);
    if (startedIngredientList.value === false && startedSteps.value === false) {
      if (title.value === null) {
        title.value = endResult.value;
        endResult.value = null;
        toDoText.innerText = "Für wie viele Personen ist dieses Rezept?";
      } else if (title.value !== null && servings.value === null) {
        servings.value = endResult.value;
        endResult.value = null;
        toDoText.innerText = "Wie lange dauert die Zubereitung?";
      } else if (servings.value !== null && prepTime.value === null) {
        prepTime.value = endResult.value;
        endResult.value = null;
        toDoText.innerText =
          "Was sind die Zutaten? Sage diese im folgenden Format: '500 Gramm Tomaten' und trenne Sie jeweils mit einem lauten 'und'.";
        startedIngredientList.value = true;
      }
    } else if (startedIngredientList.value === true) {
      const tempIngridents = endResult.value.split(" und ");
      tempIngridents.forEach((ingredient) => {
        allIngredients.value.push(ingredient);
      });

      startedIngredientList.value = false;
      startedSteps.value = true;
      toDoText.innerText =
        "Was sind die Arbeitsschritte? Sage bitte vor jedem Schritt: 'Nächster Schritt'.";
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
    }
  } else {
    recognition.onend = onEnd;
    recognition.start();
    recording.value = true;
  }
}

function onEnd() {
  console.log("Speech recognition has stopped. Starting again ...");
  recognition.start();
}

function onSpeak(e) {
  results.value = e.results;
  console.log(e.results[e.results.length - 1][0].transcript);
  p.innerHTML = p.innerHTML + e.results[e.results.length - 1][0].transcript;
  endResult.value = p.innerHTML;

  texts.appendChild(p);
}

recognition.addEventListener("result", onSpeak);

//const recognition = new window.SpeechRecognition();
// const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognition = new Recognition();

// let p = document.createElement("p");

// let texts = document.querySelector(".texts");
// let toDoText = document.querySelector(".to-do-text");

// const startRecognition = () => {
//   console.log("startRecognition");
//   displayStartBtn.value = false;
//   startedIngredientList.value = false;
//   startedSteps.value = false;
//   toDoText.innerText = "Wie ist der Titel des Rezeptes?";
// };
// const endRecognition = () => {
//   console.log("endRecognition");
//   recognition.removeEventListener("end", () => {});
//   startedIngredientList.value = false;
//   startedSteps.value = false;
//   recognitionEnded.value = true;
//   siteOpen.value = false;
// };

// recognition.onstart = () => {
//   console.log("onStart");
//   recognitionStarted.value = true;
// };

// const endMic = () => {
//   recognition.abort();
//   console.log("onEnd");
//   recognitionStarted.value = false;
//   onEnd();
// };

// const speechToText = ref("");
// recognition.onresult = (e) => {
//   console.log("results");
//   const text = Array.from(e.results)
//     .map((result) => result[0])
//     .map((result) => result.transcript)
//     .join("");
//   p.innerText = text;
//   speechToText.value = text;

//   texts.appendChild(p);
// };

// const onEnd = () => {
//   console.log("stop");
//   if (startedIngredientList.value === false && startedSteps.value === false) {
//     if (title.value === null) {
//       title.value = speechToText.value;
//       speechToText.value = "";
//       toDoText.innerText = "Für wie viele Personen ist dieses Rezept?";
//     } else if (title.value !== null && servings.value === null) {
//       servings.value = speechToText.value;
//       speechToText.value = "";
//       toDoText.innerText = "Wie lange dauert die Zubereitung?";
//     } else if (servings.value !== null && prepTime.value === null) {
//       prepTime.value = speechToText.value;
//       speechToText.value = "";
//       toDoText.innerText =
//         "Was sind die Zutaten? Sage diese im folgenden Format: 'Tomaten 5 Stück' und trenne Sie jeweils mit einem lauten 'und'.";
//       startedIngredientList.value = true;
//     }
//   } else if (startedIngredientList.value === true) {
//     console.log(startedIngredientList.value);
//     if (speechToText.value.includes("ja")) {
//       speechToText.value = "";
//       toDoText.innerText =
//         "Was sind die weiteren Zutaten?  Sage diese im folgenden Format: 'Tomaten 5 Stück' und trenne Sie jeweils mit einem lauten 'und'.";
//     } else if (speechToText.value.includes("nein")) {
//       speechToText.value = "";
//       toDoText.innerText = "Was ist der erste Arbeitsschritt?";
//       startedIngredientList.value = false;
//       startedSteps.value = true;
//     } else {
//       allIngredients.value.push(speechToText.value);
//       speechToText.value = "";
//       toDoText.innerText =
//         "Gibt es noch mehr Zutaten? Antworte bitte mit 'ja' oder 'nein'.";
//     }
//   } else if (startedSteps.value === true) {
//     if (speechToText.value.includes("fertig")) {
//       speechToText.value = "";
//       toDoText.innerText =
//         "Vielen Dank! Das Rezept wurde erkannt! Drücke jetzt auf Speichern, um es in deinem Kochbuch aufzunehmen!";
//       startedIngredientList.value = false;
//       startedSteps.value = false;
//       recognitionEnded.value = true;
//     } else {
//       allSteps.value.push(speechToText.value);
//       speechToText.value = "";
//       toDoText.innerText =
//         "Was ist der nächste Arbeitsschritt? Wenn es keine mehr gibt, sag einfach 'fertig'.";
//     }
//   }
// };

// const startRec = () => {
//   console.log("startRec??");
//   if (recognitionStarted.value && siteOpen.value) {
//     recognition.start();
//   } else {
//     recognition.stop();
//   }
// };

// onUnmounted(() => {
//   console.log("Unmounted");
//   recognitionEnded.value = true;
//   recognition.removeEventListener("result", () => {});
//   recognition.removeEventListener("end", () => {});
//   recognition.stop();
//   siteOpen.value = false;
//   endRecognition();
// });
</script>

<style lang="scss">
.content-div {
  min-height: 70vh;

  .showStartBtn {
    display: block;
  }

  .hideStartBtn {
    display: none;
  }
}
</style>
