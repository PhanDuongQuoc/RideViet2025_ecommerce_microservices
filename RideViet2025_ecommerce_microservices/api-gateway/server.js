const express = require('express');
const path = require('path'); 
const connectDB = require('../config/db'); 
const productRoutes = require('../product-service/routes/productRoutes');
const slideRoutes = require('../slide-service/routes/slideRoutes');
const typeproductRoutes = require('../type-product-service/routes/typeproductRoutes'); 
const videoRoutes = require('../video-service/routes/videoRoutes'); 
const newRoutes = require('../news-service/routes/newRoutes'); 
const authRoutes = require('../auth-service/routes/authRoutes');
const userRoutes = require('../user-service/routes/userRoutes');
const roleRoutes = require('../role-service/routes/roleRoutes');
const cartRoutes = require('../cart-service/routes/cartRoutes');
const customerRoutes = require('../customer-service/routes/customerRoutes');
const billRoutes = require('../bill-service/routes/billRoutes');
const billDetailRoutes = require('../bill-detail-service/routes/billDetailRoutes');
const app = express();  
app.use(express.json());

connectDB();
app.use(express.static(path.join(__dirname, "public")));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

app.use('/products', productRoutes);
app.use('/slides', slideRoutes);
app.use('/videos',videoRoutes);
app.use('/news', newRoutes);
app.use('/typeproducts',typeproductRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/roles', roleRoutes);
app.use("/cart", cartRoutes);
app.use("/customer", customerRoutes);
app.use("/bill", billRoutes);
app.use("/bill-details", billDetailRoutes);
app.get("/home-page", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public/dashboard.html"));
});




const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on http://localhost:${PORT}/home-page`);
    console.log(`🚀 API Gateway running on http://localhost:${PORT}/dashboard`);
});
