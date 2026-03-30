function authFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    options.headers = options.headers || {};

    if (token) {
        options.headers["Authorization"] = "Bearer " + token;
    }

    return fetch(url, options);
}
