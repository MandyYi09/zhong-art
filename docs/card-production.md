# Card production: R5 (2026-10-20)

The collection has 21 cards. SL-01 through SL-20 are regular editions with the K back. This includes SL-12 (5695) and SL-17 (5702), which were secret editions in R4. SL-21 (9549) is the only secret edition and uses the E back.

`apps/web/src/lib/card-editions.json` is the shared edition/back register for the website and print generator. Website image 9549 is a contemporary cartoon adaptation of the user-supplied WechatIMG9549.jpg, with two hands replacing the eyes, making a peace sign and a thumbs-up. Its subdued mineral palette, paper texture, softly tied blue-grey headwrap and gently drifting cloth edges match the existing twenty illustrations. The figure is recorded as Yang Ren from the owner’s book information; the original artwork date awaits that book reference. Names and edition dates for all cards are documented in `docs/painting-identification.md`. The daily rotation includes all 21 cards once per 21-day cycle.

The current vendor handoff is the ignored local artifact `output/pdf/SHUILU_21_CARDS_R5_20261020.zip`: a 21-page front/back proof, a 42-page alternating front/back print PDF, K/E technical cutlines, individual front and back PDFs, source artwork, and the numbered register. R4 and earlier files remain as archives and must not be used for production.

Regenerate with the bundled Python runtime (Pillow, reportlab, pypdf):

```sh
python3 scripts/build_card_handoff.py
```

The generator requires the existing local `character-modern` illustrations and approved K/E PNGs under `.local/design`, plus `art-source/WechatIMG9549.jpg` and `art-source/9549-generation.json`. These local source/design artifacts are intentionally preserved outside Git. The full new illustration is also preserved in `art-source/9549-character.png`; the prompt record identifies built-in image_gen and its reference images. Web-ready versions are tracked in `apps/web/public/paintings`.

Finished sizes and original K/E contours are retained from R4. Fronts have 3 mm bleed. The backs retain their original edges with no added visible border; their 3 mm page margin is blank, and their BleedBox equals their TrimBox. The vendor instructions in the handoff require any needed back bleed to be prepared outside the trim contour and returned as a proof. Print files remain RGB with embedded English fonts; vendor prepress and a physical sample are required before production.
