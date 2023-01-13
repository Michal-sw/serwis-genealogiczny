import { readFileSync } from "fs";

export const getPublicKey = (): string => {
  try {
    const publicKey = readFileSync('public.pem');
    return publicKey.toString();
  } catch {
    return "MOCK_SECRET"
  }
}

export const getPrivateKey = (): string => {
  try {
    const privateKey = readFileSync('private.pem');
    return privateKey.toString();
  } catch {
    return "MOCK_SECRET"
  }
}

export const getCookie = (cookies: String, key: string): string => {
  const cookiesSplitted = cookies.split("; ");
  const targetCookie = cookiesSplitted.find(cookie => cookie.startsWith(key));
  
  return targetCookie?.slice(key.length + 1) || "";
}
