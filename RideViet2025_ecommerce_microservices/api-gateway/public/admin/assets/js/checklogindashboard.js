
(function () {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role.toLowerCase() !== "admin") {
        alert("Bạn không có quyền truy cập trang này!");
        window.location.href = "/home-page"; 
    }
})();