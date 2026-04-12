// function authFetch(url, options = {}) {
//     const token = localStorage.getItem("token");
//
//     options.headers = options.headers || {};
//
//     if (token) {
//         options.headers["Authorization"] = "Bearer " + token;
//     }
//
//     return fetch(url, options);
// }

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
        window.location.href = "/auth.html";
        throw new Error("Не авторизован");
    }


    return response;
}