let products = [];

const categoryNames = {
    signal: "Сигнальные устройства",
    zvuk: "Звуковое оборудование",
    control: "Контрольно-управляющие устройства",
    aksessuary: "Аксессуары",
    montazh: "Монтажное оборудование"
};

const categoriesOrder = ["signal", "zvuk", "control", "aksessuary", "montazh"];

let currentIndex = 0;
let slideInterval;

/* Загружаем товары */
fetch("/api/products")
    .then(res => res.json())
    .then(data => {
        products = data;
        initSlider();
        startAutoSlide();
    });

function initSlider() {
    const slider = document.getElementById("mainSlider");
    slider.innerHTML = "";

    /* Группировка товаров по категориям */
    const grouped = {};
    products.forEach(p => {
        const cat = p.category.trim();
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(p);
    });

    /* Создание слайдов */
    categoriesOrder.forEach(category => {
        if (!grouped[category] || grouped[category].length < 4) return;

        const slide = document.createElement("div");
        slide.className = "slide";
        slide.dataset.category = category;

        grouped[category].slice(0, 4).forEach(p => {
            slide.innerHTML += `
<div class="product-card">
            <a href="product.html?id=${p.id}">
                <img src="${p.image}">
                <h3>${p.name}</h3>
                <p>${p.price} сом</p>
            </a>

            <button class="add-to-cart-btn" data-id="${p.id}">
                В корзину
            </button>
        </div>
`;
        });


        slider.appendChild(slide);
    });

    updateSlider();
}

/* ====== ПЕРЕМЕЩЕНИЕ ====== */

function updateSlider(animate = true) {
    const slider = document.getElementById("mainSlider");
    const title = document.getElementById("categoryTitle");
    const slides = document.querySelectorAll(".slide");

    slider.style.transition = animate ? "transform 0.6s ease-in-out" : "none";
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    const category = slides[currentIndex].dataset.category;
    title.textContent = categoryNames[category];
}

function nextSlide() {
    const slides = document.querySelectorAll(".slide");

    if (currentIndex === slides.length - 1) {
        // teleport с 5 на 1
        currentIndex = 0;
        updateSlider(false); // ❗ БЕЗ анимации
    } else {
        currentIndex++;
        updateSlider(true);
    }
}

function prevSlide() {
    const slides = document.querySelectorAll(".slide");

    if (currentIndex === 0) {
        // teleport с 1 на 5
        currentIndex = slides.length - 1;
        updateSlider(false); // ❗ БЕЗ анимации
    } else {
        currentIndex--;
        updateSlider(true);
    }
}


/* ====== АВТОСКРОЛЛ ====== */

function startAutoSlide() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 10000);
}

/* ====== КНОПКИ ====== */

document.getElementById("nextBtn").addEventListener("click", () => {
    nextSlide();
    startAutoSlide();
});

document.getElementById("prevBtn").addEventListener("click", () => {
    prevSlide();
    startAutoSlide();
});
function showToast(text) {
    let toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = text;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function isAuth() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

window.onload = () => {
    if (isAuth()) {
        console.log("Пользователь авторизован");
    } else {
        console.log("Гость");
    }
};

// searcher
const mainSearchInput = document.getElementById("mainSearchInput");
const mainSearchBtn = document.getElementById("mainSearchBtn");

if (mainSearchBtn && mainSearchInput) {
    mainSearchBtn.addEventListener("click", () => {
        const query = mainSearchInput.value.trim();

        if (!query) {
            window.location.href = "/catalog.html";
            return;
        }

        window.location.href = `/catalog.html?q=${encodeURIComponent(query)}`;
    });

    mainSearchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const query = mainSearchInput.value.trim();

            if (!query) {
                window.location.href = "/catalog.html";
                return;
            }

            window.location.href = `/catalog.html?q=${encodeURIComponent(query)}`;
        }
    });
}




