function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

async function loadSlides() {
    try {
        const res = await fetch("http://localhost:3000/slides");
        const slides = await res.json();

        const table = document.getElementById("slidesTableBody");
        table.innerHTML = "";

        slides.forEach(slide => {
            const row = document.createElement("tr");
            const imagePath = `images/${slide.image}`;
            row.innerHTML = `
                <td>${slide.title}</td>
                <td><img src="${imagePath}" width="100" /></td>
                <td>
                    <button onclick="editSlide('${slide._id}')">Sửa</button>
                    <button onclick="deleteSlide('${slide._id}')">Xóa</button>
                </td>
            `;
            table.appendChild(row);
        });
    } catch (err) {
        console.error("Lỗi khi tải slide:", err);
        alert("Lỗi máy chủ!");
    }
}

async function createSlide(title, image) {
    try {
        const res = await fetch("http://localhost:3000/slides", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, image })
        });

        const data = await res.json();
        if (res.ok) {
            alert("Tạo slide thành công!");
            loadSlides();
        } else {
            alert(data.error || "Tạo slide thất bại!");
        }
    } catch (err) {
        console.error("Lỗi khi tạo slide:", err);
        alert("Lỗi máy chủ!");
    }
}

async function editSlide(id) {
    const newTitle = prompt("Nhập tiêu đề mới:");
    const newImage = prompt("Nhập đường dẫn ảnh mới:");

    if (!newTitle || !newImage) {
        alert("Thông tin không được bỏ trống!");
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/slides/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle, image: newImage })
        });

        const data = await res.json();
        if (res.ok) {
            alert("Cập nhật slide thành công!");
            loadSlides();
        } else {
            alert(data.error || "Cập nhật slide thất bại!");
        }
    } catch (err) {
        console.error("Lỗi khi cập nhật slide:", err);
        alert("Lỗi máy chủ!");
    }
}

async function deleteSlide(id) {
    if (confirm("Bạn có chắc chắn muốn xóa slide này?")) {
        try {
            const res = await fetch(`http://localhost:3000/slides/${id}`, {
                method: "DELETE"
            });

            const data = await res.json();
            if (res.ok) {
                alert("Xóa slide thành công!");
                loadSlides();
            } else {
                alert(data.error || "Xóa slide thất bại!");
            }
        } catch (err) {
            console.error("Lỗi khi xóa slide:", err);
            alert("Lỗi máy chủ!");
        }
    }
}

waitForElement("#createSlideForm", (form) => {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = document.getElementById("slideTitle").value;
        const image = document.getElementById("slideImage").value;
        createSlide(title, image);
    });
});

waitForElement("#slidesTableBody", () => {
    loadSlides();
});
