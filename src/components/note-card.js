class NoteCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                .note {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .note:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
                }

                .note::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: #007bff;
                    border-radius: 4px 0 0 4px;
                }

                h3 {
                    margin: 0 0 1rem 0;
                    font-size: 1.25rem;
                    color: #2d3436;
                    font-weight: 600;
                }

                p {
                    margin: 0;
                    font-size: 0.95rem;
                    color: #636e72;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }

                .buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: auto;
                }

                button {
                    flex: 1;
                    padding: 0.75rem;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }

                #archiveBtn {
                    background: #e3f2fd;
                    color: #1976d2;
                }

                #archiveBtn:hover {
                    background: #bbdefb;
                }

                #deleteBtn {
                    background: #ffebee;
                    color: #d32f2f;
                }

                #deleteBtn:hover {
                    background: #ffcdd2;
                }

                button:active {
                    transform: scale(0.98);
                }
            </style>
            <div class="note">
                <h3 id="noteTitle"></h3>
                <p id="noteContent"></p>
                <div class="buttons">
                    <button id="archiveBtn">
                        <span>📁</span> Arsipkan
                    </button>
                    <button id="deleteBtn">
                        <span>🗑️</span> Hapus
                    </button>
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