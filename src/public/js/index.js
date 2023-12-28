// Instanciar un socket
const socket = io()
let user = ""

Swal.fire({
    title: 'Indicar usuario',
    input: 'text',
    text: 'Ingresar nombre de usuario:',
    allowOutsideClick: false,
    inputValidator: value => {
        return !value && 'Necesitas un usuario para continuar!'
    }
    // icon: 'success'
}).then(result => {
    user = result.value
    console.log(user)
})

let chatBox = document.querySelector('#chatBox')
chatBox.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        // Para eliminar los espacios por si alguien no pone nada
        if(chatBox.value.trim().length > 0){
            //console.log(user, chatBox.value )
            socket.emit('message', {user, message: chatBox.value})
            chatBox.value = ''
        }
    }
})

socket.on('messageLogs', messagesArray => {
    let messageLogs = document.querySelector('#messageLogs')    
    let mensajes = ''
    messagesArray.forEach(mensaje => {
        mensajes += `${mensaje.user} dice: ${mensaje.message} <br>`
    })
    messageLogs.innerHTML = mensajes
})

