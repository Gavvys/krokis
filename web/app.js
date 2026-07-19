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
        }
    } catch (e) {
        console.error('Failed to load insights:', e);
    }
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

    if (hash.startsWith('#/wiki/')) {
        const wikiName = hash.replace('#/wiki/', '');
        document.title = `${formatWikiTitle(wikiName)} · Krokis`;
        await renderWikiPage(wikiName, container);
    } else if (hash === '#/insights/health') {
        document.title = 'Project Quality · Krokis';
        renderHealthPage(container);
    } else if (hash === '#/insights/cadence') {
        document.title = 'Task Cadence · Krokis';
        renderCadencePage(container);
	} else if (hash === '#/insights/flow') {
		document.title = 'Flow Insights · Krokis';
		renderFlowPage(container);
    } else if (hash === '#/insights/openapi') {
        document.title = 'API Specifications · Krokis';
        renderOpenAPIPage(container);
    }
}

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

function renderHealthPage(container) {
    container.innerHTML = `
        <div class="section-card" style="max-width: 600px; margin: 0 auto;">
            <h2>📊 Code Quality Overview</h2>
            <div id="quality-component-container"></div>
        </div>
    `;
    const el = document.createElement('test-results');
    el.data = telemetryData;
    container.querySelector('#quality-component-container').appendChild(el);
}

function renderCadencePage(container) {
    container.innerHTML = `
        <div class="section-card" style="max-width: 800px; margin: 0 auto;">
            <h2>📈 Development Cadence</h2>
            <div id="cadence-component-container"></div>
        </div>
    `;
    const el = document.createElement('task-cadence');
    el.data = telemetryData;
    container.querySelector('#cadence-component-container').appendChild(el);

    const heat = document.createElement('commit-heatmap');
    heat.data = telemetryData.git;
    container.querySelector('#cadence-component-container').appendChild(heat);
}

function renderFlowPage(container) {
	container.innerHTML = `
		<div class="section-card" style="max-width: 1200px; margin: 0 auto;">
			<h2>OpenSpec Change Flow</h2>
			<p style="color: #9ca3af; margin-bottom: 20px;">Team-level flow and planning evidence. Planning health is not validation success.</p>
			<div id="flow-component-container"></div>
		</div>
	`;
	const el = document.createElement('flow-insights');
	el.data = telemetryData;
	container.querySelector('#flow-component-container').appendChild(el);
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
