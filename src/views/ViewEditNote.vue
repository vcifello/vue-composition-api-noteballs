<template>
  <div class="edit-note">
    <AddEditNote
      v-model="noteContent"
      bgColor="link"
      placeholder="Edit note"
      label="Edit note"
      ref="addEditNoteRef"
    >
      <template #buttons>
        <button
          @click="$router.back()"
          class="button is-link is-light mr-3"
        >
          Cancel
        </button>
        <button
          @click="handleSaveClicked"
          class="button is-link has-background-link"
          :disabled="!noteContent"
        >
          Save Note
        </button>
      </template>
    </AddEditNote>
  </div>
</template>

<script setup>

  import { ref } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import AddEditNote from '@/components/Notes/AddEditNote.vue';
  import { useStoreNotes } from "@/stores/storeNotes"

  const route = useRoute()
  const router = useRouter()

  const storeNotes = useStoreNotes()

  const noteContent = ref("")

  noteContent.value = storeNotes.getNoteContent(route.params.id)

  const handleSaveClicked = () => {
    // console.log("handleSaveClicked")
    // console.log("id", route.params.id)
    // console.log("noteContentValue",noteContent.value )
    storeNotes.updateNote(route.params.id, noteContent.value)
    //console.log("afterStoreNotes.updateNote")
    router.push("/")
    //console.log("afterRouterPush")
  }

</script>