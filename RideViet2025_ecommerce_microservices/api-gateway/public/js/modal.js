document.addEventListener("DOMContentLoaded", function () {
    var welcomeModal = new bootstrap.Modal(document.getElementById("welcomeModal"));
    welcomeModal.show();

    var slider = document.querySelector(".rideviet-slider-inner");
    var slides = document.querySelectorAll(".rideviet-slider-item");
    var currentIndex = 0;
    var totalSlides = slides.length;

    function goToSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        goToSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        goToSlide(currentIndex);
    }

    // Tự động chuyển slide mỗi 3 giây
    var autoSlide = setInterval(nextSlide, 3000);

    document.querySelector(".rideviet-slider-control-next").addEventListener("click", function () {
        nextSlide();
        resetAutoSlide();
    });

    document.querySelector(".rideviet-slider-control-prev").addEventListener("click", function () {
        prevSlide();
        resetAutoSlide();
    });

    function resetAutoSlide() {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, 3000);
    }

    // Đóng modal
    document.getElementById("closeModal").addEventListener("click", function () {
        var modal = document.getElementById("welcomeModal");
        welcomeModal.hide();

        setTimeout(() => {
            modal.classList.remove("show", "d-block");
            modal.setAttribute("aria-hidden", "true");

            document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
            document.body.classList.remove("modal-open");
        }, 500);
    });
});
