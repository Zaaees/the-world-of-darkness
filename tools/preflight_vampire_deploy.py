"""Run on the existing Fly machine before replacing its application image.

No secret or character data is printed. The backup stays on the private volume.
"""
import datetime
import json
import os
from pathlib import Path
import sqlite3
import urllib.request


def preflight(source=Path('/app/storage/world_of_darkness.db')):
    secret = os.environ.get('SHEETS_API_SECRET')
    url = os.environ.get('GOOGLE_SHEETS_API_URL', '')
    if not secret or not url.startswith('https://script.google.com/macros/s/') or not url.endswith('/exec'):
        raise RuntimeError('Missing or invalid Sheets deployment configuration')
    payload = json.dumps({'action': 'get', 'userId': '0', 'secret': secret}).encode()
    request = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(request, timeout=30) as response:
        result = json.load(response)
    if result.get('success') is not True or 'character' not in result:
        raise RuntimeError('The Sheets deployment did not accept server authentication')
    source = Path(source)
    if not source.is_file():
        raise RuntimeError('Persistent database not found; deployment stopped')
    folder = source.parent / 'backups'
    folder.mkdir(exist_ok=True, mode=0o700)
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    target = folder / f'before-vampire-deploy-{stamp}.db'
    with target.open('xb'):
        pass
    target.chmod(0o600)
    with sqlite3.connect(source.as_uri() + '?mode=ro', uri=True) as src, sqlite3.connect(target) as dst:
        src.backup(dst)
        if dst.execute('PRAGMA integrity_check').fetchall() != [('ok',)]:
            raise RuntimeError('Backup integrity check failed; deployment stopped')
    print('Sheets authentication verified. Private SQLite backup verified:', target.name)


if __name__ == '__main__':
    preflight()
