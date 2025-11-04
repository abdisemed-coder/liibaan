document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('burger');
    const nav = document.querySelector('header nav ul');
    const header = document.querySelector('header');

    burger.addEventListener('click', function() {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initialize Swiper
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
        speed: 5000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        grabCursor: true,
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
        }
    });
});

function handleFormSubmission(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);

    fetch('process_order.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
       alert(data);

        if (data.trim() === 'Order submitted successfully!') {
            alert(data);
        } else {
            alert(data.trim());
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(data);
        alert(error);
    });
}
