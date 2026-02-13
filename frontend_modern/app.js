// Modern NetVillage App - Real API Integration
const API_BASE_URL = 'http://localhost:8000/api';

// State Management
let selectedTariff = null;

// DOM Elements
const tariffsContainer = document.getElementById('tariffs-container');
const orderModal = document.getElementById('order-modal');
const orderForm = document.getElementById('order-form');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const cancelOrderBtn = document.getElementById('cancel-order');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadTariffs();
    initializeEventListeners();
    initSmoothScroll();
});

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Load Tariffs from API
async function loadTariffs() {
    try {
        const response = await fetch(`${API_BASE_URL}/tariffs/`);

        if (!response.ok) {
            throw new Error('Failed to load tariffs');
        }

        const tariffs = await response.json();
        renderTariffs(tariffs);
    } catch (error) {
        console.error('Error loading tariffs:', error);
        tariffsContainer.innerHTML = `
            <div class="error-message glass">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Не удалось загрузить тарифы. Попробуйте обновить страницу.</p>
            </div>
        `;
    }
}

// Render Tariffs
function renderTariffs(tariffs) {
    if (!tariffs || tariffs.length === 0) {
        tariffsContainer.innerHTML = `
            <div class="empty-message glass">
                <i class="fas fa-inbox"></i>
                <p>Тарифы временно недоступны</p>
            </div>
        `;
        return;
    }

    // Mark middle tariff as popular
    const middleIndex = Math.floor(tariffs.length / 2);

    tariffsContainer.innerHTML = tariffs.map((tariff, index) => `
        <div class="tariff-card glass ${index === middleIndex ? 'popular' : ''}" data-aos="fade-up" data-aos-delay="${index * 100}">
            ${index === middleIndex ? '<div class="popular-badge">Популярный</div>' : ''}
            <h3 class="tariff-name">${tariff.name}</h3>
            <div class="tariff-speed">
                <i class="fas fa-tachometer-alt"></i>
                ${tariff.speed}
            </div>
            <div class="tariff-price">${formatPrice(tariff.price)}₸</div>
            <div class="tariff-price-period">в месяц</div>
            <ul class="tariff-features">
                ${(tariff.features || []).map(feature => `
                    <li>${feature}</li>
                `).join('')}
            </ul>
            <button class="btn btn-primary" onclick="openOrderModal(${tariff.id}, '${tariff.name}', '${tariff.price}')">
                <i class="fas fa-bolt"></i>
                <span>Подключить</span>
            </button>
        </div>
    `).join('');
}

// Format Price
function formatPrice(price) {
    return new Intl.NumberFormat('ru-KZ').format(price);
}

// Open Order Modal
function openOrderModal(tariffId, tariffName, tariffPrice) {
    selectedTariff = { id: tariffId, name: tariffName, price: tariffPrice };
    document.getElementById('tariff-id').value = tariffId;
    orderModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close Order Modal
function closeOrderModal() {
    orderModal.classList.add('hidden');
    document.body.style.overflow = '';
    orderForm.reset();
    selectedTariff = null;
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Modal close events
    modalClose.addEventListener('click', closeOrderModal);
    cancelOrderBtn.addEventListener('click', closeOrderModal);
    modalOverlay.addEventListener('click', closeOrderModal);

    // Form submit
    orderForm.addEventListener('submit', handleOrderSubmit);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !orderModal.classList.contains('hidden')) {
            closeOrderModal();
        }
    });
}

// Handle Order Submit
async function handleOrderSubmit(e) {
    e.preventDefault();

    const submitButton = orderForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    try {
        // Disable button and show loading
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

        // Get form data
        const formData = {
            tariff_id: parseInt(document.getElementById('tariff-id').value),
            customer_name: document.getElementById('customer-name').value,
            customer_email: document.getElementById('customer-email').value,
            customer_phone: document.getElementById('customer-phone').value,
            address: document.getElementById('address').value
        };

        console.log('Sending order:', formData);

        // Send order to API
        const response = await fetch(`${API_BASE_URL}/orders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.details || 'Ошибка при создании заказа');
        }

        console.log('Order created successfully:', data);

        // Show success notification
        showNotification(
            `✅ Заказ успешно создан!<br>
            Тариф: ${selectedTariff.name}<br>
            Мы свяжемся с вами в ближайшее время.`,
            'success'
        );

        // Close modal
        closeOrderModal();

    } catch (error) {
        console.error('Error creating order:', error);
        showNotification(
            `❌ Ошибка: ${error.message}<br>
            Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.`,
            'error'
        );
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notification-message');

    // Create notification if doesn't exist
    if (!notification) {
        const notificationHTML = `
            <div id="notification" class="notification hidden">
                <div class="notification-content ${type === 'success' ? 'success' : 'error'}">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                    <div id="notification-message"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', notificationHTML);
    }

    const notif = document.getElementById('notification');
    const msg = document.getElementById('notification-message');

    msg.innerHTML = message;
    notif.classList.remove('hidden');

    // Auto hide after 5 seconds
    setTimeout(() => {
        notif.classList.add('hidden');
    }, 5000);
}

// Phone Input Formatting
document.getElementById('customer-phone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.startsWith('8')) {
        value = '7' + value.slice(1);
    }

    if (!value.startsWith('7')) {
        value = '7' + value;
    }

    value = value.slice(0, 11);

    let formatted = '+7';
    if (value.length > 1) {
        formatted += ' ' + value.slice(1, 4);
    }
    if (value.length > 4) {
        formatted += ' ' + value.slice(4, 7);
    }
    if (value.length > 7) {
        formatted += ' ' + value.slice(7, 9);
    }
    if (value.length > 9) {
        formatted += ' ' + value.slice(9, 11);
    }

    e.target.value = formatted;
});

// Scroll animations
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        navbar.querySelectorAll('.nav-link, .logo span').forEach(el => {
            el.style.color = 'var(--dark)';
        });
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.1)';
        navbar.style.boxShadow = 'none';
        navbar.querySelectorAll('.nav-link, .logo span').forEach(el => {
            el.style.color = 'var(--white)';
        });
    }
    lastScrollY = window.scrollY;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

console.log('🚀 NetVillage Modern App Loaded');
console.log('📡 API Base URL:', API_BASE_URL);
