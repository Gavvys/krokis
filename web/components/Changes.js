class Changes extends KrokisElement {
    constructor() {
        super();
        this._mode = 'active';
    }

    set mode(value) {
        this._mode = value === 'archived' ? 'archived' : 'active';
        this.render();
    }

    render() {
        const flow = this._data?.change_flow;
        if (!flow) {
            this.shadowRoot.innerHTML = `<div class="empty">No Flow Insights data. Run <code>krokis insights</code>.</div>`;
            return;
        }

        const allChanges = Array.isArray(flow.changes) ? flow.changes : [];
        const throughput = Array.isArray(flow.monthly_throughput) ? flow.monthly_throughput : [];
        const completed = allChanges.filter(change => change.status === 'completed');
        const cycleTimes = completed
            .map(change => change.cycle_time_days)
            .filter(value => Number.isFinite(value));
        const averageCycle = cycleTimes.length
            ? `${Math.round(cycleTimes.reduce((sum, value) => sum + value, 0) / cycleTimes.length)} days`
            : 'Unavailable';

        const throughputRows = throughput.map(item => `
            <div class="throughput-row">
                <span>${this.escape(item.month)}</span>
                <strong>${Number.isFinite(item.completed) ? item.completed : 'Unavailable'}</strong>
            </div>
        `).join('') || '<div class="empty">No completed changes found.</div>';

        if (this._mode === 'archived') {
            const archivedRows = completed
                .slice()
                .sort((a, b) => (b.completed_date || '').localeCompare(a.completed_date || ''))
                .map(change => this.renderArchivedRow(change))
                .join('') || '<tr><td colspan="4" class="empty">No archived changes yet.</td></tr>';

            this.shadowRoot.innerHTML = `
                <style>${this.styles()}</style>
                <section class="panel"><h3>Archived Changes</h3>
                    <table><thead><tr><th>Change</th><th>Completed</th><th>Cycle time</th><th>Planning health</th></tr></thead>
                    <tbody>${archivedRows}</tbody></table>
                </section>
            `;
            return;
        }

        const activeChanges = allChanges.filter(change => change.status === 'active');
        const changeRows = activeChanges.map(change => this.renderActiveRow(change))
            .join('') || '<tr><td colspan="4" class="empty">No active changes found.</td></tr>';

        this.shadowRoot.innerHTML = `
            <style>${this.styles()}</style>
            <div class="metrics">
                <div class="card"><div class="value">${this.number(flow.active_wip)}</div><div class="label">Active WIP</div></div>
                <div class="card"><div class="value">${averageCycle}</div><div class="label">Average completed cycle time</div></div>
                <div class="card"><div class="value">${completed.length}</div><div class="label">Completed changes tracked</div></div>
            </div>
            <div class="layout">
                <section class="panel"><h3>Change Flow</h3><table><thead><tr><th>Change</th><th>Age</th><th>Cycle time</th><th>Planning health</th></tr></thead><tbody>${changeRows}</tbody></table></section>
                <section class="panel"><h3>Monthly Throughput</h3>${throughputRows}</section>
            </div>
        `;
    }

    renderActiveRow(change) {
        const planning = change.planning_health || {};
        const age = this.days(change.age_days);
        const cycle = '—';
        const tasks = planning.tasks_present
            ? `${this.number(planning.completed_tasks)} done / ${this.number(planning.remaining_tasks)} open`
            : 'Tasks unavailable';
        const artifacts = [
            planning.proposal_present ? 'proposal' : null,
            planning.specs_present ? 'specs' : null,
            planning.design_present ? 'design' : null,
            planning.tasks_present ? 'tasks' : null,
        ].filter(Boolean).join(', ') || 'No planning artifacts';
        return `
            <tr>
                <td><a class="change-link" href="${this.escape(this.hrefFor(change.name))}"><strong>${this.escape(change.name)}</strong></a><span class="status active">active</span></td>
                <td>${age}</td>
                <td>${cycle}</td>
                <td>${this.escape(tasks)}<small>${this.escape(artifacts)}</small></td>
            </tr>
        `;
    }

    renderArchivedRow(change) {
        const planning = change.planning_health || {};
        const completed = change.completed_date || '—';
        const cycle = this.days(change.cycle_time_days);
        const tasks = planning.tasks_present
            ? `${this.number(planning.completed_tasks)} done / ${this.number(planning.remaining_tasks)} open`
            : 'Tasks unavailable';
        const artifacts = [
            planning.proposal_present ? 'proposal' : null,
            planning.specs_present ? 'specs' : null,
            planning.design_present ? 'design' : null,
            planning.tasks_present ? 'tasks' : null,
        ].filter(Boolean).join(', ') || 'No planning artifacts';
        return `
            <tr>
                <td><a class="change-link" href="${this.escape(this.hrefFor(change.name))}"><strong>${this.escape(change.name)}</strong></a><span class="status completed">completed</span></td>
                <td>${this.escape(completed)}</td>
                <td>${cycle}</td>
                <td>${this.escape(tasks)}<small>${this.escape(artifacts)}</small></td>
            </tr>
        `;
    }

    hrefFor(name) {
        return `#/changes/${encodeURIComponent(name)}`;
    }

    styles() {
        return `
            :host { display: block; font-family: var(--md-sys-typescale-font, system-ui, sans-serif); color: var(--md-sys-color-on-surface, #e3e2e6); }
            .metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--md-sys-spacing-4, 16px); margin-bottom: var(--md-sys-spacing-6, 24px); }
            .card, .panel { background: var(--md-sys-color-surface-container, #1e2024); border: 1px solid var(--md-sys-color-outline-variant, #44474f); border-radius: var(--md-sys-shape-corner-medium, 12px); padding: var(--md-sys-spacing-5, 18px); }
            .value { color: var(--md-sys-color-primary, #82b1ff); font-size: var(--md-sys-typescale-headline-small-size, 24px); line-height: var(--md-sys-typescale-headline-small-line, 32px); font-weight: 700; }
            .label { color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-size: var(--md-sys-typescale-label-small-size, 11px); line-height: var(--md-sys-typescale-label-small-line, 16px); margin-top: 4px; text-transform: uppercase; font-weight: var(--md-sys-typescale-label-small-weight, 600); letter-spacing: 0.5px; }
            .layout { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: var(--md-sys-spacing-4, 16px); }
            h3 { color: var(--md-sys-color-on-surface, #e3e2e6); font-size: var(--md-sys-typescale-title-small-size, 14px); line-height: var(--md-sys-typescale-title-small-line, 20px); margin: 0 0 14px; font-weight: var(--md-sys-typescale-title-small-weight, 600); }
            table { border-collapse: collapse; width: 100%; font-size: var(--md-sys-typescale-body-small-size, 12px); }
            th, td { border-bottom: 1px solid var(--md-sys-color-outline-variant, #44474f); padding: var(--md-sys-spacing-3, 12px) var(--md-sys-spacing-2, 8px); text-align: left; vertical-align: top; }
            th { color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-size: var(--md-sys-typescale-label-small-size, 11px); line-height: var(--md-sys-typescale-label-small-line, 16px); text-transform: uppercase; font-weight: var(--md-sys-typescale-label-small-weight, 600); letter-spacing: 0.5px; }
            small { color: var(--md-sys-color-on-surface-variant, #c5c6d0); display: block; margin-top: 4px; }
            .status { border-radius: var(--md-sys-shape-corner-full, 99px); display: inline-block; font-size: 10px; margin-left: 8px; padding: 2px 7px; text-transform: uppercase; font-weight: 600; }
            .active { background: var(--md-sys-color-primary-container, #00468f); color: var(--md-sys-color-on-primary-container, #d4e3ff); }
            .completed { background: var(--md-sys-color-secondary-container, #324a82); color: var(--md-sys-color-on-secondary-container, #dce2ff); }
            .throughput-row { border-bottom: 1px solid var(--md-sys-color-outline-variant, #44474f); display: flex; justify-content: space-between; padding: var(--md-sys-spacing-2, 10px) 0; }
            .empty { color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-size: var(--md-sys-typescale-body-medium-size, 14px); padding: var(--md-sys-spacing-3, 12px) 0; }
            code { font-family: var(--md-sys-typescale-font-mono, monospace); }
            @media (max-width: 800px) { .metrics, .layout { grid-template-columns: 1fr; } }
        `;
    }

    days(value) {
        return Number.isFinite(value) ? `${value} days` : 'Unavailable';
    }

    number(value) {
        return Number.isFinite(value) ? value : 'Unavailable';
    }

    escape(value) {
        return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
    }
}

class FlowInsightsAlias extends Changes {}
if (!customElements.get('change-list')) {
    customElements.define('change-list', Changes);
}
if (!customElements.get('flow-insights')) {
    customElements.define('flow-insights', FlowInsightsAlias);
}
