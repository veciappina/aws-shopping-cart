var spawn = require('child_process').spawn
const ipc = require('node-ipc')
let processesToKill = []

async function serve () {
    let slsOfflineProcess = executeLiveCommand('sls offline', {
        host: 'localhost',
        port: 5000,
        color: true
    }, 'backend')
    let slsDynamoProcess = executeLiveCommand('sls dynamodb install && sls dynamodb start', {
        migrate: true
    }, 'backend')
    let vueProcess = executeLiveCommand('npm run serve', { open: true, silent: true }, 'frontend', 'inherit')
    await waitForWebpackEmission()
    emitProcessOutput(slsOfflineProcess)
    emitProcessOutput(slsDynamoProcess)

}

function emitProcessOutput (p) {
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
}

function executeLiveCommand (command, params, cwd = '', stdio = 'pipe') {
    let p = command.split(' ')
    command = p.shift()
    params = p.concat(getParamsTail(params).replace(' ', '').split(' '))
    let options = { stdio: stdio, shell: process.platform === "win32", cwd: `./${cwd}` }
    let childProcess = spawn(command, params, options)
    processesToKill.push(childProcess)
    return childProcess
}

function waitForWebpackEmission () {
    return new Promise(resolve => {
        ipc.config.id = 'localServer'
        ipc.config.retry = 1500
        ipc.config.silent = true
        ipc.serve(() => ipc.server.on('FilesEmitted', resolve))
        ipc.server.start()
    })
}

function getParamsTail (params) {
    let tail = ''
    for(let param in params) {
        let value = params[param]
        let valueTail = value === true || value === undefined ? '' : ` ${params[param]}`
        tail += ` --${param}${valueTail}`
    }
    return tail
}

process.stdin.resume()

function exitHandler(err) {
    if (err) console.log(err)
    for (let i in processesToKill) {
        let p = processesToKill[i]
        try {
            process.kill(p.pid)
        } catch (e) {}
    }
    process.exit()
}

//do something when app is closing
process.on('exit', exitHandler)
process.on('beforeExit', exitHandler)
process.on('SIGINT', exitHandler)
process.on('SIGUSR1', exitHandler)
process.on('SIGUSR2', exitHandler)
process.on('SIGTERM', exitHandler)
process.on('uncaughtException', exitHandler)

serve().catch(exitHandler)