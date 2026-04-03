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
    const submitButton = document.querySelector("button");

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
    submitButton.disabled = true;

    fetch(`/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(res => {
            if (!res.ok) throw new Error();
            return mode === "login" ? res.json() : null;
        })
        .then(async data => {
            if (mode === "login") {
                localStorage.setItem("token", data.token);

                const localCart = JSON.parse(localStorage.getItem("cart") || "{}");

                await replaceServerCartWithLocal(localCart);

                localStorage.removeItem("cart");
                showToast("Вы успешно вошли");

                setTimeout(() => {
                    window.location.href = "/main.html";
                }, 800);
            } else {
                alert("Регистрация успешна. Войдите в аккаунт");
                document.getElementById("login").value = "";
                document.getElementById("password").value = "";
                switchMode();
            }
        })
        .catch(() => {
            alert("Ошибка авторизации");
        })
        .finally(() => {
            submitButton.disabled = false;
        });
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


async function replaceServerCartWithLocal(localCart) {
    const entries = Object.entries(localCart);

    if (entries.length === 0) {
        return;
    }

    const clearRes = await authFetch("/api/cart", {
        method: "DELETE"
    });

    if (!clearRes.ok) {
        throw new Error("Не удалось очистить серверную корзину");
    }

    for (const [productId, quantity] of entries) {
        for (let i = 0; i < quantity; i++) {
            const addRes = await authFetch(`/api/cart/add/${productId}`, {
                method: "POST"
            });

            if (!addRes.ok) {
                throw new Error(`Не удалось добавить товар ${productId}`);
            }
        }
    }
}