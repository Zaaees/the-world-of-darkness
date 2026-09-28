"""Create or verify a consistent SQLite copy without overwriting any file."""
import argparse
from pathlib import Path
import sqlite3


def verify(path):
    with sqlite3.connect(Path(path).resolve().as_uri() + '?mode=ro', uri=True) as db:
        if db.execute('PRAGMA integrity_check').fetchall() != [('ok',)]:
            raise RuntimeError('SQLite integrity check failed')
        return dict(db.execute("SELECT name, type FROM sqlite_master WHERE type='table'"))


def backup(source, destination):
    source, destination = Path(source).resolve(), Path(destination).resolve()
    verify(source)
    # Exclusive creation prevents an accidental overwrite, including during restore drills.
    with destination.open('xb'):
        pass
    with sqlite3.connect(source.as_uri() + '?mode=ro', uri=True) as src:
        with sqlite3.connect(destination) as dst:
            src.backup(dst)
    verify(destination)
    return destination


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source')
    parser.add_argument('destination', nargs='?')
    args = parser.parse_args()
    if args.destination:
        print(backup(args.source, args.destination))
    else:
        print('Integrity OK; tables:', ', '.join(sorted(verify(args.source))))
