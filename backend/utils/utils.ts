import { readFileSync } from "fs";
import { sign } from "jsonwebtoken";

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

export const getQueryValueAsArray = (query:string): string[] => {
  const queryDecoded = decodeURIComponent(query);
  return queryDecoded.split(',');
}

export const getNewTokenPair = (login: String) => {
  const privateKey = getPrivateKey();

  // The tokens must be paired with the user in the database
  // 15 minute expire
  const refreshToken = sign({ login }, privateKey, {
    expiresIn: 60*60
  });
  // 5 minutes expire
  const token = sign({ login }, privateKey, {
    expiresIn: 60*5
  });

  return {
    refreshToken,
    token
  }
};

