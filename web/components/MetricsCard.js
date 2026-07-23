class MetricsCard extends KrokisElement {
    connectedCallback() {
        if (!this._initialized) {
            this._initialized = true;
            const value = this.getAttribute('value') || '0';
            const label = this.getAttribute('label') || 'Metric';

            this.shadowRoot.innerHTML = `
                <style>
                    .card {
                        background: var(--md-sys-color-surface-container, #1e2024);
                        border: 1px solid var(--md-sys-color-outline-variant, #44474f);
                        border-radius: var(--md-sys-shape-corner-large, 16px);
                        padding: var(--md-sys-spacing-6, 24px);
                        display: flex;
                        flex-direction: column;
                        gap: var(--md-sys-spacing-2, 8px);
                        box-shadow: var(--md-sys-elevation-1, 0 1px 2px 0 rgba(0, 0, 0, 0.3));
                        transition: transform var(--md-sys-motion-duration-short2, 200ms) var(--md-sys-motion-easing-standard, ease),
                            box-shadow var(--md-sys-motion-duration-short2, 200ms) var(--md-sys-motion-easing-standard, ease);
                        font-family: var(--md-sys-typescale-font, system-ui, sans-serif);
                    }
                    .card:hover {
                        transform: translateY(-2px);
                        box-shadow: var(--md-sys-elevation-2, 0 1px 2px 0 rgba(0, 0, 0, 0.3));
                    }
                    .value {
                        font-size: var(--md-sys-typescale-headline-small-size, 24px);
                        line-height: var(--md-sys-typescale-headline-small-line, 32px);
                        font-weight: 700;
                        color: var(--md-sys-color-primary, #82b1ff);
                    }
                    .label {
                        font-size: var(--md-sys-typescale-label-medium-size, 12px);
                        line-height: var(--md-sys-typescale-label-medium-line, 16px);
                        color: var(--md-sys-color-on-surface-variant, #c5c6d0);
                        font-weight: var(--md-sys-typescale-label-medium-weight, 600);
                        letter-spacing: var(--md-sys-typescale-label-medium-tracking, 0.5px);
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
}

customElements.define('metrics-card', MetricsCard);
