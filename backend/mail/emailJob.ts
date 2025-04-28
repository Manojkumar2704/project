import { emailQueue } from './emailQueue';

export const addEmailJob = async (to: string) => {
  await emailQueue.add('sendWelcomeEmail', {
    to,
    subject: 'Welcome to Our App!',
    body: `Hi ${to}, thanks for signing up!`,
  });
};
