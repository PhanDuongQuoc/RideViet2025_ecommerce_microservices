// Định nghĩa hàm waitForElement
function waitForElement(selector, callback) {
    const intervalId = setInterval(() => {
        if (document.querySelector(selector)) {
            clearInterval(intervalId);
            callback();
        }
    }, 100); // Kiểm tra mỗi 100ms
}

// Hàm tải danh sách hóa đơn và sản phẩm
async function loadBillAndProductData() {
    await loadBills();
    await loadProducts();
}

async function loadBills() {
    const res = await fetch("http://localhost:3000/bill");
    if (!res.ok) {
        console.error("Không thể tải danh sách hóa đơn, mã lỗi: " + res.status);
        alert("Không thể tải danh sách hóa đơn.");
        return;
    }

    const bills = await res.json();

    const billSelect = document.getElementById("billId");
    billSelect.innerHTML = ''; // Clear current options

    bills.forEach(bill => {
        const option = document.createElement("option");
        option.value = bill._id;
        option.textContent = `Hóa đơn #${bill._id}`;
        billSelect.appendChild(option);
    });
}

async function loadProducts() {
    const res = await fetch("http://localhost:3000/products");
    if (!res.ok) {
        console.error("Không thể tải danh sách sản phẩm, mã lỗi: " + res.status);
        alert("Không thể tải danh sách sản phẩm.");
        return;
    }

    const products = await res.json();

    const productSelect = document.getElementById("productId");
    productSelect.innerHTML = ''; // Clear current options

    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product._id;
        option.textContent = product.name;
        productSelect.appendChild(option);
    });
}

async function createOrUpdateBillDetail(event) {
    event.preventDefault();  // Ngừng hành động mặc định của form submit

    const billDetailId = document.getElementById("billDetailId").value;
    const billId = document.getElementById("billId").value;
    const productId = document.getElementById("productId").value;
    const quantity = document.getElementById("quantity").value;
    const price = document.getElementById("price").value;

    // Kiểm tra tính hợp lệ của các dữ liệu
    if (!quantity || quantity <= 0 || !price || price <= 0) {
        alert("Vui lòng nhập số lượng và giá hợp lệ.");
        return;
    }

    const url = billDetailId ? `http://localhost:3000/bill-details/${billDetailId}` : "http://localhost:3000/bill-details/create";
    const method = billDetailId ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ billId, productId, quantity, price })
        });

        const data = await res.json();
        console.log("Response data:", data); // Debug response data

        if (res.ok) {
            alert(billDetailId ? "Cập nhật chi tiết hóa đơn thành công!" : "Tạo chi tiết hóa đơn thành công!");
            loadBillDetails(); // Tải lại bảng chi tiết hóa đơn
            clearForm();
        } else {
            console.error("Error data from server:", data); // In lỗi từ server ra console
            alert(data.error || "Lỗi khi xử lý chi tiết hóa đơn!");
        }
    } catch (err) {
        console.error("Lỗi khi tạo hoặc cập nhật chi tiết hóa đơn:", err); // In lỗi máy chủ ra console
        alert("Lỗi máy chủ!");
    }
}


async function loadBillDetails() {
    try {
        const res = await fetch("http://localhost:3000/bill-details");
        if (!res.ok) {
            console.error("Không thể tải chi tiết hóa đơn, mã lỗi: " + res.status);
            alert("Không thể tải chi tiết hóa đơn.");
            return;
        }

        const billDetails = await res.json();
        console.log("Dữ liệu chi tiết hóa đơn:", billDetails); // Kiểm tra dữ liệu trả về

        const tableBody = document.getElementById("billDetailsTableBody");
        tableBody.innerHTML = ""; // Clear current rows

        if (billDetails.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5'>Không có chi tiết hóa đơn nào.</td></tr>";
        }

        billDetails.forEach(billDetail => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${billDetail.billId ? `Hóa đơn #${billDetail.billId._id}` : 'N/A'}</td>
                <td>${billDetail.productId ? billDetail.productId.name : 'N/A'}</td>
                <td>${billDetail.quantity}</td>
                <td>${billDetail.price}</td>
                <td>
                    <button onclick="editBillDetail('${billDetail._id}')">Sửa</button>
                    <button onclick="deleteBillDetail('${billDetail._id}')">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error("Lỗi khi tải chi tiết hóa đơn:", err);
        alert("Lỗi máy chủ!");
    }
}

async function editBillDetail(billDetailId) {
    const res = await fetch(`http://localhost:3000/bill-details/${billDetailId}`);
    if (!res.ok) {
        console.error("Không thể tải chi tiết hóa đơn để sửa, mã lỗi: " + res.status);
        alert("Không thể tải chi tiết hóa đơn để sửa.");
        return;
    }

    const billDetail = await res.json();
    console.log(billDetail); // Kiểm tra thông tin chi tiết hóa đơn

    if (billDetail) {
        document.getElementById("billDetailId").value = billDetail._id;
        document.getElementById("billId").value = billDetail.billId._id;
        document.getElementById("productId").value = billDetail.productId._id;
        document.getElementById("quantity").value = billDetail.quantity;
        document.getElementById("price").value = billDetail.price;
    }
}
async function deleteBillDetail(billDetailId) {
    if (confirm("Bạn có chắc chắn muốn xóa chi tiết hóa đơn này?")) {
        try {
            const res = await fetch(`http://localhost:3000/bill-details/${billDetailId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    // Nếu có cần thêm token
                    // "Authorization": "Bearer " + token
                }
            });

            const data = await res.json();
            if (res.ok) {
                alert("Xóa chi tiết hóa đơn thành công!");
                loadBillDetails();
            } else {
                alert(data.error || "Xóa chi tiết hóa đơn thất bại!");
            }
        } catch (err) {
            console.error("Lỗi khi xóa chi tiết hóa đơn:", err);
            alert("Lỗi máy chủ!");
        }
    }
}

function clearForm() {
    document.getElementById("billDetailId").value = '';
    document.getElementById("billId").value = '';
    document.getElementById("productId").value = '';
    document.getElementById("quantity").value = '';
    document.getElementById("price").value = '';
}

// Gọi hàm tải dữ liệu khi DOM được tải
waitForElement('#billDetailsTableBody', loadBillDetails);
waitForElement('#createOrUpdateBillDetailForm', loadBillAndProductData);
