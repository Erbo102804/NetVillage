// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

let selectedTariff = null;
let currentOrder = null;

// Load tariffs on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTariffs();

    // Event listeners
    document.getElementById('cancel-order').addEventListener('click', () => {
        showSection('tariffs-section');
    });

    document.getElementById('order-form').addEventListener('submit', handleOrderSubmit);
    document.getElementById('proceed-payment').addEventListener('click', handlePayment);
});

async function loadTariffs() {
    try {
        const response = await fetch(`${API_BASE_URL}/tariffs/`);
        if (!response.ok) throw new Error('Failed to load tariffs');

        const tariffs = await response.json();
        displayTariffs(tariffs);
    } catch (error) {
        console.error('Error loading tariffs:', error);
        document.getElementById('tariffs-container').innerHTML =
            '<div class="error">Ошибка загрузки тарифов. Пожалуйста, обновите страницу.</div>';
    }
}

function displayTariffs(tariffs) {
    const container = document.getElementById('tariffs-container');

    if (tariffs.length === 0) {
        container.innerHTML = '<p>Тарифы не найдены</p>';
        return;
    }

    container.innerHTML = tariffs.map(tariff => `
        <div class="tariff-card" onclick="selectTariff(${tariff.id})">
            <h3>${tariff.name}</h3>
            <div class="tariff-speed">${tariff.speed}</div>
            <div class="tariff-price">${tariff.price} ₸<span>/мес</span></div>
            <p class="tariff-description">${tariff.description}</p>
            <ul class="tariff-features">
                ${tariff.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button class="btn btn-primary" style="width: 100%;">Выбрать</button>
        </div>
    `).join('');
}

function selectTariff(tariffId) {
    selectedTariff = tariffId;
    document.getElementById('tariff-id').value = tariffId;
    showSection('order-section');
}

async function handleOrderSubmit(e) {
    e.preventDefault();

    const formData = {
        tariff_id: parseInt(document.getElementById('tariff-id').value),
        customer_name: document.getElementById('customer-name').value,
        customer_email: document.getElementById('customer-email').value,
        customer_phone: document.getElementById('customer-phone').value,
        address: document.getElementById('address').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/orders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create order');
        }

        currentOrder = await response.json();
        showPaymentSection();
    } catch (error) {
        console.error('Error creating order:', error);
        alert('Ошибка при создании заказа: ' + error.message);
    }
}

function showPaymentSection() {
    const paymentDetails = document.getElementById('payment-details');
    paymentDetails.innerHTML = `
        <div class="success">
            <h3>Заказ #${currentOrder.id}</h3>
            <p><strong>Тариф:</strong> ${currentOrder.tariff_details.name}</p>
            <p><strong>Сумма:</strong> ${currentOrder.amount} ₸</p>
            <p><strong>Статус:</strong> ${getStatusText(currentOrder.status)}</p>
        </div>
    `;
    showSection('payment-section');
}

async function handlePayment() {
    if (!currentOrder) return;

    try {
        const response = await fetch(`${API_BASE_URL}/payments/kaspi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_id: currentOrder.id,
                payment_method: 'kaspi'
            })
        });

        if (!response.ok) throw new Error('Failed to create payment');

        const payment = await response.json();

        // Redirect to payment URL
        if (payment.payment_url) {
            window.location.href = payment.payment_url;
        } else {
            alert('Платеж создан! ID платежа: ' + payment.id);
        }
    } catch (error) {
        console.error('Error creating payment:', error);
        alert('Ошибка при создании платежа: ' + error.message);
    }
}

function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

function getStatusText(status) {
    const statuses = {
        'pending': 'Ожидает оплаты',
        'paid': 'Оплачен',
        'failed': 'Ошибка оплаты',
        'cancelled': 'Отменен'
    };
    return statuses[status] || status;
}
