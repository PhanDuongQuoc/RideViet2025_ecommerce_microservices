
  function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      setTimeout(() => waitForElement(selector, callback), 100);
    }
  }

  waitForElement('#search-button', () => {
    const input = document.getElementById('search-input');
    const button = document.getElementById('search-button');
    const resultsContainer = document.getElementById('search-results');
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const keyword = input.value.trim();
      if (!keyword) {
        resultsContainer.innerHTML = '<p>Vui lòng nhập từ khóa tìm kiếm.</p>';
        return;
      }

      resultsContainer.innerHTML = 'Đang tìm kiếm...';

      fetch(`http://localhost:3000/products/search?q=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(data => {
          resultsContainer.innerHTML = '';

          const modalElement = document.getElementById('searchModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }

          if (data.length === 0) {
            resultsContainer.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
          } else {
            data.forEach(product => {
              const productItem = document.createElement("div");
              productItem.classList.add("col");

              productItem.innerHTML = `
                <div class="card shadow-sm h-100 product-card" data-id="${product._id}">
                    <img src="${product.image || '/public/images/default.jpg'}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title text-pr">${product.name}</h5>
                        <p class="card-text">${product.description || ''}</p>
                        <p class="price">Giá: ${Number(product.price).toLocaleString()} VNĐ</p>
                        <span class="badge badge-category">${product.category?.name || 'Không rõ danh mục'}</span>
                        <div class="text-center mt-3">
                            <button class="btn-buynow" data-id="${product._id}">Mua ngay</button>
                        </div>
                    </div>
                </div>
              `;

              productItem.querySelector(".btn-buynow").addEventListener("click", (event) => {
                event.stopPropagation();
                const productId = product._id;
                const isLoggedIn = localStorage.getItem("username");

                if (!isLoggedIn) {
                  loadPage("login.html");
                  return;
                }

                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingProductIndex = cart.findIndex(item => item._id === productId);

                if (existingProductIndex === -1) {
                  cart.push({ ...product, quantity: 1 });
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
                  const modalElement = document.getElementById('searchModal');
                  if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) {
                      modal.hide();
                    }
                  }
              
                  sessionStorage.setItem("selectedProductId", product._id);
                  loadPage("detailproduct.html");
                }
              });


              resultsContainer.appendChild(productItem);
            });
          }
        })
        .catch(err => {
          resultsContainer.innerHTML = '<p>Đã xảy ra lỗi khi tìm kiếm.</p>';
          console.error(err);
        });
    });
  });