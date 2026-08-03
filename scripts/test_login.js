// test_login.js
// Simple script to exercise the lockout logic implemented in storage.js and AuthContext

import { validateUser, getLockInfo, setLockInfo } from './src/utils/storage.js';

async function attemptLogin(email, password) {
  const lockInfo = getLockInfo();
  const now = Date.now();
  if (lockInfo.lockedUntil && now < lockInfo.lockedUntil) {
    console.log('Locked out');
    return { success: false, locked: true };
  }
  if (lockInfo.lockedUntil && now >= lockInfo.lockedUntil) {
    setLockInfo({ count: 0, lockedUntil: null });
  }
  const user = await validateUser(email, password);
  if (user) {
    setLockInfo({ count: 0, lockedUntil: null });
    console.log('Login success for', email);
    return { success: true, role: user.role };
  }
  const newCount = (lockInfo.count || 0) + 1;
  const maxAttempts = 3;
  const lockDuration = 5 * 60 * 1000;
  if (newCount >= maxAttempts) {
    setLockInfo({ count: newCount, lockedUntil: now + lockDuration });
    console.log('Lock applied after failed attempts');
    return { success: false, locked: true };
  }
  setLockInfo({ count: newCount, lockedUntil: null });
  console.log('Invalid credentials, attempt', newCount);
  return { success: false, locked: false };
}

async function runTests() {
  setLockInfo({ count: 0, lockedUntil: null });
  const email = 'doc';
  const goodPwd = '1234';
  const badPwd = 'wrong';
  console.log('--- Attempt 1 (bad) ---');
  await attemptLogin(email, badPwd);
  console.log('--- Attempt 2 (bad) ---');
  await attemptLogin(email, badPwd);
  console.log('--- Attempt 3 (bad) ---');
  await attemptLogin(email, badPwd);
  console.log('--- Attempt 4 (good, should be locked) ---');
  await attemptLogin(email, goodPwd);
  console.log('--- Clearing lock manually ---');
  setLockInfo({ count: 0, lockedUntil: null });
  console.log('--- Attempt 5 (good) ---');
  await attemptLogin(email, goodPwd);
}

runTests();
