let editingNewsId = null;

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
waitForElement("#newsForm", () => {
    document.getElementById("newsForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const newsData = {
            name: document.getElementById("newsTitle").value,
            image: document.getElementById("newsImage").value,
            content: document.getElementById("newsContent").value,
            author: document.getElementById("newsAuthor").value,
            category: document.getElementById("newsCategory").value,
            tags: document.getElementById("newsTags").value,
            views: Number(document.getElementById("newsViews").value),
        };

        const url = editingNewsId
            ? `http://localhost:3000/news/${editingNewsId}`
            : `http://localhost:3000/news/create`;
        const method = editingNewsId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newsData),
            });

            const result = await response.json();
            if (response.ok) {
                alert(editingNewsId ? "News updated successfully!" : "News created successfully!");
                this.reset();
                editingNewsId = null; // QUAN TRỌNG: Reset để không bị nhầm
                loadNews();
            } else {
                alert(result.error || "Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving news.");
        }
    });

    // Load bảng sau khi form sẵn sàng
    waitForElement("#newsTableBody", () => {
        loadNews();
    });
});

async function loadNews() {
    try {
        const res = await fetch("http://localhost:3000/news");
        const newsList = await res.json();
        const tbody = document.getElementById("newsTableBody");
        tbody.innerHTML = "";

        newsList.forEach(news => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${news.name}</td>
                <td><img src="${news.image}" alt="news image" style="width: 100px; height: auto;" /></td>
                <td>${news.content}</td>
                <td>${news.author}</td>
                <td>${news.category}</td>
                <td>${news.views}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick="editNews('${news._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteNews('${news._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading news:", err);
    }
}

async function editNews(id) {
    const res = await fetch(`http://localhost:3000/news/${id}/limit`);
const text = await res.text();

try {
    const news = JSON.parse(text);
    console.log("kết quả là:", news);
    if (!news || news.error) return alert("News not found!");

    document.getElementById("newsTitle").value = news.name;
    document.getElementById("newsImage").value = news.image;
    document.getElementById("newsContent").value = news.content;
    document.getElementById("newsAuthor").value = news.author;
    document.getElementById("newsCategory").value = news.category;
    document.getElementById("newsTags").value = news.tags;
    document.getElementById("newsViews").value = news.views;
    editingNewsId = id;
} catch (err) {
    console.error("Không phải JSON:", text);
    alert("Server trả về dữ liệu không hợp lệ.");
}
}

async function deleteNews(id) {
    if (!confirm("Are you sure to delete this news?")) return;
    try {
        const res = await fetch(`http://localhost:3000/news/${id}`, { method: "DELETE" });
        const data = await res.json();
        alert(data.message || data.error);
        loadNews();
    } catch (err) {
        console.error("Error deleting news:", err);
    }
}

function searchNews() {
    const keyword = document.getElementById("searchNews").value.toLowerCase();
    const rows = document.querySelectorAll("#newsTableBody tr");
    rows.forEach(row => {
        const title = row.children[0].innerText.toLowerCase();
        row.style.display = title.includes(keyword) ? "" : "none";
    });
}

function resetForm() {
    document.getElementById("newsForm").reset();
    editingNewsId = null; // Reset về chế độ tạo mới
}

waitForElement("#newsTableBody", (element) => {
    loadNews(); 
});
