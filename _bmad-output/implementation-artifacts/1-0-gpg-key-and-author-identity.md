# Story 1.0: GPG Key & Author Identity

Status: review

## Story

As the author,
I want a cryptographically-established public identity with my GPG key published on-site and in the Web Key Directory,
so that readers and collaborators can verify all site content and commits originate from me.

## Acceptance Criteria

1. Ed25519 GPG key exists in the local keyring with UID matching the author's identity (name + email).
2. Key is uploaded to `keys.openpgp.org` and findable by fingerprint or email within ~30 minutes of upload.
3. Revocation certificate generated, stored **offline only** (not in this repo), and its location documented in `architecture.md`.
4. All four `[TO BE FILLED]` placeholders in `_bmad-output/planning-artifacts/architecture.md` are replaced with real values: fingerprint, creation date, expiry date, revocation cert location.
5. `public/pubkey.asc` contains the armored ASCII public key (begins with `-----BEGIN PGP PUBLIC KEY BLOCK-----`).
6. `public/.well-known/security.txt` exists with `Contact`, `Encryption`, `Preferred-Languages`, and `Expires` fields.
7. `public/.well-known/openpgpkey/hu/<z-base32-hash>` exists as a binary (not armored) key export.
8. `public/.well-known/openpgpkey/policy` exists (empty file).
9. `vercel.json` exists at the project root with correct `Content-Type` headers for `.asc` and `openpgpkey` routes.
10. Git is configured at the repo level to sign all commits with this key (`commit.gpgsign = true`, `user.signingkey` set).
11. `.gitignore` has been extended to exclude revocation certificates and any private key material.
12. No private key material appears in the working tree or any committed file.
13. A signed test commit has been created and its signature verified with `git log --show-signature`.

## Tasks / Subtasks

### Task 1 — Generate the GPG key (interactive, author must run personally)
- [x] Run: `gpg --expert --full-generate-key`
  - When prompted for key type: choose **(9) ECC and ECC** (Ed25519 + Cv25519 subkey)
  - Curve: **(1) Curve 25519** for both primary and subkey
  - Expiry: `1y` (one year — a forcing function for hygiene, not a liability)
  - UID Name: `a k i r a` (or your preferred public identity)
  - UID Email: `secureakira@gmail.com`
  - Set a strong passphrase and store it in a password manager
- [x] Note the full 40-character fingerprint from the output (e.g., `ABCD 1234 ...`)

### Task 2 — Upload to keyserver (keys.openpgp.org ONLY)
- [x] Run: `gpg --keyserver hkps://keys.openpgp.org --send-keys <FINGERPRINT>`
- [x] Do NOT upload to any SKS keyserver (`keyserver.ubuntu.com`, `keys.gnupg.net`, etc.) — SKS has a certificate-spam vulnerability that can bloat keys to tens of megabytes permanently.
- [x] Verify upload: visit `https://keys.openpgp.org/search?q=secureakira@gmail.com` within ~30 minutes.

### Task 3 — Generate revocation certificate and store offline
- [x] Run: `gpg --output revoke-akira.asc --gen-revoke <FINGERPRINT>`
- [x] Move `revoke-akira.asc` to offline storage immediately (USB drive, encrypted offline backup, etc.).
- [x] Do NOT commit it. Do NOT leave it in the project directory.
- [x] Note the physical offline location for the architecture.md entry.
- [x] Set a calendar reminder 60 days before the key expiry date.

### Task 4 — Create `public/` directory structure
- [x] Create the directory: `public/` at the project root (this will be Astro's static assets folder when the project is initialized in a later story — place files here now, Astro will serve them automatically).
- [x] Create subdirectories: `public/.well-known/openpgpkey/hu/`

### Task 5 — Export armored public key
- [x] Run: `gpg --armor --export <FINGERPRINT> > public/pubkey.asc`
- [x] Verify the file begins with `-----BEGIN PGP PUBLIC KEY BLOCK-----`.
- [x] Verify the file does NOT contain any private key material (`PRIVATE` must not appear in the file).

### Task 6 — Create WKD (Web Key Directory) structure
- [x] Run: `gpg --with-wkd-hash --fingerprint secureakira@gmail.com`
  - Note the z-base32 hash shown in the output (the long string after the fingerprint labeled `wkd`)
- [x] Export binary (NOT armored) key to WKD location:
  ```bash
  gpg --export-options export-minimal --export <FINGERPRINT> \
    > public/.well-known/openpgpkey/hu/<Z-BASE32-HASH>
  ```
  Note: no `--armor` flag here — WKD requires binary format.
- [x] Create empty policy file: `touch public/.well-known/openpgpkey/policy`

### Task 7 — Create `security.txt`
- [x] Create `public/.well-known/security.txt` with:
  ```
  Contact: mailto:secureakira@gmail.com
  Encryption: https://akirasmusicbox.com/pubkey.asc
  Preferred-Languages: en
  Expires: <date approximately 1 year from today in RFC 3339 format, e.g. 2027-05-08T00:00:00.000Z>
  ```

### Task 8 — Create `vercel.json` stub
- [x] Create `vercel.json` at the project root. This is a **stub** — only the GPG-related Content-Type headers go here now. The full CSP, X-Frame-Options, and all other security headers will be added in a later Epic 1 story.
  ```json
  {
    "headers": [
      {
        "source": "/(.*)\\.asc",
        "headers": [
          { "key": "Content-Type", "value": "application/pgp-keys" }
        ]
      },
      {
        "source": "/.well-known/openpgpkey/(.*)",
        "headers": [
          { "key": "Content-Type", "value": "application/octet-stream" }
        ]
      }
    ]
  }
  ```
  **Warning:** Do not add CSP, HSTS, X-Frame-Options, or other security headers to `vercel.json` now — those belong in a dedicated security headers story with full CSP source lists, and premature incomplete CSP can block embed loading silently.

### Task 9 — Fill architecture.md placeholders
- [x] Open `_bmad-output/planning-artifacts/architecture.md`.
- [x] Find the **Record in this document** section (under "GPG Key Publication") and replace all four `[TO BE FILLED]` values:
  - `Full fingerprint`: paste the full 40-char fingerprint with spaces (formatted in 4-char groups)
  - `Key creation date`: ISO 8601 date, e.g. `2026-05-08`
  - `Expiry date`: ISO 8601 date
  - `Revocation certificate location`: describe the offline location (e.g., `USB drive in home safe — NOT in repo`)

### Task 10 — Configure git to sign commits
- [x] Configure at repo level (not global, to keep settings scoped):
  ```bash
  git config user.signingkey <FINGERPRINT>
  git config commit.gpgsign true
  ```
- [x] Verify configuration: `git config --list | grep sign`
- [x] Create a test commit (e.g., updating `.gitignore`) and verify the signature:
  ```bash
  git log --show-signature -1
  ```
  Output must show `Good signature from "a k i r a <secureakira@gmail.com>"`.

### Task 11 — Strengthen `.gitignore`
- [x] Add to the existing `.gitignore`:
  ```gitignore
  # GPG — private key material must never be committed
  *.key
  *_private.asc
  *_secret.asc
  revoke-*.asc
  secret-*.asc
  ```
- [x] Run `git status` and confirm no private key material appears in tracked or untracked files.

## Dev Notes

### Nature of This Story
This story is primarily an **operational/manual task**, not a coding task. The GPG key generation and upload require interactive terminal commands run by the author personally. The deliverables that go into the repository are: `public/pubkey.asc`, `public/.well-known/security.txt`, `public/.well-known/openpgpkey/hu/<hash>`, `public/.well-known/openpgpkey/policy`, `vercel.json` (stub), and updated `.gitignore`.

**The private key and revocation certificate must never touch the repository under any circumstances.**

### Key Algorithm Decision
Architecture mandates Ed25519 (preferred) or RSA-4096 minimum. Use Ed25519:
- `gpg --expert --full-generate-key` → option **(9) ECC and ECC** → curve **(1) Curve 25519**
- NOT option (1) RSA and RSA — that defaults to RSA-2048 which doesn't meet the minimum
- NOT DSA or ElGamal

[Source: `_bmad-output/planning-artifacts/architecture.md` → GPG Key Publication → Key hygiene table]

### Keyserver Restriction
**Only `keys.openpgp.org`**. SKS keyservers (`keyserver.ubuntu.com`, `pool.sks-keyservers.net`, `keys.gnupg.net`) are permanently banned for this project due to certificate-spam attacks that can bloat keys to tens of megabytes with no recovery path.

[Source: `_bmad-output/planning-artifacts/architecture.md` → GPG Key Publication → "Keyservers"]

### WKD Binary vs. Armored Export
The `public/.well-known/openpgpkey/hu/<hash>` file is a **binary** export, not ASCII-armored. Omit `--armor`. Supported by Thunderbird, GPG `--auto-key-locate`, ProtonMail, and other modern clients. This is a one-time setup with meaningful value for the technically-literate target audience.

### `public/` Directory Ahead of Astro
The Astro project has not been initialized yet (that happens in a later Epic 1 story). Creating `public/` at the repo root now is intentional — Astro's minimal template uses `public/` for static assets at the project root, so these files will be served at the correct URLs (`/pubkey.asc`, `/.well-known/security.txt`, etc.) when Astro is initialized here.

Do NOT create an `akirasmusicbox/public/` subdirectory. Astro will be initialized at the repo root, not in a subdirectory.

### `vercel.json` is a Stub
The `vercel.json` created in this story contains ONLY the two GPG Content-Type header rules. The full security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) belong in a dedicated Epic 1 story after the Astro project and all embed components are known. Adding an incomplete CSP now risks silently breaking embed loading later.

### git Signing Scope
Configure signing at the repo level (`git config` without `--global`) to keep settings scoped to this project. If you have a separate identity on another machine, set the signing key there manually too.

### Accident Recovery
If private key material is accidentally staged: immediately `git reset HEAD <file>` before committing. If it's been committed, use `git filter-repo` (not `git filter-branch`) to purge it from history and force-push. Treat a committed private key as compromised — revoke and regenerate.

### Project Structure Notes
Files created in this story (relative to repo root):
```
public/
  pubkey.asc                          # ASCII-armored public key
  .well-known/
    security.txt                      # security.txt per RFC 9116
    openpgpkey/
      hu/
        <z-base32-hash>               # binary WKD key export (no extension)
      policy                          # empty file, required by WKD spec
vercel.json                           # stub: GPG Content-Type headers only
.gitignore                            # updated with private key exclusion patterns
_bmad-output/planning-artifacts/
  architecture.md                     # placeholders filled with real key data
```

Files NOT created in this story (belong to later stories):
- `src/` — Astro project not initialized yet
- Full CSP / security headers in `vercel.json`
- `/pgp` Astro page (UX-DR24) — comes after Astro initialization

### References

- GPG key requirements: [Source: `_bmad-output/planning-artifacts/architecture.md` → GPG Key Publication]
- Key hygiene table: [Source: `_bmad-output/planning-artifacts/architecture.md` → GPG Key Publication → "Key hygiene"]
- vercel.json GPG headers: [Source: `_bmad-output/planning-artifacts/architecture.md` → GPG Key Publication → "vercel.json additions"]
- security.txt format: [Source: `_bmad-output/planning-artifacts/architecture.md` → GPG Key Publication → security.txt]
- NFR requirements: NFR16 (no secrets in repo), NFR17 (signed commits + public key published)
- AR requirements: AR4 (key generation), AR5 (pubkey.asc + WKD structure)
- UX requirement for /pgp page: UX-DR24 (implemented in a later story, after Astro initialization)
- Epic 1 close gate: Run `/security-review` before starting Epic 2

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- ✅ Task 1: Ed25519 GPG key generated. UID: Akira Brand (Personal Key) <akirabrand@protonmail.com>. Fingerprint: E6C3 5F6B 598A E564 0744  1A51 8218 2BAB BB58 ECEF. Expires: 2027-05-09.
- ✅ Task 2: Key uploaded to keys.openpgp.org. Confirmed via email from keyserver.
- ✅ Task 3: Revocation certificate generated and stored on USB thumb drive offline. Not in repo. Calendar reminder set.
- ✅ Task 4: Created `public/.well-known/openpgpkey/hu/` directory tree at repo root ahead of Astro init.
- ✅ Task 5: `public/pubkey.asc` exported (689 bytes). Verified begins with `-----BEGIN PGP PUBLIC KEY BLOCK-----`. No private key material.
- ✅ Task 6: WKD binary exported to `public/.well-known/openpgpkey/hu/q736ttod8166r8cwurunzdpqaira3pdr` (450 bytes). `policy` file created (empty). Used email-based export (`akirabrand@protonmail.com`) after fingerprint-based export produced 0 bytes.
- ✅ Task 7: `public/.well-known/security.txt` created. Contact updated to `akirabrand@protonmail.com` (actual key email). Expires: 2027-05-09T00:00:00.000Z.
- ✅ Task 8: `vercel.json` stub created with GPG-only Content-Type headers. No premature CSP added.
- ✅ Task 9: `architecture.md` placeholders filled — fingerprint, creation date (2026-05-09), expiry (2027-05-09), revocation cert location (USB thumb drive, offline).
- ✅ Task 10: Git signing configured at repo level. `commit.gpgsign=true`, `user.signingkey=E6C35F6B598AE56407441A5182182BABBB58ECEF`. Signed commit 5558089 verified: `Good signature from "Akira Brand (Personal Key) <akirabrand@protonmail.com>" [ultimate]`.
- ✅ Task 11: `.gitignore` extended with GPG exclusion patterns. No private key material in working tree.

### File List

- `public/.well-known/security.txt` (new)
- `public/.well-known/openpgpkey/hu/` (new directory — WKD binary key goes here after Task 6)
- `public/.well-known/openpgpkey/policy` (new — empty, added after Task 6)
- `public/pubkey.asc` (new — added after Task 5)
- `vercel.json` (new)
- `.gitignore` (modified — GPG exclusion patterns added)
