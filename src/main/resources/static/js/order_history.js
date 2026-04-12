document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/auth.html";
        return;
    }

    const ordersHistoryListEl = document.getElementById("ordersHistoryList");
    const backBtn = document.getElementById("backBtn");

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "/profile.html";
        });
    }

    loadOrders();

    async function loadOrders() {
        try {
            const response = await authFetch("/api/orders/my");

            if (!response.ok) {
                throw new Error("Ошибка загрузки истории заказов");
            }

            const orders = await response.json();
            const safeOrders = Array.isArray(orders) ? orders : [];

            renderOrders(safeOrders);
        } catch (error) {
            console.error("Ошибка истории заказов:", error);
            ordersHistoryListEl.innerHTML = `<div class="empty-state">Не удалось загрузить историю заказов</div>`;
        }
    }

    function renderOrders(orders) {
        ordersHistoryListEl.innerHTML = "";

        if (!orders.length) {
            ordersHistoryListEl.innerHTML = `
                <div class="empty-state">
                    У вас пока нет оформленных заказов
                </div>
            `;
            return;
        }

        orders.forEach(order => {
            const card = document.createElement("div");
            card.className = "history-card";

            const itemsHtml = renderItems(order.items);

            card.innerHTML = `
                <div class="history-card-top">
                    <div class="history-card-left">
                        <div class="history-order-title">Заказ #${order.id ?? ""}</div>
                        <div class="history-order-date">Дата: ${formatDate(order.createdAt)}</div>
                    </div>

                    <div class="history-card-right">
                        <div class="history-order-sum">${order.totalPrice ?? 0} сом</div>
                        <div class="history-order-status">${order.status ?? ""}</div>
                    </div>
                </div>

                <div class="history-items-block">
                    <div class="history-items-title">Состав заказа</div>
                    <div class="history-items-list">
                        ${itemsHtml}
                    </div>
                </div>
            `;

            ordersHistoryListEl.appendChild(card);
        });
    }

    function renderItems(items) {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return `
                <div class="history-empty-items">
                    Детали заказа пока недоступны
                </div>
            `;
        }

        return items.map(item => {
            const quantity = item.quantity ?? 0;
            const price = item.price ?? 0;
            const subtotal = quantity * price;

            return `
                <div class="history-item-row">
                    <div class="history-item-left">
                        <div class="history-item-name">${item.productName || "Товар"}</div>
                        <div class="history-item-meta">
                            Количество: ${quantity}
                        </div>
                    </div>

                    <div class="history-item-right">
                        <div class="history-item-price">${price} сом</div>
                        <div class="history-item-subtotal">Итого: ${subtotal} сом</div>
                    </div>
                </div>
            `;
        }).join("");
    }

    function formatDate(value) {
        if (!value) return "";

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString("ru-RU");
    }
});