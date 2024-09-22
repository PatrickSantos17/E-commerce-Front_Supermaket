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
let swiperInstance = null; 

document.addEventListener('DOMContentLoaded', function() {
    swiperInstance = new Swiper('.swiper', {
        // Configurações do carrossel
        loop: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
    });
});

function atualizarLoopSwiper(loopAtivo) {
    if(loopAtivo ==! swiperInstance.params.loop) {
        swiperInstance.params.loop = loopAtivo;
        console.log("LOOP ATUALIZADO - "+ swiperInstance.params.loop);
    }
}

function atualizarInstanciaSwiper() {
    swiperInstance.update();
    console.log("INSTANCIA ATUALIZADA")
}