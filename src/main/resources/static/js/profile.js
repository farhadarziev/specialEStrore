document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/auth.html";
        return;
    }

    const loginEl = document.getElementById("login");
    const nameEl = document.getElementById("name");
    const surnameEl = document.getElementById("surname");
    const phoneEl = document.getElementById("phone");
    const registeredAtEl = document.getElementById("registeredAt");

    const ordersShortListEl = document.getElementById("ordersShortList");
    const ordersHistoryListEl = document.getElementById("ordersHistoryList");
    const historySectionEl = document.getElementById("historySection");
    const historyBtn = document.getElementById("historyBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (historyBtn) {
        historyBtn.addEventListener("click", () => {
            window.location.href = "/order_history.html";
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "/auth.html";
        });
    }

    loadProfile();
    loadOrders();

    async function loadProfile() {
        try {
            const response = await authFetch("/api/user/me");
            if (!response.ok) {
                throw new Error("Ошибка загрузки профиля");
            }

            const user = await response.json();

            loginEl.textContent = "Логин: " + (user.login || "");
            nameEl.textContent = "Имя: " + (user.name || "");
            surnameEl.textContent = "Фамилия: " + (user.surname || "");
            phoneEl.textContent = "Телефон: " + (user.phoneNum || "");
            registeredAtEl.textContent = "Дата регистрации: " + formatDate(user.registeredAt);
        } catch (error) {
            console.error("Ошибка профиля:", error);
        }
    }

    async function loadOrders() {
        try {
            const response = await authFetch("/api/orders/my");
            if (!response.ok) {
                throw new Error("Ошибка загрузки заказов");
            }

            const orders = await response.json();
            const safeOrders = Array.isArray(orders) ? orders : [];

            renderShortOrders(safeOrders);
        } catch (error) {
            console.error("Ошибка заказов:", error);
            ordersShortListEl.innerHTML = `<div class="empty-text">Не удалось загрузить заказы</div>`;
        }
    }

    function renderShortOrders(orders) {
        ordersShortListEl.innerHTML = "";

        if (!orders.length) {
            ordersShortListEl.innerHTML = `<div class="empty-text">У вас пока нет заказов</div>`;
            return;
        }

        const latestOrders = orders.slice(0, 3);

        latestOrders.forEach(order => {
            const card = document.createElement("div");
            card.className = "order-card";

            card.innerHTML = `
                <div class="order-top">
                    <div class="order-main">
                        <div class="order-title">Заказ #${order.id ?? ""}</div>
                        <div class="order-meta">Дата: ${formatDate(order.createdAt)}</div>
                    </div>
                    <div class="order-right">
                        <div class="order-sum">${order.totalPrice ?? 0} сом</div>
                        <div class="order-status">${order.status ?? ""}</div>
                    </div>
                </div>
            `;

            ordersShortListEl.appendChild(card);
        });
    }

    function formatDate(value) {
        if (!value) return "";

        const date = new Date(value);
        if (isNaN(date.getTime())) return value;

        return date.toLocaleString("ru-RU");
    }
});