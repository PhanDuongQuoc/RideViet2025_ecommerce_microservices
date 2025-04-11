function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#product-list", (productList) => {
    console.log("Đã tìm thấy #product-list, bắt đầu tải sản phẩm...");

    let products = [];  
    let currentPage = 1;
    const itemsPerPage = 3; 
    
    function renderProducts() {
        productList.innerHTML = ""; 
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const productsToShow = products.slice(startIndex, endIndex);

        productsToShow.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("col");
    
            productItem.innerHTML = `
                <div class="card shadow-sm h-100 product-card" data-id="${product._id}">
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
            productItem.querySelector(".card").addEventListener("click", (event) => {
                if (!event.target.classList.contains("btn-buynow")) { 
                    loadPage("detailproduct.html");
            
                    sessionStorage.setItem("selectedProductId", product._id);
                }
            });
    
            productList.appendChild(productItem);
        });

        renderPagination();
    }

    function updateCart() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartList = document.getElementById("cart-list");
        const totalPriceElement = document.getElementById("total-price");

        let totalPrice = 0;

        cartList.innerHTML = ""; 

        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("row", "mb-4", "border", "rounded", "p-3");

            cartItem.innerHTML = `
                <div class="col-3">
                    <img src="${item.image}" class="img-fluid" alt="${item.name}">
                </div>
                <div class="col-6">
                    <h5>${item.name}</h5>
                    <p>Giá: ${item.price.toLocaleString()} VNĐ</p>
                    <p>Số lượng: <span class="item-quantity">${item.quantity}</span></p>
                    <p>Thành tiền: ${(item.price * item.quantity).toLocaleString()} VNĐ</p>
                </div>
                <div class="col-3 d-flex flex-column align-items-center justify-content-center">
                    <button class="btn btn-danger mb-2 remove-item" data-id="${item._id}">Xóa</button>
                    <button class="btn btn-warning edit-quantity" data-id="${item._id}">Sửa SL</button>
                </div>
            `;

            cartList.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });

        totalPriceElement.textContent = `Tổng cộng: ${totalPrice.toLocaleString()} VNĐ`;
        console.log("Tổng tiền là:", totalPrice.toLocaleString());
    }

    waitForElement(".category-menu", (categoryMenu) => {
        console.log("Đã tìm thấy .category-menu, bắt đầu tải danh mục sản phẩm...");
        let typeproducts = [];
    
        function renderCategories() {
            categoryMenu.innerHTML = `<a href="#" class="list-group-item list-group-item-action active">Category Product</a>`;
    
            typeproducts.forEach((typeproduct) => {
                const categoryItem = document.createElement("a");
                categoryItem.href = "#";
                categoryItem.classList.add("list-group-item", "list-group-item-action");
                categoryItem.textContent = typeproduct.name;
                categoryItem.dataset.typeid = typeproduct._id;
    
                categoryItem.addEventListener("click", function (event) {
                    event.preventDefault();
                    const typeId = this.getAttribute("data-typeid");
                    loadProductsByType(typeId);
                });
    
                categoryMenu.appendChild(categoryItem);
            });
        }
    
        fetch("http://localhost:3000/typeproducts")
            .then(response => response.json())
            .then(data => {
                typeproducts = data;
                renderCategories();
            })
            .catch(error => console.error("Lỗi khi lấy danh sách loại sản phẩm:", error));
    });
    
    function loadProductsByType(typeId) {
        console.log("Đang tải sản phẩm của loại:", typeId);
    
        const productSection = document.getElementById("product-section"); 
        const productContainer = document.getElementById("product-list-type");
        const titleProduct = document.getElementById("title-product");
    
        productSection.style.display = "block"; 
    
        titleProduct.innerHTML = `Type Product Search`;
    
        productContainer.innerHTML = ""; 
    
        fetch(`http://localhost:3000/typeproducts/${typeId}/products`)
            .then(response => response.json())
            .then(products => {
                if (products.length === 0) {
                    let noProductDiv = document.createElement("div");
                    noProductDiv.className = "text-center mt-4";
                    noProductDiv.style.margin = "auto";
                    noProductDiv.innerHTML = `
                        <p class="text-danger fw-bold mt-3">Rất tiếc! Hiện tại không có sản phẩm nào thuộc danh mục này.</p>
                    `;
                    productContainer.appendChild(noProductDiv);
                    requestAnimationFrame(() => {
                        noProductDiv.scrollIntoView({ behavior: "instant", block: "start" });
                    });
                } else {
                    products.forEach(product => {
                        let productCol = document.createElement("div");
                        productCol.className = "col-md-4 col-sm-6 mb-4";
                        
                        let productCard = document.createElement("div");
                        productCard.className = "card product-card";
                        productCard.dataset.id = product._id;
    
                        productCard.innerHTML = `
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <div class="card-body text-center">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">${product.description}</p>
                                <p class="text-danger fw-bold">${product.price.toLocaleString()} VNĐ</p>
                                <span class="badge badge-category">${product.category.name}</span>
                                <div class="text-center mt-3">
                                    <button class="btn-buynow" data-id="${product._id}">Mua ngay</button>
                                </div>
                            </div>
                        `;
                        productCard.addEventListener("click", (event) => {
                            if (!event.target.classList.contains("btn-buynow")) { 
                                  window.location.href = `detailproduct.html?id=${product._id}#product-detail`;
                            }
                        });
                        requestAnimationFrame(() => {
                            const section = document.querySelector(".load_page_index");
                            if (section) {
                                section.scrollIntoView({ behavior: "instant", block: "start" });
                            }
                        });
    
                        productCol.appendChild(productCard);
                        productContainer.appendChild(productCol);
                    });
                }
    
                productSection.scrollIntoView({ behavior: "smooth" });
            })
            .catch(error => console.error("Lỗi khi tải sản phẩm theo loại:", error));
    }

    function renderPagination() {
        const paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = ""; 

        const totalPages = Math.ceil(products.length / itemsPerPage);

        const prevButton = document.createElement("button");
        prevButton.classList.add("btn", "btn-outline-primary", "me-2");
        prevButton.textContent = "Trước";
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
            }
        });
        paginationContainer.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.classList.add("btn", "btn-primary", "mx-1");
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.classList.add("active");
            }
            pageButton.addEventListener("click", () => {
                currentPage = i;
                renderProducts();
            });
            paginationContainer.appendChild(pageButton);
        }

        const nextButton = document.createElement("button");
        nextButton.classList.add("btn", "btn-outline-primary", "ms-2");
        nextButton.textContent = "Sau";
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    fetch("http://localhost:3000/products")
        .then(response => response.json())
        .then(data => {
            products = data; 
            renderProducts(); 
        })
        .catch(error => console.error("Lỗi khi lấy danh sách sản phẩm:", error));
});
