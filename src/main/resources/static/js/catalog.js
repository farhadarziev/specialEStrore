const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const q = params.get("q");

const titleEl = document.getElementById("title");
const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

const categoryNames = {
    signal: "Сигнальные устройства",
    zvuk: "Звуковое оборудование",
    control: "Контрольно-управляющие устройства",
    aksessuary: "Аксессуары",
    montazh: "Монтажное оборудование"
};

if (q && q.trim() !== "") {
    titleEl.textContent = `Результаты поиска: ${q}`;
} else if (category && categoryNames[category]) {
    titleEl.textContent = categoryNames[category];
}

if (q) {
    searchInput.value = q;
}

loadProducts();

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();

    const url = new URL("/catalog.html", window.location.origin);

    if (category) {
        url.searchParams.set("category", category);
    }

    if (query) {
        url.searchParams.set("q", query);
    }

    window.location.href = url.toString();
});

resetBtn.addEventListener("click", () => {
    const url = new URL("/catalog.html", window.location.origin);

    if (category) {
        url.searchParams.set("category", category);
    }

    window.location.href = url.toString();
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

function buildApiUrl() {
    const url = new URL("/api/products", window.location.origin);

    if (category) {
        url.searchParams.set("category", category);
    }

    if (q) {
        url.searchParams.set("q", q);
    }

    return url.toString();
}

function loadProducts() {
    fetch(buildApiUrl())
        .then(res => {
            if (!res.ok) {
                throw new Error("Ошибка загрузки товаров");
            }
            return res.json();
        })
        .then(data => {
            renderProducts(data);
        })
        .catch(err => {
            console.error(err);
            productsContainer.innerHTML = `<div>Не удалось загрузить товары</div>`;
        });
}

function renderProducts(products) {
    productsContainer.innerHTML = "";

    if (!products.length) {
        productsContainer.innerHTML = `<div>Товары не найдены</div>`;
        return;
    }

    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <a href="/product.html?id=${p.id}">
                <img src="${p.image}">
                <h3>${p.name}</h3>
                <p>${p.price} сом</p>
            </a>

            <button class="add-to-cart-btn" data-id="${p.id}">
                В корзину
            </button>
        `;

        productsContainer.appendChild(card);
    });
}