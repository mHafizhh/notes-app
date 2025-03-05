class AppBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .header {
                    background: #007bff;
                    color: white;
                    padding: 15px;
                    text-align: center;
                    font-size: 20px;
                    font-weight: bold;
                }
            </style>
            <div class="header">Aplikasi Catatan</div>
        `;
    }
}
customElements.define("app-bar", AppBar);