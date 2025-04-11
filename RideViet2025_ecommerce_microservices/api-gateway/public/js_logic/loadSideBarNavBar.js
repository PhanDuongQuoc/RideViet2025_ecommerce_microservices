document.addEventListener("DOMContentLoaded", function () {
    loadComponent("sidebar-placeholder", "views/sidebar.html");
    loadComponent("navbar-placeholder", "views/navbar.html");

    loadPage("dashboardhome.html");
});

function loadComponent(elementId, filePath) {
    fetch(filePath)
    .then(response => response.text())
    .then(data => {
        document.getElementById(elementId).innerHTML = data;

     
    })
    .catch(error => console.error("Error loading component:", error));
}

function loadPage(page) {
    fetch("pages/" + page)
        .then(response => response.text())
        .then(data => {
            document.getElementById("dashboard-placeholder").innerHTML = data;

            let scripts = [];
            if (page === "dashboardhome.html" || page === "ManagerRideViet.html") {
                scripts = [

                ];
            } else if (page === "ManagerCustomer.html") {
                scripts = ["js_logic/ManagerCustomers.js"];
            } else if (page === "ManagerUser.html") {
                scripts = ["js_logic/ManagerUser.js"];
            }else if (page === "ManagerRole.html") {
                scripts = ["js_logic/ManagerRole.js"];
            }else if (page === "ManagerProduct.html") {
                scripts = ["js_logic/ManagerProduct.js"];
            }
            else if (page === "ManagerSlider.html") {
                scripts = ["js_logic/ManagerSlider.js"];
            }else if (page === "ManagerNew.html") {
                scripts = ["js_logic/ManagerNew.js"];
            }else if (page === "ManagerVideo.html") {
                scripts = ["js_logic/ManagerVideo.js"];
            }
            else if (page === "ManagerType.html") {
                scripts = ["js_logic/ManagerType.js"];
            }
            else if (page === "ManagerBill.html") {
                scripts = ["js_logic/ManagerBill.js"];
            }
            else if (page === "ManagerBillDetail.html") {
                scripts = ["js_logic/ManagerBillDetail.js"];
            }
            loadScripts(scripts);
        })
        .catch(error => console.error("Lỗi khi tải trang:", error));
}

function loadScripts(scripts) {
    scripts.forEach(src => {
        loadScript(src);
    });
}

function loadScript(src) {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.onload = function () {
        if (src === "js_logic/ManagerCustomers.js" && typeof fetchCustomers === "function") {
            fetchCustomers();
        }

        
    };
    document.body.appendChild(script);
}
