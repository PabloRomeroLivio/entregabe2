import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'First name is required']
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    index: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts',
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user'
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

export const userModel = mongoose.model(userCollection, userSchema);
