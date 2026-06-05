import crypto from 'crypto';

export const generateDeviceFingerprint = (ip: string, userAgent: string): string => {
  const hash = crypto.createHash('sha256');
  hash.update(`${ip}-${userAgent}`);
  return hash.digest('hex');
};
