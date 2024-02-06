const { logEvents } = require('./logEvents');

const errorHandler = (err: { name: any; message: any; stack: any; }, req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }, next: any) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack)
    res.status(500).send(err.message);
}

module.exports = errorHandler;