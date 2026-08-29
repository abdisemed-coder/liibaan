document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.querySelector('.primary-nav');
    const body = document.body;

    const closeNavigation = () => {
        if (!primaryNav || !navToggle) return;
        primaryNav.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
    };

    navToggle?.addEventListener('click', () => {
        if (!primaryNav) return;
        const isOpen = primaryNav.classList.toggle('is-open');
        navToggle.classList.toggle('is-active', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        body.classList.toggle('nav-open', isOpen);
    });

    primaryNav?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            closeNavigation();
        });
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            closeNavigation();
        }
    });

    const handleScroll = () => {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const orderForm = document.getElementById('order-form');

    if (orderForm) {
        const feedback = orderForm.querySelector('.form-feedback');

        orderForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (feedback) {
                feedback.textContent = '';
                feedback.classList.remove('is-error', 'is-success');
            }

            const hasRecaptcha = typeof grecaptcha !== 'undefined';

            if (hasRecaptcha && grecaptcha.getResponse().length === 0) {
                if (feedback) {
                    feedback.textContent = 'Please complete the reCAPTCHA before submitting.';
                    feedback.classList.add('is-error');
                }
                return;
            }

            const formData = new FormData(orderForm);

            try {
                if (feedback) {
                    feedback.textContent = 'Submitting your request...';
                    feedback.classList.remove('is-error', 'is-success');
                }

                const response = await fetch('process_order.php', {
                    method: 'POST',
                    body: formData,
                });

                const text = (await response.text()).trim();
                const isSuccess = response.ok && (text === '' || text.toLowerCase().includes('success'));
                const message = text || (isSuccess
                    ? 'Thank you! Our team will be in touch shortly.'
                    : 'Something went wrong. Please try again or contact us directly.');

                if (feedback) {
                    feedback.textContent = message;
                    feedback.classList.toggle('is-success', isSuccess);
                    feedback.classList.toggle('is-error', !isSuccess);
                }

                if (isSuccess) {
                    orderForm.reset();
                    if (hasRecaptcha) {
                        grecaptcha.reset();
                    }
                }
            } catch (error) {
                console.error('Submission error:', error);
                if (feedback) {
                    feedback.textContent = 'Something went wrong. Please try again or contact us directly.';
                    feedback.classList.add('is-error');
                }
            }
        });
    }
});
