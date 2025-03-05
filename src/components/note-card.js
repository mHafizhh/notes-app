class NoteCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                .note {
                    background: white;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h3 {
                    margin: 0;
                    font-size: 18px;
                    color: black;
                }

                p {
                    margin: 5px 0 0;
                    font-size: 14px;
                    color: gray;
                }
                .buttons {
                    display: flex;
                    gap: 10px;
                }
                button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    border-radius: 4px;
                    font-size: 12px;
                }
                button:hover {
                    background: #0056b3;
                }
                .delete {
                    background: red;
                }
                .delete:hover {
                    background: darkred;
                }
            </style>
            <div class="note">
                <h3 id="noteTitle"></h3>
                <p id="noteContent"></p><br>
                <div class="buttons">
                    <button id="archiveBtn">Arsipkan</button>
                    <button id="deleteBtn" class="delete">Hapus</button>
                </div>
            </div>
        `;

        this.titleElement = this.shadowRoot.querySelector("#noteTitle");
        this.contentElement = this.shadowRoot.querySelector("#noteContent");
        this.archiveButton = this.shadowRoot.querySelector("#archiveBtn");
        this.deleteButton = this.shadowRoot.querySelector("#deleteBtn");

        this.archiveButton.addEventListener("click", () => {
            const isArchived = this.getAttribute("archived") === "true";
            this.dispatchEvent(new CustomEvent("archive-note", {
                detail: { 
                    id: this.getAttribute("data-note_id"), 
                    archived: this.getAttribute("archived") === "true" },
                bubbles: true,
                composed: true
            }));
        });

        this.deleteButton.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("delete-note", {
                detail: { id: this.getAttribute("data-note_id") },
                bubbles: true,
                composed: true
            }));
        });
    }

    static get observedAttributes() {
        return ["title", "content", "data-note_id", "archived"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "title") {
            this.shadowRoot.querySelector("#noteTitle").textContent = newValue || "No Title";
        }
        if (name === "content") {
            this.shadowRoot.querySelector("#noteContent").textContent = newValue || "No Content";
        }
        if (name === "archived") {
            this.archiveButton.textContent = newValue === "true" ? "Kembalikan" : "Arsipkan";
        }
    }
}
customElements.define("note-card", NoteCard);