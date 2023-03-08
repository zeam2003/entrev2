import app from './app.js'
import ChildProcess from 'child_process';
import ParseArgs from 'minimist';


const options = {
    alias: {
        m: 'modo',
        p: 'port'
    },
    default: {
        modo: 'prod',
        port: 8080
    }
}

const argv = process.argv.slice(2);
const { modo, port, debug, otros:  _ } = ParseArgs(argv, options);

ChildProcess.exec('ls -lh', (error, stdout, stderr) => {
    console.log(stdout)
});



// Iniciar Servidor
app.listen( port || process.env.PORT , () => console.log('Server inicalizado'))
