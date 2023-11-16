/*
- Telah membuat Produk yang dapat dilihat user => Terdapat pada index.html
- Telah membuat Keranjang yang dapat ditambahkan => addToCart(productId)
- Telah membuat diskon took dan menggunakan coupon => calculateDiscount()
- Telah membuat proses checkout => checkout()

- Telah membuat variable untuk menyimpan Data username dan jumlah item pada keranjang => cart = []; username = "";
- Telah membuat perhitungan untuk menghitung total harga pada setiap item yang ditambahkan => calculateDiscount();
- Telah membuat fungsi untuk menyimpan item pada keranjang => addToCart(productId);
- Telah membuat arrow function untuk menghitung total harga diskon => calculateTotalDiscount = () =>
- Telah membuat variable global untuk menghitung total dengan ongkos kirim => let grandTotal = 0;
- Telah membuat functional scope variable untuk menghitung diskon tambahan menggunakan coupon => calculateAdditionalDiscount()
- Telah membuat event pada tombol untuk melakukan checkout => checkout()
- Telah membuat Asyncshronous function untuk mendapatkan data product dari API
  https://6554347063cafc694fe63a4b.mockapi.io/api/v1/products => fetchProducts(), 
- Telah membuat Asyncshronous function untuk mendapatkan data Detail product dari API
  https://6554347063cafc694fe63a4b.mockapi.io/api/v1/details/${productId} => fetchProductDetails(),  
- Telah membuat class product => class Product {}
- Telah membuat Error Handling pada saat menggunakan API => handleApiError()
*/

let cart = [];
let username = "";
let couponDiscount = 0;
let total = 0;

// Variable global untuk menghitung total diskon
let totalDiscount = 0;

// Variable global untuk menghitung total dengan ongkos kirim
let grandTotal = 0;

class Product {
    constructor(id, name, price, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
    }

    createProductElement() {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.setAttribute('data-id', this.id);
        productElement.setAttribute('data-price', this.price);
        productElement.innerHTML = `<span>${this.name} - $${this.price}</span>
            <p>${this.description}</p>
            <input type="number" class="quantity" value="1" min="1">
            <button onclick="addToCart(${this.id})">Tambahkan ke Keranjang</button>`;
        return productElement;
    }
}

function handleApiError(response, context) {
    if (!response.ok) {
        throw new Error(`Gagal ${context}! Status: ${response.status}`);
    }
    return response.json();
}

async function fetchProducts() {
    try {
        const response = await fetch('https://6554347063cafc694fe63a4b.mockapi.io/api/v1/products');
        return handleApiError(response, 'mengambil data produk');
    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
}

async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`https://6554347063cafc694fe63a4b.mockapi.io/api/v1/details/${productId}`);
        return handleApiError(response, 'mengambil detail produk');
    } catch (error) {
        console.error('Error fetching product details:', error.message);
    }
}

async function fillProducts() {
    try {
        const productsData = await fetchProducts();
        const productsContainer = document.getElementById('products');

        for (const productData of productsData) {
            try {
                const details = await fetchProductDetails(productData.id);

                const product = new Product(productData.id, productData.name, productData.price, details.description);
                const productElement = product.createProductElement();
                productsContainer.appendChild(productElement);
            } catch (detailsError) {
                console.error('Error fetching product details:', detailsError.message);
            }
        }
    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
}

// Menambahkan produk ke dalam keranjang
function addToCart(productId) {
    const product = document.querySelector(`[data-id="${productId}"]`);
    const productName = product.textContent.split(' - ')[0];
    const productPrice = parseFloat(product.getAttribute('data-price'));
    const quantity = parseInt(product.querySelector('.quantity').value);

    // Memeriksa apakah produk sudah ada dalam keranjang
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            // Mengupdate jumlah jika produk sudah ada dalam keranjang
            cart[i].quantity += quantity;
            updateCart();
            return;
        }
    }

    // Menambahkan produk ke dalam keranjang
    cart.push({ id: productId, name: productName, price: productPrice, quantity: quantity });
    updateCart();
}

// Mengupdate tampilan keranjang
function updateCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    total = 0;

    cartItemsElement.innerHTML = '';

    // Menampilkan setiap item dalam keranjang
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
        cartItemsElement.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    // Menampilkan total harga
    totalElement.textContent = total.toFixed(2);
    // Mengupdate total keseluruhan
    updateGrandTotal();
}

// Fungsi untuk menghitung total diskon menggunakan arrow function
const calculateTotalDiscount = () => {
    const couponCode = "DISCOUNT20";

    // Fungsi fungsional (functional scope) untuk menghitung diskon tambahan menggunakan coupon
    const calculateAdditionalDiscount = () => {
        if (couponCode === "DISCOUNT20") {
            // Diskon tambahan 20 jika kupon DISCOUNT20 digunakan
            return 20;
        } else {
            // Tidak ada diskon tambahan jika kupon tidak digunakan
            return 0;
        }
    };

    // Menghitung diskon pada produk
    const discountPercentage = 0.1;
    const productDiscount = total * discountPercentage;
    // Menghitung total diskon termasuk kupon dan diskon tambahan
    totalDiscount = productDiscount + couponDiscount + calculateAdditionalDiscount();

    // Menampilkan diskon dan total diskon
    document.getElementById('discount').textContent = totalDiscount.toFixed(2);
    document.getElementById('totalDiscount').textContent = totalDiscount.toFixed(2);

    return totalDiscount;
};

// Mengupdate tampilan total keseluruhan
const updateGrandTotal = () => {
    const shippingCost = parseFloat(document.getElementById('shippingCost').textContent);
    const discount = calculateTotalDiscount();
    
    // Menghitung total dengan ongkos kirim
    grandTotal = total + shippingCost - discount;

    // Menampilkan total keseluruhan
    document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
};


// Menangani proses checkout
function checkout() {
    username = document.getElementById('username').value;
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Menampilkan pesan checkout
    alert(`Checkout berhasil!\nUsername: ${username}\nJumlah Item: ${itemCount}\nTotal Pembayaran: $${document.getElementById('grandTotal').textContent}`);
    
    // Mengosongkan keranjang dan username
    cart = [];
    username = "";
    couponDiscount = 0;
    document.getElementById('username').value = "";
    updateCart();
}



// Call function to show products
fillProducts();