from pathlib import Path
import socket
import subprocess
import sys


ROOT = Path(__file__).resolve().parent
PORT = 4173


def server_is_running():
    try:
        with socket.create_connection(("127.0.0.1", PORT), timeout=1):
            return True
    except OSError:
        return False


if not server_is_running():
    subprocess.Popen(
        [sys.executable, str(ROOT / "b3_server.py")],
        cwd=ROOT,
        stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=subprocess.CREATE_NO_WINDOW,
        close_fds=True,
    )
