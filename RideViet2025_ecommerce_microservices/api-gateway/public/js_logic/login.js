function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement("#loginForm", (loginForm) => {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        console.log("Đang gửi thông tin đăng nhập với Email:", email);

        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            console.log("Phản hồi từ server:", data);

            if (res.ok) {
                console.log("Đăng nhập thành công với tên người dùng:", data.username);
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("username", data.username);
                localStorage.setItem("email", data.email);

                console.log("Chuyển hướng đến trang chính...");
                loadPage("index.html");
            } else {
                document.getElementById("loginMessage").innerText = data.message || "Login failed!";
            }
        } catch (err) {
            console.error("Lỗi khi gửi yêu cầu đăng nhập:", err);
            document.getElementById("loginMessage").innerText = "Server error!";
        }
    });
});

waitForElement("#RegisterForm", (registerForm) => {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const full_name = document.getElementById("registerUsername").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const repeatPassword = document.getElementById("registerRepeatPassword").value;
        const phone_number = document.getElementById("phone").value;
        const date_of_birth = document.getElementById("dob").value;
        const gender = document.getElementById("gender").value;
        const address = document.getElementById("address").value;
        const roleId = document.getElementById("role").value;

        if (!roleId) {
            alert("Vui lòng chọn Role!");
            return;
        }

        if (password !== repeatPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    full_name,
                    email,
                    password,
                    phone_number,
                    date_of_birth,
                    gender: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase(),    
                    address,
                    roleId,
                }),
            });

            const data = await res.json();
            console.log("Phản hồi từ server:", data);

            if (res.ok) {
                alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
                loadPage("login.html");
            }  else {
                const message = data.message || data.error || "Đăng ký thất bại! Vui lòng thử lại.";
                alert(`${message}`);
            }
        } catch (err) {
            console.error("Lỗi khi gửi yêu cầu đăng ký:", err);
            alert("Lỗi máy chủ!");
        }
    });
});


async function loadRoles() {
    try {
      const response = await fetch("http://localhost:3000/roles"); 
      const roles = await response.json();
  
      const roleSelect = document.getElementById("role");
  
      roleSelect.innerHTML = `<option value="">-- Select role --</option>`;
  
      roles.forEach(role => {
        if (role.name.toLowerCase() === "admin") return;
      
        const option = document.createElement("option");
        option.value = role._id;
        option.textContent = role.name;
        roleSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Lỗi khi tải danh sách role:", err);
      alert("Không thể tải danh sách vai trò!");
    }
  }
  
  waitForElement("#role", loadRoles);




