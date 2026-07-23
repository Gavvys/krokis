class CommitHeatmap extends KrokisElement {
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
            if (count === 0) return 'background: var(--md-sys-color-surface-container-high, #292b2f); border-color: var(--md-sys-color-outline-variant, #44474f);';
            if (count <= 2) return 'background: color-mix(in srgb, var(--md-sys-color-primary, #82b1ff) 30%, transparent); border-color: color-mix(in srgb, var(--md-sys-color-primary, #82b1ff) 45%, transparent);';
            if (count <= 4) return 'background: color-mix(in srgb, var(--md-sys-color-primary, #82b1ff) 55%, transparent); border-color: color-mix(in srgb, var(--md-sys-color-primary, #82b1ff) 65%, transparent);';
            if (count <= 7) return 'background: color-mix(in srgb, var(--md-sys-color-primary, #82b1ff) 80%, transparent); border-color: var(--md-sys-color-primary, #82b1ff);';
            return 'background: var(--md-sys-color-primary, #82b1ff); border-color: var(--md-sys-color-primary, #82b1ff);';
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
                font-family: var(--md-sys-typescale-font, system-ui, sans-serif);
                color: var(--md-sys-color-on-surface, #e3e2e6);
                display: flex;
                flex-direction: column;
                gap: var(--md-sys-spacing-4, 14px);
            }
            .heatmap-head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: var(--md-sys-spacing-5, 20px);
                flex-wrap: wrap;
            }
            .heatmap-title {
                font-family: var(--md-sys-typescale-font, system-ui, sans-serif);
                font-size: var(--md-sys-typescale-title-medium-size, 16px);
                line-height: var(--md-sys-typescale-title-medium-line, 24px);
                font-weight: var(--md-sys-typescale-title-medium-weight, 600);
                color: var(--md-sys-color-primary, #82b1ff);
                border-bottom: 1px solid var(--md-sys-color-outline-variant, #44474f);
                padding-bottom: 6px;
                margin-bottom: 6px;
            }
            .heatmap-subtitle {
                font-family: var(--md-sys-typescale-font, system-ui, sans-serif);
                font-size: var(--md-sys-typescale-body-small-size, 12px);
                line-height: var(--md-sys-typescale-body-small-line, 16px);
                color: var(--md-sys-color-on-surface-variant, #c5c6d0);
            }
            .heatmap-legend {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-family: var(--md-sys-typescale-font, system-ui, sans-serif);
                font-size: var(--md-sys-typescale-label-small-size, 11px);
                line-height: var(--md-sys-typescale-label-small-line, 16px);
                color: var(--md-sys-color-on-surface-variant, #c5c6d0);
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
                color: var(--md-sys-color-on-surface-variant, #c5c6d0);
                font-family: var(--md-sys-typescale-font-mono, monospace);
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
                color: var(--md-sys-color-on-surface-variant, #c5c6d0);
                font-family: var(--md-sys-typescale-font-mono, monospace);
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
                border-radius: var(--md-sys-shape-corner-extra-small, 4px);
                border: 1px solid transparent;
                cursor: default;
            }
        `;
    }
}

customElements.define('commit-heatmap', CommitHeatmap);