const passport = require('passport')

exports.passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, function (err, user, info) {
      if (err) return next(err)
      if (!user) return res.status(401).send({ error: info.message ? info.message : info.toString() })

      req.user = user
      next()
    })(req, res, next)
  }
}
