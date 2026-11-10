import { hash, verify, type Options } from "@node-rs/argon2";

// Argon2id with OWASP's suggested minimums (19 MiB memory, 2 passes). Parameters are stored
// inside each hash, so raising them later still verifies old passwords.
const OPTIONS: Options = {
  algorithm: 2, // Argon2id
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export function hashPassword(password: string) {
  return hash(password, OPTIONS);
}

export function verifyPassword({ hash: stored, password }: { hash: string; password: string }) {
  return verify(stored, password);
}
