const {system} = require('@drstrain/drutil');
const { FuzzStatus } = require('@drstrain/shadeless-lib');
const {newPathQL,newPacketQL} = require('./libs/init');

const pathQL = newPathQL();
const packetQL = newPacketQL();

async function main() {
  const paths = await pathQL.setStatus(FuzzStatus.TODO).query();
  for (let i = 0; i < paths.length; ++i) {
    if (paths[i].origin.includes('obs-beta.line-scdn.net')) continue;

    const packet = await packetQL.queryRequestPacketId(paths[i].requestPacketId);
    const headers = packet?.requestHeaders || [];

    const victim = `${paths[i].origin}${paths[i].path}`;
    const args = headers.reduce((prev, cur) => [...prev, '--header', cur], ['run', '-u', victim]);
    await system('strangebust', args);
    await pathQL.setQueryDone(paths[i]);
  }
}

main();