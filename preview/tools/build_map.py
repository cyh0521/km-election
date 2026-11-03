"""Clip official administrative boundaries against OSM land rings.

Dependencies: pyshp, shapely. Source downloads are in .build and never shipped.
The output is a display map, not a historical electoral-boundary dataset.
"""
import json
import math
import sys
import zipfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.build' / 'python'))
import shapefile
from shapely.geometry import shape, LineString, Polygon, MultiPolygon, box
from shapely.ops import polygonize, unary_union

cache = ROOT / '.build'
with zipfile.ZipFile(cache / 'villages.zip') as z:
    shp = next(n for n in z.namelist() if n.endswith('.shp'))
    stem = shp[:-4]
    import io
    reader = shapefile.Reader(shp=io.BytesIO(z.read(shp)), dbf=io.BytesIO(z.read(stem+'.dbf')), shx=io.BytesIO(z.read(stem+'.shx')), encoding='utf-8')

coast = json.loads((cache / 'coastline.json').read_text(encoding='utf-8'))
lines = [LineString([(p['lon'],p['lat']) for p in w['geometry']]) for w in coast['elements'] if 'geometry' in w]
land = unary_union(list(polygonize(unary_union(lines))))
if land.is_empty:
    raise RuntimeError('Coastline does not form closed land polygons; do not ship un-clipped boundaries.')

villages, towns = [], defaultdict(list)
for rec in reader.iterShapeRecords():
    props = rec.record.as_dict()
    if props['COUNTYCODE'] != '09020':
        continue
    geom = shape(rec.shape.__geo_interface__)
    if not geom.is_valid:
        geom = geom.buffer(0)
    geom = geom.intersection(land)
    if geom.is_empty:
        continue
    towns[props['TOWNNAME']].append(geom)
    if props['VILLNAME']:
        villages.append((props['TOWNNAME'], props['VILLNAME'], geom))

main = box(118.12,24.32,118.52,24.60)
def polygons(geom):
    if isinstance(geom, Polygon):
        return [geom]
    return [p for p in getattr(geom, 'geoms', []) if isinstance(p, Polygon)]

def project(x,y,inset=False):
    if inset:
        return [round(95+(x-119.455)*6300,2),round(545-(y-24.99)*6900,2)]
    return [round(70+(x-118.20)*2500,2),round(520-(y-24.38)*2800,2)]

def feature(town, village, geom):
    inset = town == '烏坵鄉'
    if not inset:
        geom = geom.intersection(main)
    # Preserve even small islands; discard only sub-pixel slivers.
    parts = [p.simplify(.000055, preserve_topology=True) for p in polygons(geom) if p.area > 0.000000015]
    if not parts:
        return None
    largest = max(parts,key=lambda p:p.area)
    label = largest.representative_point()
    rings = []
    for p in parts:
        rings.append([[project(x,y,inset) for x,y in p.exterior.coords]] + [[project(x,y,inset) for x,y in r.coords] for r in p.interiors])
    return {'town':town, 'village':village, 'polygons':rings, 'label':project(label.x,label.y,inset), 'inset':inset}

result = {'towns':[], 'villages':[], 'sources': {
    'boundaries':f'NLSC {Path(stem).name} (government open data)',
    'coastline':'© OpenStreetMap contributors, ODbL; downloaded 2026-11-04',
    'note':'Current administrative boundaries clipped to coastline; historical records joined by place name, not historical boundary reconstruction.'}}
for town, parts in towns.items():
    f = feature(town,'',unary_union(parts))
    if f: result['towns'].append(f)
for town,village,geom in villages:
    f = feature(town,village,geom)
    if f: result['villages'].append(f)
if len(result['towns']) != 6 or len(result['villages']) != 37:
    raise RuntimeError(f'Unexpected coverage: {len(result["towns"])} towns / {len(result["villages"])} villages')
(ROOT/'data'/'map.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps({'towns':len(result['towns']),'villages':len(result['villages']),'bytes':(ROOT/'data'/'map.json').stat().st_size}))
