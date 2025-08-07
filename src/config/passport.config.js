import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { userModel } from '../dao/models/user.model.js';
import config from '../config/config.js'; 
import cookieParser from 'cookie-parser';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
  (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['jwtCookie'];
    }
    return token;
  },
]),
  secretOrKey: config.JWT_SECRET,
};

passport.use(
  new JWTStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await userModel.findById(payload.id);
      if (!user) {
        return done(null, false); 
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
