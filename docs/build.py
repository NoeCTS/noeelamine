#!/usr/bin/env python3
"""Inject fonts + images into the design-language template."""
import base64, sys, pathlib
root = pathlib.Path(__file__).resolve().parent
tpl  = (root/"_design-language.tpl.html").read_text(encoding="utf-8")
def b64(f): return base64.b64encode(pathlib.Path(f).read_bytes()).decode()
RAW = {
 "__GSAP__":"node_modules/gsap/dist/gsap.min.js",
 "__SCROLLTRIGGER__":"node_modules/gsap/dist/ScrollTrigger.min.js",
}
ASSETS = {
 "__F_SILVESTRE__":"/tmp/fonts/silvestre.ttf",
 "__F_RANGE__":"/tmp/fonts/rangesans.woff2",
 "__F_ARCHIVO__":"/tmp/fonts/archivo.woff2",
 "__F_DEPARTURE__":"/tmp/fonts/departure.woff2",
 "__F_NDOT__":"/tmp/fonts/ndot55.otf",
 "__F_ABACAXI__":"/tmp/fonts/abacaxi.woff2",
 "__IMG_HERO__":"/tmp/hero.jpg",
 "__IMG_GHOST__":"/tmp/ghost.jpg",
 "__IMG_TREEART__":"/tmp/treeart.jpg",
 "__IMG_TREEGHOST__":"/tmp/treeghost.jpg",
 "__IMG_TREEDOTS__":"/tmp/treedots.png",
 "__PH_16__":"/tmp/moodboard/zone/16_img_0023-jpeg.jpg",
 "__PH_17__":"/tmp/moodboard/zone/17_img_0024-jpeg.jpg",
 "__PH_18__":"/tmp/moodboard/zone/18_img_0025-jpeg.jpg",
 "__PH_19__":"/tmp/moodboard/zone/19_img_0026-jpeg.jpg",
 "__PH_20__":"/tmp/moodboard/zone/20_img_0028-jpeg.jpg",
 "__PH_21__":"/tmp/moodboard/zone/21_img_0032-jpeg.jpg",
 "__PH_22__":"/tmp/moodboard/zone/22_img_0045.jpg",
 "__PH_23__":"/tmp/moodboard/zone/23_img_0046.jpg",
 "__PH_24__":"/tmp/moodboard/zone/24_img_0048.jpg",
 "__PH_25__":"/tmp/moodboard/zone/25_img_0050.jpg",
 "__PH_26__":"/tmp/moodboard/zone/26_img_0051.jpg",
 "__PH_28__":"/tmp/moodboard/zone/28_img_5097.jpg",
 "__PH_29__":"/tmp/moodboard/zone/29_img_5214.jpg",
 "__PH_30__":"/tmp/moodboard/zone/30_img_5476.jpg",
 "__Z_BETTERIDE__":"/tmp/moodboard/zone/z-betteride.jpg",
 "__Z_NOTHING__":"/tmp/moodboard/zone/z-nothing.jpg",
 "__Z_PANGAIA__":"/tmp/moodboard/zone/z-pangaia.jpg",
 "__Z_BERLIN__":"/tmp/moodboard/zone/z-berlin.jpg",
 "__Z_AUBE__":"/tmp/moodboard/zone/z-aube.jpg",
 "__Z_ARCHIVE__":"/tmp/moodboard/zone/z-archive.jpg",
 "__Z_GOOGLE__":"/tmp/moodboard/zone/z-google.jpg",
 "__IMG_GOOGLE__":"/tmp/google.jpg",
 "__F_GSANS__":"/tmp/fonts/googlesans-regular.woff2",
 "__F_GSANSM__":"/tmp/fonts/googlesans-medium.woff2",
 "__IMG_14__":"/tmp/moodboard/sheet/14_final-flyer-broken-bike.jpg",
 "__IMG_42__":"/tmp/moodboard/sheet/42_unseen.jpg",
 "__IMG_12__":"/tmp/moodboard/sheet/12_dj.jpg",
 "__IMG_13__":"/tmp/moodboard/sheet/13_dsc02174.jpg",
 "__IMG_41__":"/tmp/moodboard/sheet/41_rectangle-1.jpg",
 "__IMG_10__":"/tmp/moodboard/sheet/10_poster-cbc.jpg",
 "__IMG_30__":"/tmp/moodboard/sheet/30_img_5476.jpg",
 "__IMG_34__":"/tmp/moodboard/sheet/34_flyer-bum.jpg",
}
out = tpl
for tok, path in RAW.items():
    if tok not in out:
        sys.exit("missing token in template: "+tok)
    out = out.replace(tok, (root.parent/path).read_text(encoding="utf-8"))
unused = []
for tok, path in ASSETS.items():
    if tok not in out:
        unused.append(tok)          # asset no longer referenced; skip rather than fail
        continue
    out = out.replace(tok, b64(path))
if unused:
    print("unused assets skipped:", ", ".join(unused))
(root/"design-language.html").write_text(out, encoding="utf-8")
# local preview: same content, wrapped in a real document
head, _, rest = out.partition("</style>")
(root/"preview.local.html").write_text(
    '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
    + head + "</style>\n</head>\n<body>\n" + rest + "\n</body>\n</html>",
    encoding="utf-8")
print("built  %.2f MB" % (len(out.encode())/1048576))
