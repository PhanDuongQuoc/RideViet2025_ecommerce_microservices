function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#cart-list", function (cartList) {
    const isLoggedIn = localStorage.getItem("username"); 

    if (!isLoggedIn) {
        cartList.innerHTML = "<p class='text-center'>Vui lòng đăng nhập để xem giỏ hàng.</p>";
        return;
    }

    waitForElement("#total-price", function (totalPriceElement) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            cartList.innerHTML = "<p class='text-center'>Giỏ hàng của bạn đang trống!</p>";
            totalPriceElement.textContent = "0 VNĐ"; 
            return;
        }

        cartList.innerHTML = ''; 

        let totalPrice = 0;
        let totalQuantity = 0; 

        cart.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("cart-item", "d-flex", "justify-content-between", "align-items-center");

            productItem.innerHTML = `
                <div class="cart-item-info d-flex align-items-center mb-3 p-3 border rounded shadow-sm">
                    <img src="${product.image}" alt="${product.name}" class="cart-item-img me-3" style="width: 100px; height: auto; border-radius: 8px;">
                    
                    <div class="d-flex flex-column w-100">
                        <h5 class="cart-item-name fs-5 fw-bold mb-2 text-truncate">${product.name}</h5>
                        <p class="cart-item-price mb-1 text-success">${product.price.toLocaleString()} VNĐ</p>
                        <p class="mb-1"><strong>Số lượng:</strong> ${product.quantity}</p>
                    </div>
                    
                    <div class="cart-item-total text-end ms-3">
                        <p class="cart-item-total-price fs-5 fw-bold text-danger">${(product.price * product.quantity).toLocaleString()} VNĐ</p>
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart('${product._id}')">Xóa</button>
                    </div>
                </div>

            `;

            cartList.appendChild(productItem);
            totalPrice += product.price * product.quantity;
            totalQuantity += product.quantity; 
            updateCartBadge();
        });

        totalPriceElement.textContent = `${totalPrice.toLocaleString()} VNĐ`;

        const totalQuantityElement = document.getElementById("total-quantity");
        if (totalQuantityElement) {
            totalQuantityElement.textContent = `Tổng số lượng: ${totalQuantity}`;
        }

    });
});

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Loại bỏ sản phẩm có _id tương ứng
    cart = cart.filter(product => product._id !== productId);
    
    localStorage.setItem("cart", JSON.stringify(cart));

    
    updateCartBadge();

   
    waitForElement("#cart-list", function(cartList) {
        renderCart(cartList);
    });
}

function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalQuantity = 0;

    cart.forEach(product => {
        totalQuantity += product.quantity;
    });

    const username = localStorage.getItem("username");
    const cartBadge = document.querySelector(".cart-badge");

    if (!username) {
        if (cartBadge) {
            cartBadge.textContent = "0"; 
        }
    } else {
        if (cartBadge) {
            cartBadge.textContent = totalQuantity; 
        }
    }
}

window.onload = function () {
    updateCartBadge();
};

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item._id === product._id);

    if (existingProduct) {
        existingProduct.quantity += product.quantity; 
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartBadge(); 
}

function renderCart(cartList) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        cartList.innerHTML = "<p class='text-center'>Giỏ hàng của bạn đang trống!</p>";
        return;
    }

    cartList.innerHTML = ''; 

    let totalPrice = 0;
    let totalQuantity = 0; 

    cart.forEach(product => {
        const productItem = document.createElement("div");
        productItem.classList.add("cart-item", "d-flex", "justify-content-between", "align-items-center");

        productItem.innerHTML = `
            <div class="cart-item-info d-flex align-items-center mb-3">
                <img src="${product.image}" alt="${product.name}" class="cart-item-img me-3" style="width: 100px; height: auto;">
                <div class="d-flex flex-column w-100">
                    <h5 class="cart-item-name fs-5 fw-bold mb-1">${product.name}</h5>
                    <p class="cart-item-price mb-1 text-success">${product.price.toLocaleString()} VNĐ</p>
                    <p class="mb-1"><strong>Số lượng:</strong> ${product.quantity}</p>
                </div>
                <div class="cart-item-total text-end ms-3">
                    <p class="cart-item-total-price fs-5 fw-bold text-danger">${(product.price * product.quantity).toLocaleString()} VNĐ</p>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart('${product._id}')">Xóa</button> <!-- Nút xóa -->
                </div>
            </div>
        `;

        cartList.appendChild(productItem);
        totalPrice += product.price * product.quantity;
        totalQuantity += product.quantity; 
    });

    const totalPriceElement = document.getElementById("total-price");
    totalPriceElement.textContent = `${totalPrice.toLocaleString()} VNĐ`;

    const totalQuantityElement = document.getElementById("total-quantity");
    if (totalQuantityElement) {
        totalQuantityElement.textContent = `Tổng số lượng: ${totalQuantity}`;
    }
}

document.getElementById('checkout-btn').addEventListener('click', async function (e) {
    e.preventDefault();

    const paymentMethod = document.getElementById('paymentMethod').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    if (!name || !phone || !address) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    // Tạo khách hàng
    const customer = {
        name,
        phone,
        address
    };

    try {
        const customerResponse = await fetch('/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        });

        if (!customerResponse.ok) {
            const errorData = await customerResponse.json();
            alert(`Lỗi: ${errorData.message}`);
            return;
        }

        const customerData = await customerResponse.json();
        const customerId = customerData._id;

        // Xử lý giỏ hàng
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }
        const token = localStorage.getItem('token');
        // Tạo hóa đơn
        const bill = {
            customerId,
            products: cart.map(product => ({
                productId: product._id,
                quantity: product.quantity,
                price: product.price
            })),
            paymentMethod
        };

        const response = await fetch('http://localhost:3000/bill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ✅ Dùng đúng biến token
            },
            body: JSON.stringify(bill)
        });
    
        if (response.ok) {
            alert('Thanh toán thành công!');
            localStorage.removeItem('cart'); 
            loadPage('thank-you.html');
        } else {
            const billError = await response.json();
            alert(`Lỗi: ${billError.message}\nChi tiết: ${billError.error || 'Không xác định'}`);
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        alert(`Lỗi khi thanh toán. Chi tiết: ${error.message}`);
    }
});
