document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header-placeholder", "views/header.html");
    loadComponent("footer-placeholder", "views/footer.html");
    fetch("pages/search.html")
    .then(res => res.text())
    .then(html => {
      if (!document.getElementById("searchModal")) {
        const modalWrapper = document.createElement("div");
        modalWrapper.innerHTML = html;
        document.body.appendChild(modalWrapper);
      }
    })
    .then(() => {
      loadSearchScript(); 
    });

        loadPage("index.html");



    
});



function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;

            if (elementId === "header-placeholder") {
                const script = document.createElement("script");
                script.src = "js_logic/user-display.js";
                script.defer = true;
                document.body.appendChild(script);
            }

        })
        .catch(error => console.error("Error loading component:", error));
}


function loadPage(page) {
    fetch("pages/" + page)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content-placeholder").innerHTML = data;
       

            if (page === "index.html") {
                let scripts = [ 
                    "js_logic/typeproducts.js",
                    "js_logic/products.js",
                    "js_logic/detailproduct.js",
                    "js_logic/new.js",
                    "js_logic/videos.js",
                    "js_logic/login.js",
                    "js_logic/user-display.js",
                     "js_logic/cart.js",
                     "js_logic/search.js"
                ];
            
                scripts.forEach(src => {
                    let script = document.createElement("script");
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            
            }
            if (page === "shop.html") {
                let scripts = [
                    "js_logic/typeproducts.js",
                    "js_logic/products.js",
                    "js_logic/detailproduct.js",
                    "js_logic/new.js",
                    "js_logic/login.js",
                     "js_logic/user-display.js",
                     "js_logic/cart.js",
                     "js_logic/search.js"
                ];
            
                scripts.forEach(src => {
                    let script = document.createElement("script");
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            }

            if (page === "detailproduct.html") {
            
                let scripts = [
                    "js_logic/typeproducts.js",
                    "js_logic/products.js",
                    "js_logic/detailproduct.js",
                    "js_logic/videos.js",
                    "js_logic/new.js",
                    "js_logic/login.js",
                    "js_logic/user-display.js",
                     "js_logic/cart.js",
                     "js_logic/search.js"
                ];
            
                scripts.forEach(src => {
                    let script = document.createElement("script");
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            }

            if (page === "video.html") {
            
                let scripts = [
                    "js_logic/typeproducts.js",
                    "js_logic/products.js",
                    "js_logic/detailproduct.js",
                    "js_logic/videos.js",
                    "js_logic/new.js",
                    "js_logic/login.js",
                     "js_logic/user-display.js",
                     "js_logic/cart.js",
                     "js_logic/search.js"
                ];
            
                scripts.forEach(src => {
                    let script = document.createElement("script");
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            }
            

            if (page === "new.html") {
            
                let scripts = [
                    "js_logic/typeproducts.js",
                    "js_logic/products.js",
                    "js_logic/detailproduct.js",
                    "js_logic/videos.js",
                    "js_logic/new.js",
                    "js_logic/login.js",
                     "js_logic/user-display.js",
                     "js_logic/cart.js",
                     "js_logic/search.js"
                ];
            
                scripts.forEach(src => {
                    let script = document.createElement("script");
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            }

            if (page === "contact.html") {
            
                let scripts = [
                    "js_logic/typeproducts.js",
                    "js_logic/products.js",
                    "js_logic/detailproduct.js",
                    "js_logic/videos.js",
                    "js_logic/new.js",
                    "js_logic/login.js",
                    "js_logic/user-display.js",
                     "js_logic/cart.js",
                     "js_logic/search.js"
                ];
            
                scripts.forEach(src => {
                    let script = document.createElement("script");
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            }

            if (page === "login.html") {
            
                let scripts = [
                    "js_logic/typeproducts.js",
                    "js_logic/products.js",
                    "js_logic/detailproduct.js",
                    "js_logic/videos.js",
                    "js_logic/new.js",
                    "js_logic/login.js",
                    "js_logic/user-display.js",
                     "js_logic/cart.js",
                     "js_logic/search.js"
                ];
            
                scripts.forEach(src => {
                    let script = document.createElement("script");
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            }
            if (page === "cart.html") {
            
                let scripts = [
                    "js_logic/typeproducts.js",
                    "js_logic/products.js",
                    "js_logic/detailproduct.js",
                    "js_logic/videos.js",
                    "js_logic/new.js",
                    "js_logic/login.js",
                    "js_logic/user-display.js",
                     "js_logic/cart.js",
                     "js_logic/search.js"
                ];
            
                scripts.forEach(src => {
                    let script = document.createElement("script");
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            }

            if (page === "thank-you.html") {
            
                let scripts = [
                    "js_logic/typeproducts.js",
                    "js_logic/products.js",
                    "js_logic/detailproduct.js",
                    "js_logic/videos.js",
                    "js_logic/new.js",
                    "js_logic/login.js",
                    "js_logic/user-display.js",
                     "js_logic/cart.js",
                     "js_logic/search.js"
                ];
            
                scripts.forEach(src => {
                    let script = document.createElement("script");
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            }
            if (page === "search.html") {
                let scripts = [
                    "js_logic/typeproducts.js",
                    "js_logic/products.js",
                    "js_logic/detailproduct.js",
                    "js_logic/videos.js",
                    "js_logic/new.js",
                    "js_logic/login.js",
                    "js_logic/user-display.js",
                     "js_logic/cart.js",
                    "js_logic/search.js"
                ];
            
                scripts.forEach(src => {
                    let script = document.createElement("script");
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            }

            if (page === "history.html") {
            
                let scripts = [
                    "js_logic/typeproducts.js",
                    "js_logic/products.js",
                    "js_logic/detailproduct.js",
                    "js_logic/videos.js",
                    "js_logic/new.js",
                    "js_logic/login.js",
                    "js_logic/user-display.js",
                     "js_logic/cart.js",
                     "js_logic/search.js",
                     "js_logic/history.js"
                ];
            
                scripts.forEach(src => {
                    let script = document.createElement("script");
                    script.src = src;
                    script.defer = true;
                    document.body.appendChild(script);
                });
            }
            
            
        })
        .catch(error => console.error("Lỗi khi tải trang:", error));
}