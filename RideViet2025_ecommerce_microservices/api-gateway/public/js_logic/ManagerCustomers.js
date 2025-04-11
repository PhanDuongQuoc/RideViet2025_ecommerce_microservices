const apiUrl = 'http://localhost:3000/customer';
let currentPage = 1;
const limit = 5;
let currentSearch = "";

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

async function fetchCustomers(page = 1, search = "") {
    try {
        const res = await fetch(`${apiUrl}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
        const result = await res.json();

        const customerList = document.querySelector('#customerList');
        const pagination = document.querySelector('#pagination');

        customerList.innerHTML = '';
        result.data.forEach(c => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${c.name}</td>
                <td>${c.phone}</td>
                <td>${c.address}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editCustomer('${c._id}')">
                        <i class="bi bi-pencil-square"></i> Sửa
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${c._id}')">
                        <i class="bi bi-trash"></i> Xóa
                    </button>
                </td>
            `;
            customerList.appendChild(row);
        });

        let paginationHTML = '';

        if (page > 1) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="fetchCustomers(${page - 1}, '${currentSearch}')">«</a>
                </li>`;
        }

        for (let i = 1; i <= result.totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="fetchCustomers(${i}, '${currentSearch}')">${i}</a>
                </li>
            `;
        }

        if (page < result.totalPages) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="fetchCustomers(${page + 1}, '${currentSearch}')">»</a>
                </li>`;
        }

        pagination.innerHTML = `<ul class="pagination">${paginationHTML}</ul>`;
        currentPage = page;
        currentSearch = search;

    } catch (err) {
        console.error('Lỗi khi tải danh sách khách hàng:', err);
    }
}

waitForElement('#customerForm', (form) => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.querySelector('#name').value;
        const phone = document.querySelector('#phone').value;
        const address = document.querySelector('#address').value;
        const id = document.querySelector('#customerId').value;

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/${id}` : apiUrl;

        const customerData = { name, phone, address };

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            alert(id ? 'Cập nhật thành công!' : 'Thêm thành công!');
            form.reset();
            document.querySelector('#customerId').value = '';
            fetchCustomers(currentPage, currentSearch); 
        } catch (err) {
            alert('Lỗi: ' + err.message);
        }
    });
});

async function editCustomer(id) {
    try {
        const res = await fetch(`${apiUrl}/${id}`);
        const data = await res.json();

        waitForElement('#customerId', (el) => el.value = data._id);
        waitForElement('#name', (el) => el.value = data.name);
        waitForElement('#phone', (el) => el.value = data.phone);
        waitForElement('#address', (el) => el.value = data.address);
    } catch (err) {
        alert('Lỗi khi tải thông tin khách hàng');
    }
}

async function deleteCustomer(id) {
    if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
        try {
            const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            alert('Xóa thành công!');
            fetchCustomers(currentPage, currentSearch); 
        } catch (err) {
            alert('Lỗi khi xóa: ' + err.message);
        }
    }
}

waitForElement('#searchForm', (form) => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchValue = document.querySelector('#searchInput').value.trim();
        fetchCustomers(1, searchValue); // Tìm từ trang đầu
    });
});

waitForElement('#customerList', () => {
    fetchCustomers();
});
