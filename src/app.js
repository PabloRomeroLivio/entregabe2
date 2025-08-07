import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
import path from 'path';

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import sessionRouter from './routes/sessions.router.js';

import websocket from './websocket.js';
import __dirname from './utils/constantsUtil.js';
import config from './config/config.js';
import './config/passport.config.js'; // Configura estrategias de Passport
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();

// Conexión a MongoDB
mongoose.connect(config.MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views')); // corregido path
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(passport.initialize());
app.use(cookieParser());


// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', viewsRouter);

// Inicialización del servidor
const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

// WebSocket
const io = new Server(httpServer);
websocket(io);
