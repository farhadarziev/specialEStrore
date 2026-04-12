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

    options.headers = options.headers || {};

    if (token) {
        options.headers["Authorization"] = "Bearer " + token;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return response;
}