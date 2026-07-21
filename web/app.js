document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let currentRoute = '';
let telemetryData = null;
let wikiFiles = [];

async function initApp() {
    // 1. Fetch telemetry
    await fetchTelemetry();

    // 2. Load wiki list
    await loadWikiList();

    // 3. Setup router
    window.addEventListener('hashchange', handleRoute);
    
    // Set initial route or default to home/first wiki
    if (!window.location.hash) {
        const hasIndex = wikiFiles.some(f => f === 'WIKI_INDEX.mdx');
        window.location.hash = hasIndex ? '#/wiki/WIKI_INDEX' : '#/wiki/USER_MANUAL';
    } else {
        handleRoute();
    }

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', async () => {
        const btn = document.getElementById('refresh-btn');
        btn.classList.add('is-loading');
        btn.disabled = true;
        await fetchTelemetry();
        await loadWikiList();
        await handleRoute();
        btn.classList.remove('is-loading');
        btn.disabled = false;
    });
}

async function fetchTelemetry() {
    try {
        const res = await fetch('/api/insights');
        if (res.ok) {
            telemetryData = await res.json();
            updateArchivedLinkVisibility();
        }
    } catch (e) {
        console.error('Failed to load insights:', e);
    }
}

function updateArchivedLinkVisibility() {
    const link = document.getElementById('archived-link');
    if (!link) return;
    const hasArchived = (telemetryData?.change_flow?.changes || [])
        .some(change => change.status === 'completed');
    link.hidden = !hasArchived;
}

async function loadWikiList() {
    try {
        const res = await fetch('/api/wiki');
        if (res.ok) {
            wikiFiles = await res.json();
            const list = document.getElementById('wiki-links');
            list.innerHTML = '';
            
            wikiFiles.forEach(f => {
                const name = f.replace(/\.(mdx|md)$/, '');
                if (name === 'WIKI_INDEX') {
                    return; // Skip rendering in dynamic list
                }
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#/wiki/${name}`;
                link.className = 'nav-link wiki-nav-link';
                link.dataset.wiki = name;

                const title = document.createElement('span');
                title.className = 'wiki-nav-title';
                title.textContent = formatWikiTitle(name);

                const source = document.createElement('span');
                source.className = 'wiki-nav-source';
                source.textContent = f;

                link.append(title, source);
                li.appendChild(link);
                list.appendChild(li);
            });
        }
    } catch (e) {
        console.error('Failed to load wiki index:', e);
    }
}

// Helper to format uppercase SNAKE_CASE to readable Title Case
function formatWikiTitle(name) {
    return name.split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

async function handleRoute() {
    let hash = window.location.hash;
    if (!hash) {
        const hasIndex = wikiFiles.some(f => f === 'WIKI_INDEX.mdx');
        hash = hasIndex ? '#/wiki/WIKI_INDEX' : '#/wiki/USER_MANUAL';
    }

    // Legacy URL compatibility: rewrite deprecated routes to their canonical form.
    for (const { from, to } of legacyRedirects) {
        if (hash === from || hash.startsWith(from + '/')) {
            const tail = hash.slice(from.length);
            const next = to + tail;
            history.replaceState(null, '', next);
            hash = next;
            break;
        }
    }

    currentRoute = hash;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });

    const container = document.getElementById('content-container');
    container.innerHTML = '<div style="color: #9ca3af;">Loading content...</div>';

    // OpenAPI page owns its own padding/scroll via .api-spec-page
    container.style.padding = (hash === '#/insights/openapi') ? '0' : '40px';
    container.style.overflow = (hash === '#/insights/openapi') ? 'hidden' : 'auto';

    for (const route of routes) {
        const params = route.match(hash);
        if (params) {
            document.title = route.title(params);
            await route.render(container, params);
            return;
        }
    }
}

const legacyRedirects = [
    { from: '#/insights/flow', to: '#/changes' },
];

const routes = [
    {
        match: (hash) => {
            if (hash.startsWith('#/wiki/')) return { name: hash.slice('#/wiki/'.length) };
            return null;
        },
        title: (params) => `${formatWikiTitle(params.name)} · Krokis`,
        render: (container, params) => renderWikiPage(params.name, container),
    },
    {
        match: (hash) => hash === '#/insights/health' ? {} : null,
        title: () => 'Project Quality · Krokis',
        render: (container) => renderHealthPage(container),
    },
    {
        match: (hash) => hash === '#/insights/cadence' ? {} : null,
        title: () => 'Task Cadence · Krokis',
        render: (container) => renderCadencePage(container),
    },
    {
        match: (hash) => hash === '#/insights/coverage' ? {} : null,
        title: () => 'Coverage · Krokis',
        render: (container) => renderCoveragePage(container),
    },
    {
        match: (hash) => hash === '#/changes' ? {} : null,
        title: () => 'Changes · Krokis',
        render: (container) => renderChangesPage(container),
    },
    {
        match: (hash) => hash === '#/changes/archived' ? {} : null,
        title: () => 'Archived Changes · Krokis',
        render: (container) => renderArchivedPage(container),
    },
    {
        match: (hash) => {
            if (hash.startsWith('#/changes/')) {
                return { name: decodeURIComponent(hash.slice('#/changes/'.length)) };
            }
            return null;
        },
        title: (params) => `${params.name} · Changes · Krokis`,
        render: (container, params) => renderChangeDetail(container, params.name),
    },
    {
        match: (hash) => hash === '#/insights/openapi' ? {} : null,
        title: () => 'API Specifications · Krokis',
        render: (container) => renderOpenAPIPage(container),
    },
];

async function renderWikiPage(name, container) {
    try {
        const res = await fetch(`/api/wiki/${name}`);
        if (!res.ok) {
            container.innerHTML = `<div style="color: #ef4444;">Error: Wiki article '${name}' not found.</div>`;
            return;
        }

        const rawText = await res.text();
        // Remove YAML frontmatter if present
        let mdText = rawText;
        if (rawText.startsWith('---')) {
            const endIdx = rawText.indexOf('---', 3);
            if (endIdx !== -1) {
                mdText = rawText.slice(endIdx + 3).trim();
            }
        }

        // Convert JSX-like tag markup to standard Custom Elements (kebab-case)
        let processedMD = mdText
            .replace(/<InfoBox\s+type="([^"]+)"\s*>/g, '<info-box type="$1">')
            .replace(/<\/InfoBox>/g, '</info-box>')
            .replace(/<MetricsCard\s+value="([^"]+)"\s+label="([^"]+)"\s*\/>/g, '<metrics-card value="$1" label="$2"></metrics-card>')
            .replace(/<TaskCadence\s*\/>/g, '<task-cadence-wrapper></task-cadence-wrapper>')
            .replace(/<TestResults\s*\/>/g, '<test-results-wrapper></test-results-wrapper>');

        // Render Markdown
        container.innerHTML = `<div class="markdown-body">${marked.parse(processedMD)}</div>`;
        
        // Populate wrapper elements with telemetry if they are in the page
        const cadWrapper = container.querySelector('task-cadence-wrapper');
        if (cadWrapper) {
            const el = document.createElement('task-cadence');
            el.data = telemetryData;
            cadWrapper.replaceWith(el);
        }

        const testWrapper = container.querySelector('test-results-wrapper');
        if (testWrapper) {
            const el = document.createElement('test-results');
            el.data = telemetryData;
            testWrapper.replaceWith(el);
        }

        // Code block highlight
        Prism.highlightAllUnder(container);

    } catch (e) {
        container.innerHTML = `<div style="color: #ef4444;">Error loading article: ${e.message}</div>`;
    }
}

function mountPage(container, opts) {
    const { tag, title, subtitle, mode, maxWidth, extraMounts } = opts;
    const width = maxWidth || '1200px';
    const subtitleHtml = subtitle
        ? `<p style="color: #9ca3af; margin-bottom: 20px;">${subtitle}</p>`
        : '';
    container.innerHTML = `
        <div class="section-card" style="max-width: ${width}; margin: 0 auto;">
            <h2>${title}</h2>
            ${subtitleHtml}
            <div class="page-component-container"></div>
        </div>
    `;
    const inner = container.querySelector('.page-component-container');
    const el = document.createElement(tag);
    el.data = telemetryData;
    if (mode) el.mode = mode;
    inner.appendChild(el);
    if (typeof extraMounts === 'function') extraMounts(inner, el);
    return { inner, el };
}

function renderHealthPage(container) {
    mountPage(container, {
        tag: 'test-results',
        title: '📊 Code Quality Overview',
        maxWidth: '600px',
    });
}

function renderCadencePage(container) {
    mountPage(container, {
        tag: 'task-cadence',
        title: '📈 Development Cadence',
        maxWidth: '800px',
        extraMounts: (inner) => {
            const heat = document.createElement('commit-heatmap');
            heat.data = telemetryData?.git;
            inner.appendChild(heat);
        },
    });
}

function renderCoveragePage(container) {
    mountPage(container, {
        tag: 'coverage-report',
        title: 'Spec Coverage',
        subtitle: 'Implementation evidence for OpenSpec requirements, not validation pass/fail.',
    });
}

function renderChangesPage(container) {
    mountPage(container, {
        tag: 'change-list',
        title: 'OpenSpec Changes',
        subtitle: 'Team-level flow and planning evidence. Planning health is not validation success.',
    });
}

function renderArchivedPage(container) {
    mountPage(container, {
        tag: 'change-list',
        title: 'Archived Changes',
        subtitle: 'Completed OpenSpec changes with cycle time and planning health.',
        mode: 'archived',
    });
}

const VIEW_MODE_KEY = 'krokis.changeViewMode';

function renderChangeDetail(container, changeName) {
    const flow = telemetryData?.change_flow;
    const change = flow?.changes?.find(c => c.name === changeName);
    if (!flow || !change) {
        container.innerHTML = `
            <div class="section-card" style="max-width: 800px; margin: 0 auto;">
                <h2>Change not found</h2>
                <p style="color: #9ca3af;">No OpenSpec change named <code>${changeName.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c])}</code> in the current workspace.</p>
                <p><a href="#/changes" class="nav-link">Back to Changes</a></p>
            </div>
        `;
        return;
    }
    const artifacts = (flow.artifact_map && flow.artifact_map[changeName]) || [];
    const hasProposal = artifacts.includes('proposal.md');
    const otherCount = artifacts.filter(a => a !== 'proposal.md').length;
    const canGraph = hasProposal && otherCount > 0;

    let stored = 'graph';
    try { stored = localStorage.getItem(VIEW_MODE_KEY) || 'graph'; } catch (e) { stored = 'graph'; }
    const initialMode = canGraph ? stored : 'list';

    container.innerHTML = `
        <div class="section-card change-detail" style="max-width: 1200px; margin: 0 auto;">
            <header class="change-detail-head">
                <div>
                    <a href="#/changes" class="change-detail-back">← All Changes</a>
                    <h2>${changeName.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c])}</h2>
                </div>
                <div class="view-toggle" role="tablist" aria-label="View mode">
                    <button class="view-toggle-btn" data-mode="list" type="button" role="tab" aria-selected="${initialMode === 'list'}">List</button>
                    <button class="view-toggle-btn" data-mode="graph" type="button" role="tab" aria-selected="${initialMode === 'graph'}"${canGraph ? '' : ' disabled'}>Graph</button>
                </div>
            </header>
            <div class="change-detail-body" id="change-detail-body"></div>
        </div>
    `;

    const body = container.querySelector('#change-detail-body');
    renderChangeDetailBody(body, change, artifacts, initialMode);

    container.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            const mode = btn.dataset.mode;
            container.querySelectorAll('.view-toggle-btn').forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
            try { localStorage.setItem(VIEW_MODE_KEY, mode); } catch (e) { /* ignore quota errors */ }
            renderChangeDetailBody(body, change, artifacts, mode);
        });
    });
}

function renderChangeDetailBody(body, change, artifacts, mode) {
    if (mode === 'graph') {
        const graph = document.createElement('change-flow-graph');
        graph.change = { ...change, artifacts };
        body.replaceChildren(graph);
        return;
    }
    const health = change.planning_health || {};
    const rows = [
        { label: 'Status', value: change.status },
        { label: 'Created', value: change.created_date || '—' },
        { label: 'Age', value: Number.isFinite(change.age_days) ? `${change.age_days} days` : '—' },
        { label: 'Cycle time', value: Number.isFinite(change.cycle_time_days) ? `${change.cycle_time_days} days` : '—' },
        { label: 'Proposal', value: health.proposal_present ? 'present' : 'absent' },
        { label: 'Design', value: health.design_present ? 'present' : 'absent' },
        { label: 'Spec deltas', value: health.specs_present ? 'present' : 'absent' },
        { label: 'Tasks', value: health.tasks_present ? `${Number.isFinite(health.completed_tasks) ? health.completed_tasks : '—'} done / ${Number.isFinite(health.remaining_tasks) ? health.remaining_tasks : '—'} open` : 'absent' },
    ];
    body.innerHTML = `
        <table class="change-detail-table">
            <tbody>
                ${rows.map(r => `<tr><th>${r.label}</th><td>${r.value}</td></tr>`).join('')}
            </tbody>
        </table>
        <p style="color: #9ca3af; margin-top: 16px; font-size: 12px;">Artifacts: ${artifacts.length ? artifacts.join(', ') : 'none'}</p>
    `;
}

async function renderOpenAPIPage(container) {
    container.innerHTML = `
        <div class="api-spec-page">
            <header class="api-spec-header">
                <div class="api-spec-title">
                    <span class="api-spec-eyebrow">OpenAPI</span>
                    <h2 id="api-spec-name" class="api-spec-name">Loading spec…</h2>
                </div>
                <div class="api-spec-meta">
                    <span id="api-spec-version" class="api-spec-badge api-spec-badge-muted">v—</span>
                    <a id="api-spec-source" class="api-spec-badge api-spec-badge-link" href="/api/openapi" target="_blank" rel="noopener">view raw</a>
                </div>
            </header>
            <div class="api-spec-frame">
                <rapi-doc
                    spec-url="/api/openapi"
                    theme="dark"
                    bg-color="#0b0f19"
                    text-color="#f3f4f6"
                    primary-color="#3b82f6"
                    regular-font="Open Sans, sans-serif"
                    mono-font="JetBrains Mono, monospace"
                    nav-bg-color="#0d1322"
                    nav-text-color="#9ca3af"
                    nav-hover-bg-color="rgba(255,255,255,0.04)"
                    nav-hover-text-color="#f3f4f6"
                    nav-item-spacing="relaxed"
                    layout="column"
                    render-style="view"
                    schema-style="tree"
                    default-schema-tab="schema"
                    show-header="false"
                    show-info="true"
                    allow-spec-url-change="false"
                    allow-spec-file-load="false"
                    allow-authentication="false"
                    allow-try="true"
                    api-key-name="Authorization"
                    api-key-location="header"
                    style="height: 100%; width: 100%; display: block;"
                ></rapi-doc>
            </div>
        </div>
    `;

    try {
        const res = await fetch('/api/openapi');
        if (res.ok) {
            const text = await res.text();
            const title = (text.match(/^title:\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
            const version = (text.match(/^version:\s*(.+)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
            const nameEl = document.getElementById('api-spec-name');
            const verEl = document.getElementById('api-spec-version');
            if (nameEl && title) nameEl.textContent = title;
            else if (nameEl) nameEl.textContent = 'Untitled spec';
            if (verEl) verEl.textContent = version ? `v${version}` : 'v—';
        } else {
            const nameEl = document.getElementById('api-spec-name');
            if (nameEl) {
                nameEl.textContent = 'No spec configured';
                nameEl.classList.add('api-spec-name-empty');
            }
        }
    } catch (e) {
        const nameEl = document.getElementById('api-spec-name');
        if (nameEl) {
            nameEl.textContent = 'Failed to load spec';
            nameEl.classList.add('api-spec-name-empty');
        }
    }
}
/* touched */
