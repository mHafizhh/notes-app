import Swal from "sweetalert2";
import anime from "animejs";

const BASE_URL = 'https://notes-api.dicoding.dev/v2';

const NotesApi = {
    async getNotes() {
        try{
            const response = await fetch(`${BASE_URL}/notes`);
            const data = await response.json();
            if(!response.ok) throw new Error (data.message);
            return data.data;
        } catch (error) {
            throw new Error(`Gagal mengambil catatan: ${error.message}`);
        }
    },

    async getArchivedNotes() {
        try {
            const response = await fetch(`${BASE_URL}/notes/archived`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data.data;
        } catch (error) {
            throw new Error(`Gagal mengambil catatan arsip: ${error.message}`);
        }
    },

    async addNote({ title, body }) {
        try {
            const response = await fetch(`${BASE_URL}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, body })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data.data;
        } catch (error) {
            throw new Error(`Gagal menambahkan catatan: ${error.message}`);
        }
    },

    async deleteNote(note_id) {
        try {
            const response = await fetch(`${BASE_URL}/notes/${note_id}`, { 
                method: 'DELETE' 
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            await Swal.fire({
                title: "Berhasil!",
                text: "Catatan telah dihapus.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            const noteElement = document.querySelector(`[data-id="${note_id}"]`);
            if (noteElement) {
                anime({
                    targets: noteElement,
                    opacity: 0,
                    translateY: -20,
                    duration: 500,
                    easing: "easeInOutQuad",
                    complete: () => {
                        noteElement.remove();
                    }
                });
            }

            return data;
            
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
            });
        }
    },

    async archiveNote(note_id) {
        try {
          const response = await fetch(`${BASE_URL}/notes/${note_id}/archive`, { method: 'POST' });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message);
          return data;
        } catch (error) {
          throw new Error(`Gagal mengarsipkan catatan: ${error.message}`);
        }
      },
    
    async unarchiveNote(note_id) {
        try {
          const response = await fetch(`${BASE_URL}/notes/${note_id}/unarchive`, { method: 'POST' });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message);
          return data;
        } catch (error) {
          throw new Error(`Gagal mengembalikan catatan: ${error.message}`);
        }
      }
};

export default NotesApi;