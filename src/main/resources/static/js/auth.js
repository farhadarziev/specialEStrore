let mode = "login"; // login | register

function switchMode() {
    const registerFields = document.getElementById("registerFields");
    setFormMessage("");

    if (mode === "login") {
        mode = "register";
        registerFields.style.display = "block";
        document.getElementById("title").innerText = "Регистрация";
        document.getElementById("submitBtn").innerText = "Зарегистрироваться";
        document.getElementById("toggle").innerHTML =
            'Уже есть аккаунт? <a href="#" onclick="switchMode()">Войти</a>';
    } else {
        mode = "login";
        registerFields.style.display = "none";
        document.getElementById("title").innerText = "Вход";
        document.getElementById("submitBtn").innerText = "Войти";
        document.getElementById("toggle").innerHTML =
            'Нет аккаунта? <a href="#" onclick="switchMode()">Зарегистрироваться</a>';
    }
}

async function submitAuth() {
    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();
    const submitButton = document.getElementById("submitBtn");

    setFormMessage("");

    if (mode === "login") {
        if (!login || !password) {
            setFormMessage("Введите логин и пароль");
            return;
        }
    }

    if (mode === "register") {
        if (!login || !password) {
            setFormMessage("Заполните логин и пароль");
            return;
        }

        if (login.length < 5 || login.length > 30) {
            setFormMessage("Логин должен быть от 5 до 30 символов");
            return;
        }

        if (/\s/.test(login)) {
            setFormMessage("Логин не должен содержать пробелы");
            return;
        }

        if (!/^[A-Za-z0-9_.]+$/.test(login)) {
            setFormMessage("Логин может содержать только латинские буквы, цифры, _ и .");
            return;
        }

        if (password.length < 8 || password.length > 50) {
            setFormMessage("Пароль должен быть от 8 до 50 символов");
            return;
        }
    }

    const body = {
        login,
        password
    };

    if (mode === "register") {
        body.name = document.getElementById("name").value.trim();
        body.surname = document.getElementById("surname").value.trim();
        body.phoneNum = document.getElementById("phoneNum").value.trim();

        if (!body.name) {
            setFormMessage("Введите имя");
            return;
        }

        if (!body.surname) {
            setFormMessage("Введите фамилию");
            return;
        }

        if (!body.phoneNum) {
            setFormMessage("Введите номер телефона");
            return;
        }
    }

    submitButton.disabled = true;

    try {
        const res = await fetch(`/auth/${mode}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            let message = "Ошибка авторизации";

            try {
                const data = await res.json();
                message = data.message || data.error || message;
            } catch (e) {
                message = "Ошибка авторизации";
            }

            setFormMessage(message);
            return;
        }

        if (mode === "login") {
            const data = await res.json();

            if (!data.token || !data.role) {
                throw new Error("Сервер не вернул данные для входа");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);



            const cartAbortController = new AbortController();
            const cartTimeoutId = setTimeout(() => cartAbortController.abort(), 8000);
            try {
                const localCart = JSON.parse(localStorage.getItem("cart") || "{}");
                await replaceServerCartWithLocal(localCart, cartAbortController.signal);
                localStorage.removeItem("cart");
            } catch (cartError) {
                console.warn("Не удалось перенести гостевую корзину. Локальная копия сохранена:", cartError);
            } finally {
                clearTimeout(cartTimeoutId);
            }

            showNotification("Вы успешно вошли");

            setTimeout(() => {

                if (data.role === "ADMIN") {
                    window.location.href = "/admin.html";
                } else {
                    window.location.href = "/main.html";
                }

            }, 800);

        } else {
            showNotification("Регистрация успешна. Теперь войдите в аккаунт");


            document.getElementById("login").value = "";
            document.getElementById("password").value = "";
            document.getElementById("name").value = "";
            document.getElementById("surname").value = "";
            document.getElementById("phoneNum").value = "";

            switchMode();
        }
    } catch (err) {
        console.error("Ошибка входа / регистрации:", err);
        setFormMessage("Не удалось выполнить запрос. Попробуйте ещё раз");
    } finally {
        submitButton.disabled = false;
    }
}

function showNotification(text, type = "info") {
    const container = document.getElementById("notification-container");
    if (!container) return;

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = text;

    container.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add("show");
    });

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
}

function setFormMessage(text = "") {
    const formMessage = document.getElementById("form-message");
    if (!formMessage) return;
    formMessage.textContent = text;
}

async function replaceServerCartWithLocal(localCart,signal) {
    const entries = Object.entries(localCart);

    if (entries.length === 0) {
        return;
    }

    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

    for (const [productId, quantity] of entries) {
        for (let i = 0; i < quantity; i++) {
            const addRes = await fetch(`/api/cart/add/${productId}`, {
                method: "POST", headers, signal
            });

            if (!addRes.ok) {
                throw new Error(`Не удалось добавить товар ${productId}`);
            }
        }
    }
}