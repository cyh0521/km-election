"""Validate source conservation and known totals for the independent preview."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
read = lambda name: json.loads((root/'data'/name).read_text(encoding='utf-8'))
catalog = read('catalog.json')
assert len(catalog) == len({e['id'] for e in catalog}), 'Duplicate elections'
assert len(catalog) == 332
for entry in catalog:
    e = read(entry['id']+'.json')
    c = e['county']
    if not e['pending'] and c['valid'] is not None:
        assert sum(c['votes']) == c['valid'], f"Votes do not match valid total: {e['id']}"
    for name,t in e['towns'].items():
        assert len(t['votes'])==len(e['candidates'])
        villages=list(t['villages'].values())
        if villages and sum(v['rowCount'] for v in villages)==t['rowCount']:
            assert [sum(v['votes'][i] for v in villages) for i in range(len(t['votes']))] == t['votes'], (e['id'],name)
        for v in villages:
            if v['stations']:
                assert sum(s['valid'] or 0 for s in v['stations']) == (v['valid'] or 0)
a = read('A2024.json')
assert a['county']['votes']==[13038,4569,28005]
assert a['county']['valid']==45612
assert read('B2024.json')['towns']['金城鎮']['valid']==13764
assert read('E2026.json')['pending'] is True
assert read('E1993.json')['towns']['金城鎮']['villages']=={}
m=read('map.json')
assert len(m['towns'])==6 and len(m['villages'])==37
assert len({(x['town'],x['village']) for x in m['villages']})==37
assert all(x['polygons'] for x in m['towns']+m['villages'])
people=read('people.json')
for p in people.values():
    if p['photo']: assert (root.parent/'candidates'/p['photo']).is_file()
print(f"PASS: {len(catalog)} elections; candidate/valid totals, village aggregation, station totals, pending and missing detail, 6 towns / 37 villages, and photo references.")
