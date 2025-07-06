// Get references to our HTML elements
const productImages = document.querySelectorAll('.product-image');
const cartCountElement = document.getElementById('cart-count');
const totalPriceDisplay = document.getElementById('total-price-display');
const cartItemsList = document.getElementById('cart-items-list');
const relatedItemsSection = document.querySelector('.related-items-section');
const relatedProductsGrid = document.getElementById('related-products-grid');

// Initialize our cart array to store items
let cart = [];

// Define a product catalog with details including image paths and related item suggestions.
// IMPORTANT: Ensure the 'img' paths here match your actual file structure relative to index.html.
const productCatalog = {
    'pizza': {
        name: 'Pizza',
        price: 200.99,
        img: './assets/pizza.jpeg',
        related: ['fries', 'coke', 'burger', 'popcorn']
    },
    'burger': {
        name: 'Burger',
        price: 150.00,
        img: './assets/burger.jpeg',
        related: ['fries', 'coke', 'pizza', 'thumpsup']
    },
    'fries': {
        name: 'Fries',
        price: 75.00,
        img: './assets/fries.jpeg',
        related: ['burger', 'coke', 'pizza', 'samosa']
    },
    'coke': {
        name: 'Coke',
        price: 50.00,
        img: './assets/cocoCola.jpeg',
        related: ['pizza', 'burger', 'fries', 'popcorn']
    },
    'salad': {
        name: 'Side Salad',
        price: 350.00, // Corrected price to float for consistency
        img: './assets/salad.jpeg',
        related: ['pizza', 'burger', 'coke']
    },
    'popcorn': {
        name: 'Popcorn',
        price: 450.00, // Corrected price to float
        img: './assets/popcorn.jpeg',
        related: ['coke', 'thumpsup', 'fries']
    },
    'samosa': {
        name: 'Samosa',
        price: 50.00, // Corrected price to float
        img: './assets/samosa.jpeg',
        related: ['thumpsup', 'coke', 'fries']
    },
    'thumpsup': { // Corrected ID to match HTML data-product-id
        name: 'Thumps Up',
        price: 100.00, // Corrected price to float
        img: './assets/thumpsUp.jpeg',
        related: ['burger', 'coke', 'pizza', 'samosa']
    },
};


// Function to update the cart's visual display (count, total price, item list)
function updateCartDisplay() {
    let totalItemsInCart = 0;
    let totalPrice = 0;
    cartItemsList.innerHTML = ''; // Clear existing list items

    if (cart.length === 0) {
        // If cart is empty, display the "Your cart is empty" message
        cartItemsList.innerHTML = '<li class="empty-cart-message">Your cart is empty.</li>';
        // Hide the superscript cart count by removing the 'active' class
        cartCountElement.classList.remove('active');
    } else {
        // If there are items, remove any existing empty message
        const emptyMessage = cartItemsList.querySelector('.empty-cart-message');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        // Iterate through cart items to calculate totals and populate the list
        cart.forEach(item => {
            totalItemsInCart += item.quantity;
            totalPrice += item.price * item.quantity;

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsList.appendChild(listItem);
        });

        // Show the superscript cart count by adding the 'active' class
        cartCountElement.classList.add('active');
    }

    // Update the displayed total item count and total price
    cartCountElement.textContent = totalItemsInCart;
    totalPriceDisplay.textContent = totalPrice.toFixed(2); // Format to 2 decimal places for currency
}

// Function to add an item to the cart
function addItemToCart(productId) {
    const product = productCatalog[productId]; // Get product details from the catalog

    if (!product) {
        console.error(`Product with ID "${productId}" not found in catalog.`);
        return;
    }

    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // If item exists, just increment its quantity
        existingItem.quantity++;
    } else {
        // If it's a new item, add it to the cart array with quantity 1
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    // After modifying the cart, update the display and show related items
    updateCartDisplay();
    displayRelatedItems(productId); // Show related items for the product just added
}

// Function to display related items dynamically
function displayRelatedItems(currentProductId) {
    const product = productCatalog[currentProductId];
    relatedProductsGrid.innerHTML = ''; // Clear any previously displayed related items

    // Check if the current product has related items defined and if there are any
    if (product && product.related && product.related.length > 0) {
        let itemsToShow = 0; // Counter for items actually added
        // Loop through related product IDs
        product.related.forEach(relatedId => {
            const relatedProduct = productCatalog[relatedId];
            // Only display if the related product exists and is NOT ALREADY in the main cart
            if (relatedProduct && !cart.some(item => item.id === relatedId)) {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card'); // Use existing product-card style
                productCard.innerHTML = `
                    <img src="${relatedProduct.img}" alt="${relatedProduct.name}" class="product-image"
                         data-product-name="${relatedProduct.name}"
                         data-product-price="${relatedProduct.price}"
                         data-product-id="${relatedId}">
                    <h3>${relatedProduct.name}</h3>
                    <p>$${relatedProduct.price.toFixed(2)}</p>
                `;
                relatedProductsGrid.appendChild(productCard);
                itemsToShow++; // Increment counter for each item successfully added

                // Add click listener to the newly created related product image
                const newProductImage = productCard.querySelector('.product-image');
                newProductImage.addEventListener('click', () => {
                    addItemToCart(newProductImage.dataset.productId);
                    // Hide related items section after adding one from it
                    relatedItemsSection.style.display = 'none';
                });
            }
        });

        // Only show the section if there are actually items to display
        if (itemsToShow > 0) {
            relatedItemsSection.style.display = 'block';
        } else {
            relatedItemsSection.style.display = 'none'; // Hide if no valid related items to show
        }

    } else {
        relatedItemsSection.style.display = 'none'; // Hide if no related items are defined for the product
    }
}


// Add click event listeners to all initial product images on page load
productImages.forEach(image => {
    image.addEventListener('click', () => {
        const productId = image.dataset.productId; // Get the product ID from data attribute

        if (productId) {
            addItemToCart(productId); // Call function to add item to cart
        } else {
            console.warn('Could not add item: Missing product ID on image.');
        }
    });
});

// Initial update of the cart display when the page first loads
updateCartDisplay();