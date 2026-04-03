const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/auth.html";
    throw new Error("Нет токена");
}

// ===== ПРОФИЛЬ =====
fetch("/api/user/me", {
    headers: {
        "Authorization": "Bearer " + token
    }
})
    .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
    })
    .then(user => {
        document.getElementById("login").textContent = user.login;
        document.getElementById("name").textContent = user.name;
        document.getElementById("surname").textContent = user.surname;
        document.getElementById("phone").textContent = user.phoneNum;
        document.getElementById("registeredAt").textContent =
            user.registeredAt.replace("T", " ");
    })
    .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/auth.html";
    });

// ===== ЗАКАЗЫ =====
fetch("/api/orders/my", {
    headers: {
        "Authorization": "Bearer " + token
    }
})
    .then(res => {
        if (!res.ok) {
            document.getElementById("orders").innerHTML = "<p>Заказов пока нет</p>";
            return [];
        }
        return res.json();
    })
    .then(orders => {
        const block = document.getElementById("orders");

        if (!orders || orders.length === 0) {
            block.innerHTML = "<p>Заказов пока нет</p>";
            return;
        }

        orders.forEach(o => {
            block.innerHTML += `
            <div class="order">
                <b>Заказ #${o.id}</b><br>
                Сумма: ${o.totalPrice} сом<br>
                Статус: ${o.status}<br>
                Дата: ${o.createdAt.replace("T", " ")}
            </div>
            <hr>
        `;
        });
    });

document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth.html";
};