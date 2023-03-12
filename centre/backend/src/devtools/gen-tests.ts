import RawPackets from 'libs/schemas/raw_packet.schema';
import { getRandomString } from '@drstrain/drutil';

const GENERATE_NUM = 20000;

export async function gentest() {
  let numDocs = await RawPackets.countDocuments();
  while (++numDocs <= GENERATE_NUM) {
    if (numDocs % 500 === 0)
      console.log('[Add to DB] Done:', numDocs, GENERATE_NUM);
    const randIndex = Math.floor(Math.random() * numDocs);
    const packet = await RawPackets.find().skip(randIndex).limit(1);
    const p = packet[0];
    if (p) {
      const t = JSON.parse(JSON.stringify(p));
      delete t._id;
      delete t['createdAt'];
      delete t['updatedAt'];
      delete t.__v;
      t.requestPacketPrefix = getRandomString(32);
      t.requestPacketIndex = Math.ceil(Math.random() * 1000);
      t.requestPacketId = `${t.requestPacketPrefix}.${t.requestPacketIndex}`;
      const k = new RawPackets(t);
      await k.save();
    }
  }
}
