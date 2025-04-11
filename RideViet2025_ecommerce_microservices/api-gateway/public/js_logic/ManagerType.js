let editingTypeId = null;

// Hàm đợi phần tử có sẵn trong DOM
function waitForElement(selector, callback, interval = 100, timeout = 5000) {
    const start = Date.now();
    function check() {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else if (Date.now() - start > timeout) {
            console.warn(`Timeout: Element "${selector}" not found after ${timeout}ms`);
        } else {
            setTimeout(check, interval);
        }
    }
    check();
}

// Load form khi sẵn sàng
waitForElement("#typeForm", () => {
    document.getElementById("typeForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const typeData = {
            name: document.getElementById("typeName").value,
            image: document.getElementById("typeImage").value
        };

        const url = editingTypeId
            ? `http://localhost:3000/typeproducts/${editingTypeId}`
            : `http://localhost:3000/typeproducts/`;
        const method = editingTypeId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(typeData),
            });

            const result = await response.json();
            if (response.ok) {
                alert(editingTypeId ? "Product Type updated successfully!" : "Product Type created successfully!");
                this.reset();
                editingTypeId = null; // Reset để không bị nhầm
                loadTypes();
            } else {
                alert(result.error || "Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving product type.");
        }
    });

    // Load bảng sau khi form sẵn sàng
    waitForElement("#typeTableBody", () => {
        loadTypes();
    });
});

async function loadTypes() {
    try {
        const res = await fetch("http://localhost:3000/typeproducts");
        const typesList = await res.json();
        const tbody = document.getElementById("typeTableBody");
        tbody.innerHTML = "";

        typesList.forEach(type => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${type.name}</td>
                <td><img src="${type.image}" alt="type image" style="width: 100px; height: auto;" /></td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick="editType('${type._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteType('${type._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading types:", err);
    }
}

async function editType(id) {
    const res = await fetch(`http://localhost:3000/typeproducts/${id}`);
    const type = await res.json();

    if (!type || type.error) return alert("Product type not found!");

    document.getElementById("typeName").value = type.name;
    document.getElementById("typeImage").value = type.image;
    editingTypeId = id;
}

async function deleteType(id) {
    if (!confirm("Are you sure to delete this product type?")) return;
    try {
        const res = await fetch(`http://localhost:3000/typeproducts/${id}`, { method: "DELETE" });
        const data = await res.json();
        alert(data.message || data.error);
        loadTypes();
    } catch (err) {
        console.error("Error deleting product type:", err);
    }
}

function searchType() {
    const keyword = document.getElementById("searchType").value.toLowerCase();
    const rows = document.querySelectorAll("#typeTableBody tr");
    rows.forEach(row => {
        const title = row.children[0].innerText.toLowerCase();
        row.style.display = title.includes(keyword) ? "" : "none";
    });
}

function resetForm() {
    document.getElementById("typeForm").reset();
    editingTypeId = null; // Reset về chế độ tạo mới
}

waitForElement("#typeTableBody", (element) => {
    loadTypes(); 
});
