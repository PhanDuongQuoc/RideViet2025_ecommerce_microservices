// Đợi phần tử được tải hoàn tất trước khi thực thi logic
function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement('#orderHistory', function(orderHistoryDiv) {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Bạn cần đăng nhập để xem lịch sử đơn hàng.");
        window.location.href = "login.html";  
        return;
    }

    fetchOrders(token, orderHistoryDiv);
});

function fetchOrders(token, orderHistoryDiv) {
    fetch('http://localhost:3000/bill/my-orders', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi khi lấy dữ liệu lịch sử đơn hàng');
        }
        return response.json();
    })
    .then(data => {
        displayOrderHistory(data, orderHistoryDiv);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Không thể tải dữ liệu lịch sử đơn hàng!');
    });
}

function displayOrderHistory(orders, orderHistoryDiv) {
    if (orders.length === 0) {
        orderHistoryDiv.innerHTML = '<p class="alert alert-warning">Không có đơn hàng nào trong lịch sử.</p>';
        return;
    }

    let htmlContent = '<div class="row">';
    orders.forEach(order => {
        htmlContent += `
            <div class="col-md-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Mã hóa đơn: ${order._id}</h5>
                        <p><strong>Tổng tiền:</strong> ${order.totalAmount} VND</p>
                        <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod}</p>
                        <p><strong>Ngày tạo:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <button class="btn btn-primary" onclick="viewOrderDetails('${order._id}')">Xem chi tiết</button>
                    </div>
                </div>
            </div>
        `;
    });
    htmlContent += '</div>';
    
    orderHistoryDiv.innerHTML = htmlContent;
}

function viewOrderDetails(orderId) {
    alert('Xem chi tiết cho hóa đơn ' + orderId);
}