let mode = "login"; // login | register

function switchMode() {
    const registerFields = document.getElementById("registerFields");

    if (mode === "login") {
        mode = "register";
        registerFields.style.display = "block";
        document.getElementById("title").innerText = "Регистрация";
        document.querySelector("button").innerText = "Зарегистрироваться";
        document.getElementById("toggle").innerHTML =
            'Уже есть аккаунт? <a href="#" onclick="switchMode()">Войти</a>';
    } else {
        mode = "login";
        registerFields.style.display = "none";
        document.getElementById("title").innerText = "Вход";
        document.querySelector("button").innerText = "Войти";
        document.getElementById("toggle").innerHTML =
            'Нет аккаунта? <a href="#" onclick="switchMode()">Зарегистрироваться</a>';
    }
}

function submitAuth() {
    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!login || !password) {
        alert("Заполните логин и пароль");
        return;
    }

    const body = {
        login,
        password
    };

    if (mode === "register") {
        body.name = document.getElementById("name").value.trim();
        body.surname = document.getElementById("surname").value.trim();
        body.phoneNum = document.getElementById("phoneNum").value.trim();

        if (!body.name || !body.surname || !body.phoneNum) {
            alert("Заполните все поля регистрации");
            return;
        }
    }

    fetch(`/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(res => {
            if (!res.ok) throw new Error();
            return mode === "login" ? res.json() : null;
        })
        .then(data => {
            if (mode === "login") {
                localStorage.setItem("token", data.token);

                const localCart = JSON.parse(localStorage.getItem("cart") || "{}");

                const requests = [];

                for (const productId in localCart) {
                    for (let i = 0; i < localCart[productId]; i++) {
                        requests.push(
                            authFetch(`/api/cart/add/${productId}`, { method: "POST" })
                        );
                    }
                }

                Promise.all(requests)
                    .then(() => {
                        localStorage.removeItem("cart");
                        showToast("Вы успешно вошли");
                        setTimeout(() => {
                            window.location.href = "/main.html";
                        }, 800);
                    })
                    .catch(() => {
                        alert("Ошибка переноса корзины");
                        window.location.href = "/main.html";
                    });
            } else {
                alert("Регистрация успешна. Войдите в аккаунт");
                document.getElementById("login").value = "";
                document.getElementById("password").value = "";
                switchMode();
            }
        })
        .catch(() => alert("Ошибка авторизации"));
}

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

