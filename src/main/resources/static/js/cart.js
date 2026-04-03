
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


// localStorage cart
function getLocalCart() {
    if (isAuth()) return {}; // 🔥 КЛЮЧ
    return JSON.parse(localStorage.getItem("cart")) || {};
}


function saveLocalCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToLocalCart(productId) {
    const cart = getLocalCart();
    cart[productId] = (cart[productId] || 0) + 1;
    saveLocalCart(cart);
}
async function renderLocalCart(containerId, totalId) {
    const scrollY = window.scrollY;
    const cart = getLocalCart();
    const container = document.getElementById(containerId);
    const totalBlock = document.getElementById(totalId);

    container.innerHTML = "";
    let total = 0;

    const entries = Object.entries(cart);
    if (entries.length === 0) {
        container.innerHTML = "<p>Корзина пуста</p>";
        totalBlock.innerText = "0 сом";
        return;
    }

    for (const [productId, quantity] of entries) {
        const res = await fetch(`/api/products/${productId}`);
        const product = await res.json();

        container.innerHTML += `
    <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div class="info">
            <h3>${product.name}</h3>
            <p>Цена за 1 шт: ${product.price} сом</p>
<p>Сумма: ${product.price * quantity} сом</p>

            <div class="controls">
                <button onclick="minusLocal(${productId})">−</button>
                <span>${quantity}</span>
                <button onclick="plusLocal(${productId})">+</button>
                <button onclick="removeLocal(${productId})">🗑</button>
            </div>
        </div>
    </div>
`;
        total += product.price * quantity;
    }

    totalBlock.innerText = total + " сом";
    window.scrollTo(0, scrollY);
}


function plusLocal(id) {
    const cart = getLocalCart();
    cart[id]++;
    saveLocalCart(cart);
    renderLocalCart("cart-items", "cart-total");
}

function minusLocal(id) {
    const cart = getLocalCart();
    if (cart[id] > 1) {
        cart[id]--;
        saveLocalCart(cart);
        renderLocalCart("cart-items", "cart-total");
    }
}


function removeLocal(id) {
    const cart = getLocalCart();
    delete cart[id];
    saveLocalCart(cart);
    renderLocalCart("cart-items", "cart-total");
}







// backend cart

// ================= ADD TO CART =================

function addToCart(productId) {
    if (!isAuth()) {
        addToLocalCart(productId);
        showToast("Товар добавлен в корзину");
        renderLocalCart("cart-items", "cart-total");
        return;
    }

    authFetch(`/api/cart/add/${productId}`, {
        method: "POST"
    }).then(() => {
        showToast("Товар добавлен в корзину");
    });
}



// ================= TOAST =================

function showToast(text) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.innerText = text;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

// ================= RENDER CART =================

async function renderCart(containerId, totalId) {
    const scrollY = window.scrollY;
    const res = await authFetch("/api/cart");
    const cart = await res.json();


    const container = document.getElementById(containerId);
    const totalBlock = document.getElementById(totalId);

    container.innerHTML = "";
    let total = 0;

    for (const item of cart.items) {
        const pRes = await fetch(`/api/products/${item.productId}`);
        const product = await pRes.json();

        container.innerHTML += `
<div class="cart-item">
    <img src="${product.image}">
    <div class="info">
        <h3>${product.name}</h3>
        <p>Цена за 1 шт: ${product.price} сом</p>
<p>Сумма: ${product.price * item.quantity} сом</p>

        <div class="controls">
            <button onclick="minus(${item.productId})">−</button>
            <span>${item.quantity}</span>
            <button onclick="plus(${item.productId})">+</button>
            <button onclick="removeFromCart(${item.productId})">🗑</button>
        </div>
    </div>
</div>
`;


        total += product.price * item.quantity;
    }

    totalBlock.innerText = total + " сом";
    window.scrollTo(0, scrollY);

}




document.addEventListener("click", e => {
    if (e.target.classList.contains("add-to-cart-btn")) {
        const id = e.target.dataset.id;

        addToCart(id);

    }
});


function removeFromCart(id) {
    authFetch(`/api/cart/remove/${id}`, {
        method: "DELETE"
    }).then(() => {
        renderCart("cart-items", "cart-total");
    });
}



document.addEventListener("click", e => {
    if (e.target.id === "clear-cart") {

        if (!isAuth()) {
            saveLocalCart({});
            renderLocalCart("cart-items", "cart-total");
            return;
        }

        authFetch("/api/cart", {
            method: "DELETE"
        }).then(() => {
            renderCart("cart-items", "cart-total");
        });
    }
});

function plus(id) {
    authFetch(`/api/cart/add/${id}`, {
        method: "POST"
    }).then(() => {
        renderCart("cart-items", "cart-total");
    });
}


function minus(id) {
    authFetch(`/api/cart/minus/${id}`, {
        method: "POST"
    }).then(() => {
        renderCart("cart-items", "cart-total");
    });
}

document.getElementById("checkout-btn")?.addEventListener("click", () => {

    if (!isAuth()) {
        alert("Войдите, чтобы оформить заказ");
        window.location.href = "/auth.html";
        return;
    }

    authFetch("/api/orders/create", {
        method: "POST"
    })
        .then(() => {
            showToast("Заказ оформлен");
            renderCart("cart-items", "cart-total");
        })
        .catch(() => alert("Ошибка оформления заказа"));
});





