document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("software-search");
    const cards = Array.from(document.querySelectorAll(".software-card"));
    const categoryButtons = Array.from(document.querySelectorAll(".category-button"));
    const resultsCount = document.getElementById("results-count");
    const emptyState = document.getElementById("empty-state");
    let activeCategory = "all";

    if (!searchInput || !resultsCount || !emptyState) {
        return;
    }

    function updateResults() {
        const query = searchInput.value.trim().toLocaleLowerCase();
        let visibleCount = 0;

        cards.forEach(function (card) {
            const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
            const searchText = (card.dataset.search + " " + card.textContent).toLocaleLowerCase();
            const matchesQuery = !query || searchText.includes(query);
            const isVisible = matchesCategory && matchesQuery;

            card.hidden = !isVisible;
            visibleCount += isVisible ? 1 : 0;
        });

        resultsCount.textContent = `显示 ${visibleCount} 款软件`;
        emptyState.hidden = visibleCount > 0;
    }

    categoryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            activeCategory = button.dataset.category;

            categoryButtons.forEach(function (categoryButton) {
                const isActive = categoryButton === button;
                categoryButton.classList.toggle("active", isActive);
                categoryButton.setAttribute("aria-pressed", String(isActive));
            });

            updateResults();
        });
    });

    searchInput.addEventListener("input", updateResults);

    document.addEventListener("keydown", function (event) {
        if (event.key === "/" && document.activeElement !== searchInput && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            searchInput.focus();
        }
    });

    updateResults();
});
