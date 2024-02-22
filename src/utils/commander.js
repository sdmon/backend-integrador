const { Command } = require('commander')
const program = new Command()

program    
    //.option('-d', 'Variable para debug', false) // Debug
    //.option('-p <port>', 'Puerto del servidor', 8080) // Puerto
    //.option('-u <user>', 'Usuario del proceso')
    .option('--mode <mode>', 'Entorno de ejecucion', 'production')
    //.option('-l, --letter [letter...]', 'specify letter') // Modo

program.parse()

module.exports= { program }