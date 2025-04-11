function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement(".container-row", (containerRow) => {
    console.log("Đã tìm thấy .container-row, bắt đầu tải danh mục sản phẩm...");

    let typeproducts = [];

    function renderCategories() {
        containerRow.innerHTML = ""; 

        typeproducts.forEach((typeproduct) => {
            const typeproductItem = document.createElement("div");
            typeproductItem.classList.add("col-md-3", "col-sm-6", "mb-4");

            typeproductItem.innerHTML = `
                <a href="#" class="text-decoration-none text-dark category-item" data-typeid="${typeproduct._id}">
                    <div class="card category-card">
                        <img src="${typeproduct.image}" class="card-img-top" alt="${typeproduct.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${typeproduct.name}</h5>
                        </div>
                    </div>
                </a>
            `;

            containerRow.appendChild(typeproductItem);
        });

       
        document.querySelectorAll(".category-item").forEach(item => {
            item.addEventListener("click", function (event) {
                event.preventDefault();
                const typeId = this.getAttribute("data-typeid"); 
                loadProductsByType(typeId); 
            });
        });
    }
    LoadProductList();

    fetch("http://localhost:3000/typeproducts/limit")
        .then(response => response.json())
        .then(data => {
            typeproducts = data;
            renderCategories();
        })
        .catch(error => console.error("Lỗi khi lấy danh sách loại sản phẩm:", error));
});





function LoadProductList() {
    fetch(`http://localhost:3000/products`)
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById("product-list");
            productContainer.innerHTML = ""; 

            if (products.length === 0) {
                productContainer.innerHTML = "<p class='text-center text-danger'>Không có sản phẩm nào</p>";
                return;
            }

            products.forEach(product => {
                let productItem = document.createElement("div");
                productItem.dataset.id = product._id;

                productItem.innerHTML = `
                    <div class="card shadow-sm h-100 product-card">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title text-pr">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="price">Giá: ${product.price.toLocaleString()} VNĐ</p>
                            <span class="badge badge-category">${product.category.name}</span>
                            <div class="text-center mt-3">
                                <button class="btn-buynow" data-id="${product._id}">Mua ngay</button>
                            </div>
                        </div>
                    </div>
                `;

                productItem.querySelector(".btn-buynow").addEventListener("click", (event) => {
                    const productId = product._id;
                
                    const isLoggedIn = localStorage.getItem("username");
                
                    if (!isLoggedIn) {
                        loadPage("login.html");
                        return; 
                    }
                
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                
                    const existingProductIndex = cart.findIndex(item => item._id === productId);
                
                    if (existingProductIndex === -1) {
                        cart.push({...product, quantity: 1}); 
                    } else {
                        cart[existingProductIndex].quantity += 1;
                    }
                
                    localStorage.setItem("cart", JSON.stringify(cart));
                
                    alert("Sản phẩm đã được thêm vào giỏ hàng!");
                    loadPage("cart.html");
                    updateCart();
                });

                productItem.addEventListener("click", (event) => {
                    if (!event.target.classList.contains("btn-buynow")) { 
                        loadPage("detailproduct.html");
                        sessionStorage.setItem("selectedProductId", product._id);
                    }
                });


                productContainer.appendChild(productItem);
            });
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm:", error));
}


function loadProductsByType(typeId) {
    console.log("Đang tải sản phẩm của loại:", typeId);
    fetch(`http://localhost:3000/typeproducts/${typeId}/products`)
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById("product-list");
            productContainer.innerHTML = ""; 

            if (products.length === 0) {
                let noProductDiv = document.createElement("div");
                noProductDiv.className = "text-center mt-4";
                noProductDiv.style.margin = "0 auto";
                noProductDiv.innerHTML = `
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" alt="No Product" width="150">
                    <p class="text-danger fw-bold mt-3">Rất tiếc! Hiện tại không có sản phẩm nào thuộc hãng này.</p>
                `;
                productContainer.appendChild(noProductDiv);
                requestAnimationFrame(() => {
                    noProductDiv.scrollIntoView({ behavior: "instant", block: "start" }); 
                });
                return;
            }

            products.forEach(product => {
                let productCol = document.createElement("div");
                productCol.className = "col-md-4 col-sm-6 mb-4";

                let productCard = document.createElement("div");
                productCard.className = "card product-card";
                productCard.dataset.id = product._id;

                productCard.innerHTML = `
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="text-primary fw-bold">${product.price.toLocaleString()} VNĐ</p>
                        <div class="text-center mt-3">
                            <button class="btn-buynow" data-id="${product._id}">Mua ngay</button>
                        </div>
                    </div>
                `;

                productCard.addEventListener("click", (event) => {
                    if (!event.target.classList.contains("btn-buynow")) {
                        loadPage("detailproduct.html");
                        sessionStorage.setItem("selectedProductId", product._id);
                    }
                });

                requestAnimationFrame(() => {
                    const section = document.querySelector(".cycle_section");
                    if (section) {
                        section.scrollIntoView({ behavior: "instant", block: "start" });
                    }
                });


                productCol.appendChild(productCard);
                productContainer.appendChild(productCol);
            });
        })
        .catch(error => console.error("Lỗi khi tải sản phẩm theo loại:", error));
        
}
