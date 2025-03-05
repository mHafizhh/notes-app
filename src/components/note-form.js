class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                .form-container {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                input, textarea {
                    width: 100%;
                    padding: 8px;
                    margin-top: 5px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px;
                    width: 100%;
                    cursor: pointer;
                    border-radius: 5px;
                    margin-top: 10px;
                }
                button:hover {
                    background: #0056b3;
                }
                .error-message {
                    color: red;
                }
                label {
                    display: block;
                    margin-top: 15px;
                }
                input:hover, textarea:hover {
                    border-color: #007bff;
                }
                input:focus, textarea:focus {
                    border-color: #007bff;
                    outline: none;
                    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
                }
                .notification-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background:rgb(55, 173, 82);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    display: none;
                }
            </style>
            <div class="form-container">
                <form id="noteForm">
                    <label for="title">Judul Catatan:</label>
                    <input type="text" id="title" required minlength="6" pattern="^[^\s$][a-zA-Z0-9 ]*$" aria-describedby="titleError">
                    <span id="titleError" class="error-message"></span>

                    <label for="content">Isi Catatan:</label>
                    <textarea id="content" required minlength="6" aria-describedby="contentError"></textarea>
                    <span id="contentError" class="error-message"></span>

                    <button type="submit">Tambahkan Catatan</button>
                </form>
                <div id="notification" class="notification-toast">Catatan berhasil ditambahkan!</div>
            </div>
        `;

        this.form = this.shadowRoot.getElementById("noteForm");
        this.titleInput = this.shadowRoot.getElementById("title");
        this.contentInput = this.shadowRoot.getElementById("content");
        this.titleError = this.shadowRoot.getElementById("titleError");
        this.contentError = this.shadowRoot.getElementById("contentError");
        this.notification = this.shadowRoot.getElementById("notification");
    }
    
    customValidationHandler(event) {
        event.target.setCustomValidity("");

        let errorMessage = "";

        if (event.target.validity.valueMissing) {
            errorMessage = "Wajib diisi.";
        } else if (event.target.validity.tooShort) {
            errorMessage = "Minimal panjang adalah enam karakter.";
        } else if (event.target.validity.patternMismatch) {
            errorMessage =
                "Tidak boleh diawali dengan simbol, mengandung spasi, atau karakter spesial seperti dolar ($).";
        }

        event.target.setCustomValidity(errorMessage);

        const connectedValidationId = event.target.getAttribute("aria-describedby");
        const connectedValidationEl = connectedValidationId
            ? this.shadowRoot.getElementById(connectedValidationId)
            : null;

        if (connectedValidationEl && errorMessage) {
            connectedValidationEl.innerText = errorMessage;
        } else {
            connectedValidationEl.innerText = "";
        }
    }

    connectedCallback() {
        this.titleInput.addEventListener("input", this.customValidationHandler.bind(this));
        this.titleInput.addEventListener("change", this.customValidationHandler.bind(this));
        this.titleInput.addEventListener("invalid", this.customValidationHandler.bind(this));
        this.titleInput.addEventListener("blur", this.customValidationHandler.bind(this));

        this.contentInput.addEventListener("input", this.customValidationHandler.bind(this));
        this.contentInput.addEventListener("change", this.customValidationHandler.bind(this));
        this.contentInput.addEventListener("invalid", this.customValidationHandler.bind(this));
        this.contentInput.addEventListener("blur", this.customValidationHandler.bind(this));

        this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.titleInput.validity.valid && this.contentInput.validity.valid) {

            const noteData = {
                title: this.titleInput.value.trim(),
                content: this.contentInput.value.trim(),
            };

            this.dispatchEvent(new CustomEvent("note-added", {
                detail: noteData,
                bubbles: true,
                composed: true
            }));

            console.log("Catatan berhasil ditambahkan");
            if (this.notification) {
                this.notification.style.display = "block";
            
                setTimeout(() => {
                    this.notification.style.display = "none";
                }, 3000);
            }

            this.form.reset();
        } else {
            console.log("Form tidak valid. Harap periksa input.");
        }
    }
}

customElements.define("note-form", NoteForm);
