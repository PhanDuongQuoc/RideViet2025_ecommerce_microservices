// Đợi phần tử DOM được tải trước khi thực hiện các thao tác
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
        const res = await fetch("http://localhost:3000/roles");
        const roles = await res.json();

        const rolesTableBody = document.getElementById("rolesTableBody");
        rolesTableBody.innerHTML = "";

        roles.forEach(role => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${role.name}</td>
                <td>${role.description}</td>
                <td>
                    <button onclick="editRole('${role._id}')">Sửa</button>
                    <button onclick="deleteRole('${role._id}')">Xóa</button>
                </td>
            `;
            rolesTableBody.appendChild(row);
        });
    } catch (err) {
        console.error("Lỗi khi tải danh sách quyền:", err);
        alert("Lỗi máy chủ!");
    }
}

// Hàm thêm quyền mới
async function createRole(roleName, roleDescription) {
    try {
        const res = await fetch("http://localhost:3000/roles/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: roleName, description: roleDescription }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Thêm quyền thành công!");
            loadRoles();  // Tải lại danh sách quyền
        } else {
            alert(data.error || "Thêm quyền thất bại!");
        }
    } catch (err) {
        console.error("Lỗi khi thêm quyền:", err);
        alert("Lỗi máy chủ!");
    }
}

async function editRole(roleId) {
    const newRoleName = prompt("Nhập tên quyền mới:");
    const newRoleDescription = prompt("Nhập mô tả mới:");

    if (!newRoleName || !newRoleDescription) {
        alert("Tên quyền và mô tả không được bỏ trống!");
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/roles/${roleId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newRoleName,
                description: newRoleDescription,
            }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Sửa quyền thành công!");
            loadRoles();  // Tải lại danh sách quyền
        } else {
            alert(data.error || "Sửa quyền thất bại!");
        }
    } catch (err) {
        console.error("Lỗi khi sửa quyền:", err);
        alert("Lỗi máy chủ!");
    }
}

async function deleteRole(roleId) {
    if (confirm("Bạn có chắc chắn muốn xóa quyền này?")) {
        try {
            const res = await fetch(`http://localhost:3000/roles/${roleId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
                alert("Xóa quyền thành công!");
                loadRoles();  
            } else {
                alert(data.error || "Xóa quyền thất bại!");
            }
        } catch (err) {
            console.error("Lỗi khi xóa quyền:", err);
            alert("Lỗi máy chủ!");
        }
    }
}

waitForElement("#createRoleForm", (form) => {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const roleName = document.getElementById("roleName").value;
        const roleDescription = document.getElementById("roleDescription").value;

        createRole(roleName, roleDescription);  
    });
});

waitForElement("#rolesTableBody", (element) => {
    loadRoles(); 
});
