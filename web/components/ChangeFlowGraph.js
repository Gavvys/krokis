class ChangeFlowGraph extends KrokisElement {
    set change(value) {
        this._change = value;
        this.render();
    }

    get change() {
        return this._change;
    }

    render() {
        if (!this._change) {
            this.shadowRoot.innerHTML = `<style>${this.styles()}</style><div class="empty">No change selected.</div>`;
            return;
        }
        const stages = this.buildStages(this._change);
        if (stages.length === 0) {
            this.shadowRoot.innerHTML = `<style>${this.styles()}</style><div class="empty">No planning artifacts present.</div>`;
            return;
        }
        this.shadowRoot.innerHTML = `
            <style>${this.styles()}</style>
            <div class="graph-wrap">
                <div class="graph-head">
                    <div class="graph-title">${this.escape(this._change.name)}</div>
                    <div class="graph-subtitle">Change flow · proposal → design → spec deltas → tasks</div>
                </div>
                <div class="graph-canvas">
                    <svg viewBox="0 0 ${this.viewWidth(stages)} 180" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Change flow graph">
                        <defs>
                            <marker id="cfg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" class="cfg-edge" />
                            </marker>
                        </defs>
                        ${this.renderEdges(stages)}
                        ${this.renderNodes(stages)}
                    </svg>
                </div>
            </div>
        `;
    }

    buildStages(change) {
        const artifacts = Array.isArray(change.artifacts) ? change.artifacts : [];
        const has = (name) => artifacts.includes(name);
        const hasSpecs = artifacts.some(a => a.startsWith('specs/'));
        const stages = [];
        if (has('proposal.md')) stages.push({ key: 'proposal', label: 'Proposal', badge: '✓' });
        if (has('design.md')) stages.push({ key: 'design', label: 'Design', badge: '✓' });
        if (hasSpecs) {
            const count = artifacts.filter(a => a.startsWith('specs/')).length;
            stages.push({ key: 'specs', label: 'Spec Deltas', badge: `${count}` });
        }
        if (has('tasks.md')) {
            const health = change.planning_health || {};
            const done = Number.isFinite(health.completed_tasks) ? health.completed_tasks : 0;
            const total = done + (Number.isFinite(health.remaining_tasks) ? health.remaining_tasks : 0);
            stages.push({ key: 'tasks', label: 'Tasks', badge: total > 0 ? `${done}/${total}` : '—' });
        }
        return stages;
    }

    viewWidth(stages) {
        const cols = stages.length;
        return Math.max(640, 80 + cols * 200);
    }

    nodeBox(index) {
        const x = 40 + index * 200;
        return { x, y: 50, width: 160, height: 80 };
    }

    renderNodes(stages) {
        return stages.map((stage, i) => {
            const box = this.nodeBox(i);
            return `
                <g class="cfg-node" transform="translate(${box.x},${box.y})">
                    <rect width="${box.width}" height="${box.height}" rx="14" class="cfg-rect" />
                    <text x="${box.width / 2}" y="34" class="cfg-label">${this.escape(stage.label)}</text>
                    <text x="${box.width / 2}" y="60" class="cfg-badge">${this.escape(stage.badge)}</text>
                </g>
            `;
        }).join('');
    }

    renderEdges(stages) {
        if (stages.length < 2) return '';
        return stages.slice(0, -1).map((_, i) => {
            const a = this.nodeBox(i);
            const b = this.nodeBox(i + 1);
            const x1 = a.x + a.width;
            const y1 = a.y + a.height / 2;
            const x2 = b.x;
            const y2 = b.y + b.height / 2;
            const cx = (x1 + x2) / 2;
            return `<path d="M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}" class="cfg-edge" marker-end="url(#cfg-arrow)" />`;
        }).join('');
    }

    styles() {
        return `
            :host { display: block; font-family: var(--md-sys-typescale-font, system-ui, sans-serif); color: var(--md-sys-color-on-surface, #e3e2e6); }
            .graph-wrap { display: flex; flex-direction: column; gap: var(--md-sys-spacing-3, 12px); }
            .graph-head { display: flex; flex-direction: column; gap: 4px; }
            .graph-title { color: var(--md-sys-color-primary, #82b1ff); font-size: var(--md-sys-typescale-title-medium-size, 16px); line-height: var(--md-sys-typescale-title-medium-line, 24px); font-weight: var(--md-sys-typescale-title-medium-weight, 600); }
            .graph-subtitle { color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-size: var(--md-sys-typescale-body-small-size, 12px); }
            .graph-canvas { width: 100%; overflow-x: auto; }
            svg { width: 100%; min-width: 640px; height: auto; }
            .cfg-rect { fill: var(--md-sys-color-surface-container, #1e2024); stroke: var(--md-sys-color-outline-variant, #44474f); stroke-width: 1; }
            .cfg-label { fill: var(--md-sys-color-on-surface, #e3e2e6); font-size: 13px; font-weight: 600; text-anchor: middle; font-family: var(--md-sys-typescale-font, system-ui, sans-serif); }
            .cfg-badge { fill: var(--md-sys-color-primary, #82b1ff); font-size: 18px; font-weight: 700; text-anchor: middle; font-family: var(--md-sys-typescale-font-mono, monospace); }
            .cfg-edge { fill: none; stroke: var(--md-sys-color-primary, #82b1ff); stroke-width: 1.5; opacity: 0.7; }
            .empty { color: var(--md-sys-color-on-surface-variant, #c5c6d0); font-size: var(--md-sys-typescale-body-medium-size, 14px); padding: var(--md-sys-spacing-3, 12px) 0; }
        `;
    }
}

customElements.define('change-flow-graph', ChangeFlowGraph);
