import CryptoJS from 'crypto-js'

// 加密密钥（用于加密存储的密钥）
const ENCRYPTION_KEY = 'history_website_encryption_key_2024'

// 上传密钥（原始值）
const UPLOAD_KEY = 'ssfz2027n15662768895'
// 删除密钥（原始值）
const DELETE_KEY = 'ssfz2027371920029173'

// 加密函数
function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
}

// 解密函数
function decrypt(encryptedText: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// 验证上传密钥
export function verifyUploadKey(inputKey: string): boolean {
  return inputKey === UPLOAD_KEY
}

// 验证删除密钥
export function verifyDeleteKey(inputKey: string): boolean {
  return inputKey === DELETE_KEY
}

// 生成加密的密钥哈希（用于在客户端显示时隐藏真实密钥）
export function getKeyHash(key: string): string {
  return CryptoJS.SHA256(key).toString().substring(0, 16)
}

