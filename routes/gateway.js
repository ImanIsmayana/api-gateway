const express = require('express');
const axios = require('axios');
const authenticateJWT = require('../middlewares/auth');
const router = express.Router();

// microservice URLs
const SERVICE_MASTER_DATA = process.env.SERVICE_MASTER_DATA_URL;
const SERVICE_EXTERNAL = process.env.SERVICE_EXTERNAL_URL;

// to protect routes / authorized routes
router.use(authenticateJWT);

// Route for master data service (table_name without prefix, if barokahtesting1inv_variants so the table name is variants)
router.use('/master_data/:table_name', async (req, res) => {
    const { table_name } = req.params;        
    const prefix = req.prefix.split('1')[0];
    try {
        const response = await axios({
            method: req.method,
            url: `${SERVICE_MASTER_DATA}/${table_name}/${prefix}`,
            data: req.body,
            headers: req.headers,
            headers: {
                ...req.headers,
                'X-From-Api-Gateway': 'true',
            },
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || 'Error forwarding request');
    }
});

// Route for external service
router.use('/external', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${SERVICE_EXTERNAL}${req.originalUrl}`,
            data: req.body,
            headers: req.headers,
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || 'Error forwarding request');
    }
});

module.exports = router;