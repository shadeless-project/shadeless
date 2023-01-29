const { default: Jaeles } = require('jaeles-integration');

const jaeles = new Jaeles({
  endpoint: 'http://localhost:3001',
  username: 'jaeles',
  password: '51e75e5c99',
});

async function send() {
  const t = await jaeles.sendRequest({
    url: 'http://drstra.in:3145/dumawtf?id=123',
    method: 'GET',
    headers: [
      'Cookie: wtg=123',
      'Autho: cc',
      'Content-Type: application/json',
    ],
    body: '',
  });
}

send();