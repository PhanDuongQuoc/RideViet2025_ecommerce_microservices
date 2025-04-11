function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement(".carousel-inner", (carouselInner) => {
    console.log("Đã tìm thấy .carousel-inner, bắt đầu tải slide sản phẩm...");

    let slides = [];

    function renderSlides() {
        carouselInner.innerHTML = ""; 

        slides.forEach((slide, index) => {
            const slideItem = document.createElement("div");
            slideItem.classList.add("carousel-item");
            if (index === 0) slideItem.classList.add("active"); 

            const imagePath = `images/${slide.image}`;
            slideItem.innerHTML = `
                <div class="row">
                    <div class="col-md-7">
                        <div class="best_text">Great</div>
                        <div class="image_1"><img src="${imagePath}" class="d-block w-100"></div>
                    </div>
                    <div class="col-md-5">
                        <h1 class="banner_taital">New Model Cycle ${index + 1}</h1>
                        <p class="banner_text">Another slide with amazing content.</p>
                        <div class="contact_bt"><a onclick="loadPage('shop.html')">Shop Now</a></div>
                    </div>
                </div>
            `;

            carouselInner.appendChild(slideItem);
        });

        let carouselElement = document.getElementById("main_slider");
        let carouselInstance = new bootstrap.Carousel(carouselElement, {
            interval: 3000, 
            ride: "carousel"
        });
    }

    fetch("http://localhost:3000/slides")
        .then(response => response.json())
        .then(data => {
            slides = data;
            renderSlides();
        })
        .catch(error => console.error("Lỗi khi lấy danh sách sản phẩm:", error));
});
