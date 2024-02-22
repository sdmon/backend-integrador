const { Router } = require('express')
const router = Router()

function operacionCompleja(){
    let result = 0
    for (let i = 0; i < 7e9; i++) {
        result += i
        
    }
    return result
}

router.get('/block', (req, res) => {
    const result = operacionCompleja()
    res.send(`El resultado es: ${result}`)
})

router.get('/noblock', (req, res) => {
    const child = fork('./src/routes/operacioncompleja.js')
    child.send('Inicio de calculo')
    child.on('message', data => {
        res.send(`El resultado es: ${data}`)
    })   
})

module.exports = router
