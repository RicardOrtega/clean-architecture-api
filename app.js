const Server = require('./src/presentation/server');

async function main() {
    const server = new Server();
    await server.start();
}

if (require.main === module) {
    main().catch(error => {
        console.error('Application failed to start:', error);
        process.exit(1);
    });
}

module.exports = { Server };