class InfoBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const type = this.getAttribute('type') || 'info';
        const title = this.getAttribute('title') || this.capitalize(type);

        let color = '#3b82f6';
        let bg = 'rgba(59, 130, 246, 0.05)';
        let border = 'rgba(59, 130, 246, 0.2)';
        let icon = 'ℹ️';

        if (type === 'tip') {
            color = '#10b981';
            bg = 'rgba(16, 185, 129, 0.05)';
            border = 'rgba(16, 185, 129, 0.2)';
            icon = '💡';
        } else if (type === 'warning') {
            color = '#f59e0b';
            bg = 'rgba(245, 158, 11, 0.05)';
            border = 'rgba(245, 158, 11, 0.2)';
            icon = '⚠️';
        } else if (type === 'caution') {
            color = '#ef4444';
            bg = 'rgba(239, 68, 68, 0.05)';
            border = 'rgba(239, 68, 68, 0.2)';
            icon = '🚨';
        }

        this.shadowRoot.innerHTML = `
            <style>
                .box {
                    background-color: ${bg};
                    border: 1px solid ${border};
                    border-left: 4px solid ${color};
                    border-radius: 8px;
                    padding: 16px;
                    margin: 20px 0;
                    font-family: 'Outfit', sans-serif;
                    color: #f3f4f6;
                    display: flex;
                    gap: 12px;
                }
                .icon {
                    font-size: 20px;
                    user-select: none;
                }
                .content {
                    flex: 1;
                }
                .title {
                    font-weight: 600;
                    color: ${color};
                    margin-bottom: 4px;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .text {
                    font-size: 14px;
                    line-height: 1.5;
                    color: #d1d5db;
                }
                ::slotted(*) {
                    margin: 0;
                    padding: 0;
                }
            </style>
            <div class="box">
                <div class="icon">${icon}</div>
                <div class="content">
                    <div class="title">${title}</div>
                    <div class="text">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

customElements.define('info-box', InfoBox);
