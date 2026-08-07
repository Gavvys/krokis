class ProjectSelector extends KrokisElement {
  static get observedAttributes() {
    return ['active', 'recent'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.addEventListener('click', (e) => this._handleClick(e));
  }

  _handleClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    if (action === 'toggle-dropdown') {
      const menu = this.shadowRoot.querySelector('.dropdown-menu');
      if (menu) menu.classList.toggle('show');
    } else if (action === 'open-folder') {
      e.stopPropagation();
      const menu = this.shadowRoot.querySelector('.dropdown-menu');
      if (menu) menu.classList.remove('show');
      this._selectFolder();
    } else if (action === 'initialize-workspace') {
      e.stopPropagation();
      const menu = this.shadowRoot.querySelector('.dropdown-menu');
      if (menu) menu.classList.remove('show');
      this._initializeWorkspace();
    } else if (action === 'switch-project') {
      const menu = this.shadowRoot.querySelector('.dropdown-menu');
      if (menu) menu.classList.remove('show');
      const path = target.dataset.path;
      if (path) this._switchProject(path);
    }
  }

  async _selectFolder() {
    try {
      let path = null;
      if (window.__TAURI__ && window.__TAURI__.core) {
        path = await window.__TAURI__.core.invoke('select_project_folder');
      } else {
        path = prompt('Enter project directory path:');
      }

      if (path) {
        const name = path.split('/').pop() || path.split('\\').pop() || path;
        window.notifyToast?.({
          message: `Project '${name}' added successfully`,
          type: 'success',
          duration: 3500
        });
        this.dispatchEvent(new CustomEvent('projectchange', {
          bubbles: true,
          composed: true,
          detail: { path }
        }));
      }
    } catch (err) {
      console.error('Failed to select project folder:', err);
      const msg = typeof err === 'string' ? err : (err.message || String(err));
      window.notifyToast?.({
        message: `Could not open folder: ${msg}`,
        type: 'error',
        duration: 6000
      });
    }
  }

  async _initializeWorkspace() {
    const projectPath = this._data?.active_project;
    if (!projectPath || projectPath === 'Select Project') {
      window.notifyToast?.({
        message: 'Open a project before initializing its workspace.',
        type: 'warning',
        duration: 4500
      });
      return;
    }

    window.notifyToast?.({
      message: 'Initializing Krokis workspace...',
      type: 'info',
      duration: 3000
    });

    try {
      if (!(window.__TAURI__ && window.__TAURI__.core)) {
        throw new Error('Workspace initialization requires the Tauri desktop app.');
      }
      const result = await window.__TAURI__.core.invoke('scaffold_workspace', {
        projectPath
      });
      const created = Array.isArray(result?.created) ? result.created.length : 0;
      const skipped = Array.isArray(result?.skipped) ? result.skipped.length : 0;
      window.notifyToast?.({
        message: `Workspace ready: ${created} created, ${skipped} already present.`,
        type: 'success',
        duration: 5500
      });
      this.dispatchEvent(new CustomEvent('projectchange', {
        bubbles: true,
        composed: true,
        detail: { path: projectPath, initialized: true }
      }));
    } catch (err) {
      console.error('Failed to initialize workspace:', err);
      const msg = typeof err === 'string' ? err : (err.message || String(err));
      window.notifyToast?.({
        message: `Workspace initialization failed: ${msg}`,
        type: 'error',
        duration: 7000
      });
    }
  }

  async _switchProject(path) {
    try {
      let state = null;
      if (window.__TAURI__ && window.__TAURI__.core) {
        state = await window.__TAURI__.core.invoke('add_recent_project', { projectPath: path });
      }
      const activePath = state?.active_project || path;
      const name = activePath.split('/').pop() || activePath.split('\\').pop() || activePath;
      window.notifyToast?.({
        message: `Switched to project '${name}'`,
        type: 'success',
        duration: 3000
      });
      this.dispatchEvent(new CustomEvent('projectchange', {
        bubbles: true,
        composed: true,
        detail: { path: activePath }
      }));
    } catch (err) {
      console.error('Failed to switch project:', err);
      const msg = typeof err === 'string' ? err : (err.message || String(err));
      window.notifyToast?.({
        message: `Could not switch project: ${msg}`,
        type: 'error',
        duration: 6000
      });
    }
  }

  render() {
    const data = this._data || {};
    const active = data.active_project || this.getAttribute('active') || 'Select Project';
    const registry = Array.isArray(data.registry) ? data.registry : [];
    const recentPaths = Array.isArray(data.recent_projects) ? data.recent_projects : [];

    // Fall back to recent_projects paths if registry is not populated yet
    const items = registry.length > 0 ? registry : recentPaths.map(p => ({
      name: p.split('/').pop() || p.split('\\').pop() || p,
      path: p,
      has_openspec: false
    }));

    const activeItem = items.find(item => item.path === active);
    const activeName = activeItem ? activeItem.name : (active.split('/').pop() || active.split('\\').pop() || active);

    const recentHtml = items.map(item => {
      const isCurrent = item.path === active;
      const specBadge = item.has_openspec ? `<span class="spec-tag">OpenSpec</span>` : '';
      return `
        <button class="dropdown-item ${isCurrent ? 'active' : ''}" data-action="switch-project" data-path="${this.escape(item.path)}">
          <div class="item-header">
            <span class="project-item-name">${this.escape(item.name)}</span>
            ${specBadge}
          </div>
          <span class="project-item-path" title="${this.escape(item.path)}">${this.escape(item.path)}</span>
        </button>
      `;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          font-family: var(--md-sys-typescale-body-font-family, inherit);
        }
        .selector-row {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          position: relative;
        }
        .project-selector {
          flex: 1;
          min-width: 0;
          position: relative;
          background: var(--md-sys-color-surface-container, #232323);
          border-radius: var(--md-sys-shape-corner-small, 4px);
          padding: 6px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          border: 1px solid var(--md-sys-color-outline, rgba(255,255,255,0.23));
          box-shadow: var(--md-sys-elevation-1);
          transition: background 0.15s ease, box-shadow 0.15s ease;
        }
        .project-selector:hover {
          background: var(--md-sys-color-surface-container-high, #2c2c2c);
          box-shadow: var(--md-sys-elevation-2);
        }
        .project-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }
        .project-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--md-sys-color-on-surface, #e1e2e8);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .chevron {
          width: 16px;
          height: 16px;
          fill: var(--md-sys-color-on-surface-variant, #a0a5b5);
          flex-shrink: 0;
          margin-left: 6px;
        }
        .add-btn-outside {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          border-radius: var(--md-sys-shape-corner-small, 4px);
          background: var(--md-sys-color-surface-container, #232323);
          border: 1px solid var(--md-sys-color-outline, rgba(255,255,255,0.23));
          box-shadow: var(--md-sys-elevation-1);
          color: var(--md-sys-color-primary, #90caf9);
          cursor: pointer;
          transition: background 0.15s ease, box-shadow 0.15s ease;
          padding: 0;
        }
        .add-btn-outside:hover {
          background: var(--md-sys-color-surface-container-high, #2c2c2c);
          box-shadow: var(--md-sys-elevation-2);
        }
        .add-btn-outside svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }
        .dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          background: var(--md-sys-color-surface-container-highest, #383838);
          border: 1px solid var(--md-sys-color-outline, rgba(255,255,255,0.23));
          border-radius: var(--md-sys-shape-corner-small, 4px);
          box-shadow: var(--md-sys-elevation-4);
          z-index: 1000;
          overflow: hidden;
          max-height: 280px;
          overflow-y: auto;
        }
        .dropdown-menu.show {
          display: block;
        }
        .dropdown-item {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 8px 12px;
          background: transparent;
          border: none;
          text-align: left;
          color: var(--md-sys-color-on-surface, #e1e2e8);
          cursor: pointer;
          border-bottom: 1px solid var(--md-sys-color-outline-variant, #2e323e);
        }
        .dropdown-item:hover {
          background: var(--md-sys-color-surface-container-high, #343844);
        }
        .dropdown-item.active {
          background: var(--md-sys-color-primary-container, #3a2c58);
          color: var(--md-sys-color-on-primary-container, #e8ddff);
        }
        .item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .project-item-name {
          font-weight: 500;
          font-size: 12px;
        }
        .spec-tag {
          font-size: 9px;
          padding: 1px 4px;
          border-radius: 2px;
          background: var(--md-sys-color-primary-container, #1976d2);
          color: var(--md-sys-color-on-primary-container, #ffffff);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .project-item-path {
          font-size: 10px;
          color: var(--md-sys-color-on-surface-variant, #9095a5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-action {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: var(--md-sys-color-primary, #a880ff);
        }
      </style>

      <div class="selector-row">
        <div class="project-selector" data-action="toggle-dropdown">
          <div class="project-info">
            <span class="project-name" title="${this.escape(active)}">${this.escape(activeName)}</span>
          </div>
          <svg class="chevron" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>

          <div class="dropdown-menu">
            ${recentHtml}
            <button class="dropdown-item dropdown-action" data-action="initialize-workspace">
              <span>Initialize Workspace</span>
            </button>
            <button class="dropdown-item dropdown-action" data-action="open-folder">
              <span>+ Open Project...</span>
            </button>
          </div>
        </div>
        <button class="add-btn-outside" data-action="open-folder" title="Open and register new project" aria-label="Open project directory">
          <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
      </div>
    `;
  }
}

customElements.define('project-selector', ProjectSelector);
