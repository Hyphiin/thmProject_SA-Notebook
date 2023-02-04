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
const recordingsCollectionQuery = query(
  recordingsCollectionRef,
  orderBy("date", "desc")
);

export const useStoreAllRecordings = defineStore("storeAllRecordings", () => {
  const recordings = ref([]);

  /**
   * actions
   */
  const getRecordings = async () => {
    onSnapshot(recordingsCollectionQuery, (querySnapshot) => {
      const tempRecordings = [];
      querySnapshot.forEach((doc) => {
        let recording = {
          id: doc.id,
          recording: doc.data().recording,
        };
        tempRecordings.push(recording);
      });
      recordings.value = tempRecordings;
    });
  };

  const addRecordings = async (newRecordingContent) => {
    await addDoc(recordingsCollectionRef, {
      recording: newRecordingContent,
    });
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
