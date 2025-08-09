import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import sessionRouter from './routes/sessions.router.js';

import websocket from './websocket.js';
import __dirname from './utils/constantsUtil.js';
import config from './config/config.js';
import './config/passport.config.js'; 
import passwordResetRouter from './routes/passwordResetRouter.js';


dotenv.config();


const app = express();


mongoose.connect(config.MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(passport.initialize());


app.use(express.static(path.join(__dirname, '..', 'public')));



app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionRouter); 
app.use('/', viewsRouter);
app.use('/api/password-reset', passwordResetRouter);

const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});


const io = new Server(httpServer);
websocket(io);
