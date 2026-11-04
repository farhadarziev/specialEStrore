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
    .then(res => {
        if (!res.ok) throw new Error(`Ошибка загрузки товаров: HTTP ${res.status}`);
        return res.json();
    })
    .then(data => {
        products = Array.isArray(data) ? data : [];
        initSlider();
        startAutoSlide();
    })
    .catch(err => {
        console.error(err);
        document.getElementById("categoryTitle").textContent = "Не удалось загрузить товары";
    });

function initSlider() {
    const slider = document.getElementById("mainSlider");
    slider.innerHTML = "";

    // Группируем товары по категориям
    const grouped = {};

    products.forEach(p => {
        const cat = typeof p.category === "string"
            ? p.category.trim()
            : "";

        if (!cat) return;

        if (!grouped[cat]) {
            grouped[cat] = [];
        }

        grouped[cat].push(p);
    });

    // Создаём слайды
    categoriesOrder.forEach(category => {

        if (!grouped[category] || grouped[category].length === 0) {
            return;
        }

        const slide = document.createElement("div");
        slide.className = "slide";
        slide.dataset.category = category;

        grouped[category].slice(0, 4).forEach(p => {
            slide.innerHTML += `
                <div class="product-card">
                    <a href="product.html?id=${p.id}">
                        <img src="${p.image}" alt="${p.name}">
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

    currentIndex = 0;

    const slideCount = slider.querySelectorAll(".slide").length;

    document.getElementById("prevBtn").style.display =
        slideCount > 1 ? "" : "none";

    document.getElementById("nextBtn").style.display =
        slideCount > 1 ? "" : "none";

    if (slideCount === 0) {
        document.getElementById("categoryTitle").textContent =
            "Товары пока не добавлены";
        return;
    }

    updateSlider();
}


// ====== ПЕРЕМЕЩЕНИЕ ======

function updateSlider(animate = true) {
    const slider = document.getElementById("mainSlider");
    const title = document.getElementById("categoryTitle");
    const slides = document.querySelectorAll(".slide");

    if (slides.length === 0) return;

    currentIndex = currentIndex % slides.length;

    slider.style.transition = animate
        ? "transform 0.6s ease-in-out"
        : "none";

    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    const category = slides[currentIndex].dataset.category;
    title.textContent = categoryNames[category];
}


function nextSlide() {
    const slides = document.querySelectorAll(".slide");

    if (slides.length <= 1) return;

    if (currentIndex === slides.length - 1) {
        currentIndex = 0;
        updateSlider(false);
    } else {
        currentIndex++;
        updateSlider(true);
    }
}


function prevSlide() {
    const slides = document.querySelectorAll(".slide");

    if (slides.length <= 1) return;

    if (currentIndex === 0) {
        currentIndex = slides.length - 1;
        updateSlider(false);
    } else {
        currentIndex--;
        updateSlider(true);
    }
}


// ====== АВТОСКРОЛЛ ======

function startAutoSlide() {
    clearInterval(slideInterval);

    if (document.querySelectorAll(".slide").length > 1) {
        slideInterval = setInterval(nextSlide, 10000);
    }
}


// ====== КНОПКИ ======

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

// ====== КНОПКА АДМИН-ПАНЕЛИ ======

const adminPanelLink = document.getElementById("adminPanelLink");

if (adminPanelLink) {

    const role = localStorage.getItem("role");

    if (isAuth() && role === "ADMIN") {
        adminPanelLink.style.display = "inline-block";
    }

}

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





