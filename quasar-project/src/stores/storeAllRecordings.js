import { defineStore } from "pinia";
import { ref } from "vue";
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "/src/js/firebase";

const recordingsCollectionRef = collection(db, "SpeechToTextAll");

export const useStoreAllRecordings = defineStore("storeAllRecordings", () => {
  const recordings = ref([]);
  const recordingCounter = ref(1);

  /**
   * actions
   */
  const getRecordings = async () => {
    onSnapshot(recordingsCollectionRef, (querySnapshot) => {
      const tempRecordings = [];
      querySnapshot.forEach((doc) => {
        let recording = {
          id: doc.id,
          title: doc.data().title,
          recording1: doc.data().recording1,
          recording2: doc.data().recording2,
          recording3: doc.data().recording3,
          recording4: doc.data().recording4,
        };
        tempRecordings.push(recording);
        recordingCounter.value++;
      });
      recordings.value = tempRecordings;
    });
  };

  const addRecordings = async (newRecordingContent) => {
    await addDoc(recordingsCollectionRef, {
      title: recordingCounter.value,
      recording1: newRecordingContent[0],
      recording2: newRecordingContent[1],
      recording3: newRecordingContent[2],
      recording4: newRecordingContent[3],
    });
    recordingCounter.value++;
  };

  const deleteRecording = async (idToDelete) => {
    await deleteDoc(doc(recordingsCollectionRef, idToDelete));
  };

  /**
   * getters
   */

  return {
    recordings,
    getRecordings,
    addRecordings,
    deleteRecording,
  };
});
