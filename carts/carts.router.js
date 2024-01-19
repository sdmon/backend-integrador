const { Router } = require('express')

const router = Router()

const CartDaoMongo = require('../dao/managerMongo/cartManagerMongo')
const cartServiceMongo = new CartDaoMongo()


router.get('/', async (req, res) => {
    try {
        const carts = await cartServiceMongo.getCarts()
        if (!carts) {
            return res.status(404).send({
                status: "Error",
                message: { error: "Carrito no encontrado" },
            })
        }
        return res.send({ status: "Sucess", payload: carts })

    } catch (error) {
        console.log(error)
    }
})

router.get('/:cid', async (req, res) => {

    try {

        const cartId = req.params.cid

        const carts = await cartServiceMongo.getCartById(cartId)


        if (!carts) {
            return res.status(404).send({
                status: "Error",
                message: { error: "Carrito por id no encontrado" },
            })
        }
        return res.send({ status: "Sucess", payload: carts })

    } catch (error) {
        console.log(error)
    }
})

//post
router.post('/', async (req, res) => {
    try {

        const newCart = req.body

        const result = await cartServiceMongo.createCart(newCart)
        if (!result) {
            return res.status(400).send({ status: "Error", message: { error: "No se pudo agregar ningun producto" } })
        }

        res.send({
            status: 'success',
            payload: result
        })

    } catch (error) {
        console.log(error)
    }

})

router.post('/:cid/products/:pid', async (req, res) => {
    try {

        const cartId = req.params.cid
        const prodId = req.params.pid

        const cart = await cartServiceMongo.AddProductToCart(cartId, prodId)
        if (!cart) {

            return res.status(400).send({
                status: "Error",
                message: { error: "no se pudo actualizar el carrito" }
            })

        }

        return res.status(200).send({
            status: "Success",
            payload: cart,
        })

    } catch (error) {
        console.log(error)
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const prods = req.body

        const update = await cartServiceMongo.updateCart(cartId, prods)

        return res.status(200).send({
            status: "Success",
            payload: update,
        })


    } catch (error) {
        console.log(error)
    }
})

router.put('/:cid/products/:pid', async(req,res)=>{
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity

        const updateCart = await cartServiceMongo.updateQuantity(cid,pid,quantity)

        return res.status(200).send({
            status: "Success",
            payload: updateCart,
        })

        
    } catch (error) {
        console.log(error)
    }
})


router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid

        const deleteCart = await cartServiceMongo.deleteAllProducts(cartId)

        if (!deleteCart) {

            return res.status(400).send({
                status: "Error",
                message: { error: "no se pudo eliminar el carrito" }
            })

        }

        return res.status(200).send({
            status: "Success",
            payload: deleteCart,
        })

    } catch (error) {
        console.log(error)
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const prodId = req.params.pid

        const deleteProduct = await cartServiceMongo.deleteProduct(cartId, prodId)

        if (!deleteProduct) {

            return res.status(400).send({
                status: "Error",
                message: { error: "no se pudo eliminar el producto del carrito" }
            })

        }

        return res.status(200).send({
            status: "Success",
            payload: deleteProduct,
        })

    } catch (error) {
        console.log(error)
    }
})



module.exports = router