from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit
import json
import time
import unicodedata


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
STATE_FILE = DATA_DIR / "b3-state.json"
HOST = "0.0.0.0"
PORT = 4173


def clean_request_path(request_path):
    parsed = urlsplit(request_path)
    decoded_path = unquote(parsed.path)

    while decoded_path and (
        decoded_path[0].isspace() or unicodedata.category(decoded_path[0]) == "Cf"
    ):
        decoded_path = decoded_path[1:]

    while decoded_path and (
        decoded_path[-1].isspace() or unicodedata.category(decoded_path[-1]) == "Cf"
    ):
        decoded_path = decoded_path[:-1]

    return quote(decoded_path, safe="/:@-._~!$&'()*+,;=")


class B3Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        self.path = clean_request_path(self.path)
        if self.path == "/api/state":
            self.send_json(read_state())
            return
        super().do_GET()

    def do_POST(self):
        self.path = clean_request_path(self.path)
        if self.path != "/api/state":
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", 0))
        try:
            payload = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
            return

        state = payload.get("state", payload)
        if not isinstance(state, dict):
            self.send_error(400, "State must be an object")
            return

        DATA_DIR.mkdir(exist_ok=True)
        record = {"updatedAt": time.time(), "state": state}
        temp_file = STATE_FILE.with_suffix(".tmp")
        temp_file.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
        temp_file.replace(STATE_FILE)
        self.send_json(record)

    def send_json(self, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def read_state():
    if not STATE_FILE.exists():
        return {"updatedAt": 0, "state": {}}
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {"updatedAt": 0, "state": {}}


if __name__ == "__main__":
    DATA_DIR.mkdir(exist_ok=True)
    server = ThreadingHTTPServer((HOST, PORT), B3Handler)
    print(f"B3 Floral EBS server running at http://127.0.0.1:{PORT}/")
    print("Phone URL uses this computer IP, for example http://192.168.1.15:4173/")
    server.serve_forever()
