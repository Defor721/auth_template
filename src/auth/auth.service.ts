// // src/auth/auth.service.ts
// import { Injectable } from '@nestjs/common';
// import { Worker } from 'worker_threads';
// import { randomBytes } from 'crypto';

// @Injectable()
// export class AuthService {
//   private users: Record<string, { salt: string; hash: string }> = {};

//   async hashPassword(
//     password: string,
//     salt?: string,
//   ): Promise<{ salt: string; hash: string }> {
//     salt = salt || randomBytes(16).toString('hex');

//     const hash = await new Promise<string>((resolve, reject) => {
//       const worker = new Worker(__dirname + '/worker.js', {
//         workerData: { password, salt },
//       });

//       worker.once('message', resolve);
//       worker.once('error', reject);
//     });

//     return { salt, hash };
//   }

//   async register(email: string, password: string) {
//     if (this.users[email]) throw new Error('이미 존재하는 사용자');

//     const { salt, hash } = await this.hashPassword(password);
//     this.users[email] = { salt, hash };

//     return { email, message: '회원가입 성공' };
//   }

//   async login(email: string, password: string) {
//     const user = this.users[email];
//     if (!user) throw new Error('사용자를 찾을 수 없습니다');

//     const { hash: newHash } = await this.hashPassword(password, user.salt);

//     if (newHash !== user.hash) throw new Error('비밀번호 불일치');

//     return { email, message: '로그인 성공' };
//   }
// }

import { Injectable, OnModuleInit } from '@nestjs/common';
import Piscina from 'piscina';
import { resolve } from 'path';

@Injectable()
export class AuthService implements OnModuleInit {
  private pool: Piscina;

  onModuleInit() {
    this.pool = new Piscina({
      filename: resolve(__dirname, 'piscina.worker.js'), // 빌드 시 JS 경로로!(dist기준)
      maxThreads: 4, // 동시에 돌 수 있는 Worker 수
    });
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    const hash = await this.pool.run({ password, salt });
    return hash;
  }
}
