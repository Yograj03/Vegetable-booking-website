document.addEventListener('DOMContentLoaded', () => {
    const orderNumberElement = document.getElementById('order-number');
    const orderNumber = localStorage.getItem('orderNumber') || 'N/A';

    orderNumberElement.textContent = orderNumber;

    // Clear cart-related data
    try {
        localStorage.removeItem('cart');
        localStorage.removeItem('lastCheckoutItems');
        console.log('Cleared cart and lastCheckoutItems after confirmation');
    } catch (error) {
        console.error('Error clearing data after confirmation:', error);
    }
});