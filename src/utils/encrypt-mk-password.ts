import crypto from "node:crypto";

const SECRET_KEY = process.env.CRYPTO_SECRET_KEY!;
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY),
    iv,
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY),
    iv,
  );
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString();
}
