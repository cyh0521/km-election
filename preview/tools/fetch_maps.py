"""Download openly available boundary/coastline data into ignored build cache."""
import json
import ssl
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.build'
CACHE.mkdir(exist_ok=True)
context = ssl.create_default_context()
# The government's certificate predates strict X.509 SKI requirements.
# Certificate chains and hostnames are still verified.
context.verify_flags &= ~ssl.VERIFY_X509_STRICT
url = 'https://maps.nlsc.gov.tw/download/' + urllib.parse.quote('村(里)界(TWD97經緯度).zip')
target = CACHE / 'villages.zip'
if not target.exists():
    with urllib.request.urlopen(url, context=context, timeout=180) as r:
        target.write_bytes(r.read())
print('Official village boundaries:', target.stat().st_size, flush=True)
query = '[out:json][timeout:90];(way["natural"="coastline"](24.32,118.12,24.60,118.52);way["natural"="coastline"](24.94,119.40,25.03,119.52););out geom;'
target = CACHE / 'coastline.json'
if not target.exists():
    data = urllib.parse.urlencode({'data': query}).encode()
    req = urllib.request.Request('https://overpass-api.de/api/interpreter', data=data, headers={'User-Agent': 'KinmenElectionPreview/1.0'})
    with urllib.request.urlopen(req, timeout=150) as r:
        target.write_bytes(r.read())
print('OpenStreetMap coastline ways:', len(json.loads(target.read_text(encoding='utf-8'))['elements']), flush=True)
