const {sleep} = require('@drstrain/drutil');
const {newPacketQL, defaultOpts} = require('./libs/init');
const { default: Jaeles } = require('jaeles-integration');
const fs = require('fs/promises');

const packetQL = newPacketQL();

const jaeles = new Jaeles({
  endpoint: 'http://localhost:3001',
  username: 'jaeles',
  password: '51e75e5c99',
});

async function main() {
  const apis = await packetQL.query({ status: 'todo' });
  for (let i = 0; i < apis.length; ++i) {
    if (apis[i].origin.includes('scdn')) continue;
    if (apis[i].origin.includes('access')) continue;
    if (apis[i].origin.includes('google')) continue;
    if (apis[i].origin.includes('torimochi')) continue;
    if (apis[i].origin.includes('sentry')) continue;
    if (apis[i].origin.includes('optout')) continue;
    if (!apis[i].origin.includes('admin')) continue;

    const url = `${apis[i].origin}${apis[i].path}${apis[i].querystring ? '?' + apis[i].querystring : ''}`;

    console.log(url);
    const body = await fs.readFile(`${defaultOpts['fileLocation']}/${apis[i].requestBodyHash}`, 'utf-8');
    const t = await jaeles.sendRequest({
      url: url,
      method: apis[i].method,
      headers: apis[i].requestHeaders,
      body: body,
    });
    await sleep(23000);
    await packetQL.setQueryDone(apis[i]);
  }
}

main();