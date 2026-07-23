class CoverageReport extends KrokisElement {
    constructor() {
        super();
        this._expanded = new Set();
    }

    set data(value) {
        this._data = value?.coverage ?? { capabilities: [] };
        this.render();
    }

    render() {
        const capabilities = Array.isArray(this._data?.capabilities) ? this._data.capabilities : [];
        if (capabilities.length === 0) {
            this.shadowRoot.innerHTML = `<style>${this.styles()}</style><div class="empty">No coverage data. Run <code>krokis insights</code>.</div>`;
            return;
        }

        const summaryCards = capabilities.map(cap => `
            <div class="cov-card">
                <div class="cov-card-head">
                    <strong>${this.escape(cap.name)}</strong>
                    <span class="cov-status ${cap.covered === cap.requirements && cap.requirements > 0 ? 'cov-covered' : cap.covered > 0 ? 'cov-partial' : 'cov-uncovered'}">${cap.covered}/${cap.requirements}</span>
                </div>
                <div class="cov-card-body">${cap.covered} covered · ${cap.uncovered} uncovered</div>
            </div>
        `).join('');

        const requirementRows = capabilities.flatMap(cap => cap.items.map(item => {
            const expanded = this._expanded.has(item.name);
            const files = (item.matched_files || []).map(f => `<li>${this.escape(f)}</li>`).join('') || '<li class="none">No matched files.</li>';
            return `
                <tr class="cov-row ${item.status}">
                    <td><strong>${this.escape(item.name)}</strong><small>${this.escape(cap.name)}</small></td>
                    <td><span class="cov-status cov-status-inline ${this.statusClass(item.status)}">${this.escape(item.status)}</span></td>
                    <td>${item.matched_count}/${item.identifier_count}</td>
                    <td>
                        <button class="cov-toggle" type="button" data-name="${this.escape(item.name)}">${expanded ? '▾' : '▸'}</button>
                        ${expanded ? `<ul class="cov-files">${files}</ul>` : ''}
                    </td>
                </tr>
            `;
        })).join('');

        this.shadowRoot.innerHTML = `
            <style>${this.styles()}</style>
            <div class="cov-summary">${summaryCards}</div>
            <table class="cov-table">
                <thead><tr><th>Requirement</th><th>Status</th><th>Matched</th><th>Files</th></tr></thead>
                <tbody>${requirementRows}</tbody>
            </table>
        `;

        this.shadowRoot.querySelectorAll('.cov-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                if (this._expanded.has(name)) {
                    this._expanded.delete(name);
                } else {
                    this._expanded.add(name);
                }
                this.render();
            });
        });
    }

    statusClass(status) {
        if (status === 'covered') return 'cov-covered';
        if (status === 'partial') return 'cov-partial';
        return 'cov-uncovered';
    }

    styles() {
        return `
            :host { display: block; font-family: var(--md-sys-typescale-font, system-ui, sans-serif); color: var(--md-sys-color-on-surface, #e3e2e6); }
            .empty { color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-size: var(--md-sys-typescale-body-medium-size, 14px); padding: var(--md-sys-spacing-3, 12px) 0; }
            code { font-family: var(--md-sys-typescale-font-mono, monospace); }
            .cov-summary { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--md-sys-spacing-3, 12px); margin-bottom: var(--md-sys-spacing-6, 24px); }
            .cov-card { background: var(--md-sys-color-surface-container, #1e2024); border: 1px solid var(--md-sys-color-outline-variant, #44474f); border-radius: var(--md-sys-shape-corner-medium, 12px); padding: var(--md-sys-spacing-3, 14px); }
            .cov-card-head { display: flex; justify-content: space-between; align-items: baseline; gap: var(--md-sys-spacing-2, 8px); }
            .cov-card-body { color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-size: var(--md-sys-typescale-body-small-size, 12px); margin-top: 6px; }
            .cov-status { padding: 2px 8px; border-radius: var(--md-sys-shape-corner-full, 999px); font-size: var(--md-sys-typescale-label-small-size, 11px); line-height: var(--md-sys-typescale-label-small-line, 16px); font-weight: var(--md-sys-typescale-label-small-weight, 600); text-transform: uppercase; font-family: var(--md-sys-typescale-font-mono, monospace); letter-spacing: 0.5px; }
            .cov-status-inline { display: inline-block; }
            .cov-covered { background: var(--md-sys-color-secondary-container, #324a82); color: var(--md-sys-color-on-secondary-container, #dce2ff); }
            .cov-partial { background: var(--md-sys-color-tertiary-container, #4837ac); color: var(--md-sys-color-on-tertiary-container, #e6deff); }
            .cov-uncovered { background: var(--md-sys-color-error-container, #93000a); color: var(--md-sys-color-on-error-container, #ffdad6); }
            .cov-table { width: 100%; border-collapse: collapse; font-size: var(--md-sys-typescale-body-medium-size, 14px); }
            .cov-table th, .cov-table td { border-bottom: 1px solid var(--md-sys-color-outline-variant, #44474f); padding: var(--md-sys-spacing-2, 10px) var(--md-sys-spacing-2, 8px); text-align: left; vertical-align: top; }
            .cov-table th { color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-size: var(--md-sys-typescale-label-small-size, 11px); line-height: var(--md-sys-typescale-label-small-line, 16px); text-transform: uppercase; font-weight: var(--md-sys-typescale-label-small-weight, 600); letter-spacing: 0.5px; }
            .cov-row small { color: var(--md-sys-color-on-surface-variant, #c5c6d0); margin-top: 2px; display: block; font-size: var(--md-sys-typescale-label-small-size, 11px); }
            .cov-toggle { background: transparent; color: var(--md-sys-color-on-surface-variant, #c5c6d0); border: 0; cursor: pointer; font-size: 14px; padding: 0; transition: color var(--md-sys-motion-duration-short1, 150ms) var(--md-sys-motion-easing-standard, ease); }
            .cov-toggle:hover { color: var(--md-sys-color-primary, #82b1ff); }
            .cov-files { margin: 6px 0 0; padding-left: 16px; color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-size: var(--md-sys-typescale-body-small-size, 12px); font-family: var(--md-sys-typescale-font-mono, monospace); }
            .cov-files li.none { list-style: none; margin-left: -16px; }
            tr.covered { background: var(--md-sys-color-surface-container-low, #1a1c1f); }
            tr.partial { background: var(--md-sys-color-surface-container, #1e2024); }
            tr.uncovered { background: var(--md-sys-color-surface-container-high, #292b2f); }
        `;
    }
}

customElements.define('coverage-report', CoverageReport);