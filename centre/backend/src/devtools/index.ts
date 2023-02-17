// getting-started.js
import mongoose from 'mongoose';
import { gentest } from './gentest';

async function main() {
  if (process.argv.length !== 3) {
    console.log('[devtool] Error: must have exactly 3 process arguments');
    process.exit(1);
  }
  const action = process.argv[2];
  switch (action) {
    case 'gentest':
      await gentest();
      break;
    default:
      console.log(`[devtool] Error: not found action ${action}`);
      break;
  }
}

mongoose.connect(process.env.DATABASE_URL, () => {
  main()
    .catch((err) => console.log(err))
    .then(() => {
      process.exit(0);
    });
});
