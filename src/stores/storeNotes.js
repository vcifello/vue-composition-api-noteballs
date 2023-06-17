// stores/counter.js
import { defineStore } from 'pinia'
import { collection, onSnapshot,
  doc , deleteDoc, updateDoc, addDoc,
  query, orderBy
} from "firebase/firestore"
import { db } from "@/js/firebase"

const notesCollectionRef = collection(db, "notes")
const notesCollectionQuery = query(notesCollectionRef, orderBy("date", "desc"));

export const useStoreNotes = defineStore('storeNotes', {
  state: () => {
    return {
      notes: [
        // {
        //   id: "id1",
        //   content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nesciunt culpa tenetur totam debitis repellendus nulla temporibus aspernatur. Eius, repellat dicta. Placeat rerum ducimus itaque laborum recusandae aliquam maxime maiores."
        // },
        // {
        //   id: "id2",
        //   content: "This is a short note for demo."
        // }
      ],
      notesLoaded: false
    }
  },
  actions: {
    async getNotes() {
      this.notesLoaded = false
      onSnapshot(notesCollectionQuery, (querySnapshot) => {
        let tempNotes = []
        querySnapshot.forEach((doc) => {
          let note = {
            id: doc.id,
            content: doc.data().content,
            date: doc.data().date
          }
          tempNotes.push(note)
        })
        this.notes = tempNotes
        this.notesLoaded = true
      })
    },
    async addNote(newNoteContent) {
      let currentDate = new Date().getTime(),
          date = currentDate.toString()

      await addDoc(notesCollectionRef, {
        content: newNoteContent,
        date
      })
    },
    async deleteNote(idToDelete) {
      await deleteDoc(doc(notesCollectionRef, idToDelete))
    },
    async updateNote(id, content){

      const docRef = doc(db, "notes", id);

      await updateDoc(docRef, {
        content: content
      });
    }
  },
  getters: {
    getNoteContent: (state) => {
      return (id) => {
        return state.notes.filter(note => { return note.id === id})[0].content
      }
    },
    totalNotesCount: (state) => {
      return state.notes.length
    },
    totalCharactersCount: (state) => {
      let count = 0
      state.notes.forEach(note => {
        count += note.content.length
      })
      return count
    }
  }
})