# B3 Floral EBS

Static responsive floral shop management dashboard with separate views for dashboard, production stock entry, cashier vouchers and follow-up payments, daily expenses, inventory, reports, login permissions, staff settings, and category settings.

## Open On Desktop And Phone

For one-device testing, open `index.html` in a browser.

For desktop and phone to see the same data:

1. Double-click `Start B3 EBS.bat`.
2. Keep that window running.
3. Open `http://127.0.0.1:4173/index.html` on the desktop.
4. Open the same server from the phone using the computer IP, for example `http://192.168.1.15:4173/index.html`.

The browser will ask for HTTP Basic authentication. Use username `b3` and the random password stored in `data/local-server-password.txt`. Keep that file private. The same password is reused after restarts; delete only that password file if you intentionally want to rotate it.

The shared data is saved in `data/b3-state.json`.

## Files

- `index.html` - dashboard structure and forms
- `styles.css` - responsive app styling and sticker print layout
- `app.js` - local data storage, view routing, category-based auto product codes, partial payments, reports, stock deduction, voucher item tables, settings, login permissions, and sticker printing
- `b3_server.py` - local web server with shared data API for desktop and phone
- `Start B3 EBS.bat` - double-click launcher for the local web server

## Notes

When opened through `b3_server.py`, the app syncs browser data to `data/b3-state.json` so phones on the same Wi-Fi can see the same records. For access from anywhere, connect the same UI to a cloud database and user login backend.

The local server requires authentication, limits JSON request size, protects concurrent state writes, and publishes an authenticated health check at `/api/health`.
