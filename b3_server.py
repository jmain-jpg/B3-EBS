from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, unquote, urlsplit
import base64
import binascii
import hmac
import json
import os
import re
import secrets
import threading
import time
import unicodedata
import uuid


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
STATE_FILE = DATA_DIR / "b3-state.json"
PHOTO_DIR = DATA_DIR / "stock-photos"
PASSWORD_FILE = DATA_DIR / "local-server-password.txt"
MAX_STOCK_PHOTO_BYTES = 750 * 1024
MAX_JSON_BYTES = 8 * 1024 * 1024
PORT = int(os.environ.get("B3_LOCAL_PORT", "4173"))
STATE_LOCK = threading.RLock()


def local_password():
    configured = os.environ.get("B3_LOCAL_PASSWORD", "").strip()
    if configured:
        return configured
    DATA_DIR.mkdir(exist_ok=True)
    if PASSWORD_FILE.exists():
        saved = PASSWORD_FILE.read_text(encoding="utf-8").strip()
        if saved:
            return saved
    generated = secrets.token_urlsafe(24)
    PASSWORD_FILE.write_text(generated, encoding="utf-8")
    return generated


LOCAL_PASSWORD = local_password()
HOST = os.environ.get("B3_LOCAL_HOST", "0.0.0.0")


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
    server_version = "B3EBS"
    sys_version = ""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "same-origin")
        self.send_header("Permissions-Policy", "camera=(self), microphone=(), geolocation=()")
        self.send_header(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; "
            "base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
        )
        super().end_headers()

    def is_authorized(self):
        header = self.headers.get("Authorization", "")
        if not header.startswith("Basic "):
            return False
        try:
            decoded = base64.b64decode(header[6:], validate=True).decode("utf-8")
            username, separator, password = decoded.partition(":")
            return bool(separator) and hmac.compare_digest(username, "b3") and hmac.compare_digest(password, LOCAL_PASSWORD)
        except (binascii.Error, UnicodeDecodeError, ValueError):
            return False

    def require_authorization(self):
        if self.is_authorized():
            return True
        body = b"B3 Floral EBS - password required"
        self.send_response(401)
        self.send_header("WWW-Authenticate", 'Basic realm="B3 Floral EBS", charset="UTF-8"')
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        return False

    def read_json_body(self, maximum=MAX_JSON_BYTES):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError as error:
            raise ValueError("Invalid Content-Length") from error
        if length < 1:
            raise ValueError("JSON body is required")
        if length > maximum:
            raise OverflowError("Request body is too large")
        try:
            return json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError) as error:
            raise ValueError("Invalid JSON") from error

    def do_GET(self):
        if not self.require_authorization():
            return
        query = parse_qs(urlsplit(self.path).query)
        self.path = clean_request_path(self.path)
        if self.path == "/api/health":
            record = read_state()
            self.send_json({
                "ok": True,
                "service": "b3-floral-ebs-local",
                "version": int(record.get("updatedAt", 0) or 0),
                "checkedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            })
            return
        if self.path == "/api/stock-photo":
            self.send_stock_photo(query)
            return
        if self.path == "/api/sync":
            try:
                self.send_json(read_sync_page(query))
            except (TypeError, ValueError):
                self.send_error(400, "Invalid sync query")
            return
        if self.path == "/api/state":
            self.send_json(read_state())
            return
        super().do_GET()

    def do_POST(self):
        if not self.require_authorization():
            return
        self.path = clean_request_path(self.path)
        if self.path == "/api/stock-photo":
            self.save_stock_photo()
            return
        if self.path not in {"/api/state", "/api/sync"}:
            self.send_error(404)
            return

        try:
            payload = self.read_json_body()
        except OverflowError:
            self.send_error(413, "Request body is too large")
            return
        except ValueError as error:
            self.send_error(400, str(error))
            return

        if self.path == "/api/sync":
            try:
                cursor = apply_sync_patch(payload.get("patch", {}))
            except (TypeError, ValueError) as error:
                self.send_error(400, str(error))
                return
            self.send_json({"cursor": cursor})
            return

        state = payload.get("state", payload)
        if not isinstance(state, dict):
            self.send_error(400, "State must be an object")
            return

        with STATE_LOCK:
            current = read_state()
            base_updated_at = int(payload.get("baseUpdatedAt", 0) or 0)
            current_updated_at = int(current.get("updatedAt", 0) or 0)
            if base_updated_at and base_updated_at != current_updated_at:
                self.send_json(current, status=409)
                return
            record = {"updatedAt": next_cursor(current_updated_at), "state": state}
            write_state(record)
        self.send_json(record)

    def do_DELETE(self):
        if not self.require_authorization():
            return
        self.path = clean_request_path(self.path)
        if self.path != "/api/stock-photo":
            self.send_error(404)
            return
        try:
            payload = self.read_json_body(maximum=64 * 1024)
            target = stock_photo_path(payload.get("key", ""))
        except OverflowError:
            self.send_error(413, "Request body is too large")
            return
        except ValueError:
            self.send_error(400, "Invalid stock photo key")
            return
        target.unlink(missing_ok=True)
        self.send_json({"ok": True})

    def save_stock_photo(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.send_error(400, "Invalid Content-Length")
            return
        content_type = self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
        if length < 1 or length > MAX_STOCK_PHOTO_BYTES or content_type not in {"image/jpeg", "image/webp"}:
            self.send_error(413 if length > MAX_STOCK_PHOTO_BYTES else 415, "Invalid stock photo")
            return
        body = self.rfile.read(length)
        is_jpeg = content_type == "image/jpeg" and body[:3] == b"\xff\xd8\xff"
        is_webp = content_type == "image/webp" and body[:4] == b"RIFF" and body[8:12] == b"WEBP"
        if not (is_jpeg or is_webp):
            self.send_error(400, "Invalid photo file")
            return
        stock_id = safe_photo_segment(self.headers.get("X-Stock-Id", "stock"), "stock")
        product_code = safe_photo_segment(self.headers.get("X-Product-Code", "photo"), "photo")
        now = time.gmtime()
        extension = "webp" if content_type == "image/webp" else "jpg"
        key = f"stock/{now.tm_year}/{now.tm_mon:02d}/{stock_id}/{product_code}-{uuid.uuid4()}.{extension}"
        target = stock_photo_path(key)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(body)
        self.send_response(201)
        photo = {
            "key": key,
            "contentType": content_type,
            "width": safe_positive_int(self.headers.get("X-Photo-Width", 0)),
            "height": safe_positive_int(self.headers.get("X-Photo-Height", 0)),
            "size": len(body),
            "uploadedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", now),
        }
        self.send_json({"photo": photo}, status=201, response_started=True)

    def send_stock_photo(self, query):
        try:
            target = stock_photo_path(query.get("key", [""])[0])
        except ValueError:
            self.send_error(400, "Invalid stock photo key")
            return
        if not target.exists():
            self.send_error(404, "Photo not found")
            return
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "image/webp" if target.suffix.lower() == ".webp" else "image/jpeg")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)

    def send_json(self, payload, status=200, response_started=False):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        if not response_started:
            self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def safe_photo_segment(value, fallback):
    cleaned = re.sub(r"[^a-zA-Z0-9_-]+", "-", str(value or fallback)).strip("-")[:100]
    return cleaned or fallback


def safe_positive_int(value):
    try:
        return max(0, int(value or 0))
    except (TypeError, ValueError):
        return 0


def stock_photo_path(key):
    if not str(key).startswith("stock/") or ".." in str(key):
        raise ValueError("Invalid stock photo key")
    relative = Path(str(key)[len("stock/"):])
    target = (PHOTO_DIR / relative).resolve()
    if PHOTO_DIR.resolve() not in target.parents:
        raise ValueError("Invalid stock photo key")
    return target


def read_state():
    with STATE_LOCK:
        if not STATE_FILE.exists():
            return {"updatedAt": 0, "state": {}}
        try:
            return json.loads(STATE_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {"updatedAt": 0, "state": {}}


def write_state(record):
    with STATE_LOCK:
        DATA_DIR.mkdir(exist_ok=True)
        temp_file = STATE_FILE.with_name(f".{STATE_FILE.name}.{uuid.uuid4().hex}.tmp")
        try:
            temp_file.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
            temp_file.replace(STATE_FILE)
        finally:
            temp_file.unlink(missing_ok=True)


def next_cursor(previous=0):
    return max(int(time.time() * 1000), int(previous or 0) + 1)


def entity_key(section, item):
    if not isinstance(item, dict):
        return ""
    if section == "stock":
        return str(item.get("productCode") or item.get("id") or "")
    return str(item.get("id") or item.get("name") or item.get("productCode") or "")


def read_sync_page(query):
    record = read_state()
    state = record.get("state", {}) if isinstance(record, dict) else {}
    cursor = int(float(record.get("updatedAt", 0) or 0)) if isinstance(record, dict) else 0
    since = int(query.get("since", ["0"])[0] or 0)
    page_size = max(1, min(5000, int(query.get("pageSize", ["2000"])[0] or 2000)))
    entity_offset = max(0, int(query.get("entityOffset", ["0"])[0] or 0))
    value_offset = max(0, int(query.get("valueOffset", ["0"])[0] or 0))
    include_entities = query.get("includeEntities", ["1"])[0] != "0"
    include_values = query.get("includeValues", ["1"])[0] != "0"

    if since >= cursor and since > 0:
        return {
            "cursor": cursor,
            "snapshotVersion": cursor,
            "entities": [],
            "values": [],
            "entitiesHasMore": False,
            "valuesHasMore": False,
            "nextEntityOffset": entity_offset,
            "nextValueOffset": value_offset,
            "hasMore": False,
        }

    all_entities = []
    all_values = []
    for section, value in state.items():
        if isinstance(value, list):
            for sort_order, item in enumerate(value):
                key = entity_key(section, item)
                if key:
                    all_entities.append({
                        "section": section,
                        "entityKey": key,
                        "sortOrder": sort_order,
                        "updatedAt": cursor,
                        "deleted": False,
                        "data": item,
                    })
        else:
            all_values.append({"key": section, "updatedAt": cursor, "deleted": False, "data": value})

    entities = all_entities[entity_offset:entity_offset + page_size] if include_entities else []
    values = all_values[value_offset:value_offset + page_size] if include_values else []
    next_entity_offset = entity_offset + len(entities)
    next_value_offset = value_offset + len(values)
    entities_more = include_entities and next_entity_offset < len(all_entities)
    values_more = include_values and next_value_offset < len(all_values)
    return {
        "cursor": cursor,
        "snapshotVersion": cursor,
        "entities": entities,
        "values": values,
        "entitiesHasMore": entities_more,
        "valuesHasMore": values_more,
        "nextEntityOffset": next_entity_offset,
        "nextValueOffset": next_value_offset,
        "hasMore": entities_more or values_more,
    }


def apply_sync_patch(patch):
    if not isinstance(patch, dict):
        raise TypeError("Patch must be an object")
    with STATE_LOCK:
        record = read_state()
        state = record.get("state", {}) if isinstance(record, dict) else {}
        if not isinstance(state, dict):
            state = {}

        arrays = patch.get("arrays", {})
        if not isinstance(arrays, dict):
            raise TypeError("Patch arrays must be an object")
        for section, changes in arrays.items():
            if not isinstance(changes, dict):
                continue
            items = state.get(section, [])
            if not isinstance(items, list):
                items = []
            deletes = {str(value) for value in changes.get("deletes", [])}
            items = [item for item in items if entity_key(section, item) not in deletes]
            positions = {entity_key(section, item): index for index, item in enumerate(items)}
            for item in changes.get("upserts", []):
                key = entity_key(section, item)
                if not key:
                    continue
                if key in positions:
                    items[positions[key]] = item
                else:
                    positions[key] = len(items)
                    items.append(item)
            state[section] = items

        values = patch.get("values", {})
        if not isinstance(values, dict):
            raise TypeError("Patch values must be an object")
        state.update(values)
        cursor = next_cursor(record.get("updatedAt", 0))
        write_state({"updatedAt": cursor, "state": state})
        return cursor


if __name__ == "__main__":
    DATA_DIR.mkdir(exist_ok=True)
    server = ThreadingHTTPServer((HOST, PORT), B3Handler)
    print(f"B3 Floral EBS server running at http://127.0.0.1:{PORT}/")
    print(f"Phone URL uses this computer IP, for example http://192.168.1.15:{PORT}/")
    print(f"Username: b3 | Password file: {PASSWORD_FILE}")
    server.serve_forever()
