const { Router } = require('express')
const userRouter = require('./users.router.js')
const productRouter = require('./products.router.js')
const cartRouter = require('./carts.router.js')
const viewsRouter = require('./views.router.js')
const messagesRouter = require('./messages.router.js')
const ordersRouter = require('./orders.router.js')
const { uploader } = require('../utils/uploader.js')
const router = Router()

router.post('/uploader', uploader.single('myFile'), async (req, res) => {
  res.send('Imagen Subida!')
})

router.use('/api/chat', messagesRouter)
router.use('/api/users', userRouter)
router.use('/api/products', productRouter)
router.use('/api/carts', cartRouter)
router.use('/api/orders', ordersRouter)

router.use('/', viewsRouter) 

module.exports = router