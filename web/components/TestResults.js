class TestResults extends HTMLElement {
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
        if (!this._data) {
            this.shadowRoot.innerHTML = `<div style="color: #9ca3af; font-family: 'Open Sans';">Loading quality report...</div>`;
            return;
        }

        const tests = this._data.tests || { total: 0, passed: 0, failed: 0, skipped: 0 };
        const lintIssues = this._data.lint_issues || 0;

        let passRate = 0;
        if (tests.total > 0) {
            passRate = Math.round((tests.passed / tests.total) * 100);
        }

        this.shadowRoot.innerHTML = `
            <style>
                .quality-box {
                    font-family: 'Open Sans', sans-serif;
                    color: #f3f4f6;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .metrics-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                .metric-tile {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 16px;
                    text-align: center;
                }
                .value {
                    font-size: 24px;
                    font-weight: 700;
                }
                .value.success { color: #10b981; }
                .value.danger { color: #ef4444; }
                .value.warning { color: #f59e0b; }
                .label {
                    font-size: 12px;
                    color: #9ca3af;
                    margin-top: 4px;
                }
                .bar-total {
                    height: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 5px;
                    overflow: hidden;
                    display: flex;
                }
                .bar-passed { background: #10b981; height: 100%; }
                .bar-failed { background: #ef4444; height: 100%; }
                .bar-skipped { background: #f59e0b; height: 100%; }
            </style>
            <div class="quality-box">
                <div class="metrics-row">
                    <div class="metric-tile">
                        <div class="value ${passRate === 100 ? 'success' : passRate > 80 ? 'warning' : 'danger'}">${passRate}%</div>
                        <div class="label">Test Pass Rate</div>
                    </div>
                    <div class="metric-tile">
                        <div class="value ${lintIssues === 0 ? 'success' : 'danger'}">${lintIssues}</div>
                        <div class="label">Lint Issues</div>
                    </div>
                </div>

                <div>
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #9ca3af;">Test Execution Status</div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; color: #d1d5db;">
                        <span>Passed: ${tests.passed}</span>
                        <span>Failed: ${tests.failed}</span>
                        <span>Total: ${tests.total}</span>
                    </div>
                    <div class="bar-total">
                        <div class="bar-passed" style="width: ${tests.total > 0 ? (tests.passed / tests.total) * 100 : 0}%"></div>
                        <div class="bar-failed" style="width: ${tests.total > 0 ? (tests.failed / tests.total) * 100 : 0}%"></div>
                        <div class="bar-skipped" style="width: ${tests.total > 0 ? (tests.skipped / tests.total) * 100 : 0}%"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('test-results', TestResults);
