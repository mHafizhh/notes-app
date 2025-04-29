class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                .form-container {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    margin: 1rem;
                }

                .form-title {
                    font-size: 1.5rem;
                    color: #2d3436;
                    margin-bottom: 2rem;
                    font-weight: 600;
                    position: relative;
                    padding-bottom: 0.5rem;
                }

                .form-title::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 50px;
                    height: 3px;
                    background: linear-gradient(135deg, #0072ff, #00c6ff);
                    border-radius: 3px;
                }

                .form-group {
                    margin-bottom: 2rem;
                }

                label {
                    display: block;
                    margin-bottom: 0.75rem;
                    color: #2d3436;
                    font-weight: 500;
                    font-size: 1rem;
                }

                input, textarea {
                    width: calc(100% - 2rem); /* Mengurangi width untuk mengakomodasi padding */
                    padding: 1rem;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    color: #2d3436;
                    background: #f8f9fa;
                    font-family: inherit;
                }

                textarea {
                    min-height: 180px;
                    resize: vertical;
                    line-height: 1.6;
                }

                input::placeholder, textarea::placeholder {
                    color: #a0a0a0;
                }

                input:hover, textarea:hover {
                    border-color: #90caf9;
                }

                input:focus, textarea:focus {
                    border-color: #2196f3;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
                    background: white;
                }

                button {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(135deg, #0072ff, #00c6ff);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 1rem;
                }

                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 114, 255, 0.2);
                }

                button:active {
                    transform: translateY(0);
                }

                .error-message {
                    color: #d32f2f;
                    font-size: 0.85rem;
                    margin-top: 0.75rem;
                    display: block;
                }

                .notification-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #4caf50;
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
                    display: none;
                    animation: slideIn 0.3s ease;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            </style>
            <div class="form-container">
                <h2 class="form-title">Tambah Catatan Baru</h2>
                <form id="noteForm">
                    <div class="form-group">
                        <label for="title">Judul Catatan</label>
                        <input type="text" id="title" required minlength="6" 
                            pattern="^[^\s$][a-zA-Z0-9 ]*$" 
                            placeholder="Masukkan judul catatan..."
                            aria-describedby="titleError">
                        <span id="titleError" class="error-message"></span>
                    </div>

                    <div class="form-group">
                        <label for="content">Isi Catatan</label>
                        <textarea id="content" required minlength="6" 
                            placeholder="Tulis catatan Anda di sini..."
                            aria-describedby="contentError"></textarea>
                        <span id="contentError" class="error-message"></span>
                    </div>

                    <button type="submit">
                        <span>📝</span> Tambahkan Catatan
                    </button>
                </form>
                <div id="notification" class="notification-toast">
                    ✅ Catatan berhasil ditambahkan!
                </div>
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

            event.target.reset();
        } else {
            alert("Form tidak valid. Harap periksa input.");
        }
    }
}

customElements.define("note-form", NoteForm);
