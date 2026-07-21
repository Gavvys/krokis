class KrokisElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._data = null;
        this._mode = null;
        this._onThemeChange = this._onThemeChange.bind(this);
    }

    set data(value) {
        this._data = value;
        this.render();
    }

    get data() {
        return this._data;
    }

    set mode(value) {
        this._mode = value;
        this.render();
    }

    get mode() {
        return this._mode;
    }

    connectedCallback() {
        document.addEventListener('themechange', this._onThemeChange);
        this.render();
    }

    disconnectedCallback() {
        document.removeEventListener('themechange', this._onThemeChange);
    }

    _onThemeChange() {
        this.render();
    }

    themeColor(name, fallback) {
        const styles = getComputedStyle(this);
        const value = styles.getPropertyValue(name).trim();
        return value || fallback;
    }

    escape(value) {
        return String(value ?? '').replace(/[&<>'"]/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        })[character]);
    }

    render() {
        // Subclasses override.
    }
}
