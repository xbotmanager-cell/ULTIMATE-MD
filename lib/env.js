import { config } from 'dotenv';
config();

export function validateEnv() {
  if (!process.env.SESSION_ID) {
    throw new Error('SESSION_ID environment variable is missing.');
  }
  if (!process.env.SESSION_ID.startsWith('SWIFTBOT~')) {
    throw new Error('SESSION_ID must start with "SWIFTBOT~".');
  }
}
