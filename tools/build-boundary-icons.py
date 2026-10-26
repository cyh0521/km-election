"""Build small raster menu icons from NLSC village boundaries.

Usage: python tools/build-boundary-icons.py /path/to/VILLAGE.shp
Requires pyshp, shapely and Pillow. Original SHP files need not ship with the site.
"""
import json
import math
import sys
from collections import defaultdict
from pathlib import Path

import shapefile
from PIL import Image, ImageDraw
from shapely.geometry import shape
from shapely.ops import transform, unary_union

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'images' / 'administrative-icons'
OUT.mkdir(parents=True, exist_ok=True)
towns = defaultdict(list)
villages = {}
reader = shapefile.Reader(sys.argv[1], encoding='utf-8')
for record in reader.iterShapeRecords():
    props = record.record.as_dict()
    if props['COUNTYCODE'] != '09020':
        continue
    geometry = shape(record.shape.__geo_interface__)
    if not geometry.is_valid:
        geometry = geometry.buffer(0)
    town, village = props['TOWNNAME'], props['VILLNAME']
    towns[town].append(geometry)
    if village:
        villages.setdefault((town, village), []).append(geometry)


def draw_icon(geometry, filename, main_island_only=False):
    # Correct longitude scale at Kinmen's latitude, then simplify at icon scale.
    geometry = transform(lambda x, y, z=None: (x * math.cos(math.radians(24.45)), y), geometry)
    parts = list(geometry.geoms) if geometry.geom_type == 'MultiPolygon' else [geometry]
    largest = max(p.area for p in parts)
    main = max(parts, key=lambda p: p.area)
    if main_island_only:
        parts = [main]
    bx0, by0, bx1, by1 = main.bounds
    nearby = max(bx1-bx0, by1-by0) * .65
    parts = [p for p in parts if p.area >= largest * .012 and p.distance(main) <= nearby]
    geometry = unary_union(parts)
    x0, y0, x1, y1 = geometry.bounds
    span = max(x1 - x0, y1 - y0)
    geometry = geometry.simplify(span * .009, preserve_topology=True)
    parts = list(geometry.geoms) if geometry.geom_type == 'MultiPolygon' else [geometry]
    scale = 8
    image = Image.new('RGBA', (64 * scale, 64 * scale))
    pen = ImageDraw.Draw(image)
    # A quiet gold geometric accent ties the maps to the existing icon palette.
    pen.polygon([(42*scale, 8*scale), (58*scale, 35*scale), (27*scale, 35*scale)], fill='#F6E6C7')
    factor = 48 / span
    cx, cy = (x0+x1)/2, (y0+y1)/2
    def project(ring):
        return [((32+(x-cx)*factor)*scale, (32-(y-cy)*factor)*scale) for x, y in ring.coords]
    for part in parts:
        points = project(part.exterior)
        pen.polygon(points, fill='#E0EFEB')
        pen.line(points, fill='#147E83', width=round(2.5*scale), joint='curve')
        radius = 1.25*scale
        for x, y in points:
            pen.ellipse((x-radius, y-radius, x+radius, y+radius), fill='#147E83')
    image.resize((192, 192), Image.Resampling.LANCZOS).save(OUT / filename)


manifest = {'towns': {}, 'villages': {}}
for index, (town, geometries) in enumerate(sorted(towns.items())):
    filename = f'town-{index+1}.png'
    draw_icon(unary_union(geometries), filename, main_island_only=town == '烈嶼鄉')
    manifest['towns'][town] = filename
for index, ((town, village), geometries) in enumerate(sorted(villages.items())):
    filename = f'village-{index+1}.png'
    draw_icon(unary_union(geometries), filename,
              main_island_only=(town, village) == ('烈嶼鄉', '黃埔村'))
    manifest['villages'][f'{town}/{village}'] = filename
(OUT / 'manifest.js').write_text('window.ADMINISTRATIVE_ICONS = ' + json.dumps(manifest, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
print(json.dumps({key: len(value) for key, value in manifest.items()}))
