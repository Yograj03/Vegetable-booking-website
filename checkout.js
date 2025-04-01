document.addEventListener('DOMContentLoaded', () => {
    // Global cart variable
    let cart = [];

    // Function to load cart from localStorage
    function loadCart() {
        try {
            const storedCart = localStorage.getItem('cart');
            console.log('Loading cart from localStorage (checkout.html):', storedCart);
            cart = storedCart ? JSON.parse(storedCart) : [];
            if (!Array.isArray(cart)) {
                console.error('Cart data is not an array on checkout page, resetting cart:', cart);
                cart = [];
            }
        } catch (error) {
            console.error('Error loading cart from localStorage on checkout page:', error);
            cart = [];
        }
        return cart;
    }

    // Function to save cart to localStorage
    function saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Cart saved to localStorage (checkout.html):', cart);
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
            alert('Error saving cart. Please try again.');
        }
    }

    // Load cart on page load
    cart = loadCart();

    // Load last checkout items if available (for display after checkout)
    let lastCheckoutItems = [];
    try {
        const storedLastCheckout = localStorage.getItem('lastCheckoutItems');
        console.log('Last checkout items from localStorage:', storedLastCheckout);
        lastCheckoutItems = storedLastCheckout ? JSON.parse(storedLastCheckout) : [];
        if (!Array.isArray(lastCheckoutItems)) {
            console.error('Last checkout items data is not an array, resetting:', lastCheckoutItems);
            lastCheckoutItems = [];
        }
    } catch (error) {
        console.error('Error parsing lastCheckoutItems from localStorage:', error);
        lastCheckoutItems = [];
    }

    // DOM elements
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    const buyBtn = document.getElementById('buy-btn');

    // Display cart items on checkout page
    function displayCheckoutItems() {
        checkoutItems.innerHTML = '';

        // Use lastCheckoutItems if cart is empty (e.g., after checkout)
        const itemsToDisplay = cart.length > 0 ? cart : lastCheckoutItems;

        if (itemsToDisplay.length === 0) {
            checkoutItems.innerHTML = '<p>Your cart is empty.</p>';
            checkoutTotal.textContent = '0.00';
            console.log('No items to display (cart and lastCheckoutItems are empty)');
            return false; // Indicate that no items were displayed
        }

        itemsToDisplay.forEach(item => {
            const price = parseFloat(item.price);
            if (isNaN(price)) {
                console.error(`Invalid price for item ${item.name}: ${item.price}`);
                return;
            }
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} - ₹${price.toFixed(2)} x ${item.quantity}</span>
            `;
            checkoutItems.appendChild(cartItem);
        });

        const total = itemsToDisplay.reduce((sum, item) => {
            const price = parseFloat(item.price);
            const quantity = item.quantity || 1;
            if (isNaN(price)) return sum;
            return sum + (price * quantity);
        }, 0);
        checkoutTotal.textContent = total.toFixed(2);
        console.log('Displayed items:', itemsToDisplay, 'Total:', total);
        return true; // Indicate that items were displayed
    }

    // Display items and track if items were shown
    const itemsDisplayed = displayCheckoutItems();

    // Buy Now button
    buyBtn.addEventListener('click', () => {
        // Re-fetch cart to ensure it's up-to-date
        cart = loadCart();
        console.log('Cart state on Buy Now click:', cart);

        // If no items are in the cart and nothing was displayed, show the empty cart message
        if (cart.length === 0 && !itemsDisplayed) {
            alert('Your cart is empty!');
            return;
        }

        // If the cart is empty but items were displayed, use the displayed items
        if (cart.length === 0 && itemsDisplayed) {
            console.log('Cart is empty but items were displayed, using displayed items for checkout');
            cart = lastCheckoutItems.length > 0 ? lastCheckoutItems : cart;
        }

        // Double-check that we have items to process
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Store the current cart as lastCheckoutItems
        localStorage.setItem('lastCheckoutItems', JSON.stringify(cart));
        console.log('Saved lastCheckoutItems to localStorage:', cart);

        // Generate a random order number
        const orderNumber = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('orderNumber', orderNumber);
        console.log('Saved orderNumber to localStorage:', orderNumber);

        // Clear the cart
        cart = [];
        saveCart();
        console.log('Cart cleared from localStorage');

        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    });
});