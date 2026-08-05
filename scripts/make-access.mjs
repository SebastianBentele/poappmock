#!/usr/bin/env node
// Creates an access entry for the preview gate.
//
//   node scripts/make-access.mjs <email> [password]
//
// Prints the password (share it with the invitee) and the SHA-256 hash to add
// to ACCESS_HASHES in src/components/password-gate.tsx. Only the hash belongs
// in the repository — never the password or the email address, since one of
// the mirrors is public.
import { createHash, randomInt } from "node:crypto";

const [email, given] = process.argv.slice(2);

if (!email || !email.includes("@")) {
  console.error("Usage: node scripts/make-access.mjs <email> [password]");
  process.exit(1);
}

// Unambiguous alphabet — no O/0 or I/l/1, so it survives being typed by hand.
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const DIGIT = "23456789";

function generate(length = 12) {
  const all = UPPER + LOWER + DIGIT;
  const chars = [
    UPPER[randomInt(UPPER.length)],
    LOWER[randomInt(LOWER.length)],
    DIGIT[randomInt(DIGIT.length)],
  ];
  while (chars.length < length) chars.push(all[randomInt(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

const password = given || generate();
const hash = createHash("sha256")
  .update(`${email.trim().toLowerCase()}:${password}`)
  .digest("hex");

console.log(`\nE-Mail:    ${email.trim().toLowerCase()}`);
console.log(`Passwort:  ${password}`);
console.log(`\nAdd to ACCESS_HASHES in src/components/password-gate.tsx:`);
console.log(`  "${hash}",\n`);
