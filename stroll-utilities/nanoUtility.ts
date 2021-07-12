import { customAlphabet } from "nanoid"; 

interface INanoUtility {
  generate: (length?: number) => string;
}

export const Nano: INanoUtility = {
  generate: (length?: number): string => {
    const id: () => string = customAlphabet(
      "0123456789abcdefghijklmnopqrstuvwxyz",
      length || 14
    );

    return id();
  }
}