function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#user-info", (el) => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (username && role ==="admin") {
        el.innerHTML = `
            <div class="dropdown">
                <div class="dropdown">
                <a class="nav-link dropdown-toggle d-flex justify-content-between align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div class="d-flex align-items-center">
                        <span id="usernameDisplay">${username} -  Admin </span>
                    </div>
                </a>


                <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown" style="min-width: 220px;">
                    <li class="px-3 py-2">
                                <div class="d-flex align-items-center">
                                    <img src="/images/phanduongquoc.jpg" alt="Avatar"
                                        style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 8px;">
                                <div>
                                <div class="fw-semibold">${username}</div>
                                <div class="text-muted" style="font-size: 0.85rem;"></div>
                            </div>
                        </div>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="/profile">Personal page</a></li>
                    <li><a class="dropdown-item" href="/settings">Setting</a></li>
                    <li><a class="dropdown-item" href="/dashboard">Dashboard</a></li>
                    <li><a class="dropdown-item" onclick="loadPage('history.html')">History order</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logout()">Đăng xuất</a></li>
                </ul>
            </div>  
   
        `;


        const registerLink = document.getElementById("register-link");
        if (registerLink) {
            registerLink.style.display = "none";
        }
    }
    else if(username && role ==="user"){
        el.innerHTML = `    
            <div class="dropdown">
                <div class="dropdown">
                <a class="nav-link dropdown-toggle d-flex justify-content-between align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div class="d-flex align-items-center">
                        <span id="usernameDisplay">${username}</span>
                    </div>
                </a>


               <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown" style="min-width: 220px;">
                    <li class="px-3 py-2">
                        <div class="d-flex align-items-center">
                            <img src="/images/phanduongquoc.jpg" alt="Avatar"
                                style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 8px;">
                        <div>
                                <div class="fw-semibold">${username}</div>
                                <div class="text-muted" style="font-size: 0.85rem;"></div>
                            </div>
                        </div>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="/profile">Personal page</a></li>
                    <li><a class="dropdown-item" href="/settings">Setting</a></li>
                    <li><a class="dropdown-item" onclick="loadPage('history.html')">History order</a></li>

                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logout()">Đăng xuất</a></li>
                </ul>
            </div>  
   
        `;


        const registerLink = document.getElementById("register-link");
        if (registerLink) {
            registerLink.style.display = "none";
        }
    }
});


function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    loadPage("index.html");
    location.reload( loadPage("index.html"));
}
