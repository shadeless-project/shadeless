const { default: Jaeles } = require('jaeles-integration');

const jaeles = new Jaeles({
  endpoint: 'http://localhost:5000',
  username: 'jaeles',
  password: '12e9dfd859',
});

async function send() {
  const t = await jaeles.sendRequest({
    url: 'http://drstra.in/dumawtf?id=123',
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