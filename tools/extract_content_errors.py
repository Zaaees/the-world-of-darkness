"""Register literal API error messages for display-only overrides in the frontend."""
import ast
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
destination = root / 'data/site_content.json'
registry = json.loads(destination.read_text(encoding='utf-8'))
known = {entry['default'] for entry in registry.values() if entry.get('catalog') and entry['scope'] == 'common'}
sequence = max(int(key.rsplit('.', 1)[1]) for key in registry)
sources = [root / 'api_server.py', root / 'utils/api_auth.py', *sorted((root / 'modules').rglob('*.py'))]
for source in sources:
    if 'tests' in source.parts or 'content' in source.parts:
        continue
    tree = ast.parse(source.read_text(encoding='utf-8-sig'))
    texts = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Dict):
            texts.extend(value.value for key, value in zip(node.keys, node.values)
                         if isinstance(key, ast.Constant) and key.value in ('error', 'message')
                         and isinstance(value, ast.Constant) and isinstance(value.value, str))
        if source.name == 'api_auth.py' and isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'failure':
            texts.extend(arg.value for arg in node.args[:1] if isinstance(arg, ast.Constant) and isinstance(arg.value, str))
    for text in texts:
        if text in known:
            continue
        sequence += 1
        registry[f'common.text.{sequence:05}'] = {
            'scope': 'common', 'source': source.relative_to(root).as_posix(), 'default': text,
            'maxLength': 12000, 'public': False, 'catalog': True, 'variables': [],
        }
        known.add(text)
destination.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(registry)} registered texts')
