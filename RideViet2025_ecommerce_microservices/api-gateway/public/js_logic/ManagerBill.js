  // Đợi cho form và bảng hóa đơn có sẵn trong DOM rồi mới thêm sự kiện và tải hóa đơn
  waitForElement("#createOrUpdateBillForm", (form) => {
    form.addEventListener("submit", createOrUpdateBill);
});

waitForElement("#billsTableBody", () => {
    loadBills();
});

// Hàm tải danh sách hóa đơn
async function createOrUpdateBill(event) {
    event.preventDefault();

    const billId = document.getElementById("billId").value;
    const customerId = document.getElementById("customerId").value;
    const userId = document.getElementById("userId").value;
    const totalAmount = document.getElementById("totalAmount").value;
    const paymentMethod = document.getElementById("paymentMethod").value;

    // Kiểm tra dữ liệu đầu vào cho tổng tiền
    if (!totalAmount || totalAmount <= 0) {
        alert("Vui lòng nhập tổng tiền hợp lệ.");
        return;
    }

    const url = billId ? `http://localhost:3000/bill/update/${billId}` : "http://localhost:3000/bill/create";
    const method = billId ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId, userId, totalAmount, paymentMethod })
        });

        const data = await res.json();
        if (res.ok) {
            alert(billId ? "Cập nhật hóa đơn thành công!" : "Tạo hóa đơn thành công!");
            loadBills();
            clearForm();
        } else {
            alert(data.error || "Lỗi khi xử lý hóa đơn!");
        }
    } catch (err) {
        console.error("Lỗi khi tạo hoặc cập nhật hóa đơn:", err);
        alert("Lỗi máy chủ!");
    }
}

// Hàm tải danh sách hóa đơn
async function loadBills() {
    try {
        const res = await fetch("http://localhost:3000/bill");
        const bills = await res.json();

        const table = document.getElementById("billsTableBody");
        table.innerHTML = "";

        // Duyệt qua các hóa đơn để hiển thị thông tin
        bills.forEach(bill => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${bill.customerId ? bill.customerId.name : 'N/A'}</td> <!-- Hiển thị tên khách hàng -->
                <td>${bill.userId ? bill.userId.full_name : 'N/A'}</td> <!-- Hiển thị tên người tạo -->
                <td>${bill.totalAmount}</td>
                <td>${bill.paymentMethod}</td>
                <td>
                    <button onclick="editBill('${bill._id}')">Sửa</button>
                    <button onclick="deleteBill('${bill._id}')">Xóa</button>
                </td>
            `;
            table.appendChild(row);
        });
    } catch (err) {
        console.error("Lỗi khi tải hóa đơn:", err);
        alert("Lỗi máy chủ!");
    }
}

// Hàm chỉnh sửa hóa đơn
async function editBill(billId) {
    const res = await fetch(`http://localhost:3000/bill/getbill/${billId}`);
    const bill = await res.json();

    if (bill) {
        document.getElementById("billId").value = bill._id;
        document.getElementById("customerId").value = bill.customerId._id;
        document.getElementById("userId").value = bill.userId ? bill.userId._id : '';
        document.getElementById("totalAmount").value = bill.totalAmount;
        document.getElementById("paymentMethod").value = bill.paymentMethod;
    }
}
// Hàm xóa hóa đơn
async function deleteBill(billId) {
    if (confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) {
        try {
            const res = await fetch(`http://localhost:3000/bill/delete/${billId}`, {
                method: "DELETE"
            });

            const data = await res.json();
            if (res.ok) {
                alert("Xóa hóa đơn thành công!");
                loadBills();
            } else {
                alert(data.error || "Xóa hóa đơn thất bại!");
            }
        } catch (err) {
            console.error("Lỗi khi xóa hóa đơn:", err);
            alert("Lỗi máy chủ!");
        }
    }
}

// Hàm xóa form sau khi thêm hoặc cập nhật hóa đơn
function clearForm() {
    document.getElementById("billId").value = '';
    document.getElementById("customerId").value = '';
    document.getElementById("userId").value = '';
    document.getElementById("products").value = '';
    document.getElementById("paymentMethod").value = '';
}

// Hàm để load các thông tin (khách hàng, người dùng, v.v...) cho form
async function loadFormData() {
    await loadCustomers();
    await loadUsers();
}

// Hàm chờ cho phần tử có mặt trong DOM
function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

async function loadCustomers() {
    try {
        const res = await fetch("http://localhost:3000/customer");
        const response = await res.json(); // Lấy dữ liệu trả về
        const customers = response.data; // Truy cập vào trường 'data'

        console.log("Customers:", customers); // Kiểm tra dữ liệu trả về

        if (Array.isArray(customers) && customers.length > 0) {
            const customerSelect = document.getElementById("customerId");
            customers.forEach(customer => {
                const option = document.createElement("option");
                option.value = customer._id;
                option.textContent = customer.name;
                customerSelect.appendChild(option);
            });
        } else {
            console.error("Dữ liệu khách hàng không hợp lệ!");
        }
    } catch (err) {
        console.error("Lỗi khi tải khách hàng:", err);
    }
}

async function loadUsers() {
    try {
        const res = await fetch("http://localhost:3000/users");
        const response = await res.json(); // Lấy dữ liệu trả về
        const users = response.data; // Truy cập vào trường 'data'

        console.log("Users:", users); // Kiểm tra dữ liệu trả về

        if (Array.isArray(users) && users.length > 0) {
            const userSelect = document.getElementById("userId");
            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user._id;
                option.textContent = user.full_name;
                userSelect.appendChild(option);
            });
        } else {
            console.error("Dữ liệu người dùng không hợp lệ!");
        }
    } catch (err) {
        console.error("Lỗi khi tải người dùng:", err);
    }
}
async function loadFormData() {
    await loadCustomers();
    await loadUsers();
}


waitForElement('#customerId', loadCustomers);
// Gọi các hàm tải dữ liệu khi DOM được tải
waitForElement('#createOrUpdateBillForm', loadFormData);