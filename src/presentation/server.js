require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { getInstance: getDatabaseContext } = require('../infrastructure/database/DatabaseContext');
const { ProductRepository } = require('../infrastructure/repositories');
const { ProductController } = require('./controllers');
const configureRoutes = require('./routes');
const { errorHandler, requestLogger, validateContentType } = require('./middleware');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.databaseContext = null;
        this.dependencies = {};
    }

    async initializeDependencies() {
        try {
            this.databaseContext = getDatabaseContext();
            await this.databaseContext.connect();

            const productRepository = new ProductRepository(this.databaseContext);
            const productController = new ProductController(productRepository);

            this.dependencies = {
                productRepository,
                productController
            };

            console.log('Dependencies initialized successfully');
        } catch (error) {
            console.error('Failed to initialize dependencies:', error.message);
            throw error;
        }
    }

    configureMiddleware() {
        this.app.use(helmet());
        
        this.app.use(cors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use(requestLogger);
        this.app.use(validateContentType);
    }

    configureRoutes() {
        configureRoutes(this.app, this.dependencies);
        this.app.use(errorHandler);
    }

    async start() {
        try {
            await this.initializeDependencies();
            
            this.configureMiddleware();
            this.configureRoutes();

            this.server = this.app.listen(this.port, () => {
                console.log(`Server running on port ${this.port}`);
                console.log(`API Documentation: http://localhost:${this.port}/api/health`);
                console.log(`Products endpoint: http://localhost:${this.port}/api/products`);
            });

            this.setupGracefulShutdown();

        } catch (error) {
            console.error('Failed to start server:', error.message);
            process.exit(1);
        }
    }

    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            console.log(`\nReceived ${signal}. Shutting down gracefully...`);
            
            if (this.server) {
                this.server.close(async () => {
                    console.log('HTTP server closed');
                    
                    if (this.databaseContext) {
                        await this.databaseContext.disconnect();
                    }
                    
                    console.log('Database connection closed');
                    process.exit(0);
                });
            }
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }

    async stop() {
        if (this.server) {
            this.server.close();
        }
        if (this.databaseContext) {
            await this.databaseContext.disconnect();
        }
    }
}

if (require.main === module) {
    const server = new Server();
    server.start().catch(console.error);
}

module.exports = Server;

// Si este archivo es ejecutado directamente, iniciar el servidor
if (require.main === module) {
    const server = new Server();
    server.start().catch(console.error);
}

module.exports = Server;