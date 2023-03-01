import cluster from 'cluster';
import * as os from 'os';
import { Injectable } from '@nestjs/common';
import { getRandomString } from '@drstrain/drutil';

type Func = (...args: any[]) => any;

function logHeader() {
  if (cluster.isPrimary) return '[Master process]';
  return '[Worker process]';
}

const numCPUs = process.env.NODE_ENV === 'production' ? os.cpus().length : 1;
if (cluster.isPrimary) {
  console.log(`${logHeader()} Number of cpus: ${numCPUs}`);
}

@Injectable()
export class AppClusterService {
  static clusterize(callback: Func): void {
    if (cluster.isPrimary) {
      console.log(`${logHeader()} Master server started on pid ${process.pid}`);
      const secretJwt =
        process.env.NODE_ENV === 'production' ? getRandomString(32) : 'secret';
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork({ SECRET_JWT: secretJwt });
      }
      cluster.on('exit', (worker, code, signal) => {
        if (process.env.NODE_ENV === 'production') {
          console.log(
            `${logHeader()} Worker ${worker.process.pid} died. Restarting`,
          );
          cluster.fork({ SECRET_JWT: secretJwt });
        } else {
          console.log(`${logHeader()} Worker ${worker.process.pid} died`);
        }
      });
    } else {
      console.log(`${logHeader()} Started on pid ${process.pid}`);
      callback(process.env.SECRET_JWT);
    }
  }
}
