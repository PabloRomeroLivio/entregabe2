
Proyecto Backend - Entrega JWT + Usuario + Login

Este proyecto corresponde a la entrega del módulo de Autenticación y Autorización con JWT del curso Programación Backend Avanzado.
📦 Funcionalidades implementadas
✅ Modelo de Usuario

    Modelo User con los campos requeridos: first_name, last_name, email, age, password, role.

    Contraseñas encriptadas con bcrypt.hashSync.

    Campo role con valor por defecto "user" (puede ser "admin" para usuarios especiales).

✅ Autenticación y Autorización

    Login con validación de credenciales.

    Generación de Token JWT al iniciar sesión.

    Middleware de Passport configurado para proteger rutas con JWT.

    Estrategia personalizada "current" para extraer el usuario autenticado.

✅ Endpoints clave

    POST /api/sessions/login: Inicia sesión y devuelve un token JWT.

    GET /api/sessions/current: Devuelve los datos del usuario autenticado (requiere JWT en el header).

✅ Rutas de Productos y Carritos

    CRUD completo para productos.

    CRUD completo para carritos.

    Relación entre productos y carritos usando Mongoose.

🧪 Cómo probar el sistema

    ⚠️ No hay frontend para registro ni login, las pruebas se hacen con Postman o herramienta similar.

1. Usuario de prueba

Se creó un usuario de prueba con los siguientes datos:

Email: usuario@prueba.com
Contraseña: 123456
Role: user

2. Iniciar sesión (Login)

    Método: POST

    URL: http://localhost:8080/api/sessions/login

    Body (JSON):

{
  "email": "usuario@prueba.com",
  "password": "123456"
}

    Respuesta exitosa devuelve un token JWT.

3. Consultar usuario actual

    Método: GET

    URL: http://localhost:8080/api/sessions/current

    Headers:

Authorization: Bearer <token_JWT_obtenido_en_login>

    Respuesta: datos del usuario autenticado.
