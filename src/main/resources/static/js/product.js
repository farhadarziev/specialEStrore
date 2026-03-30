
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    alert("Товар не найден");
}

let currentProduct = null;

fetch("/api/products/" + id)
    .then(res => res.json())
    .then(product => {
        currentProduct = product;

        document.getElementById("product-name").innerText = product.name;
        document.getElementById("product-image").src = product.image;
        document.getElementById("product-price").innerText =
            product.price + " сом";


        document
            .querySelector(".add-to-cart-btn")
            .dataset.id = product.id;
    });
