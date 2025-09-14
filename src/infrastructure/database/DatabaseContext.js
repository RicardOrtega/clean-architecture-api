class DatabaseContext {
    constructor() {
        this.products = new Map();
        this.isConnected = false;
    }

    async connect() {
        try {
            this.isConnected = true;
            console.log('Connected to database');
            this.seedData();
        } catch (error) {
            throw new Error(`Database connection failed: ${error.message}`);
        }
    }

    async disconnect() {
        try {
            this.isConnected = false;
            this.products.clear();
            console.log('Disconnected from database');
        } catch (error) {
            throw new Error(`Database disconnection failed: ${error.message}`);
        }
    }

    isHealthy() {
        return this.isConnected;
    }

    getProductsCollection() {
        if (!this.isConnected) {
            throw new Error('Database not connected');
        }
        return this.products;
    }

    seedData() {
        const { Product } = require('../../domain/models');
        
        const sampleProducts = [
            new Product('1', 'Laptop HP', 'Laptop para trabajo', 15000, 'Electrónicos'),
            new Product('2', 'Mouse Inalámbrico', 'Mouse ergonómico', 500, 'Accesorios'),
            new Product('3', 'Teclado Mecánico', 'Teclado gaming RGB', 2000, 'Accesorios')
        ];

        sampleProducts.forEach(product => {
            this.products.set(product.id, product);
        });

        console.log('Database seeded with sample data');
    }

    async runTransaction(callback) {
        try {
            return await callback(this);
        } catch (error) {
            throw new Error(`Transaction failed: ${error.message}`);
        }
    }
}

let instance = null;

module.exports = {
    DatabaseContext,
    getInstance: () => {
        if (!instance) {
            instance = new DatabaseContext();
        }
        return instance;
    }
};