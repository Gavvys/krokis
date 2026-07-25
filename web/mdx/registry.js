// MDX-only component catalog. Script loading remains explicit in index.html.
window.KROKIS_MDX_COMPONENTS = {
    InfoBox: {
        tag: 'info-box',
        props: ['type', 'title'],
        children: true,
        data: null,
    },
    MetricsCard: {
        tag: 'metrics-card',
        props: ['value', 'label'],
        children: false,
        data: null,
    },
    TaskCadence: {
        tag: 'task-cadence',
        props: [],
        children: false,
        data: 'telemetry',
    },
    CoverageReport: {
        tag: 'coverage-report',
        props: [],
        children: false,
        data: 'telemetry',
    },
    RoadmapBoard: {
        tag: 'roadmap-board',
        props: [],
        children: false,
        data: 'roadmap',
    },
};
