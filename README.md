# Clean Architecture API

API RESTful implementada con Clean Architecture en Node.js.

## Estructura del proyecto

```
src/
├── domain/               # Capa de Dominio
│   ├── models/          # Entidades de negocio
│   └── interfaces/      # Contratos/Interfaces
├── application/         # Capa de Aplicación
│   ├── dtos/           # Data Transfer Objects
│   ├── commands/       # Comandos (operaciones de escritura)
│   └── queries/        # Consultas (operaciones de lectura)
├── infrastructure/     # Capa de Infraestructura
│   ├── database/       # Contexto de base de datos
│   └── repositories/   # Implementación de repositorios
└── presentation/       # Capa de Presentación
    ├── controllers/    # Controladores HTTP
    ├── routes/         # Rutas de la API
    └── server.js       # Configuración del servidor
```

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

## Endpoints

- GET /api/products - Obtener todos los productos
- GET /api/products/:id - Obtener producto por ID
- POST /api/products - Crear nuevo producto
- PUT /api/products/:id - Actualizar producto
- DELETE /api/products/:id - Eliminar producto