const http = require('http');
const websocket = require('websocket-driver');

const server = http.createServer();
const sampleData = new Uint8Array([ 255 ]);
const buffer = Buffer.from(sampleData.buffer);

server.on('upgrade', (request, socket, body) => {
    if (!websocket.isWebSocket(request)) {
        return;
    }

    const driver = websocket.http(request, { maxLength: Math.pow(2, 9), protocols: ['websocket'] });

    driver.io.write(body);
    socket.pipe(driver.io).pipe(socket);

    driver.on('error', error => console.error(error));
    driver.on('open', () => {
        console.log('-'.repeat(10));
        console.log('Sending TypedArray', sampleData);
        console.log('Sending Buffer', buffer, buffer.byteLength);
        console.log('Sending ArrayBuffer', buffer.buffer, buffer.buffer.byteLength);
        console.log('Buffer and ArrayBuffer have same byte length?', buffer.byteLength === buffer.buffer.byteLength);

        driver.binary(buffer);
    });
    driver.on('close', () => {
        console.log('connexion closed.');
    });
    driver.on('message', event => {
        const { data } = event;
        console.log('-'.repeat(10));
        console.log('receiving Buffer', data, data.byteLength);
        console.log('receiving ArrayBuffer', data.buffer, data.buffer.byteLength);
        console.error('Buffer and ArrayBuffer have same byte length?', data.byteLength === data.buffer.byteLength);
        // Buffer and its ArrayBuffer should have the same bytelenght. That's not the case!
    });

    driver.start();
});

server.on('error', error => console.error(error));

server.listen(8080, 'localhost');

console.info('Listening on localhost:8080');
