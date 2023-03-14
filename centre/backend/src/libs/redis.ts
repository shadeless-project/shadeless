import Redis from 'ioredis';

const redis = new Redis({
  host: 'app-redis',
  port: 6379,
});

export default redis;
