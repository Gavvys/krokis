class FlowInsights extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set data(value) {
        this._data = value;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const flow = this._data?.change_flow;
        if (!flow) {
            this.shadowRoot.innerHTML = `<div class="empty">No Flow Insights data. Run <code>krokis insights</code>.</div>`;
            return;
        }

        const changes = Array.isArray(flow.changes) ? flow.changes : [];
        const throughput = Array.isArray(flow.monthly_throughput) ? flow.monthly_throughput : [];
        const completed = changes.filter(change => change.status === 'completed');
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

        const changeRows = changes.map(change => {
            const planning = change.planning_health || {};
            const age = change.status === 'active' ? this.days(change.age_days) : '—';
            const cycle = change.status === 'completed' ? this.days(change.cycle_time_days) : '—';
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
                    <td><strong>${this.escape(change.name)}</strong><span class="status ${this.escape(change.status)}">${this.escape(change.status)}</span></td>
                    <td>${age}</td>
                    <td>${cycle}</td>
                    <td>${this.escape(tasks)}<small>${this.escape(artifacts)}</small></td>
                </tr>
            `;
        }).join('') || '<tr><td colspan="4" class="empty">No OpenSpec changes found.</td></tr>';

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; font-family: 'Open Sans', sans-serif; color: #f3f4f6; }
                .metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; }
                .card, .panel { background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.05); border-radius: 12px; padding: 18px; }
                .value { color: #60a5fa; font-size: 28px; font-weight: 700; }
                .label { color: #9ca3af; font-size: 12px; margin-top: 4px; text-transform: uppercase; }
                .layout { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 16px; }
                h3 { color: #dbeafe; font-size: 15px; margin: 0 0 14px; }
                table { border-collapse: collapse; width: 100%; font-size: 13px; }
                th, td { border-bottom: 1px solid rgba(255,255,255,.08); padding: 12px 8px; text-align: left; vertical-align: top; }
                th { color: #9ca3af; font-size: 11px; text-transform: uppercase; }
                small { color: #9ca3af; display: block; margin-top: 4px; }
                .status { border-radius: 99px; display: inline-block; font-size: 10px; margin-left: 8px; padding: 2px 7px; text-transform: uppercase; }
                .active { background: rgba(59,130,246,.18); color: #93c5fd; }
                .completed { background: rgba(16,185,129,.14); color: #6ee7b7; }
                .throughput-row { border-bottom: 1px solid rgba(255,255,255,.08); display: flex; justify-content: space-between; padding: 10px 0; }
                .empty { color: #9ca3af; font-size: 14px; padding: 12px 0; }
                code { font-family: 'JetBrains Mono', monospace; }
                @media (max-width: 800px) { .metrics, .layout { grid-template-columns: 1fr; } }
            </style>
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

customElements.define('flow-insights', FlowInsights);
