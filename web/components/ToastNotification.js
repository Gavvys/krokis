class ToastNotification extends KrokisElement {
    constructor() {
        super();
        this._type = 'info';
        this._message = '';
        this._actionText = '';
        this._onAction = null;
        this._timer = null;
    }

    show({ message, type = 'info', actionText = '', onAction = null, duration = 5000 }) {
        this._message = message;
        this._type = type;
        this._actionText = actionText;
        this._onAction = onAction;

        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }

        this.render();

        const toastEl = this.shadowRoot.querySelector('.snackbar');
        if (toastEl) {
            toastEl.classList.add('show');
        }

        if (duration > 0) {
            this._timer = setTimeout(() => {
                this.dismiss();
            }, duration);
        }
    }

    dismiss() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        const toastEl = this.shadowRoot.querySelector('.snackbar');
        if (toastEl) {
            toastEl.classList.remove('show');
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'toast-action') {
                if (typeof this._onAction === 'function') {
                    this._onAction();
                }
                this.dismiss();
            } else if (action === 'toast-dismiss') {
                this.dismiss();
            }
        });
    }

    render() {
        const iconSvg = {
            success: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
            warning: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
            error: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
            info: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`
        }[this._type] || '';

        const actionBtn = this._actionText
            ? `<button class="action-btn" data-action="toast-action">${this.escape(this._actionText)}</button>`
            : '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    bottom: 24px;
                    left: 24px;
                    z-index: 9999;
                    pointer-events: none;
                    font-family: var(--md-sys-typescale-font, 'PT Sans', sans-serif);
                }
                .snackbar {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 280px;
                    max-width: 480px;
                    padding: 10px 16px;
                    border-radius: var(--md-sys-shape-corner-small, 4px);
                    background: var(--md-sys-color-surface-container-highest, #2c2c2c);
                    color: var(--md-sys-color-on-surface, #e1e2e8);
                    border: 1px solid var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.12));
                    box-shadow: var(--md-sys-elevation-4, 0 4px 12px rgba(0, 0, 0, 0.3));
                    pointer-events: auto;
                    opacity: 0;
                    transform: translateY(16px);
                    transition: opacity 200ms ease, transform 200ms ease;
                }
                .snackbar.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                .snackbar.type-success .icon { color: var(--md-sys-color-tertiary, #a5d6a7); }
                .snackbar.type-warning .icon { color: #ffb74d; }
                .snackbar.type-error .icon { color: var(--md-sys-color-error, #f44336); }
                .snackbar.type-info .icon { color: var(--md-sys-color-primary, #82b1ff); }

                .icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                }
                .icon svg {
                    width: 20px;
                    height: 20px;
                }
                .message {
                    flex: 1;
                    font-size: 13px;
                    line-height: 18px;
                    overflow-wrap: anywhere;
                }
                .action-btn {
                    background: transparent;
                    border: none;
                    color: var(--md-sys-color-primary, #82b1ff);
                    font-family: inherit;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: var(--md-sys-shape-corner-small, 4px);
                    flex-shrink: 0;
                }
                .action-btn:hover {
                    background: var(--md-sys-color-primary-container, rgba(130, 177, 255, 0.16));
                }
                .dismiss-btn {
                    background: transparent;
                    border: none;
                    color: var(--md-sys-color-on-surface-variant, #a0a5b5);
                    cursor: pointer;
                    padding: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .dismiss-btn:hover {
                    color: var(--md-sys-color-on-surface, #e1e2e8);
                }
                .dismiss-btn svg {
                    width: 16px;
                    height: 16px;
                }
            </style>
            <div class="snackbar type-${this.escape(this._type)}">
                <div class="icon">${iconSvg}</div>
                <div class="message">${this.escape(this._message)}</div>
                ${actionBtn}
                <button class="dismiss-btn" data-action="toast-dismiss" title="Dismiss notification" aria-label="Dismiss">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
            </div>
        `;
    }
}

customElements.define('toast-notification', ToastNotification);
