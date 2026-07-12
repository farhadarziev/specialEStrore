if (!localStorage.getItem("token")) {
    window.location.href = "/auth.html";
}

if (localStorage.getItem("role") !== "ADMIN") {
    window.location.href = "/main.html";
}

showProducts();

async function showProducts(){

    document.getElementById("title").innerText="Товары";

    const res = await authFetch("/api/admin/products");
    const products = await res.json();

    let html = `
<div class="admin-form">
    <input id="name" type="text" placeholder="Название">

    <select id="category">
        <option value="" disabled selected>Выберите категорию</option>
        <option value="signal">Сигнальные устройства</option>
        <option value="zvuk">Звуковое оборудование</option>
        <option value="control">Контрольно-управляющие устройства</option>
        <option value="aksessuary">Аксессуары</option>
        <option value="montazh">Монтажное оборудование</option>
    </select>

    <input id="price" type="number" placeholder="Цена">
    <input id="image" type="text" placeholder="Картинка URL">

    <button class="action" onclick="addProduct()">Добавить</button>
</div>
<hr>
`;

    products.forEach(p=>{
        html += `
<div class="card">
<h3>${p.name}</h3>
<p>${p.category}</p>
<p>${p.price} сом</p>

<button class="action" onclick="deleteProduct(${p.id})">Удалить</button>
</div>
`;
    });

    document.getElementById("panel").innerHTML=html;
}

async function addProduct() {
    const product = {
        name: document.getElementById("name").value.trim(),
        category: document.getElementById("category").value,
        price: Number(document.getElementById("price").value),
        image: document.getElementById("image").value.trim()
    };

    if (!product.name || !product.category || product.price <= 0) {
        alert("Заполните название, категорию и цену");
        return;
    }

    const res = await authFetch("/api/admin/products", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(product)
    });

    if (!res.ok) {
        alert("Не удалось добавить товар");
        return;
    }

    showProducts();
}

async function deleteProduct(id) {
    const res = await authFetch("/api/admin/products/" + id, {
        method: "DELETE"
    });

    if (!res.ok) {
        alert("Не удалось удалить товар");
        return;
    }

    showProducts();
}

async function showOrders() {
    document.getElementById("title").innerText = "Заказы";

    const res = await authFetch("/api/admin/orders");
    const orders = await res.json();

    let html = "";

    if (orders.length === 0) {
        html = "<p>Заказов пока нет</p>";
    }

    orders.forEach(order => {
        const itemsHtml = order.items.map(item => `
<li>${item.productName} — ${item.quantity} шт. × ${item.price} сом</li>
`).join("");

        html += `
<div class="card">
<h3>Заказ #${order.id}</h3>
<p>User ID: ${order.userId}</p>
<p>Логин: ${order.userLogin}</p>
<p>Статус: ${order.status}</p>
<p>Сумма: ${order.totalPrice} сом</p>
<p>Дата: ${order.createdAt}</p>
<ul>${itemsHtml}</ul>
</div>
`;
    });

    document.getElementById("panel").innerHTML = html;
}

function goShop() {
    window.location.href = "/main.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "/auth.html";
}