import NotesApi from "./api/api.js";
import Swal from "sweetalert2";

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
              Swal.fire({
                title: "Menambahkan...",
                text: "Mohon Menunggu",
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading();
                }
              });

              await NotesApi.addNote({ title, body: content });
              Swal.close();
              displayNotes();
            } catch (error) {
              Swal.close();
              Swal.fire("Gagal", error.message, "error");
            }
        });

    }, 100);

    document.addEventListener("delete-note", async (event) => {
      const { id } = event.detail;
      if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
        try {
          Swal.fire({
            title: "Menghapus...",
            text: "Mohon tunggu",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
          });

          await NotesApi.deleteNote(id);
          Swal.close();
          displayNotes();
          displayArchivedNotes();
        } catch (error) {
          Swal.close();
          Swal.fire("Gagal", error.message, "error");
        }
      }
    });

    document.addEventListener("archive-note", async (event) => {
      const { id, archived } = event.detail;
      try {
          Swal.fire({
            title: archived ? "Mengembalikan..." : "Mengarsipkan...",
            text: "Mohon Menunggu",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
          });

          if (archived) {
              await NotesApi.unarchiveNote(id);
          } else {
              await NotesApi.archiveNote(id);
          }

          Swal.close();
          Swal.fire("Berhasil!", `Catatan telah ${archived ? "dikembalikan" : "diarsipkan"}.`, "success");
          displayNotes();
          displayArchivedNotes();
      } catch (error) {
          Swal.close();
          Swal.fire("Gagal", error.message, "error");
      }
  });

    displayNotes();
    displayArchivedNotes();
});
