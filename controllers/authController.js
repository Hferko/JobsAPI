const User = require('../models/UserModel')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {

  // EZ A JÓ, DE A UserModel-ben UserShema.pre függvénnyel kiváltottuk -->
  // const {name, email, password} = req.body  
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt)
  // const tempUser = {name, email, password: hashedPassword}
  // if (!name || !email || !password) {
  //   throw new BadRequestError('Kérjük adja meg a nevet, az email címet és egy jelszót')
  // }
  //const user = await User.create({...tempUser})

  const user = await User.create({ ...req.body })
  //const token = jwt.sign({ userID: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '30d' })
  const token = user.createJWT()
  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'Új felhasználó létrehozva', user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Kérjük adja meg az email címet és a jelszót')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Érvénytelen hitelesítő adatok')
  }

  //Jelszó összehasonlítása
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Helytelen jelszó')
  }

  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

module.exports = { register, login }
