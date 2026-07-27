class TaskCadence extends KrokisElement {
    render() {
        if (!this._data) {
            this.shadowRoot.innerHTML = `<div style="color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-family: var(--md-sys-typescale-font, system-ui, sans-serif);">Loading cadence data...</div>`;
            return;
        }

        const git = this._data.git || this._data;
        const commits = git.history || [];
        const authors = git.authors || [];

        let authorRows = authors.map(a => `
            <div class="author-row">
                <span class="author-name">${a.name}</span>
                <div class="bar-container">
                    <div class="bar" style="width: ${Math.min(100, (a.commits / Math.max(1, commits.length)) * 100)}%"></div>
                </div>
                <span class="author-count">${a.commits} commits</span>
            </div>
        `).join('');

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
                    font-family: var(--md-sys-typescale-font, system-ui, sans-serif);
                    color: var(--md-sys-color-on-surface, #e3e2e6);
                    display: flex;
                    flex-direction: column;
                    gap: var(--md-sys-spacing-6, 24px);
                }
                .section-header {
                    font-family: var(--md-sys-typescale-font, system-ui, sans-serif);
                    font-size: var(--md-sys-typescale-title-medium-size, 16px);
                    line-height: var(--md-sys-typescale-title-medium-line, 24px);
                    font-weight: var(--md-sys-typescale-title-medium-weight, 600);
                    margin-bottom: var(--md-sys-spacing-3, 12px);
                    border-bottom: 1px solid var(--md-sys-color-outline-variant, #44474f);
                    padding-bottom: 6px;
                    color: var(--md-sys-color-primary, #82b1ff);
                }
                .author-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: var(--md-sys-spacing-3, 12px);
                    font-size: var(--md-sys-typescale-body-medium-size, 14px);
                }
                .author-name {
                    width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: var(--md-sys-color-on-surface, #e3e2e6);
                }
                .bar-container {
                    flex: 1;
                    height: 8px;
                    background: var(--md-sys-color-surface-container-high, #292b2f);
                    border-radius: var(--md-sys-shape-corner-extra-small, 4px);
                    margin: 0 var(--md-sys-spacing-4, 16px);
                    overflow: hidden;
                }
                .bar {
                    height: 100%;
                    background: var(--md-sys-color-primary, #82b1ff);
                    border-radius: var(--md-sys-shape-corner-extra-small, 4px);
                }
                .author-count {
                    width: 80px;
                    text-align: right;
                    color: var(--md-sys-color-on-surface-variant, #c5c6d0);
                }
                .commit-item {
                    background: var(--md-sys-color-surface-container, #1e2024);
                    border: 1px solid var(--md-sys-color-outline-variant, #44474f);
                    border-radius: var(--md-sys-shape-corner-small, 8px);
                    padding: var(--md-sys-spacing-3, 12px);
                    margin-bottom: var(--md-sys-spacing-2, 8px);
                }
                .commit-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: var(--md-sys-typescale-label-small-size, 11px);
                    line-height: var(--md-sys-typescale-label-small-line, 16px);
                    color: var(--md-sys-color-on-surface-variant, #c5c6d0);
                    margin-bottom: 6px;
                }
                .commit-hash {
                    font-family: var(--md-sys-typescale-font-mono, monospace);
                    color: var(--md-sys-color-primary, #82b1ff);
                    font-weight: 500;
                }
                .commit-author {
                    font-weight: 500;
                    color: var(--md-sys-color-on-surface, #e3e2e6);
                }
                .commit-msg {
                    font-size: var(--md-sys-typescale-body-medium-size, 14px);
                    line-height: var(--md-sys-typescale-body-medium-line, 20px);
                    color: var(--md-sys-color-on-surface-variant, #c5c6d0);
                }
            </style>
            <div class="container">
                <div>
                    <div class="section-header">Author Breakdown</div>
                    ${authorRows || '<div style="color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-size: var(--md-sys-typescale-body-medium-size, 14px);">No commit metrics available.</div>'}
                </div>
                <div>
                    <div class="section-header">Recent Commit Activity</div>
                    <div class="commit-list">
                        ${commitRows || '<div style="color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-size: var(--md-sys-typescale-body-medium-size, 14px);">No commits found in history.</div>'}
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
