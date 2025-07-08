import bcrypt from 'bcrypt';

// Esta función crea un hash de la contraseña antes de guardarla
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Esta función compara la contraseña ingresada con la hash almacenada
export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};
