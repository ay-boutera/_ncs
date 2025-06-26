import * as passport from 'passport';

export function configurePassportSession() {
  passport.serializeUser((user, done) => {
    // You can store just user.id if you want
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    // You can fetch user from DB if you stored only the id
    done(null, user);
  });
}
