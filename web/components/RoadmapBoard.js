class RoadmapBoard extends KrokisElement {
    set data(value) {
        this._data = value || { columns: [], found: false, change_names: [] };
        this.render();
    }

    render() {
        const columns = Array.isArray(this._data?.columns) ? this._data.columns : [];
        const changeNames = new Set(
            Array.isArray(this._data?.change_names) ? this._data.change_names : []
        );
        const found = this._data?.found !== false;

        if (!found || columns.length === 0) {
            this.shadowRoot.innerHTML = `
                <style>${this.styles()}</style>
                <div class="empty">No <code>ROADMAP.md</code> in this workspace. Agents can create one with Now, Queued, Exploring, Parked, and Shipped horizons.</div>
            `;
            return;
        }

        const colsHtml = columns.map((col) => {
            const cards = Array.isArray(col.cards) ? col.cards : [];
            const cardsHtml = cards.length === 0
                ? `<div class="empty-col">No items</div>`
                : cards.map((card) => this.cardHtml(card, changeNames)).join('');
            return `
                <section class="column" aria-label="${this.escape(col.name)}">
                    <header class="column-head">
                        <h3>${this.escape(col.name)}</h3>
                        <span class="count">${cards.length}</span>
                    </header>
                    <div class="column-body">${cardsHtml}</div>
                </section>
            `;
        }).join('');

        this.shadowRoot.innerHTML = `
            <style>${this.styles()}</style>
            <div class="board" role="list">${colsHtml}</div>
        `;
    }

    cardHtml(card, changeNames) {
        const title = card?.title || '';
        const body = card?.body || '';
        return `
            <article class="card" role="listitem">
                <h4 class="card-title">${this.linkify(title, changeNames)}</h4>
                ${body ? `<p class="card-body">${this.linkify(body, changeNames)}</p>` : ''}
            </article>
        `;
    }

    linkify(text, changeNames) {
        const escaped = this.escape(text);
        return escaped.replace(/`([a-z0-9]+(?:-[a-z0-9]+)+)`/g, (match, name) => {
            if (changeNames.has(name)) {
                return `<a class="change-link" href="#/changes/${encodeURIComponent(name)}">${this.escape(name)}</a>`;
            }
            return match;
        });
    }

    styles() {
        return `
            :host {
                display: block;
                font-family: var(--md-sys-typescale-font, system-ui, sans-serif);
                color: var(--md-sys-color-on-surface, #e3e2e6);
            }
            .empty {
                color: var(--md-sys-color-on-surface-variant, #c5c6d0);
                font-size: var(--md-sys-typescale-body-medium-size, 14px);
                padding: var(--md-sys-spacing-3, 12px) 0;
            }
            code {
                font-family: var(--md-sys-typescale-font-mono, monospace);
            }
            .board {
                display: grid;
                grid-template-columns: repeat(5, minmax(220px, 1fr));
                gap: var(--md-sys-spacing-3, 12px);
                overflow-x: auto;
                padding-bottom: var(--md-sys-spacing-2, 8px);
            }
            .column {
                display: flex;
                flex-direction: column;
                min-height: 280px;
                background: var(--md-sys-color-surface-container, #1e1e1e);
                border: 1px solid var(--md-sys-color-outline-variant, rgba(255,255,255,0.12));
                border-radius: var(--md-sys-shape-corner-extra-small, 4px);
                min-width: 220px;
            }
            .column-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--md-sys-spacing-2, 8px);
                padding: var(--md-sys-spacing-3, 12px);
                border-bottom: 1px solid var(--md-sys-color-outline-variant, rgba(255,255,255,0.12));
            }
            .column-head h3 {
                margin: 0;
                font-size: var(--md-sys-typescale-title-small-size, 14px);
                font-weight: 700;
                letter-spacing: 0.02em;
                text-transform: none;
            }
            .count {
                font-size: 12px;
                color: var(--md-sys-color-on-surface-variant, #c5c6d0);
                background: var(--md-sys-color-surface-container-high, #2c2c2c);
                border-radius: var(--md-sys-shape-corner-extra-small, 4px);
                padding: 2px 8px;
            }
            .column-body {
                display: flex;
                flex-direction: column;
                gap: var(--md-sys-spacing-2, 8px);
                padding: var(--md-sys-spacing-3, 12px);
                flex: 1;
            }
            .empty-col {
                color: var(--md-sys-color-on-surface-variant, #c5c6d0);
                font-size: 13px;
                font-style: italic;
                padding: var(--md-sys-spacing-2, 8px) 0;
            }
            .card {
                background: var(--md-sys-color-surface-container-high, #2c2c2c);
                border: 1px solid var(--md-sys-color-outline-variant, rgba(255,255,255,0.12));
                border-radius: var(--md-sys-shape-corner-extra-small, 4px);
                padding: var(--md-sys-spacing-3, 12px);
            }
            .card-title {
                margin: 0;
                font-size: 14px;
                font-weight: 700;
                line-height: 1.35;
            }
            .card-body {
                margin: 8px 0 0;
                font-size: 13px;
                line-height: 1.45;
                color: var(--md-sys-color-on-surface-variant, #c5c6d0);
            }
            .change-link {
                color: var(--md-sys-color-primary, #90caf9);
                text-decoration: none;
                border-bottom: 1px dashed currentColor;
            }
            .change-link:hover {
                border-bottom-style: solid;
            }
            @media (max-width: 1100px) {
                .board {
                    grid-template-columns: repeat(5, minmax(200px, 1fr));
                }
            }
        `;
    }
}

customElements.define('roadmap-board', RoadmapBoard);
