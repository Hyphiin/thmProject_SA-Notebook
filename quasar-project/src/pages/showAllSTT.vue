<template>
  <div class="container-all">
    <q-btn color="primary" outline class="q-ma-md" to="/">Abbrechen</q-btn>
    <div class="flex justify-center q-pa-md container-all_content">
      <div class="texts flex row content-center q-ma-md items-center no-wrap">
        <div class="btnDiv flex row no-wrap">
          <div class="showTextDiv flex no-wrap column">
            Web Speech API
            <div id="p-tagDiv" class="tagDiv">
              {{ recordingData1 }}
            </div>
          </div>
          <div class="showTextDiv flex no-wrap column">
            Artyom.js
            <div id="p-tagDiv" class="tagDiv">{{ recordingData2 }}</div>
          </div>
          <div class="showTextDiv flex no-wrap column">
            AssemblyAi
            <div id="p-tagDiv" class="tagDiv">{{ recordingData3 }}</div>
          </div>
          <div class="showTextDiv flex no-wrap column">
            Deepspeech
            <div id="p-tagDiv" class="tagDiv">{{ recordingData4 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useStoreAllRecordings } from "src/stores/storeAllRecordings";

/**
 * router
 */
const route = useRoute();

/**
 * store
 */
const storeRecordings = useStoreAllRecordings();

/**
 * recipe data
 */
const recordingData1 = ref(
  storeRecordings.recordings.find((rec) => rec.id === route.params.id)
    .recording1
);
const recordingData2 = ref(
  storeRecordings.recordings.find((rec) => rec.id === route.params.id)
    .recording2
);
const recordingData3 = ref(
  storeRecordings.recordings.find((rec) => rec.id === route.params.id)
    .recording3
);
const recordingData4 = ref(
  storeRecordings.recordings.find((rec) => rec.id === route.params.id)
    .recording4
);
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
