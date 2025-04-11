function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement(".rowner", (rowner) => {
    let videos = [];
    let currentPage = 1;
    const videosPerPage = 6;

    function renderSlides() {
        rowner.innerHTML = "";
        const startIndex = (currentPage - 1) * videosPerPage;
        const endIndex = startIndex + videosPerPage;
        const currentVideos = videos.slice(startIndex, endIndex);

        currentVideos.forEach((video) => {
            const videoItem = document.createElement("div");
            videoItem.classList.add("col-md-4"); // Bootstrap layout

            videoItem.innerHTML = `
                <div class="card mb-4">
                    <div class="ratio ratio-16x9">
                        <iframe src="${video.url}" class="card-img-top" allowfullscreen></iframe>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${video.title}</h5>
                        <p class="card-text">${video.description}</p>
                        <a href="${video.url}" class="btn btn-primary" target="_blank">Xem video</a>
                    </div>
                </div>
            `;

            rowner.appendChild(videoItem);
        });
        LoadProductList()
        renderPagination();
    }



    function LoadProductList() {
        fetch(`http://localhost:3000/products/limit`)
            .then(response => response.json())
            .then(products => {
                const productContainer = document.getElementById("product-list-limit");
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
    


    

    function renderPagination() {
        const paginationContainer = document.querySelector(".pagination-container");
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(videos.length / videosPerPage);

        if (totalPages > 1) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "Trước";
            prevButton.classList.add("btn", "btn-secondary", "me-2");
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderSlides();
                }
            });
            paginationContainer.appendChild(prevButton);

            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement("button");
                pageButton.textContent = i;
                pageButton.classList.add("btn", "btn-light", "me-2");
                if (i === currentPage) {
                    pageButton.classList.add("btn-primary");
                }
                pageButton.addEventListener("click", () => {
                    currentPage = i;
                    renderSlides();
                });
                paginationContainer.appendChild(pageButton);
            }

            const nextButton = document.createElement("button");
            nextButton.textContent = "Sau";
            nextButton.classList.add("btn", "btn-secondary");
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderSlides();
                }
            });
            paginationContainer.appendChild(nextButton);
        }
    }

    fetch("http://localhost:3000/videos")
        .then(response => response.json())
        .then(data => {
            videos = data;
            renderSlides();
        })
        .catch(error => console.error("Lỗi khi lấy danh sách video:", error));
});


