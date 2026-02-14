const { io } = require('socket.io-client');

const clientA = io('http://localhost:3000');
const clientB = io('http://localhost:3000');

let received = false;

clientA.on('connect', () => console.log('clientA connected'));
clientA.on('new-message', (data) => {
  console.log('clientA received:', JSON.stringify(data));
  received = true;
  cleanupAndExit(0);
});

clientB.on('connect', () => {
  console.log('clientB connected - sending message');
  clientB.emit('send-message', { username: 'SmokeTester', message: 'hello from clientB' });
});

setTimeout(() => {
  if (!received) {
    console.error('Timeout: no message received within 5s');
    cleanupAndExit(2);
  }
}, 5000);

function cleanupAndExit(code) {
  try { clientA.disconnect(); } catch (e) {}
  try { clientB.disconnect(); } catch (e) {}
  process.exit(code);
}
