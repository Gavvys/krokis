class CommitHeatmap extends HTMLElement {
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
        if (!this._data || !Array.isArray(this._data.daily) || this._data.daily.length === 0) {
            this.shadowRoot.innerHTML = `
                <style>${this.styles()}</style>
                <div class="heatmap-wrap">
                    <div class="heatmap-title">Commit Activity</div>
                    <div class="heatmap-empty">No commit history in the trailing year.</div>
                </div>
            `;
            return;
        }

        const daily = this._data.daily;
        const dayCells = this.buildCells(daily);
        const weeks = this.groupWeeks(dayCells);
        const monthLabels = this.buildMonthLabels(dayCells);
        const totals = this.computeTotals(daily);

        const heatColors = (count) => {
            if (count === 0) return 'background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06);';
            if (count <= 2) return 'background: rgba(59,130,246,0.22); border-color: rgba(59,130,246,0.35);';
            if (count <= 4) return 'background: rgba(59,130,246,0.45); border-color: rgba(59,130,246,0.55);';
            if (count <= 7) return 'background: rgba(59,130,246,0.7); border-color: rgba(59,130,246,0.85);';
            return 'background: #3b82f6; border-color: #60a5fa;';
        };

        const cells = weeks.map(week => `
            <div class="heatmap-col">
                ${week.map(cell => `
                    <div
                        class="heatmap-cell"
                        style="${heatColors(cell.count)}"
                        title="${cell.date} · ${cell.count} commit${cell.count === 1 ? '' : 's'}"
                    ></div>
                `).join('')}
            </div>
        `).join('');

        this.shadowRoot.innerHTML = `
            <style>${this.styles()}</style>
            <div class="heatmap-wrap">
                <div class="heatmap-head">
                    <div>
                        <div class="heatmap-title">Commit Activity</div>
                        <div class="heatmap-subtitle">
                            ${totals.total} commits in the last year · weekly cadence below.
                        </div>
                    </div>
                    <div class="heatmap-legend">
                        <span class="heatmap-legend-label">Less</span>
                        ${[0, 2, 4, 7, 10].map(n => `
                            <span
                                class="heatmap-cell"
                                style="width:11px; height:11px; ${heatColors(n)}"
                                title="${n}+ commits"
                            ></span>
                        `).join('')}
                        <span class="heatmap-legend-label">More</span>
                    </div>
                </div>
                <div class="heatmap-canvas">
                    <div class="heatmap-y-gutter">
                        <span class="heatmap-y-cell">Mon</span>
                        <span class="heatmap-y-cell">Wed</span>
                        <span class="heatmap-y-cell">Fri</span>
                    </div>
                    <div class="heatmap-grid-area">
                        <div class="heatmap-x-axis">${monthLabels.map(m => `<span class="heatmap-x-label" style="grid-column: ${m.col + 1};">${m.label}</span>`).join('')}</div>
                        <div class="heatmap-grid">${cells}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Convert daily series into per-day cells keyed by Date.
    buildCells(daily) {
        return daily.map(d => {
            const date = new Date(d.date + 'T00:00:00Z');
            return {
                date: d.date,
                count: d.count,
                dow: (date.getUTCDay() + 6) % 7, // Mon=0..Sun=6,
                weekStart: this.weekKey(date),
            };
        });
    }

    groupWeeks(cells) {
        // Bucket cells into Mon-Sun columns. Pad short first/last weeks.
        const cols = [];
        cells.forEach(cell => {
            const idx = cell.dow; // 0..6
            let col;
            if (cols.length === 0 || cols[cols.length - 1].__week !== cell.weekStart) {
                col = new Array(7).fill(null).map(() => ({ date: '', count: -1 }));
                col.__week = cell.weekStart;
                cols.push(col);
            } else {
                col = cols[cols.length - 1];
            }
            col[idx] = { date: cell.date, count: cell.count };
        });
        return cols;
    }

    buildMonthLabels(cells) {
        if (cells.length === 0) return [];
        const labels = [];
        let lastMonth = -1;
        cells.forEach((cell, i) => {
            const month = new Date(cell.date + 'T00:00:00Z').getUTCMonth();
            if (month !== lastMonth && cell.dow === 0) {
                labels.push({
                    col: labels.length, // index maps to grid column starting from 1
                    label: new Date(cell.date + 'T00:00:00Z').toLocaleString(undefined, { month: 'short', timeZone: 'UTC' }),
                });
                lastMonth = month;
            }
        });
        // Normalize: align label positions to week columns rather than label index.
        const aligned = [];
        lastMonth = -1;
        cells.forEach((cell, i) => {
            const month = new Date(cell.date + 'T00:00:00Z').getUTCMonth();
            if (month !== lastMonth) {
                const weekCol = Math.floor(i / 7);
                aligned.push({ col: weekCol, label: new Date(cell.date + 'T00:00:00Z').toLocaleString(undefined, { month: 'short', timeZone: 'UTC' }) });
                lastMonth = month;
            }
        });
        return aligned;
    }

    computeTotals(daily) {
        const total = daily.reduce((sum, d) => sum + d.count, 0);
        const active = daily.filter(d => d.count > 0).length;
        return { total, active };
    }

    weekKey(date) {
        const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - ((date.getUTCDay() + 6) % 7)));
        return monday.toISOString().slice(0, 10);
    }

    styles() {
        return `
            .heatmap-wrap {
                font-family: 'Open Sans', sans-serif;
                color: #f3f4f6;
                display: flex;
                flex-direction: column;
                gap: 14px;
            }
            .heatmap-head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 20px;
                flex-wrap: wrap;
            }
            .heatmap-title {
                font-size: 16px;
                font-weight: 600;
                color: #60a5fa;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                padding-bottom: 6px;
                margin-bottom: 6px;
            }
            .heatmap-subtitle {
                font-size: 13px;
                color: #9ca3af;
            }
            .heatmap-legend {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 11px;
                color: #9ca3af;
            }
            .heatmap-legend-label {
                margin: 0 2px;
            }
            .heatmap-canvas {
                display: flex;
                gap: 6px;
                align-items: stretch;
                overflow-x: auto;
                padding-bottom: 4px;
            }
            .heatmap-y-gutter {
                display: grid;
                grid-template-rows: repeat(7, 13px);
                gap: 3px;
                padding-top: 22px;
                font-size: 10px;
                color: #6b7280;
                font-family: 'JetBrains Mono', monospace;
            }
            .heatmap-y-cell {
                grid-row-start: var(--row);
                line-height: 13px;
                height: 13px;
            }
            .heatmap-grid-area {
                display: flex;
                flex-direction: column;
                min-width: 0;
                flex: 1;
            }
            .heatmap-x-axis {
                display: grid;
                grid-auto-columns: minmax(13px, 1fr);
                grid-auto-flow: column;
                height: 16px;
                margin-bottom: 6px;
                font-size: 10px;
                color: #6b7280;
                font-family: 'JetBrains Mono', monospace;
            }
            .heatmap-x-label {
                white-space: nowrap;
                grid-column-start: var(--col);
            }
            .heatmap-grid {
                display: flex;
                gap: 3px;
            }
            .heatmap-col {
                display: grid;
                grid-template-rows: repeat(7, 13px);
                gap: 3px;
                flex: 1;
                min-width: 13px;
            }
            .heatmap-cell {
                width: 13px;
                height: 13px;
                border-radius: 3px;
                border: 1px solid transparent;
                cursor: default;
            }
        `;
    }
}

customElements.define('commit-heatmap', CommitHeatmap);