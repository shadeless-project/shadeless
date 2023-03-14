import cluster from 'cluster';
import * as os from 'os';
import { Injectable } from '@nestjs/common';

type Func = (...args: any[]) => any;

const YELLOW = '\x1B[1;33m';
const BLUE = '\x1B[1;36m';
const NC = '\x1B[0m';

function logHeader() {
  if (cluster.isPrimary) return `${YELLOW}[Master process]${NC}`;
  return `${BLUE}[Worker process]${NC}`;
}

export const numCPUs =
  process.env.NODE_ENV === 'production' ? os.cpus().length : 1;
if (cluster.isPrimary) {
  console.log(`${logHeader()} Number of cpus: ${numCPUs}`);
}

@Injectable()
export class AppClusterService {
  static clusterize(callback: Func): void {
    if (cluster.isPrimary) {
      console.log(`${logHeader()} Master server started on pid ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        if (process.env.NODE_ENV === 'production') {
          console.log(
            `${logHeader()} Worker ${worker.process.pid} died. Restarting`,
          );
          cluster.fork();
        } else {
          console.log(`${logHeader()} Worker ${worker.process.pid} died`);
        }
      });
    } else {
      console.log(`${logHeader()} Started on pid ${process.pid}`);
      callback();
    }
  }
}
