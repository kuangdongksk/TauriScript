import { createHash } from "node:crypto";

const hash = createHash("sha256");

export function getHash(str: string): string {
  hash.update(str);
  return hash.digest("hex");
}