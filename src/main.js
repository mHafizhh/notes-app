import NotesApi from "./api/api.js";

  document.addEventListener("DOMContentLoaded", async () => {
    const notesContainer = document.getElementById("notesContainer");

    async function displayNotes() {
        notesContainer.innerHTML = "<p>Loading...</p>";
        try {
          const notes = await NotesApi.getNotes();
          notesContainer.innerHTML = "";
          notes.forEach(note => {
            const noteElement = document.createElement("note-card");
            noteElement.setAttribute("title", note.title);
            noteElement.setAttribute("content", note.body);
            noteElement.setAttribute("data-note_id", note.id);
            noteElement.setAttribute("archived", note.archived);
            notesContainer.appendChild(noteElement);
            });
        } catch (error) {
          notesContainer.innerHTML = `p style="color:red;">${error.message}</p>`
        }
    }

    async function displayArchivedNotes() {
      const archivedNotesContainer = document.getElementById("archivedNotesContainer");
      archivedNotesContainer.innerHTML = "<p>Loading...</p>";
      try {
          const archivedNotes = await NotesApi.getArchivedNotes();
          archivedNotesContainer.innerHTML = "";
          archivedNotes.forEach(note => {
              const noteElement = document.createElement("note-card");
              noteElement.setAttribute("title", note.title);
              noteElement.setAttribute("content", note.body);
              noteElement.setAttribute("data-note_id", note.id);
              noteElement.setAttribute("archived", "true");
              archivedNotesContainer.appendChild(noteElement);
          });
      } catch (error) {
          archivedNotesContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
      }
    }

    setTimeout(() => {
        const noteForm = document.querySelector("note-form");
        
        if (!noteForm) {
            console.error("note-form tidak ditemukan!");
            return;
        }

        noteForm.addEventListener("note-added", async (event) => {
            const { title, content } = event.detail;
            try {
              await NotesApi.addNote({ title, body: content });
              displayNotes();
            } catch (error) {
              alert (`Gagal menambahkan catatan: ${error.message}`);
            }
        });

    }, 100);

    document.addEventListener("delete-note", async (event) => {
      const { id } = event.detail;
      if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
        try {
          await NotesApi.deleteNote(id);
          displayNotes();
        } catch (error) {
          alert(`Gagal menghapus catatan: ${error.message}`);
        }
      }
    });

    document.addEventListener("archive-note", async (event) => {
      const { id, archived } = event.detail;
      try {
          if (archived) {
              await NotesApi.unarchiveNote(id);
          } else {
              await NotesApi.archiveNote(id);
          }
          displayNotes();
          displayArchivedNotes();
      } catch (error) {
          alert(`Gagal mengubah status catatan: ${error.message}`);
      }
  });

    displayNotes();
    displayArchivedNotes();
});
