let products = [];

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

const categoryNames = {
    signal: "Сигнальные устройства",
    zvuk: "Звуковое оборудование",
    control: "Контрольно-управляющие устройства",
    aksessuary: "Аксессуары",
    montazh: "Монтажное оборудование"
};

if (category && categoryNames[category]) {
    document.getElementById("title").innerText = categoryNames[category];
}

let url = "/api/products";
if (category) {
    url += "?category=" + category;
}

fetch(url)
    .then(res => res.json())
    .then(data => {
        products = data;
        const container = document.getElementById("products");
        container.innerHTML = "";

        products.forEach(p => {
            container.innerHTML += `
    <div class="product-card">
      <a href="product.html?id=${p.id}">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>${p.price} сом</p>
      </a>

      <button 
        class="add-to-cart-btn"
        data-id="${p.id}">
        В корзину
      </button>
    </div>
  `;
        });


    })
    .catch(err => console.error(err));



