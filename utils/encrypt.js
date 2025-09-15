const crypto = require("crypto");
const ALGORITHM = "aes-256-gcm"; // or aes-256-cbc (gcm provides auth tag)
const IV_LENGTH = 12; // recommended for gcm
const {ENCRYPTION_KEY } = require('../config/config');
const KEY = Buffer.from(ENCRYPTION_KEY, "hex"); // 32 bytes hex in .env

exports.encrypt=(plaintext)=> {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv, { authTagLength: 16 });
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // store iv + tag + ciphertext all encoded
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

exports.decrypt=(payloadB64)=> {
  const data = Buffer.from(payloadB64, "base64");
  const iv = data.slice(0, IV_LENGTH);
  const tag = data.slice(IV_LENGTH, IV_LENGTH + 16);
  const ciphertext = data.slice(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}
