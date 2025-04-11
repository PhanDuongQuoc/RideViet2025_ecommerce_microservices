function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

// Load video form functionality
function loadVideoForm() {
    waitForElement("#videoForm", function (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            const videoData = {
                title: document.getElementById("videoTitle").value,
                url: document.getElementById("videoUrl").value,
                description: document.getElementById("videoDescription").value,
            };

            const url = editingVideoId 
                ? `http://localhost:3000/videos/${editingVideoId}` // URL for updating
                : `http://localhost:3000/videos/create`; // URL for creating

            const method = editingVideoId ? "PUT" : "POST"; // PUT if updating, POST if creating

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(videoData),
                });
                const result = await response.json();

                if (response.ok) {
                    alert(editingVideoId ? "Video updated successfully!" : "Video created successfully!");
                    this.reset();
                    editingVideoId = null;
                    loadVideos();
                } else {
                    alert(result.error || "Something went wrong.");
                }
            } catch (err) {
                console.error(err);
                alert("Error saving video.");
            }
        });
    });
}

// Load videos into the table
async function loadVideos() {
    try {
        const res = await fetch("http://localhost:3000/videos");
        const videoList = await res.json();
        const tbody = document.getElementById("videoTableBody");
        tbody.innerHTML = "";

        videoList.forEach(video => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${video.title}</td>
                <td><a href="${video.url}" target="_blank">Watch</a></td>
                <td>${video.description}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editVideo('${video._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVideo('${video._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading videos:", err);
    }
}

// Edit video
function editVideo(id) {
    waitForElement("#videoForm", async function () {
        try {
            const res = await fetch(`http://localhost:3000/videos/${id}`);
            const video = await res.json();
            
            if (!video) return alert("Video not found!");

            document.getElementById("videoTitle").value = video.title;
            document.getElementById("videoUrl").value = video.url;
            document.getElementById("videoDescription").value = video.description;
            document.getElementById("videoId").value = video._id; 
            editingVideoId = id; 
        } catch (err) {
            console.error("Error editing video:", err);
        }
    });
}

// Delete video
async function deleteVideo(id) {
    if (!confirm("Are you sure to delete this video?")) return;
    
    try {
        const res = await fetch(`http://localhost:3000/videos/${id}`, { method: "DELETE" });
        const data = await res.json();
        alert(data.message || data.error);
        loadVideos();
    } catch (err) {
        console.error("Error deleting video:", err);
    }
}

// Search video by title
function searchVideo() {
    const keyword = document.getElementById("searchVideo").value.toLowerCase();
    const rows = document.querySelectorAll("#videoTableBody tr");

    rows.forEach(row => {
        const title = row.children[0].innerText.toLowerCase();
        row.style.display = title.includes(keyword) ? "" : "none";
    });
}

// Initialize the page
waitForElement("#videoTableBody", loadVideos);
waitForElement("#videoForm", loadVideoForm);
