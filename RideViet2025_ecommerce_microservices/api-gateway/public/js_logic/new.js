function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement(".news-container", (newsContainer) => {
    let newsList = [];
    let currentPage = 1;
    const newsPerPage = 6;

    function renderNews() {
        newsContainer.innerHTML = "";
        const startIndex = (currentPage - 1) * newsPerPage;
        const endIndex = startIndex + newsPerPage;
        const currentNews = newsList.slice(startIndex, endIndex);

        currentNews.forEach((news) => {
            const newsItem = document.createElement("div");
            newsItem.classList.add("col-md-4");

            newsItem.innerHTML = `
                <div class="card mb-4">
                    <img src="${news.image}" class="card-img-top" alt="${news.name}">
                    <div class="card-body">
                        <h5 class="card-title">${news.name}</h5>
                        <p class="card-text">${news.content.substring(0, 100)}...</p>
                        <a href="news-detail.html?id=${news._id}" class="btn btn-primary">Xem chi tiết</a>
                    </div>
                </div>
            `;

            newsContainer.appendChild(newsItem);
        });

        LoadNewTopList();
        renderPagination();
    }






    function LoadNewTopList() {
        fetch(`http://localhost:3000/news/topnews`)
            .then(response => response.json())
            .then(newsList => {
                const newsContainer = document.querySelector(".top-news-container");
                newsContainer.innerHTML = "";
    
                if (newsList.length === 0) {
                    newsContainer.innerHTML = "<p class='text-center text-danger'>Không có bản tin nào</p>";
                    return;
                }
    
                newsList.forEach(news => {
                    const newsItem = document.createElement("a");
                    newsItem.href = `news-detail.html?id=${news._id}`;
                    newsItem.classList.add("list-group-item", "list-group-item-action", "d-flex", "align-items-center");
    
                    newsItem.innerHTML = `
                        <img src="${news.image}" class="rounded me-3" alt="${news.name}" width="50" height="50">
                        <div>
                            <h6 class="mb-1">${news.name}</h6>
                            <small class="text-muted">${news.content.substring(0, 50)}...</small>
                        </div>
                    `;
    
                    newsContainer.appendChild(newsItem);
                });
            })
            .catch(error => console.error("Lỗi khi tải bản tin:", error));
    }
    


  

    function renderPagination() {
        const paginationContainer = document.querySelector(".pagination-container");
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(newsList.length / newsPerPage);

        if (totalPages > 1) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "Trước";
            prevButton.classList.add("btn", "btn-secondary", "me-2");
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderNews();
                }
            });
            paginationContainer.appendChild(prevButton);

            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement("button");
                pageButton.textContent = i;
                pageButton.classList.add("btn", "btn-light", "me-2");
                if (i === currentPage) {
                    pageButton.classList.add("btn-primary");
                }
                pageButton.addEventListener("click", () => {
                    currentPage = i;
                    renderNews();
                });
                paginationContainer.appendChild(pageButton);
            }

            const nextButton = document.createElement("button");
            nextButton.textContent = "Sau";
            nextButton.classList.add("btn", "btn-secondary");
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderNews();
                }
            });
            paginationContainer.appendChild(nextButton);
        }
    }

    fetch("http://localhost:3000/news")
        .then(response => response.json())
        .then(data => {
            newsList = data;
            renderNews();
        })
        .catch(error => console.error("Lỗi khi lấy danh sách tin tức:", error));
});


