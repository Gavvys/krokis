document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let currentRoute = '';
let telemetryData = null;

async function initApp() {
    // 1. Fetch telemetry
    await fetchTelemetry();

    // 2. Load wiki list
    await loadWikiList();

    // 3. Setup router
    window.addEventListener('hashchange', handleRoute);
    
    // Set initial route or default to home/first wiki
    if (!window.location.hash) {
        window.location.hash = '#/wiki/USER_MANUAL';
    } else {
        handleRoute();
    }

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', async () => {
        const btn = document.getElementById('refresh-btn');
        btn.textContent = 'Refreshing...';
        btn.disabled = true;
        await fetchTelemetry();
        await loadWikiList();
        await handleRoute();
        btn.textContent = 'Refresh';
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
            const files = await res.json();
            const list = document.getElementById('wiki-links');
            list.innerHTML = '';
            
            files.forEach(f => {
                const name = f.replace('.mdx', '');
                const li = document.createElement('li');
                li.innerHTML = `<a href="#/wiki/${name}" class="nav-link" data-wiki="${name}">${formatWikiTitle(name)}</a>`;
                list.appendChild(li);
            });
        }
    } catch (e) {
        console.error('Failed to load wiki index:', e);
    }
}

function formatWikiTitle(name) {
    return name.split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

async function handleRoute() {
    const hash = window.location.hash || '#/wiki/USER_MANUAL';
    currentRoute = hash;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });

    const titleEl = document.getElementById('page-title');
    const container = document.getElementById('content-container');
    container.innerHTML = '<div style="color: #9ca3af;">Loading content...</div>';
    
    // Toggle full-screen pane for OpenAPI interactive viewer
    container.style.padding = (hash === '#/insights/openapi') ? '0' : '40px';
    container.style.overflow = (hash === '#/insights/openapi') ? 'hidden' : 'auto';

    if (hash.startsWith('#/wiki/')) {
        const wikiName = hash.replace('#/wiki/', '');
        titleEl.textContent = formatWikiTitle(wikiName);
        await renderWikiPage(wikiName, container);
    } else if (hash === '#/insights/health') {
        titleEl.textContent = 'Project Quality';
        renderHealthPage(container);
    } else if (hash === '#/insights/cadence') {
        titleEl.textContent = 'Task Cadence';
        renderCadencePage(container);
    } else if (hash === '#/insights/openapi') {
        titleEl.textContent = 'API Specifications';
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
}

function renderOpenAPIPage(container) {
    container.innerHTML = `
        <rapi-doc
            spec-url="/api/openapi"
            theme="dark"
            bg-color="#0b0f19"
            text-color="#f3f4f6"
            primary-color="#3b82f6"
            render-style="read"
            show-header="false"
            style="height: 100%; width: 100%; display: block;"
        ></rapi-doc>
    `;
}
