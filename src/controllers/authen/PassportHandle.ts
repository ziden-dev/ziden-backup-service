import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import bcrypt from 'bcryptjs';
import User from "../../models/User.js";
import { JWT_SECRET } from '../../common/config/secrets.js'
import { ExceptionMessage } from "../../common/enum/ExceptionMessages.js";
import { ResultMessage } from "../../common/enum/ResultMessages.js";

const LocalStrategy = passportLocal.Strategy

let ExtractJwt = passportJwt.ExtractJwt;
let JwtStrategy = passportJwt.Strategy;

passport.use(new LocalStrategy(async (username: string, password: string, done) => {
  try {
    const user = await User.findOne({ username: username });

    if (!user) return done(null, false, ExceptionMessage.USER_NOT_EXITS);

    bcrypt.compare(password, user.password!, (err, result: boolean) => {
      if (err) return done(err, false);
      if (result === true) {
        return done(null, user, ResultMessage.APISUCCESS);
      } else {
        return done(null, false, ExceptionMessage.INVALID_PASSWORD);
      }
    });

  } catch (err: any) {
    return done(err, false);
  }

})
);

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  }, async function (jwtToken, done) {

    try {
      if (Date.now() > jwtToken.exp * 1000) {
        return done(undefined, false);
      }

      const user = await User.findOne({ username: jwtToken.username });
      if (user) {
        return done(null, user, jwtToken);
      } else {
        return done(null, false, ExceptionMessage.USER_NOT_EXITS);
      }

    } catch (err: any) {
      done(err, false);
    }

  }));
