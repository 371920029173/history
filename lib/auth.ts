// 认证系统 - 密钥加密和验证

import CryptoJS from 'crypto-js';

// 加密密钥（硬编码）
const ENCRYPTION_KEY = 'yiban-history-secret-key-2027';

// 上传密钥和删除密钥（加密存储）
const UPLOAD_KEY_ENCRYPTED = CryptoJS.AES.encrypt('ssfz2027n15662768895', ENCRYPTION_KEY).toString();
const DELETE_KEY_ENCRYPTED = CryptoJS.AES.encrypt('ssfz2027371920029173', ENCRYPTION_KEY).toString();

// 验证密钥
export function verifyKey(inputKey: string, action: 'upload' | 'delete'): boolean {
  try {
    const encryptedKey = action === 'upload' ? UPLOAD_KEY_ENCRYPTED : DELETE_KEY_ENCRYPTED;
    const decryptedKey = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    return inputKey === decryptedKey;
  } catch (error) {
    return false;
  }
}

// 清除密钥（在验证后）
export function clearKeyFromMemory(): void {
  // 在 Node.js 中，我们无法真正清除内存中的变量
  // 但可以在验证后不保存密钥到任何地方
  // 这里主要是概念性的实现
}



