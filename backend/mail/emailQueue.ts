// queues/emailQueue.ts
import Queue from 'bull';

export const emailQueue = new Queue('emailQueue', {
  redis: {
    port: 6379,
    host: '127.0.0.1',
  },
});
