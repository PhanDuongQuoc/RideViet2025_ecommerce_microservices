let products = []; // Biến toàn cục lưu danh sách sản phẩm

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) callback(element);
    else setTimeout(() => waitForElement(selector, callback), 100);
}

// Load danh mục sản phẩm
async function loadCategories() {
    try {
        const res = await fetch("http://localhost:3000/typeproducts");
        const categories = await res.json();
        const categorySelect = document.getElementById("productCategory");
        categorySelect.innerHTML = `<option value="">Chọn danh mục</option>`;
        categories.forEach(c => {
            const option = document.createElement("option");
            option.value = c._id;
            option.textContent = c.name;
            categorySelect.appendChild(option);
        });
    } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
        alert("Lỗi máy chủ!");
    }
}

// Load sản phẩm
async function loadProducts() {
    try {
        const res = await fetch("http://localhost:3000/products");
        const response = await res.json();
        products = response; // Lưu danh sách vào biến toàn cục

        const tbody = document.getElementById("productTableBody");
        tbody.innerHTML = "";

        products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.category?.name || 'Không xác định'}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" onclick="editProduct('${product._id}')">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        alert("Lỗi máy chủ!");
    }
}

// Gửi form (tạo mới hoặc cập nhật sản phẩm)
async function handleProductFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const description = document.getElementById("productDescription").value;
    const image = document.getElementById("productImage").value;
    const category = document.getElementById("productCategory").value;
    const form = document.getElementById("productForm");
    const productId = form.dataset.productId;

    if (!name || !price || !description || !image || !category) {
        alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
        return;
    }

    try {
        const url = productId ? `http://localhost:3000/products/${productId}` : "http://localhost:3000/products";
        const method = productId ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, description, image, category })
        });

        const data = await res.json();

        if (res.ok) {
            alert(productId ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!");
            resetForm();
            loadProducts();
        } else {
            alert(data.error || "Có lỗi xảy ra!");
        }
    } catch (err) {
        console.error("Lỗi khi gửi sản phẩm:", err);
        alert("Lỗi máy chủ!");
    }
}

// Sửa sản phẩm
function editProduct(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return console.error("Không tìm thấy sản phẩm!");

    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productImage").value = product.image;
    document.getElementById("productCategory").value = product.category?._id || "";

    document.getElementById("productForm").dataset.productId = product._id;
    document.getElementById("formTitle").textContent = "Cập nhật sản phẩm";
    document.getElementById("addProductButton").innerHTML = `<i class="bi bi-save"></i> Lưu thay đổi`;
}

// Xóa sản phẩm
async function deleteProduct(productId) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
        const res = await fetch(`http://localhost:3000/products/${productId}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
            alert("Xóa thành công!");
            loadProducts();
        } else {
            alert(data.error || "Xóa thất bại!");
        }
    } catch (err) {
        console.error("Lỗi khi xóa:", err);
        alert("Lỗi máy chủ!");
    }
}

// Reset form
function resetForm() {
    const form = document.getElementById("productForm");
    form.reset();
    delete form.dataset.productId;
    document.getElementById("formTitle").textContent = "Thêm sản phẩm mới";
    document.getElementById("addProductButton").innerHTML = `<i class="bi bi-plus"></i> Thêm sản phẩm`;
}

// Gắn các sự kiện sau khi DOM load
waitForElement("#productCategory", loadCategories);
waitForElement("#productTableBody", loadProducts);

document.getElementById("productForm").addEventListener("submit", handleProductFormSubmit);
