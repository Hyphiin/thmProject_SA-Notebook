<template>
  <q-btn color="primary" outline class="q-ma-md" to="/">Abbrechen</q-btn>
  <div class="content-div flex column q-pa-md content-center justify-between">
    <div
      v-if="recognitionEnded === false"
      class="texts flex column content-center q-ma-md justify-center"
    >
      <p class="to-do-text">Mit der Rezepteingabe starten</p>
      <div v-if="startDic === true" class="btnDiv">
        <div class="recBtn flex justify-center">
          <q-btn
            size="32px"
            round
            stack
            id="recBtn"
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
          <q-btn
            dense
            outline
            class="showTextDiv_btn"
            :class="startedIngredientList || startedSteps ? '' : 'hideBtn'"
            color="primary"
            label="Neu"
            @click="deleteTagText"
          />
          <div id="p-tagDiv" class="p-tagDiv"></div>
          <q-btn
            dense
            class="showTextDiv_btn"
            color="primary"
            label="Weiter"
            @click="nextRecording"
          />
        </div>
      </div>
      <q-btn
        color="accent"
        label="Starten"
        :class="startDic === false ? 'showStartBtn' : 'hideStartBtn'"
        @click="startRecipeDictation"
      />
    </div>

    <q-form
      v-if="recognitionEnded === true"
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md formular"
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
          <div class="flex input-div">
            <q-input
              :model-value="ingredient"
              filled
              label=""
              lazy-rules
              hint=""
              @update:model-value="($event) => changeIngredient($event, idx)"
            />
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
          <div class="flex input-div">
            <span class="text-bold q-mr-md">{{ idx + 1 }}.</span>
            <q-input
              :model-value="step"
              filled
              label=""
              lazy-rules
              hint=""
              @update:model-value="($event) => changeStep($event, idx)"
            />
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
import { useRouter } from "vue-router";
import { checkSize, checkNumber } from "src/js/exportFunctions";

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

const changeIngredient = (newValue, idx) => {
  allIngredients.value[idx] = newValue;
  console.log(allIngredients.value);
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

const changeStep = (newValue, idx) => {
  allSteps.value[idx] = newValue;
  console.log(allSteps.value);
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
  tagDiv = document.querySelector(".p-tagDiv");
  toDoText = document.querySelector(".to-do-text");
});

let p = document.createElement("p");

let tagDiv = document.querySelector(".p-tagDiv");
let toDoText = document.querySelector(".to-do-text");

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

let recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

const startDic = ref(false);
const recording = ref(false);
const results = ref(null);
const endResult = ref("");

const startedIngredientList = ref(false);
const startedSteps = ref(false);
const recognitionEnded = ref(false);

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
    document.getElementById("recBtn").style.boxShadow = "none";
  } else {
    tagDiv = document.querySelector(".p-tagDiv");
    recognition.onend = onEnd;
    recognition.start();
    recording.value = true;
    document.getElementById("recBtn").style.boxShadow =
      "0px 0px 15px 10px #64e890 ";
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
        "Was sind die Zutaten? Warte bitte bis der Aufnahme Button wieder grün ist, bevor du mit der nächsten weitermachst.";
      startedIngredientList.value = true;
    }
  } else if (startedIngredientList.value === true) {
    endResult.value = "";

    startedIngredientList.value = false;
    startedSteps.value = true;
    toDoText.innerText =
      "Was sind die Arbeitsschritte?  Warte bitte bis der Aufnahme Button wieder grün ist, bevor du mit dem nächsten weitermachst.";
    var child = tagDiv.lastElementChild;
    while (child) {
      tagDiv.removeChild(child);
      child = tagDiv.lastElementChild;
    }
  } else if (startedSteps.value === true) {
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
  endResult.value = "";
  if (startedIngredientList.value) {
    allIngredients.value = [];
  }
  if (startedSteps.value) {
    startedSteps.value = [];
  }
  var child = tagDiv.lastElementChild;
  while (child) {
    tagDiv.removeChild(child);
    child = tagDiv.lastElementChild;
  }
};

function onEnd() {
  console.log("Speech recognition has stopped.");
}

function onSpeak(e) {
  results.value = e.results;
  if (startedIngredientList.value) {
    if (e.results[e.results.length - 1].isFinal === true) {
      p.innerHTML = e.results[e.results.length - 1][0].transcript;
      endResult.value = p.innerHTML;

      let foundNumber = checkNumber(p.innerHTML);
      if (foundNumber !== null) {
        p.innerHTML = foundNumber;
      }

      let foundSize = checkSize(p.innerHTML);
      if (foundSize !== null) {
        p.innerHTML = foundSize;
      }
      allIngredients.value.push(p.innerHTML);

      tagDiv.appendChild(p);
      p = document.createElement("p");
      document.getElementById("recBtn").style.boxShadow =
        "0px 0px 15px 10px #64e890 ";
    } else {
      document.getElementById("recBtn").style.boxShadow =
        "0px 0px 15px 10px #f96858 ";
    }
  } else if (startedSteps.value) {
    if (e.results[e.results.length - 1].isFinal === true) {
      p.innerHTML = e.results[e.results.length - 1][0].transcript;
      endResult.value = endResult.value + p.innerHTML;
      tagDiv.appendChild(p);

      allSteps.value.push(p.innerHTML);
      p = document.createElement("p");
      document.getElementById("recBtn").style.boxShadow =
        "0px 0px 15px 10px #64e890 ";
    } else {
      document.getElementById("recBtn").style.boxShadow =
        "0px 0px 15px 10px #f96858 ";
    }
  } else {
    if (e.results[e.results.length - 1].isFinal === true) {
      p.innerHTML = e.results[e.results.length - 1][0].transcript;
      endResult.value = p.innerHTML;
      let foundNumber = checkNumber(p.innerHTML);
      if (foundNumber !== null) {
        p.innerHTML = foundNumber;
        endResult.value = foundNumber;
      }
      tagDiv.appendChild(p);
      document.getElementById("recBtn").style.boxShadow =
        "0px 0px 15px 10px #64e890 ";
    } else {
      document.getElementById("recBtn").style.boxShadow =
        "0px 0px 15px 10px #f96858 ";
    }
  }
}

recognition.addEventListener("result", onSpeak);

onUnmounted(() => {
  console.log("Unmounted");
  recognitionEnded.value = true;
  recognition.removeEventListener("result", () => {});
  recognition.removeEventListener("end", () => {});
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

  .hideBtn {
    visibility: hidden;
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
  .input-div {
    width: 100%;
    .q-input {
      flex: auto;
    }
  }
}
</style>
