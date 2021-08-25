import { ICookie } from "../models/cookie";

interface ICookieUtility {
  getAll: () => ICookie[];
  remove: (name: string) => void;
  removeAll: () => void;
}

export const CookieUtility: ICookieUtility = {
  getAll: (): ICookie[] => {
    return document.cookie.split(";")
    .map((entry: any) => {
      const split: any[] = entry.split("="),
        cookie: ICookie = { name: split[0], value: split[1] };

      return cookie;
    });
  },
  remove: (name: string): void => {    
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  },
  removeAll: (): void => {
    CookieUtility
      .getAll()
      .forEach((cookie: ICookie) => CookieUtility.remove(cookie.name));
  }
}