const express = require('express');
const createProductRoutes = require('./productRoutes');

function configureRoutes(app, dependencies) {
    const { productController } = dependencies;

    app.get('/api/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'API is running',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    });

    app.use('/api/products', createProductRoutes(productController));

    app.use('*', (req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint not found',
            data: null
        });
    });
}

module.exports = configureRoutes;