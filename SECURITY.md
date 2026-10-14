# B3 Floral EBS security notes

## Local server

The local server listens on the LAN and requires HTTP Basic authentication.

- Username: `b3`
- Password: `data/local-server-password.txt`
- Rotate the local password by stopping the server, deleting only that password file, and restarting the server.
- Do not share the password file, `data/`, `logs/`, `backups/`, or `cloudflare/recovery-state.json`.

Use the local server only on a trusted private Wi-Fi network. HTTP Basic authentication protects access but does not encrypt traffic. Do not expose port 4173 directly to the internet.

## Cloud deployment

Set `APP_PASSWORD` as a Wrangler secret and use a long, unique value. Production builds exclude the local recovery snapshot and business-data directories.

The shared cloud password is currently the outer security boundary. Staff roles inside the browser are workflow controls, not independent server-enforced authorization. Before granting access to mutually untrusted users, add server-issued staff sessions, password hashing, and endpoint-level role enforcement.

New and updated staff passwords are stored as salted PBKDF2-SHA-256 hashes. A legacy plaintext staff password is replaced with a hash after that staff member's next successful login. Server-issued staff sessions and endpoint-level role enforcement are still required before treating staff roles as a security boundary.

Emergency rotations save a temporary credential handoff document under the ignored `data/` directory. Distribute each password privately, then delete the handoff document after staff confirm access.

## Repository hygiene

Business state and logs are ignored and must remain untracked. If a repository containing previous copies was shared, rotate affected credentials and remove sensitive files from the remote Git history using a reviewed history-rewrite procedure.
