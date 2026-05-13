const filterState = {
    tense: new Set(["present", "future", "past"]),
    aspect: new Set(["simple", "continuous", "perfect"]),
    column: new Set(["question", "statement", "negation"]),
    voice: new Set(["active-voice"]),
    feature: new Set()
};

// ---------------- INIT ----------------

document.addEventListener("DOMContentLoaded", () => {
    initButtons();
    resetFeatureStyles();
    render();
});

function initButtons() {
    document.querySelectorAll(".toggle-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.dataset.type;
            const value = btn.dataset.value;

            toggle(filterState[type], value);
            btn.classList.toggle("active-btn");

            render();
        });
    });
}

// ---------------- STATE ----------------

function toggle(set, value) {
    set.has(value) ? set.delete(value) : set.add(value);
}

// ---------------- RENDER PIPELINE ----------------

function render() {
    applyRowFilter();
    applyHeaderFilter();
    applyCellFilters();
    applyFeatureFilter();
}

// ---------------- ROW FILTER ----------------

function applyRowFilter() {
    document.querySelectorAll(".tense-row").forEach(row => {
        const classes = row.classList;

        const matchTense = [...filterState.tense]
            .some(t => classes.contains(t));

        const matchAspect = [...filterState.aspect]
            .some(a => classes.contains(a));

        const visible = matchTense && matchAspect;

        row.classList.toggle("hidden", !visible);
    });
}

// ---------------- CELL FILTER ----------------

function applyCellFilters() {
    document.querySelectorAll(".tense-row").forEach(row => {
        if (row.classList.contains("hidden")) return;

        // columns
        ["question", "statement", "negation"].forEach(col => {
            row.querySelectorAll("." + col).forEach(el => {
                el.classList.toggle("hidden", !filterState.column.has(col));
            });
        });

        // voice
        ["active-voice", "passive-voice"].forEach(voice => {
            row.querySelectorAll("." + voice).forEach(el => {
                el.classList.toggle("hidden", !filterState.voice.has(voice));
            });
        });
    });
}

// ---------------- FEATURE FILTER ----------------

function applyFeatureFilter() {
    const enabled = filterState.feature;

    document.querySelectorAll(".grammar, .tense-marker").forEach(el => {
        const row = el.closest(".tense-row");
        if (!row || row.classList.contains("hidden")) return;

        if (enabled.size === 0) {
            el.classList.remove("active");
            return;
        }

        if (el.classList.contains("grammar") && enabled.has("grammar")) {
            el.classList.add("active");
        } else if (el.classList.contains("tense-marker") && enabled.has("tense-marker")) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    });
}

// ---------------- RESET ----------------

function resetFeatureStyles() {
    document.querySelectorAll(".grammar, .tense-marker")
        .forEach(el => el.classList.remove("active"));
}

function applyHeaderFilter() {
    const columns = ["question", "statement", "negation"];

    columns.forEach(col => {
        const visible = filterState.column.has(col);

        document.querySelectorAll(`th.${col}`).forEach(th => {
            th.classList.toggle("hidden", !visible);
        });
    });
}