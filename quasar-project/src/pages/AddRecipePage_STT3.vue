<template>
  <q-btn class="q-ma-md" @click="stopMic" to="/">Abbrechen</q-btn>
  <div class="content-div flex column q-pa-md content-center justify-between">
    <div v-if="recognitionEnded === false" class="texts flex column content-center q-ma-md">
      <p class="to-do-text">Mit der Rezepteingabe starten</p>
      <q-btn :class="displayStartBtn === true ? 'showStartBtn' : 'hideStartBtn'" label="Starten"
        @click="startRecognition" />
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
import { SpeechToText } from 'watson-speech';
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
    allIngredients.value.push(newIngredient);
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
const displayStartBtn = ref(true);
const recognitionStarted = ref(false);
const startedIngredientList = ref(false);
const startedSteps = ref(false);
const recognitionEnded = ref(false);
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

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

//const recognition = new window.SpeechRecognition();
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition =  SpeechToText({
        username: 'your-username',
        password: 'your-password'
    });

let p = document.createElement("p");

let texts = document.querySelector(".texts");
let toDoText = document.querySelector(".to-do-text");

onMounted(() => {
  texts = document.querySelector(".texts");
  toDoText = document.querySelector(".to-do-text");
});

const startRecognition = () => {
  recognition.start({
        continuous: true,
        interimResults: true
    })
  displayStartBtn.value = false;
  recognitionStarted.value = true;
  startedIngredientList.value = false;
  startedSteps.value = false;
  toDoText.innerText = "Wie ist der Titel des Rezeptes?";
  console.log("hallo")
};

const speechToText = ref("");
recognition.addEventListener("result", (e) => {
  const text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");
  p.innerText = text;
  speechToText.value = text;

  texts.appendChild(p);

  if (e.results[0].isFinal) {
    console.log("STT 1:", e.results);
    if (
      !speechToText.value.includes("ja") &&
      !speechToText.value.includes("nein")
    ) {
      p = document.createElement("p");
    }
  }
});

recognition.on("end", () => {
  if (startedIngredientList.value === false && startedSteps.value === false) {
    if (recognitionStarted.value === true && title.value === null) {
      title.value = speechToText.value;
      speechToText.value = "";
      toDoText.innerText = "Für wie viele Personen ist dieses Rezept?";
      startRec();
    } else if (title.value !== null && servings.value === null) {
      servings.value = speechToText.value;
      speechToText.value = "";
      toDoText.innerText = "Wie lange dauert die Zubereitung?";
      startRec();
    } else if (servings.value !== null && prepTime.value === null) {
      prepTime.value = speechToText.value;
      speechToText.value = "";
      toDoText.innerText = "Was ist die erste Zutat?";
      startedIngredientList.value = true;
      startRec();
    }
  } else if (startedIngredientList.value === true) {
    console.log(startedIngredientList.value);
    if (speechToText.value.includes("ja")) {
      speechToText.value = "";
      toDoText.innerText = "Was ist die nächste Zutat?";
      startRec();
    } else if (speechToText.value.includes("nein")) {
      speechToText.value = "";
      toDoText.innerText = "Was ist der erste Arbeitsschritt?";
      startedIngredientList.value = false;
      startedSteps.value = true;
      startRec();
    } else {
      allIngredients.value.push(speechToText.value);
      speechToText.value = "";
      toDoText.innerText =
        "Gibt es noch eine Zutat? Antworte bitte mit Ja oder Nein.";
      startRec();
    }
  } else if (startedSteps.value === true) {
    if (speechToText.value.includes("ja")) {
      speechToText.value = "";
      toDoText.innerText = "Was ist der nächste Arbeitsschritt?";
      startRec();
    } else if (speechToText.value.includes("nein")) {
      speechToText.value = "";
      toDoText.innerText =
        "Vielen Dank! Das Rezept wurde erkannt! Drücke jetzt auf Speichern, um es in deinem Kochbuch aufzunehmen!";
      startedIngredientList.value = false;
      startedSteps.value = false;
      recognitionEnded.value = true;
    } else {
      allSteps.value.push(speechToText.value);
      speechToText.value = "";
      toDoText.innerText =
        "Gibt es noch einen Arbeitsschritt? Antworte bitte mit Ja oder Nein.";
      startRec();
    }
  }
}
);

const stopMic = () => {
  console.log("stop mic");
  recognition.removeEventListener("end", () => { });
  startedIngredientList.value = false;
  startedSteps.value = false;
  recognitionEnded.value = true;
  siteOpen.value = false;
  startRec();
}

const startRec = () =>{
  if (recognitionStarted.value && siteOpen.value){
    recognition.start();
  }else{
    recognition.stop();
  }
}

onUnmounted(() => {
  console.log("Unmounted");
  recognitionEnded.value = true;
  recognition.removeEventListener("result", () => { });
  recognition.removeEventListener("end", () => { });
  recognition.stop();
  siteOpen.value = false;
  startRec();
});
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
