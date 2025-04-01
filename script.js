document.addEventListener('DOMContentLoaded', () => {
    // Global cart variable
    let cart = [];

    // Function to load cart from localStorage
    function loadCart() {
        try {
            const storedCart = localStorage.getItem('cart');
            console.log('Loading cart from localStorage (index.html):', storedCart);
            cart = storedCart ? JSON.parse(storedCart) : [];
            if (!Array.isArray(cart)) {
                console.error('Cart data is not an array, resetting cart:', cart);
                cart = [];
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            cart = [];
        }
        return cart;
    }

    // Function to save cart to localStorage
    function saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Cart saved to localStorage (index.html):', cart);
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
            showNotification('Error saving cart. Please try again.', true);
        }
    }

    // Load cart on page load
    cart = loadCart();

    // DOM elements
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const modal = document.getElementById('cart-modal');
    const viewCartBtn = document.getElementById('view-cart-btn');
    const closeModal = document.getElementById('close-modal');
    const checkoutBtn = document.getElementById('checkout-btn');
    const notification = document.getElementById('notification');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const closeLogin = document.getElementById('close-login');

    // Check if user has already logged in this session
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        loginModal.style.display = 'flex';
    }

    // Handle login form submission (simulated)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username && password) {
            sessionStorage.setItem('isLoggedIn', 'true');
            loginModal.style.display = 'none';
            showNotification('Logged in successfully!');
        } else {
            showNotification('Please fill in all fields.', true);
        }
    });

    // Close login modal
    closeLogin.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // Show notification
    function showNotification(message, isError = false) {
        if (!notification) {
            console.error('Notification element not found!');
            return;
        }
        notification.textContent = message;
        notification.style.backgroundColor = isError ? '#ff4444' : '#4CAF50';
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Update cart count in the header
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
        cartCount.textContent = totalItems || 0;
        console.log('Updated cart count:', totalItems);
    }

    // Update cart modal content
    function updateCartModal() {
        if (!cartItems || !cartTotal) {
            console.error('Cart items or total element not found!');
            return;
        }
        cartItems.innerHTML = '';

        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center;">Your cart is empty.</p>';
            cartTotal.textContent = '0.00';
            console.log('Cart is empty in updateCartModal');
            return;
        }

        cart.forEach((item, index) => {
            const price = parseFloat(item.price);
            if (isNaN(price)) {
                console.error(`Invalid price for item ${item.name}: ${item.price}`);
                return;
            }
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} - ₹${price.toFixed(2)} x ${item.quantity}</span>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });

        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price);
            const quantity = item.quantity || 1;
            if (isNaN(price)) return sum;
            return sum + (price * quantity);
        }, 0);
        cartTotal.textContent = total.toFixed(2);
        console.log('Updated cart modal - Cart:', cart, 'Total:', total);
    }

    // Add item to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.vegetable-card');
            const name = card.getAttribute('data-name');
            const price = parseFloat(card.getAttribute('data-price'));

            if (!name || isNaN(price)) {
                showNotification('Error: Unable to add item to cart.', true);
                return;
            }

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            saveCart();
            updateCartCount();
            updateCartModal();
            showNotification(`${name} added to cart!`);
        });
    });

    // Remove item from cart
    window.removeFromCart = function(index) {
        const itemName = cart[index].name;
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        updateCartModal();
        showNotification(`${itemName} removed from cart!`);
    };

    // Open cart modal
    viewCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!sessionStorage.getItem('isLoggedIn')) {
            showNotification('Please login first!', true);
            loginModal.style.display = 'flex';
            return;
        }
        modal.style.display = 'block';
        updateCartModal();
    });

    // Close cart modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        console.log('Cart state on Checkout click:', cart);

        if (cart.length === 0) {
            showNotification('Your cart is empty!', true);
            return;
        }

        // Save cart before navigating
        saveCart();

        // Add a small delay to ensure localStorage write completes
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 100);
    });

    // Initialize cart count on page load
    updateCartCount();
    updateCartModal();
});