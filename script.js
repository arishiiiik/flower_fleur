

//----------------------ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ---------------

document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Закрываем все открытые элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Переключаем текущий элемент
            item.classList.toggle('active');
        });
    });
});



document.addEventListener('DOMContentLoaded', function () {
    const track = document.getElementById('testimonialsTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    const nav = document.getElementById('testimonialsNav');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');

    let currentSlide = 0;
    let autoPlayInterval;
    const slideInterval = 5000; // 5 секунд

    // Создаем точки навигации
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        nav.appendChild(dot);
    });

    const dots = document.querySelectorAll('.nav-dot');

    // Функция перехода к слайду
    function goToSlide(slideIndex) {
        // Скрываем все слайды
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Скрываем все точки
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Обновляем текущий слайд
        currentSlide = slideIndex;

        // Показываем новый слайд
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        // Сбрасываем и запускаем прогресс-бар
        resetProgressBar();
    }

    // Следующий слайд
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        goToSlide(nextIndex);
    }

    // Предыдущий слайд
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1;
        goToSlide(prevIndex);
    }

    // Сброс прогресс-бара
    function resetProgressBar() {
        progressBar.classList.remove('active');
        void progressBar.offsetWidth; // Перезапуск анимации
        progressBar.classList.add('active');
    }

    // Автоплей
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, slideInterval);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Обработчики событий
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    // Пауза автоплея при наведении
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Запускаем автоплей и прогресс-бар
    startAutoPlay();
    resetProgressBar();

    // Добавляем поддержку свайпов на мобильных устройствах
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                nextSlide();
            } else {
                // Свайп вправо - предыдущий слайд
                prevSlide();
            }
            stopAutoPlay();
            startAutoPlay();
        }
    }
});



// ---------------КОРЗИНА ТОВАРОВ---------------------
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.title === product.title);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showAddToCartNotification(product.title);
    }

    removeItem(title) {
        this.items = this.items.filter(item => item.title !== title);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(title, quantity) {
        const item = this.items.find(item => item.title === title);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(title);
            } else {
                this.saveCart();
                this.updateCartCount();
            }
        }
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => {
            const price = parseInt(item.price.replace(/\s/g, '').replace('₽', ''));
            return total + (price * item.quantity);
        }, 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }
    }

    showAddToCartNotification(productName) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <span>✓ Товар "${productName}" добавлен в корзину</span>
        `;

        document.body.appendChild(notification);

        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Убираем уведомление через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    clear() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    }
}

// Инициализация корзины
const cart = new Cart();

// Модальное окно корзины
class CartModal {
    constructor() {
        this.modal = document.getElementById('cart-modal');
        this.init();
    }

    init() {
        // Обработчик клика на иконку корзины в основном меню
        const mainCartIcon = document.querySelector('.menu .cart-icon');
        if (mainCartIcon) {
            mainCartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }

        // Обработчик клика на иконку корзины в бургер-меню
        const burgerCartIcon = document.querySelector('.burger-modal .cart-icon');
        if (burgerCartIcon) {
            burgerCartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                // Закрыть бургер-меню
                document.getElementById('burger-toggle').checked = false;
                // Открыть модальное окно корзины
                this.open();
            });
        }

        // Закрытие модального окна
        const closeBtn = this.modal.querySelector('.close');
        closeBtn.addEventListener('click', () => this.close());

        // Обработчик клика вне модального окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Кнопка "Продолжить покупки"
        const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => this.close());
        }
    }

    open() {
        this.render();
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }


    render() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const emptyCart = document.getElementById('empty-cart');
        const cartContent = document.getElementById('cart-content');

        if (cart.items.length === 0) {
            emptyCart.style.display = 'block';
            cartContent.style.display = 'none';
        } else {
            emptyCart.style.display = 'none';
            cartContent.style.display = 'block';

            // Очищаем содержимое
            cartItems.innerHTML = '';

            // Добавляем товары
            cart.items.forEach(item => {
                const price = parseInt(item.price.replace(/\s/g, '').replace('₽', ''));
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p class="cart-item-price">${item.price}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" data-title="${item.title}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-title="${item.title}">+</button>
                        <button class="remove-btn" data-title="${item.title}">×</button>
                    </div>
                `;
                cartItems.appendChild(itemElement);
            });

            // Обновляем общую сумму
            cartTotal.textContent = this.formatPrice(cart.getTotalPrice());
        }

        // Добавляем обработчики событий для кнопок
        this.addEventListeners();
    }

    addEventListeners() {
        // Кнопки увеличения количества
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.target.getAttribute('data-title');
                const item = cart.items.find(item => item.title === title);
                if (item) {
                    cart.updateQuantity(title, item.quantity + 1);
                    this.render();
                }
            });
        });

        // Кнопки уменьшения количества
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.target.getAttribute('data-title');
                const item = cart.items.find(item => item.title === title);
                if (item) {
                    cart.updateQuantity(title, item.quantity - 1);
                    this.render();
                }
            });
        });

        // Кнопки удаления
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.target.getAttribute('data-title');
                cart.removeItem(title);
                this.render();
            });
        });

        // Кнопка оформления заказа
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.addEventListener('click', () => {
            this.checkout();
        });
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    }

    checkout() {
        if (cart.items.length === 0) return;

        // Показываем уведомление
        this.showOrderNotification();

        // Очищаем корзину
        cart.clear();

        // Закрываем модальное окно корзины
        this.close();

        // Перезагружаем корзину (если открыта)
        this.render();
    }

    showOrderNotification() {
        const notification = document.createElement('div');
        notification.className = 'order-notification';
        notification.innerHTML = `
            <div class="order-notification-content">
                <h3>✓ Заказ оформлен!</h3>
                <p>С вами свяжется наш менеджер для подтверждения заказа в течение 15 минут.</p>
                <p>Спасибо за ваш заказ! 🌸</p>
                <button class="notification-close-btn">OK</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Обработчик закрытия уведомления
        const closeBtn = notification.querySelector('.notification-close-btn');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    // Инициализация модального окна корзины
    new CartModal();

    // Обработчик для кнопки "Добавить в корзину" в модальном окне товара
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            const product = {
                image: document.getElementById('modal-img').src,
                title: document.getElementById('modal-title').textContent,
                price: document.getElementById('modal-price').textContent,
                description: document.getElementById('modal-description').textContent
            };

            cart.addItem(product);
        });
    }

    // Обработчики для кнопок "подробнее" (ваш существующий код)
    const modal = document.getElementById('bouquet-modal');
    const closeBtn = document.querySelector('.close');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalComposition = document.getElementById('modal-composition');
    const modalHeight = document.getElementById('modal-height');
    const modalDiameter = document.getElementById('modal-diameter');
    const modalSeason = document.getElementById('modal-season');
    const modalPackaging = document.getElementById('modal-packaging');
    const modalCare = document.getElementById('modal-care');
    const modalPrice = document.getElementById('modal-price');
    const modalOldPrice = document.getElementById('modal-old-price');
    const wishlistBtn = document.getElementById('wishlist-btn');

    const detailButtons = document.querySelectorAll('.details-btn');

    detailButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Получаем данные
            const image = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const composition = this.getAttribute('data-composition');
            const height = this.getAttribute('data-height');
            const diameter = this.getAttribute('data-diameter');
            const season = this.getAttribute('data-season');
            const packaging = this.getAttribute('data-packaging');
            const care = this.getAttribute('data-care');
            const rating = this.getAttribute('data-rating');
            const reviews = this.getAttribute('data-reviews');
            const price = this.getAttribute('data-price');
            const oldPrice = this.getAttribute('data-old-price');
            const badge = this.getAttribute('data-badge');

            // Заполняем модальное окно
            modalImg.src = image;
            modalImg.alt = title;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalHeight.textContent = height;
            modalDiameter.textContent = diameter;
            modalSeason.textContent = season;
            modalPackaging.textContent = packaging;
            modalCare.textContent = care;
            modalPrice.textContent = price;
            modalOldPrice.textContent = oldPrice;

            // Заполняем состав букета
            modalComposition.innerHTML = '';
            if (composition) {
                const items = composition.split(',');
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.trim();
                    modalComposition.appendChild(li);
                });
            }

            // Обновляем рейтинг
            updateRating(rating, reviews);

            // Обновляем бейджи
            updateBadges(badge);

            // Показываем модальное окно
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Функция обновления рейтинга
    function updateRating(rating, reviews) {
        const stars = document.querySelectorAll('.star');
        const ratingValue = document.querySelector('.rating-value');
        const reviewsCount = document.querySelector('.reviews-count');

        ratingValue.textContent = rating;
        reviewsCount.textContent = `(${reviews} отзыва)`;

        const numericRating = parseFloat(rating);
        stars.forEach((star, index) => {
            if (index < Math.floor(numericRating)) {
                star.style.color = '#FFD700';
            } else {
                star.style.color = '#ddd';
            }
        });
    }

    // Функция обновления бейджей
    function updateBadges(badge) {
        const badges = document.querySelector('.image-badges');
        badges.innerHTML = '';

        if (badge === 'popular') {
            badges.innerHTML = '<span class="badge popular">Популярный</span>';
        } else if (badge === 'new') {
            badges.innerHTML = '<span class="badge new">Новый</span>';
        } else if (badge === 'luxury') {
            badges.innerHTML = '<span class="badge luxury">Люкс</span>';
        } else if (badge === 'sale') {
            badges.innerHTML = '<span class="badge sale">Скидка</span>';
        } else if (badge === 'exclusive') {
            badges.innerHTML = '<span class="badge exclusive">Эксклюзив</span>';
        }
    }


    // Обработчики закрытия модального окна товара
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function (event) {
        if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeModal();
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        wishlistBtn.classList.remove('active');
    }
});
