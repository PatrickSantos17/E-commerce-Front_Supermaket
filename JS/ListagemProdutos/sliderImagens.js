// var swiper = new Swiper(".swiper", {
//     cssMode: true,
//     loop: true,
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//     pagination: {
//       el: ".swiper-pagination",
//     },
//     keyboard: true,
//   });

document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.swiper', {
        // Configurações do carrossel
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
    });
});