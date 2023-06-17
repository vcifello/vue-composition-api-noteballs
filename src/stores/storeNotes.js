// stores/counter.js
import { defineStore } from 'pinia'
import { collection, onSnapshot,
  doc , deleteDoc, updateDoc, addDoc,
  query, orderBy
} from "firebase/firestore"
import { db } from "@/js/firebase"
import { useStoreAuth } from "@/stores/storeAuth"

let notesCollectionRef
let notesCollectionQuery

let getNotesSnapshot = null

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
    init() {
      const storeAuth = useStoreAuth()

      console.log("userId", storeAuth.user.id)
      notesCollectionRef = collection(db, "users", storeAuth.user.id, 'notes')
      notesCollectionQuery = query(notesCollectionRef, orderBy("date", "desc"));
      this.getNotes()
    },
    async getNotes() {
      this.notesLoaded = false

      if(getNotesSnapshot) getNotesSnapshot() //unsubscribe prior listener

      getNotesSnapshot = onSnapshot(notesCollectionQuery, (querySnapshot) => {
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
    clearNotes() {
      this.notes = []
      if (getNotesSnapshot) getNotesSnapshot()
      this.notesLoaded = false
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

      //const docRef = doc(db, "notes", id);
      const docRef = doc(notesCollectionRef, id);

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