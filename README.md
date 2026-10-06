# LuxeCart — Your Shopping Application
### Complete, Modern, Mobile-Friendly E-Commerce Web Application (Diploma Project)

**LuxeCart** (Your Shopping Application) is a modern, responsive, mobile-first e-commerce single-page application built with **React** on the frontend, **Node.js + Express** on the backend, and **MongoDB** (with Mongoose schemas and auto-fallback storage) on the database layer.

---

## 🌟 Key Features & Requirements Met

1. **WebApp Opening / Splash Screen**:
   - Modern e-commerce opening screen with glowing icon, pulse animations, and progress bar.
   - Branded as: **"LuxeCart - Your Shopping Application"**.
   - Smoothly auto-advances to the Home page after a short moment (with a manual "Skip" option).

2. **Home Page**:
   - **Header**: Logo, App Name, functional Search Bar, Notification bell with live badge and dropdown, and Profile icon.
   - **Horizontally Scrollable Categories**: Shoes, Bags, Makeup, Women, Men, Home Decor, Home Utilities, Electronics, Accessories, Beauty, Fashion.
   - **Promotional Hero Banner**: Festive Grand Sale banner with interactive call-to-action.
   - **Clearly Separated Sections**:
     - *Trending Shoes & Sneakers*
     - *Women's Fashion & Dresses* (with subcategory chips: Dresses, Tops, Jeans, Ethnic, Jackets)
     - *Men's Wardrobe & Watches* (with subcategory chips: Shirts, T-shirts, Jeans, Trousers, Watches)
     - *Handbags, Backpacks & Luggage*
     - *Makeup & Radiant Beauty*
     - *Home Decor & Modern Lamps* (Wall decor, Lamps, Curtains, Cushions, Decorative items)
     - *Home Utilities & Kitchen* (Kitchen products, Storage, Cleaning)
   - Every product card features high-res images, brand, rating pill, original price struck out, discounted price, discount percentage tag, wishlist heart toggle, and quick "Add to Cart".

3. **Instant Live Search Function**:
   - Matches keywords across product names, brands, categories, subcategories, and colors (e.g. `running shoes`, `black shoes`, `lipstick`, `dress`, `curtains`, `cookware`).
   - Quick suggestion tags for common queries.
   - Live results grid showing product image, brand, rating, original/discounted price, discount %, and Add to Cart button.

4. **Product Listing Page (Category/Filtered Views)**:
   - Accessible by clicking any category bubble or "View All" on any section.
   - Sorting options: Price: Low to High, Price: High to Low, Highest Rated, Biggest Discount.
   - Filtering options: Price ranges (Under ₹2,000, ₹2,000 - ₹5,000, Above ₹5,000) and Customer Ratings (4★ & above, 4.5★ & above).
   - Continuous scrollable grid.

5. **Product Details Page (Multi-Image Angles & Options)**:
   - **Multi-Angle Gallery**: Multiple high-resolution images for each product. For shoes:
     - Front View
     - Side View
     - Back View
     - Top View
     - Detail / Outsole View
   - Interactive thumbnails with active outline.
   - Product Name, Brand, Material, Stock Status, Customer rating badge, and Star breakdown.
   - Interactive Size Selection (e.g. 6, 7, 8, 9, 10 or S, M, L, XL).
   - Interactive Color Swatch Selection.
   - Description and Specifications table.
   - **Fixed Bottom Action Bar**:
     - **ADD TO CART** button (adds selected size & color to cart with notification toast).
     - **BUY NOW** button with **noticeable yellow/golden highlight** (`#FFB800` to `#F59E0B` gradient with dynamic shine animation) that jumps directly to the Checkout / Address page!

6. **Cart Page**:
   - Product image, brand, title, selected size, and selected color.
   - Quantity stepper controls (`-` and `+`) with validation.
   - Item removal button.
   - Bill breakdown: Total MRP, Discount Savings (highlighted in emerald green), Free Delivery, and Final Payable Amount.
   - Prominent **PROCEED TO BUY** button.

7. **Checkout / Address Page**:
   - Title: **Delivery Address**
   - Strictly validated fields:
     - Your Full Name
     - Door Number
     - House / Apartment Name
     - Street / Area
     - City
     - State
     - PIN Code (strictly 6 digits)
     - Mobile Number (strictly 10 digits)
   - Real-time error messages if any required field is omitted.
   - Button: **CONTINUE TO PAYMENT**.

8. **Payment Page (Demo Sandbox)**:
   - Title: **Payment**
   - Clear banner stating it is a demo payment system (no real money charged).
   - Selectable payment methods:
     - **UPI**: PhonePe, Google Pay, Paytm, Other UPI (with custom UPI ID input field).
     - **Other Payment Option**: Cash on Delivery (COD).
   - Order price recap and **BUY NOW** final confirmation button.

9. **Order Confirmation (Popup Modal)**:
   - **Large Circular Success Checkmark SVG Animation** with smooth draw stroke.
   - Headings: **"Your Order is Confirmed!"** and **"Your address has been confirmed."**
   - Detailed receipt: Order ID (e.g. `#LXC-XXXXXX`), Product summary, Total amount paid, Formatted Delivery Address, Payment method, and Estimated Delivery date.
   - **CONTINUE SHOPPING** button that seamlessly returns to Home.

10. **Orders Page**:
    - Complete order history (persisted in local state / MongoDB).
    - Status badges: *Order Confirmed*, *Shipped*, *Out for Delivery*, *Delivered*.
    - **Step-by-step 4-node tracking progress visualizer** (Placed → Shipped → Out for Delivery → Delivered).

11. **Account Page**:
    - User avatar, name, email, and mobile number.
    - Saved Delivery Address card with quick edit capability.
    - Navigation to My Orders, My Cart, Wishlist, and Help & Support (hotline demo).
    - **Dark Mode / Light Mode toggle**.

12. **Fixed Bottom Navigation Bar**:
    - Exactly 5 tabs: **Home | Search | Orders | Cart | Account**.
    - Active icon indicator with subtle bounce and real-time badge counters for Cart items and Orders!

13. **Wishlist**:
    - Heart icon on every product card and product detail view.
    - Dedicated Wishlist screen with instant "Add to Cart" transfer.

14. **Dual-Mode Viewport Simulator**:
    - **Mobile App View (390px - 430px)**: Displays a sleek smartphone chassis with rounded corners, dynamic island, and authentic mobile app feel.
    - **Full Screen View**: Expands to standard responsive desktop/tablet layout.

15. **Comprehensive Product Catalog**:
    - **111+ realistic products** spanning 7 major categories:
      - 21 Shoes (Nike, Adidas, Puma, Woodland, Skechers, Asics, Converse, Vans, etc.)
      - 15 Bags (Wildcraft, American Tourister, Lavie, Tommy Hilfiger, Safari, Baggit, etc.)
      - 15 Women's Products (Zara dresses, Levi's jeans, Biba kurtas, tops, skirts, etc.)
      - 15 Men's Products (Ralph Lauren shirts, Levi's 511, suits, polo, jackets, watches)
      - 15 Makeup & Beauty Products (MAC Ruby Woo, Maybelline, Huda Beauty, Clinique, serums, toners)
      - 15 Home Decor Products (Art canvas sets, Philips arc lamps, linen curtains, velvet cushions, ceramic vases)
      - 15 Home Utilities (Prestige pressure cookers, Milton borosilicate jars, Scotch-Brite spin mop, cookware, organizers)

---

## 📁 Project Structure

```
your-shopping-app/
├── package.json               # Backend dependencies (Express, CORS, Mongoose, dotenv)
├── server.js                  # Node.js Express REST API server with MongoDB & auto-fallback
├── README.md                  # Complete documentation and presentation guide
├── config/
│   └── db.js                  # MongoDB Mongoose connection with resilient fallback
├── models/
│   ├── Product.js             # Mongoose Product Schema
│   ├── Order.js               # Mongoose Order Schema
│   └── User.js                # Mongoose User & Address Schema
├── data/
│   └── products.json          # 111 comprehensive demo products catalog
└── public/
    ├── index.html             # Application entrypoint with Outfit & Inter Google Fonts
    ├── css/
    │   └── style.css          # Modern CSS Design System (variables, animations, golden Buy Now button)
    ├── data/
    │   └── products.json      # Client-accessible products catalog mirror
    └── js/
        ├── app.js             # Complete React 18 Application (all screens & states)
        └── products-data.js   # Instantaneous client-side embedded data source
```

---

## 🚀 How to Run the Project

### Option A: Instant Browser Launch (Zero-Setup, 1-Click)
Because the frontend is built using browser-ready React 18, you can test and demonstrate the entire application immediately without installing Node or starting any server!
1. Open Windows File Explorer.
2. Navigate to: `D:\diploma folder\your-shopping-app\public\`
3. Double-click **`index.html`** to open it in Chrome, Edge, Brave, or Firefox.
4. All features, categories, multi-angle images, size selectors, cart, checkout, demo payments, orders, and dark mode will function immediately!

### Option B: Full-Stack Node.js & MongoDB Server
When you have Node.js installed on your machine or college lab:
1. Open PowerShell or Command Prompt.
2. Navigate to the project folder:
   ```powershell
   cd "D:\diploma folder\your-shopping-app"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Node.js server:
   ```bash
   npm start
   ```
   *(Or `node server.js`)*
5. Open your web browser at:
   ```
   http://localhost:5000
   ```
6. The server will automatically connect to MongoDB (`mongodb://127.0.0.1:27017/your_shopping_app`).
   *Note: If MongoDB is not installed or not running, the server automatically and seamlessly activates its high-performance JSON datastore (`data/db.json`), ensuring that the application **NEVER crashes**!*

---

## 🎓 Perfect for Diploma Presentation
- **Application Name**: "Your Shopping Application" (Branded: **LuxeCart**)
- **Flow to Demonstrate**:
  1. Splash screen loads with smooth animation → opens Home.
  2. Scroll through Categories (Shoes, Bags, Women, Men, Makeup, Decor, Utilities).
  3. Search for "Running Shoes" or "Black dress" to show real-time search.
  4. Click a Shoe product (e.g. Nike Air Zoom Pegasus 40) → Show multi-angle carousel (Front view, Side view, Back view, Top view, Detail view).
  5. Select Size (e.g. 9) and Color.
  6. Click the glowing **Golden Yellow "BUY NOW" button**.
  7. Fill the Delivery Address form (demonstrate required validation).
  8. Choose Payment (PhonePe, Google Pay, Paytm, or Cash on Delivery).
  9. Click **BUY NOW** → View the **Large Circular Success Checkmark SVG Animation** and Order Confirmed modal!
  10. Click **CONTINUE SHOPPING** or visit **Orders** tab to inspect the 4-step tracking visualizer!
  11. Switch between **Mobile View** and **Full Screen View** using the top control bar.
