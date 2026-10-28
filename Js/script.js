    document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // FOOTER YEAR
    // =========================

    document.getElementById("year").textContent =
        new Date().getFullYear();


    // =========================
    // MENU SEARCH AND FILTERS
    // =========================

    const searchInput = document.getElementById("searchInput");
    const menuItems = [...document.querySelectorAll(".menu-item")];
    const filterButtons = [...document.querySelectorAll(".filter-btn")];
    const noResults = document.getElementById("noResults");

    let activeCategory = "all";

    function filterMenu() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        menuItems.forEach(item => {
            const name = item.dataset.name.toLowerCase();
            const category = item.dataset.category;

            const matchesSearch = name.includes(searchTerm);
            const matchesCategory =
                activeCategory === "all" || category === activeCategory;

            const shouldShow = matchesSearch && matchesCategory;

            item.classList.toggle("d-none", !shouldShow);

            if (shouldShow) {
                visibleCount++;
            }
        });

        noResults.classList.toggle("d-none", visibleCount > 0);
    }

    searchInput.addEventListener("input", filterMenu);

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");
            activeCategory = button.dataset.filter;

            filterMenu();
        });
    });


    // =========================
    // SHOPPING CART
    // =========================

    const cart = new Map();

    const cartCount = document.getElementById("cartCount");
    const cartButton = document.getElementById("cartButton");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    const cartModalElement = document.getElementById("cartModal");
    const cartModal = bootstrap.Modal.getOrCreateInstance(
        cartModalElement
    );

    function getCartQuantity() {
        let quantity = 0;

        cart.forEach(item => {
            quantity += item.quantity;
        });

        return quantity;
    }

    function getCartTotal() {
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
        });

        return total;
    }

    function updateCart() {
        cartCount.textContent = getCartQuantity();

        cartItems.replaceChildren();

        if (cart.size === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "text-center text-muted py-3";
            emptyMessage.textContent =
                "Your cart is empty. Add something delicious!";
            cartItems.appendChild(emptyMessage);
        }

        cart.forEach((item, name) => {
            const row = document.createElement("div");
            row.className = "cart-row";

            const details = document.createElement("div");

            const title = document.createElement("strong");
            title.textContent = name;

            const price = document.createElement("small");
            price.textContent =
                `$${(item.price * item.quantity).toFixed(2)}`;

            details.append(title, price);

            const quantityControls = document.createElement("div");
            quantityControls.className = "cart-quantity";

            const decrease = document.createElement("button");
            decrease.type = "button";
            decrease.textContent = "−";
            decrease.setAttribute(
                "aria-label",
                `Remove one ${name}`
            );

            decrease.addEventListener("click", () => {
                changeQuantity(name, -1);
            });

            const quantity = document.createElement("span");
            quantity.textContent = item.quantity;

            const increase = document.createElement("button");
            increase.type = "button";
            increase.textContent = "+";
            increase.setAttribute(
                "aria-label",
                `Add one ${name}`
            );

            increase.addEventListener("click", () => {
                changeQuantity(name, 1);
            });

            quantityControls.append(
                decrease,
                quantity,
                increase
            );

            row.append(details, quantityControls);
            cartItems.appendChild(row);
        });

        cartTotal.textContent = `$${getCartTotal().toFixed(2)}`;
    }

    function changeQuantity(name, amount) {
        const item = cart.get(name);

        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {
            cart.delete(name);
        }

        updateCart();
    }

    document.querySelectorAll(".add-cart").forEach(button => {
        button.addEventListener("click", () => {
            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            if (!name || !Number.isFinite(price) || price < 0) {
                return;
            }

            if (cart.has(name)) {
                cart.get(name).quantity++;
            } else {
                cart.set(name, {
                    price,
                    quantity: 1
                });
            }

            updateCart();

            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fa-solid fa-check"></i>';
            button.setAttribute("aria-label", `${name} added to cart`);

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.setAttribute("aria-label", `Add ${name} to cart`);
            }, 700);
        });
    });

    cartButton.addEventListener("click", () => {
        updateCart();
        cartModal.show();
    });

    document.getElementById("checkoutButton").addEventListener(
        "click",
        () => {
            if (cart.size === 0) {
                alert("Your cart is empty. Please add a meal first.");
                return;
            }

            alert(
                "Your demo cart is ready! A real checkout requires " +
                "an order-processing backend and payment integration."
            );
        }
    );

    updateCart();


    // =========================
    // CONTACT FORM
    // =========================

    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactStatus");

    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        contactStatus.textContent =
            "Thank you! The form works, but a backend or email service " +
            "must be connected to deliver your message.";

        contactStatus.className = "mt-3 mb-0 text-success";

        contactForm.reset();
    });


    // =========================
    // NEWSLETTER FORM
    // =========================

    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterStatus = document.getElementById("newsletterStatus");

    newsletterForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!newsletterForm.reportValidity()) return;

        newsletterStatus.textContent =
            "Thanks for your interest! Connect a newsletter service " +
            "to save your subscription.";

        newsletterStatus.className = "mt-2 mb-0 text-success";

        newsletterForm.reset();
    });
});