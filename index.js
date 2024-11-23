require('dotenv').config();
const express = require('express');
const app = express();
const gatewayRoutes = require('./routes/gateway');

app.use(express.json()); // To parse JSON requests

// Gateway routes
app.use('/api', gatewayRoutes);

// Start the server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});