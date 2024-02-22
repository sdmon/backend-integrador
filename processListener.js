process.on('exit', code => {
    console.log('Evento que se ejecuta antes de salir del proceso', code)
} )
process.on('uncaughtException', exception => {
    console.log('Evento que ejecuta excepciones', exception)
})

console.log('Ejecutando sentencia!')