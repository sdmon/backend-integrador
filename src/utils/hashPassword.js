const bcrypt = require('bcrypt')

exports.createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

exports.isValidPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword)

