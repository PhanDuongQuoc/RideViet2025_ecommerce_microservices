function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#product-detail", async (productDetail) => {
    console.log("Đã tìm thấy #product-detail, bắt đầu tải sản phẩm...");

    const productId = sessionStorage.getItem("selectedProductId"); 

    if (!productId) {
        productDetail.innerHTML = "<p style='color: red;'>Sản phẩm không tồn tại.</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/products/detail/${productId}`);

        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        const product = await response.json();

        productDetail.innerHTML = `
            <div class="row">

                <div class="col-md-5">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
                    </div>
                </div>
                
                <div class="col-md-7">
                    <h2 class="product-title">${product.name}</h2>
                    <p class="product-description">${product.description}</p>
                    <p class="price">Giá: <span>${product.price.toLocaleString()} VNĐ</span></p>
                    <span class="badge badge-category">${product.category?.name|| "Không có danh mục"}</span>
                    
                    <div class="mt-3">
                            <button class="btn-buynow" data-id="${product._id}">Mua ngay</button>
                    </div>
                </div>
            </div>`;
            
            productDetail.querySelector(".btn-buynow").addEventListener("click", (event) => {
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
        
            requestAnimationFrame(() => {
                const detailSection = document.querySelector(".cycle_section.layout_padding");
                if (detailSection) {
                    detailSection.scrollIntoView({ behavior: "instant", block: "start" });
                }
            });

    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        productDetail.innerHTML = "<p style='color: red;'>Có lỗi xảy ra khi tải dữ liệu.</p>";
    }
    LoadNewTopList();
});


function LoadNewTopList() {
    fetch(`http://localhost:3000/news/topnews`)
        .then(response => response.json())
        .then(newsList => {
            const newsContainer = document.querySelector(".top-news-container");
            newsContainer.innerHTML = "";

            if (newsList.length === 0) {
                newsContainer.innerHTML = "<p class='text-center text-danger'>Không có bản tin nào</p>";
                return;
            }

            newsList.forEach(news => {
                const newsItem = document.createElement("a");
                newsItem.href = `news-detail.html?id=${news._id}`;
                newsItem.classList.add("list-group-item", "list-group-item-action", "d-flex", "align-items-center");

                newsItem.innerHTML = `
                    <img src="${news.image}" class="rounded me-3" alt="${news.name}" width="50" height="50">
                    <div>
                        <h6 class="mb-1">${news.name}</h6>
                        <small class="text-muted">${news.content.substring(0, 50)}...</small>
                    </div>
                `;

                newsContainer.appendChild(newsItem);
            });
        })
        .catch(error => console.error("Lỗi khi tải bản tin:", error));
}

