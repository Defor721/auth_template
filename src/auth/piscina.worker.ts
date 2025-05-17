// src/auth/piscina.worker.ts
import { pbkdf2 } from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(pbkdf2);

export default async function ({
  password,
  salt,
}: {
  password: string;
  salt: string;
}) {
  const derivedKey = await pbkdf2Async(password, salt, 100_000, 64, 'sha512');
  return derivedKey.toString('hex');
}
