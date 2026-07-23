class InfoBox extends KrokisElement {
    connectedCallback() {
        if (!this._initialized) {
            this._initialized = true;
            const type = this.getAttribute('type') || 'info';
            this._title = this.getAttribute('title') || this.capitalize(type);

            let color = 'var(--md-sys-color-primary, #82b1ff)';
            let bg = 'var(--md-sys-color-surface-container, #1e2024)';
            let icon = 'ℹ️';

            if (type === 'tip') {
                color = 'var(--md-sys-color-tertiary, #c8b8ff)';
                icon = '💡';
            } else if (type === 'warning') {
                color = 'var(--md-sys-color-error, #ffb4ab)';
                icon = '⚠️';
            } else if (type === 'caution') {
                color = 'var(--md-sys-color-error, #ffb4ab)';
                icon = '🚨';
            }

            this.shadowRoot.innerHTML = `
                <style>
                    .box {
                        background-color: ${bg};
                        border: 1px solid var(--md-sys-color-outline-variant, #44474f);
                        border-left: 4px solid ${color};
                        border-radius: var(--md-sys-shape-corner-small, 8px);
                        padding: var(--md-sys-spacing-4, 16px);
                        margin: var(--md-sys-spacing-5, 20px) 0;
                        font-family: var(--md-sys-typescale-font, system-ui, sans-serif);
                        color: var(--md-sys-color-on-surface, #e3e2e6);
                        display: flex;
                        gap: var(--md-sys-spacing-3, 12px);
                    }
                    .icon {
                        font-size: 20px;
                        color: ${color};
                        user-select: none;
                        font-weight: 700;
                    }
                    .content {
                        flex: 1;
                    }
                    .title {
                        font-family: var(--md-sys-typescale-font, system-ui, sans-serif);
                        font-weight: var(--md-sys-typescale-label-large-weight, 600);
                        color: ${color};
                        margin-bottom: var(--md-sys-spacing-1, 4px);
                        font-size: var(--md-sys-typescale-label-large-size, 14px);
                        line-height: var(--md-sys-typescale-label-large-line, 20px);
                        text-transform: uppercase;
                        letter-spacing: var(--md-sys-typescale-label-large-tracking, 0.1px);
                    }
                    .text {
                        font-family: var(--md-sys-typescale-font, system-ui, sans-serif);
                        font-size: var(--md-sys-typescale-body-medium-size, 14px);
                        line-height: var(--md-sys-typescale-body-medium-line, 20px);
                        color: var(--md-sys-color-on-surface-variant, #c5c6d0);
                    }
                    ::slotted(*) {
                        margin: 0;
                        padding: 0;
                    }
                </style>
                <div class="box">
                    <div class="icon">${icon}</div>
                    <div class="content">
                        <div class="title">${this._title}</div>
                        <div class="text">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

customElements.define('info-box', InfoBox);
