


function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

async function loadRoles() {
    try {
        const response = await fetch("http://localhost:3000/roles");
        const roles = await response.json();
        const roleSelect = document.getElementById("createRole");
        roleSelect.innerHTML = `<option value="">-- Chọn vai trò --</option>`;
        roles.forEach(role => {
            const option = document.createElement("option");
            option.value = role._id;
            option.textContent = role.name;
            roleSelect.appendChild(option);
        });
    } catch (err) {
        console.error("Lỗi khi tải danh sách vai trò:", err);
        alert("Không thể tải danh sách vai trò!");
    }
}

// Function to handle user creation and updating
async function handleFormSubmit(e) {
    e.preventDefault();

    const full_name = document.getElementById("createUsername").value;
    const email = document.getElementById("createEmail").value;
    const password = document.getElementById("createPassword").value;
    const repeatPassword = document.getElementById("createRepeatPassword").value;
    const phone_number = document.getElementById("createPhone").value;
    const date_of_birth = document.getElementById("createDob").value;
    const gender = document.getElementById("createGender").value;
    const address = document.getElementById("createAddress").value;
    const roleId = document.getElementById("createRole").value;
    const terms = document.getElementById("createTerms").checked;
    const userId = document.getElementById("createUserForm").dataset.userId;

    if (!roleId) {
        alert("Vui lòng chọn vai trò!");
        return;
    }

    if (password !== repeatPassword) {
        alert("Mật khẩu không khớp!");
        return;
    }

    if (!terms) {
        alert("Vui lòng đồng ý với điều khoản!");
        return;
    }

    try {
        const url = userId ? `http://localhost:3000/users/${userId}` : "http://localhost:3000/users";
        const method = userId ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                full_name,
                email,
                password,
                phone_number,
                date_of_birth,
                gender,
                address,
                roleId,
            }),
        });

        const data = await res.json();
        console.log("Phản hồi từ server:", data);

        if (res.ok) {
            alert(userId ? "Cập nhật người dùng thành công!" : "Tạo người dùng thành công!");
            loadUsers();
            resetForm();
        } else {
            const message = data.message || data.error || (userId ? "Cập nhật người dùng thất bại!" : "Tạo người dùng thất bại!");
            alert(message);
        }
    } catch (err) {
        console.error("Lỗi khi gửi yêu cầu tạo hoặc cập nhật người dùng:", err);
        alert("Lỗi máy chủ!");
    }
}


async function loadUsers() {
    try {
        const res = await fetch("http://localhost:3000/users");
        const response = await res.json();
        users = response.data; // Cập nhật danh sách người dùng

        if (!Array.isArray(users) || users.length === 0) {
            alert("Không có người dùng nào để hiển thị!");
            return;
        }

        const userTableBody = document.getElementById("userTableBody");
        userTableBody.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.full_name || "Không có tên"}</td>
                <td>${user.email || "Không có email"}</td>
                <td>${user.phone_number || "Không có số điện thoại"}</td>
                <td>${user.date_of_birth || "Không có ngày sinh"}</td>
                <td>${user.gender || "Không có giới tính"}</td>
                <td>${user.address || "Không có địa chỉ"}</td>
                <td>${user.role_id ? user.role_id.name : "Không có vai trò"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editUser('${user._id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    } catch (err) {
        console.error("Lỗi khi tải danh sách người dùng:", err);
        alert("Lỗi máy chủ: Không thể tải dữ liệu người dùng!");
    }
}

// Edit user
function editUser(userId) {
    const user = users.find(user => user._id === userId); // Tìm người dùng trong mảng users

    if (user) {
        document.getElementById("createUsername").value = user.full_name;
        document.getElementById("createEmail").value = user.email;
        document.getElementById("createPhone").value = user.phone_number;
        document.getElementById("createDob").value = user.date_of_birth;
        document.getElementById("createGender").value = user.gender;
        document.getElementById("createAddress").value = user.address;
        document.getElementById("createRole").value = user.role_id._id;
        document.getElementById("createUserForm").dataset.userId = user._id;
    } else {
        console.error("Không tìm thấy người dùng với ID: ", userId);
    }
}

// Delete user
async function deleteUser(userId) {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        try {
            const res = await fetch(`http://localhost:3000/users/${userId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                alert("Xóa người dùng thành công!");
                loadUsers();
            } else {
                alert("Xóa người dùng thất bại!");
            }
        } catch (err) {
            console.error("Lỗi khi xóa người dùng:", err);
            alert("Lỗi máy chủ!");
        }
    }
}

function resetForm() {
    document.getElementById("createUserForm").reset(); 
    document.getElementById("createUserForm").dataset.userId = ''; 
}

waitForElement("#createRole", loadRoles);



document.getElementById("createUserForm").addEventListener("submit", handleFormSubmit);

waitForElement("#userTableBody", (element) => {
    loadUsers(); 
});
