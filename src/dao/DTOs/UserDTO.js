export default class UserDTO {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role || 'user'; // por si no está definido
    this.cart = user.cart?._id || user.cart || null; // devuelve el ID del carrito
  }
}
