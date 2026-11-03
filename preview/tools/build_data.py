"""Read existing CSVs and build an independent preview; never edit source files."""
import csv
import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'preview' / 'data'
TOWNS = {'金城鎮', '金寧鄉', '金湖鎮', '金沙鎮', '烈嶼鄉', '烏坵鄉'}
OUT.mkdir(parents=True, exist_ok=True)

def save(name, data):
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')

def number(value):
    value = value.strip().replace(',', '')
    return int(value) if re.fullmatch(r'\d+', value) else None

def aggregate(rows, count):
    def total(key):
        vals = [r[key] for r in rows]
        return sum(vals) if vals and all(v is not None for v in vals) else None
    return {'votes': [sum(r['votes'][i] for r in rows) for i in range(count)],
            'valid': total('valid'), 'invalid': total('invalid'), 'eligible': total('eligible'), 'rowCount': len(rows)}

source = (ROOT / 'script.js').read_text(encoding='utf-8-sig')
pattern = r'\{file:\s*"([^"]+)",\s*year:\s*"([^"]+)",\s*type:\s*"([^"]+)",\s*uiName:\s*"([^"]+)"'
catalog, warnings, seen = [], [], set()
for file, year, kind, title in re.findall(pattern, source):
    if file in seen:
        continue
    seen.add(file)
    path = ROOT / file
    if not path.is_file():
        warnings.append(f'Missing source: {file}')
        continue
    rows = list(csv.reader(path.read_text(encoding='utf-8-sig').splitlines()))
    if len(rows) < 4:
        warnings.append(f'No result rows: {file}')
        continue
    start = 4 if len(rows[2]) > 2 and rows[2][2].strip() == '投開票所編號' else 2
    end = start
    while end < min(len(rows[0]), len(rows[1])) and rows[0][end].strip() and rows[1][end].strip():
        end += 1
    candidates = []
    for i in range(start, end):
        raw = rows[1][i].strip()
        partner = re.search(r'\[(.*?)\]', raw)
        party = rows[2][i].strip()
        candidates.append({'name': re.sub(r'\[.*?\]|[*!#?]', '', raw).strip(), 'number': rows[0][i].strip(),
                           'party': '無黨籍' if party == '無' else party,
                           'partner': partner.group(1) if partner else '', 'elected': '*' in raw})
    if not candidates:
        warnings.append(f'Unsupported headers: {file}')
        continue
    records = []
    for r in rows[3:]:
        if len(r) < end + 3 or not any(x.strip() for x in r) or '鄉鎮' in r[0]:
            continue
        records.append({'town': r[0].strip(), 'village': r[1].strip(),
                        'station': r[2].strip() if start == 4 else '', 'location': r[3].strip() if start == 4 else '',
                        'votes': [number(v) or 0 for v in r[start:end]],
                        'valid': number(r[end]), 'invalid': number(r[end+1]), 'eligible': number(r[end+2])})
    groups = defaultdict(list)
    for row in records:
        if row['town'] in TOWNS:
            groups[row['town']].append(row)
    towns = {}
    for town, townrows in groups.items():
        villages = defaultdict(list)
        for row in townrows:
            if row['village']:
                villages[row['village']].append(row)
        towns[town] = {**aggregate(townrows, len(candidates)), 'villages': {
            name: {**aggregate(vrows, len(candidates)), 'stations': [r for r in vrows if r['station']]}
            for name, vrows in villages.items()}}
    key = path.stem
    pending = '!' in title
    entry = {'id': key, 'year': int(year), 'type': kind, 'title': title.replace('!', ''),
             'series': re.sub(r'\d{4}', '', key, count=1), 'pending': pending, 'source': file,
             'date': rows[0][1].strip(), 'towns': list(towns)}
    catalog.append(entry)
    result = {**entry, 'candidates': candidates, 'county': aggregate(records, len(candidates)), 'towns': towns}
    save(key + '.json', result)
    if not pending and result['county']['valid'] is not None and sum(result['county']['votes']) != result['county']['valid']:
        warnings.append(f'Candidate/valid total mismatch (preserved source): {key}')

people = {}
for p in csv.DictReader((ROOT / 'candidates.csv').read_text(encoding='utf-8-sig').splitlines()):
    photo = p.get('照片檔名', '').strip()
    people[p['姓名']] = {'photo': photo if photo and (ROOT / 'candidates' / photo).is_file() else '',
                       'birth': p.get('出生年', ''), 'birthplace': p.get('出生地', '')}
save('catalog.json', catalog)
save('people.json', people)
save('data-audit.json', {'elections': len(catalog), 'warnings': warnings})
print(json.dumps({'elections': len(catalog), 'people': len(people), 'warnings': warnings}, ensure_ascii=False))
