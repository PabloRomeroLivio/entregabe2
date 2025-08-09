Proyecto Backend Avanzado - Ecommerce
Descripción

Este proyecto es un backend para un sistema de ecommerce desarrollado con Node.js, Express y MongoDB. Permite gestionar usuarios, productos y carritos, e incluye autenticación y autorización mediante JWT. También incorpora un sistema de recuperación de contraseña mediante tokens con expiración.
Tecnologías usadas

    Node.js

    Express.js

    MongoDB y Mongoose

    Passport.js (estrategia JWT)

    JSON Web Tokens (JWT)

    Bcrypt para hashing de contraseñas

    Cookies HttpOnly para almacenar el JWT

    dotenv para variables de entorno

Instalación y configuración

    Clonar el repositorio:

git clone https://github.com/tu_usuario/tu_repositorio.git
cd tu_repositorio

    Instalar dependencias:

npm install

    Crear archivo .env en la raíz con las variables:



PORT=8080
MONGO_URL=mongodb+srv://pabloromerolivio:coderPass123@cluster0.c3hwozk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=claveSuperSecreta123
ADMIN_EMAIL=pablo.romero.livio@gmail.com
JWT_EXPIRES_IN=1h
NODE_ENV=development
PORT=8080

    Iniciar el servidor:

npm run start

Estructura del proyecto

src/
├── config/               # Configuración general (Passport, variables, etc)
├── dao/                  # Modelos y acceso a datos (repositorios)
│   ├── models/           # Modelos Mongoose (User, Product, Cart, PasswordResetToken)
│   ├── repositories/     # Repositorios para acceder a los modelos
├── services/             # Lógica de negocio (UserService, ProductService, etc)
├── routes/               # Definición de rutas (userRouter, passwordResetRouter, etc)
├── middlewares/          # Middlewares de autenticación y autorización
├── utils/                # Utilidades (crypto, JWT helpers, etc)
app.js                   # Configuración principal de Express

Funcionalidades principales
Usuarios

    Registro de usuarios con validación y creación automática de carrito

    Login con JWT guardado en cookie HttpOnly

    Logout que elimina la cookie

    Endpoint para obtener datos del usuario autenticado (/current)

    Middleware para proteger rutas y autorizar por roles

Recuperación de contraseña

    Endpoint para solicitar recuperación de contraseña: /api/password-reset/request-reset-password

    Genera un token único y con expiración (1 hora) guardado en base de datos

    Endpoint para resetear contraseña usando token: /api/password-reset/reset-password

    Valida token, verifica expiración y actualiza la contraseña hasheada

Productos y carritos

    CRUD de productos y carritos (según la consigna del proyecto)

Endpoints clave
Método	Ruta	Descripción	Protección
POST	/api/sessions/register	Registrar nuevo usuario	Pública
POST	/api/sessions/login	Login y obtener JWT en cookie httpOnly	Pública
POST	/api/sessions/logout	Logout y eliminar cookie	Autenticado
GET	/api/sessions/current	Obtener info del usuario autenticado	Autenticado
POST	/api/password-reset/request-reset-password	Solicitar token para recuperar contraseña	Pública
POST	/api/password-reset/reset-password	Resetear contraseña con token válido	Pública
Uso

Para probar los endpoints de recuperación de contraseña, podés usar Postman:

    Enviar POST /api/password-reset/request-reset-password con JSON:

{
  "email": "usuario@ejemplo.com"
}

Recibirás un token en la respuesta (para esta entrega, lo devolvemos directamente).

    Enviar POST /api/password-reset/reset-password con JSON:

{
  "token": "token_recibido",
  "newPassword": "nueva_contraseña_segura"
}

Si el token es válido y no expiró, la contraseña se actualizará.
Notas

    La expiración del token para reset de contraseña está configurada en 1 hora.

    Para producción se recomienda enviar el token por email (no implementado en esta entrega).

    Las contraseñas se almacenan hasheadas con bcrypt.

    La autenticación se realiza con JWT almacenado en cookie HttpOnly para mayor seguridad.

Autor

Pablo Romero Livio
