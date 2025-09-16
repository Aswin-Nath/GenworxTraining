document.addEventListener("DOMContentLoaded", function () {
    const carousels = document.querySelectorAll(".carousel-container");

    carousels.forEach((container) => {
        const track = container.querySelector(".carousel-track");
        const cards = track.querySelectorAll(".card");
        const nextBtn = container.querySelector(".carousel-next");
        const prevBtn = container.querySelector(".carousel-prev");

        let currentIndex = 0;
        const cardsPerView = 1;
        
        function updateCarousel() {
            // Find the first card's width and the gap between cards
            const cardWidth = cards[0].offsetWidth;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 0; // Use parseFloat to get the numeric value of the gap

            // Calculate the total distance to move
            const totalMove = (cardWidth + gap) * currentIndex;

            // Apply the transform to the track
            track.style.transform = `translateX(-${totalMove}px)`;

            // Hide/show buttons at the ends of the carousel
            prevBtn.classList.toggle('hidden', currentIndex === 0);
            nextBtn.classList.toggle('hidden', currentIndex >= cards.length - cardsPerView);
        }

        // Initially hide the previous button
        updateCarousel();

        nextBtn.addEventListener("click", () => {
            currentIndex = Math.min(currentIndex + cardsPerView, cards.length - cardsPerView);
            updateCarousel();
        });

        prevBtn.addEventListener("click", () => {
            currentIndex = Math.max(currentIndex - cardsPerView, 0);
            updateCarousel();
        });
    });
});