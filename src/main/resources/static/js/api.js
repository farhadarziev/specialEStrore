async function authFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/auth.html";
        throw new Error("Нет токена");
    }

    options.headers = options.headers || {};
    options.headers["Authorization"] = "Bearer " + token;

    const response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/auth.html";
        throw new Error("Не авторизован");
    }
    return response;
}