class AppBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                .header {
                    background: linear-gradient(135deg, #0072ff, #00c6ff);
                    color: white;
                    padding: 1.2rem;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }

                .header-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    padding: 0 20px;
                }

                .app-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0;
                    letter-spacing: 0.5px;
                }

                .app-subtitle {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    margin-left: 15px;
                    font-weight: 300;
                }

                @media (max-width: 768px) {
                    .header-content {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .app-subtitle {
                        margin-left: 0;
                        margin-top: 5px;
                    }
                }
            </style>
            <div class="header">
                <div class="header-content">
                    <h1 class="app-title">Aplikasi Catatan</h1>
                    <span class="app-subtitle">Simpan catatan Anda dengan mudah</span>
                </div>
            </div>
        `;
    }
}
customElements.define("app-bar", AppBar);