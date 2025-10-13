document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт загружен'); // Для отладки
    
    // Инициализация на разных страницах
    if (window.location.pathname.includes('admin.html') || 
        window.location.pathname.endsWith('admin.html') ||
        document.getElementById('add-product-form')) {
        initAdminPage();
    }
    
    if (window.location.pathname.includes('products.html') || 
        window.location.pathname.endsWith('products.html') ||
        document.getElementById('products-container')) {
        initProductsPage();
    }
});

function initAdminPage() {
    console.log('Инициализация админ-панели');
    const productForm = document.getElementById('add-product-form');
    const productsList = document.getElementById('added-products-list');
    
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Форма отправлена');
            
            const name = document.getElementById('product-name').value;
            const description = document.getElementById('product-description').value;
            const price = document.getElementById('product-price').value;
            const image = document.getElementById('product-image').value;
            
            if (name && description && price && image) {
                addProduct(name, description, price, image);
                productForm.reset();
                showNotification('Товар успешно добавлен!', 'success');
            } else {
                showNotification('Заполните все поля!', 'error');
            }
        });
    }
    
    // Загрузка существующих товаров в админ-панель
    loadAdminProducts();
}

function initProductsPage() {
    console.log('Инициализация страницы товаров');
    loadProductsForProductsPage();
}

function addProduct(name, description, price, image) {
    const product = {
        id: Date.now(), // Уникальный ID на основе времени
        name: name,
        description: description,
        price: parseInt(price),
        image: image,
        date: new Date().toLocaleDateString('ru-RU')
    };
    
    console.log('Добавляем товар:', product);
    
    // Сохраняем в localStorage
    saveProductToStorage(product);
    
    // Обновляем отображение на обеих страницах
    updateProductsDisplay();
}

function saveProductToStorage(product) {
    let products = JSON.parse(localStorage.getItem('bakeryProducts')) || [];
    products.push(product);
    localStorage.setItem('bakeryProducts', JSON.stringify(products));
    console.log('Товары в localStorage:', products);
}

function loadAdminProducts() {
    const productsList = document.getElementById('added-products-list');
    if (!productsList) return;
    
    const products = JSON.parse(localStorage.getItem('bakeryProducts')) || [];
    console.log('Загружаем товары для админ-панели:', products);
    
    productsList.innerHTML = ''; // Очищаем контейнер
    
    products.forEach(product => {
        displayProductInAdmin(product);
    });
}

function displayProductInAdmin(product) {
    const productsList = document.getElementById('added-products-list');
    if (!productsList) return;
    
    const productElement = document.createElement('div');
    productElement.className = 'product-card';
    productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x180?text=Нет+изображения'">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">${product.price} ₽</p>
        <p><small>Добавлен: ${product.date}</small></p>
        <button onclick="removeProduct(${product.id})" class="btn-remove">Удалить</button>
    `;
    productsList.appendChild(productElement);
}

function loadProductsForProductsPage() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) {
        console.log('Контейнер товаров не найден');
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('bakeryProducts')) || [];
    console.log('Загружаем товары для страницы products:', products);
    
    // Добавляем новые товары из localStorage
    products.forEach(product => {
        // Проверяем, нет ли уже такого товара
        const existingProduct = Array.from(productsContainer.children).find(child => 
            child.querySelector('h3')?.textContent === product.name
        );
        
        if (!existingProduct) {
            const productElement = document.createElement('div');
            productElement.className = 'product-card new-product';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x180?text=Нет+изображения'">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${product.price} ₽</p>
                <div class="new-badge">Новинка!</div>
            `;
            productsContainer.appendChild(productElement);
        }
    });
}

function updateProductsDisplay() {
    // Обновляем обе страницы
    loadAdminProducts();
    loadProductsForProductsPage();
}

function removeProduct(productId) {
    let products = JSON.parse(localStorage.getItem('bakeryProducts')) || [];
    products = products.filter(product => product.id !== productId);
    localStorage.setItem('bakeryProducts', JSON.stringify(products));
    
    showNotification('Товар удален!', 'success');
    setTimeout(() => {
        location.reload();
    }, 1000);
}

function clearAllProducts() {
    if (confirm('Вы уверены, что хотите удалить все товары?')) {
        localStorage.removeItem('bakeryProducts');
        showNotification('Все товары удалены!', 'success');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

function showNotification(message, type) {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: bold;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Функция для проверки localStorage (для отладки)
function debugStorage() {
    console.log('Товары в localStorage:', JSON.parse(localStorage.getItem('bakeryProducts')) || []);
}