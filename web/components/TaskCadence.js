class TaskCadence extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set data(val) {
        this._data = val;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this._data) {
            this.shadowRoot.innerHTML = `<div style="color: #9ca3af; font-family: 'Outfit';">Loading cadence data...</div>`;
            return;
        }

        const commits = this._data.history || [];
        const authors = this._data.authors || [];

        // Build list of authors
        let authorRows = authors.map(a => `
            <div class="author-row">
                <span class="author-name">${a.name}</span>
                <div class="bar-container">
                    <div class="bar" style="width: ${Math.min(100, (a.commits / Math.max(1, commits.length)) * 100)}%"></div>
                </div>
                <span class="author-count">${a.commits} commits</span>
            </div>
        `).join('');

        // Build list of recent history commits
        let commitRows = commits.slice(0, 10).map(c => `
            <div class="commit-item">
                <div class="commit-header">
                    <span class="commit-hash">${c.hash}</span>
                    <span class="commit-author">${c.author}</span>
                    <span class="commit-date">${this.formatDate(c.date)}</span>
                </div>
                <div class="commit-msg">${c.message}</div>
            </div>
        `).join('');

        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    font-family: 'Outfit', sans-serif;
                    color: #f3f4f6;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                .section-header {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    padding-bottom: 6px;
                    color: #60a5fa;
                }
                .author-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    font-size: 14px;
                }
                .author-name {
                    width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #d1d5db;
                }
                .bar-container {
                    flex: 1;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                    margin: 0 16px;
                    overflow: hidden;
                }
                .bar {
                    height: 100%;
                    background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
                    border-radius: 4px;
                }
                .author-count {
                    width: 80px;
                    text-align: right;
                    color: #9ca3af;
                }
                .commit-item {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 8px;
                }
                .commit-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #9ca3af;
                    margin-bottom: 6px;
                }
                .commit-hash {
                    font-family: 'JetBrains Mono', monospace;
                    color: #60a5fa;
                    font-weight: 500;
                }
                .commit-author {
                    font-weight: 500;
                    color: #e5e7eb;
                }
                .commit-msg {
                    font-size: 14px;
                    color: #d1d5db;
                }
            </style>
            <div class="container">
                <div>
                    <div class="section-header">Author Breakdown</div>
                    ${authorRows || '<div style="color: #9ca3af; font-size: 14px;">No commit metrics available.</div>'}
                </div>
                <div>
                    <div class="section-header">Recent Commit Activity</div>
                    <div class="commit-list">
                        ${commitRows || '<div style="color: #9ca3af; font-size: 14px;">No commits found in history.</div>'}
                    </div>
                </div>
            </div>
        `;
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return dateStr;
        }
    }
}

customElements.define('task-cadence', TaskCadence);
