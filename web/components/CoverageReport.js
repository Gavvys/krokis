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
            :host { display: block; font-family: 'Open Sans', sans-serif; color: #f3f4f6; }
            .empty { color: #9ca3af; font-size: 14px; padding: 12px 0; }
            code { font-family: 'JetBrains Mono', monospace; }
            .cov-summary { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-bottom: 24px; }
            .cov-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 14px; }
            .cov-card-head { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
            .cov-card-body { color: #9ca3af; font-size: 12px; margin-top: 6px; }
            .cov-status { padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; }
            .cov-status-inline { display: inline-block; }
            .cov-covered { background: rgba(16,185,129,0.14); color: #6ee7b7; }
            .cov-partial { background: rgba(245,158,11,0.14); color: #fcd34d; }
            .cov-uncovered { background: rgba(239,68,68,0.14); color: #fca5a5; }
            .cov-table { width: 100%; border-collapse: collapse; font-size: 13px; }
            .cov-table th, .cov-table td { border-bottom: 1px solid rgba(255,255,255,0.08); padding: 10px 8px; text-align: left; vertical-align: top; }
            .cov-table th { color: #9ca3af; font-size: 11px; text-transform: uppercase; }
            .cov-row small { color: #9ca3af; margin-top: 2px; display: block; font-size: 11px; }
            .cov-toggle { background: transparent; color: #9ca3af; border: 0; cursor: pointer; font-size: 14px; padding: 0; }
            .cov-files { margin: 6px 0 0; padding-left: 16px; color: #9ca3af; font-size: 12px; font-family: 'JetBrains Mono', monospace; }
            .cov-files li.none { list-style: none; margin-left: -16px; }
            tr.covered { background: rgba(16,185,129,0.04); }
            tr.partial { background: rgba(245,158,11,0.04); }
            tr.uncovered { background: rgba(239,68,68,0.04); }
        `;
    }
}

customElements.define('coverage-report', CoverageReport);