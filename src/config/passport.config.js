import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/config.js';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

passport.use = new JWTStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id); 
    return done(null, user); 
  } catch (error) {
    return done(error, false);
  }
});

export default passport;