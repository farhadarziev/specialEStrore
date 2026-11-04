let editingProductId = null;
let adminProducts = [];
if (!localStorage.getItem("token")) {
    window.location.href = "/auth.html";
}

if (localStorage.getItem("role") !== "ADMIN") {
    window.location.href = "/main.html";
}

showProducts();

async function showProducts() {

    editingProductId = null;

    document.getElementById("title").innerText = "Товары";

    const res = await authFetch("/api/admin/products");

    if (!res.ok) {
        alert("Не удалось загрузить товары");
        return;
    }

    adminProducts = await res.json();

    let html = `
<div class="admin-form">

    <h3 id="formTitle">Добавление товара</h3>

    <input id="name"
           type="text"
           placeholder="Название">

    <select id="category">
        <option value="" disabled selected>Выберите категорию</option>
        <option value="signal">Сигнальные устройства</option>
        <option value="zvuk">Звуковое оборудование</option>
        <option value="control">Контрольно-управляющие устройства</option>
        <option value="aksessuary">Аксессуары</option>
        <option value="montazh">Монтажное оборудование</option>
    </select>

    <input id="price"
           type="number"
           placeholder="Цена">
           
    <input id="stockQuantity"
           type="number"
           min="0"
           step="1"
           placeholder="Количество на складе">

    <input id="image"
           type="text"
           placeholder="Картинка URL">

    <button class="action"
            id="saveProductBtn"
            onclick="saveProduct()">
        Добавить
    </button>

    <button class="action"
            id="cancelEditBtn"
            onclick="cancelEditProduct()"
            style="display: none;">
        Отмена
    </button>

</div>

<hr>
`;

    adminProducts.forEach(p => {

        html += `
<div class="card">

    <h3>${p.name}</h3>

    <p>Категория: ${p.category}</p>

    <p>Цена: ${p.price} сом</p>
    
    <p>На складе: ${p.stockQuantity} шт.</p>

    <button class="action"
            onclick="startEditProduct(${p.id})">
        Изменить
    </button>

    <button class="action"
            onclick="deleteProduct(${p.id})">
        Удалить
    </button>

</div>
`;
    });

    document.getElementById("panel").innerHTML = html;
}

function startEditProduct(id) {

    const product = adminProducts.find(p => p.id === id);

    if (!product) {
        alert("Товар не найден");
        return;
    }

    editingProductId = id;

    document.getElementById("name").value = product.name;
    document.getElementById("category").value = product.category;
    document.getElementById("price").value = product.price;
    document.getElementById("stockQuantity").value = product.stockQuantity;
    document.getElementById("image").value = product.image || "";

    document.getElementById("formTitle").innerText =
        "Редактирование товара";

    document.getElementById("saveProductBtn").innerText =
        "Сохранить изменения";

    document.getElementById("cancelEditBtn").style.display =
        "inline-block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


async function saveProduct() {

    const stockInput = document.getElementById("stockQuantity").value;

    const product = {
        name: document.getElementById("name").value.trim(),
        category: document.getElementById("category").value,
        price: Number(document.getElementById("price").value),
        image: document.getElementById("image").value.trim(),
        stockQuantity: Number(stockInput)
    };

    if (!product.name || !product.category || product.price <= 0) {
        alert("Заполните название, категорию и цену");
        return;
    }

    if (
        stockInput.trim() === "" ||
        !Number.isInteger(product.stockQuantity) ||
        product.stockQuantity < 0
    ) {
        alert("Укажите корректное количество товара (0 или больше)");
        return;
    }

    const isEditing = editingProductId !== null;

    const url = isEditing
        ? `/api/admin/products/${editingProductId}`
        : "/api/admin/products";

    const method = isEditing ? "PUT" : "POST";

    try {

        const res = await authFetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });

        if (!res.ok) {
            alert("Не удалось сохранить товар");
            return;
        }

        if (isEditing) {
            alert("Товар успешно обновлён");
        } else {
            alert("Товар успешно добавлен");
        }

        await showProducts();

    } catch (error) {
        console.error("Ошибка сохранения товара:", error);
        alert("Произошла ошибка при сохранении товара");
    }
}

function cancelEditProduct() {

    editingProductId = null;

    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("price").value = "";
    document.getElementById("stockQuantity").value = "";
    document.getElementById("image").value = "";

    document.getElementById("formTitle").innerText =
        "Добавление товара";

    document.getElementById("saveProductBtn").innerText =
        "Добавить";

    document.getElementById("cancelEditBtn").style.display =
        "none";
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