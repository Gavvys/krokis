class MetricsCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const value = this.getAttribute('value') || '0';
        const label = this.getAttribute('label') || 'Metric';

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(10px);
                    transition: transform 0.3s ease, border-color 0.3s ease;
                    font-family: 'Outfit', sans-serif;
                }
                .card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(59, 130, 246, 0.3);
                }
                .value {
                    font-size: 32px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .label {
                    font-size: 13px;
                    color: #9ca3af;
                    font-weight: 500;
                    letter-spacing: 0.2px;
                    text-transform: uppercase;
                }
            </style>
            <div class="card">
                <div class="value">${value}</div>
                <div class="label">${label}</div>
            </div>
        `;
    }
}

customElements.define('metrics-card', MetricsCard);
