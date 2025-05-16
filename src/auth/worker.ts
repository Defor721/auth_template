// parentPort = 메인 스레드와 메시지 주고받는 채널 , workerData = 워커가 실행될때 메인 스레드에서 전달받은 데이터
import { parentPort, workerData } from 'worker_threads';
import { pbkdf2 } from 'crypto';

pbkdf2(
  workerData.password,
  workerData.salt,
  //반복횟수
  100_000,
  //결과 키 길이
  64,
  'sha512',
  //연산완료 후 실행되는 콜백함수
  (err, derivedKey) => {
    if (err) throw err;
    parentPort?.postMessage(derivedKey.toString('hex'));
  },
);
//postMessage로 parentPort에 전달
