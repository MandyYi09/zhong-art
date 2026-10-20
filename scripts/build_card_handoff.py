from pathlib import Path
import json, re, csv, math, shutil, zipfile
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

ROOT=next(parent for parent in Path(__file__).resolve().parents if (parent/'apps/web/src/lib/paintings.ts').is_file())
OUT=ROOT/'output/pdf/SHUILU_21_CARDS_R5_20261020'
for folder in ['artwork/fronts','artwork/backs','cutlines','assets/characters','assets/backs','data']:
    (OUT/folder).mkdir(parents=True,exist_ok=True)
FONTS=Path('/Users/mandy/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype')
for name,file in [('Sans','NotoSans-Regular.ttf'),('Bold','NotoSans-Bold.ttf'),('Serif','NotoSerif-Regular.ttf'),('Italic','NotoSerif-Italic.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONTS/file)))
pdfmetrics.registerFont(TTFont('CJK','/System/Library/Fonts/Supplemental/Arial Unicode.ttf'))
BG=colors.HexColor('#142D33'); CREAM=colors.HexColor('#F4EFDF'); GOLD=colors.HexColor('#CCB882'); MUTED=colors.HexColor('#73857D')
TIER={'R':('REGULAR EDITION','#DAD5C4'),'SP':('SECRET EDITION','#E4BE82')}
scheme=json.loads((ROOT/'apps/web/src/lib/card-editions.json').read_text())
src=(ROOT/'apps/web/src/lib/paintingBlessings.ts').read_text()
identities=json.loads((ROOT/'apps/web/src/lib/painting-identities.json').read_text())
blessings={m[0]:m[1] for m in re.findall(r"'([^']+)': \{ zh: '[^']*', en: '([^']*)' \}",src)}
cards=[]
for n,c in enumerate(scheme):
    hidden = c['edition'] == 'hidden'
    back_code = c['back']
    cards.append({**c,'tier':'SP' if hidden else 'R',
        'deityName':identities[c['paintingId']]['name']['zh'],'sourceArtworkDate':identities[c['paintingId']]['date']['zh'],
        'blessing':blessings[c['paintingId']],'edition':'SECRET EDITION' if hidden else 'REGULAR EDITION',
        'faceFile':f'SL-{n+1:02d}_FRONT.pdf','backFile':f'BACK-{back_code}.pdf',
        'frontPage':2*n+1,'backPage':2*n+2,'referenceOnlyName':True})

# Source images are preserved; conversion to PNG is lossless format conversion only.
for c in cards:
    p=OUT/'assets/characters'/f"{c['paintingId'].replace(' ','_')}.png"
    Image.open(ROOT/f"apps/web/public/paintings/character-modern/{c['paintingId']}.webp").save(p)
    c['asset']=str(p.relative_to(OUT))
for k,name in [('K','card-back-K-token-knot.png'),('E','card-back-E-flowing-cloud.png')]:
    shutil.copy2(ROOT/'.local/design'/name,OUT/'assets/backs'/f'BACK-{k}.png')

def rdp(points,eps=0.9):
    if len(points)<=2:return points
    a,b=points[0],points[-1];dx=b[0]-a[0];dy=b[1]-a[1];norm=dx*dx+dy*dy
    ds=[]
    for x,y in points:
        t=max(0,min(1,((x-a[0])*dx+(y-a[1])*dy)/norm)) if norm else 0
        ds.append(math.hypot(x-a[0]-t*dx,y-a[1]-t*dy))
    idx=max(range(len(ds)),key=ds.__getitem__)
    if ds[idx]>eps:return rdp(points[:idx+1],eps)[:-1]+rdp(points[idx:],eps)
    return [a,b]

def contour(file):
    im=Image.open(file);a=im.getchannel('A').load();ww,hh=im.size
    # Vector boundary extraction for a reference die line, not raster editing.
    edges={}
    for y in range(hh):
        for x in range(ww):
            if a[x,y]<128:continue
            tests=[(y==0 or a[x,y-1]<128,(0,0),(1,0)),(x==ww-1 or a[x+1,y]<128,(1,0),(1,1)),(y==hh-1 or a[x,y+1]<128,(1,1),(0,1)),(x==0 or a[x-1,y]<128,(0,1),(0,0))]
            for yes,offset1,offset2 in tests:
                if yes:
                    p=(x+offset1[0],y+offset1[1]);q=(x+offset2[0],y+offset2[1]);edges.setdefault(p,[]).append(q)
    loops=[]
    while edges:
        start=next(iter(edges));p=start;line=[]
        while p in edges:
            line.append(p);q=edges[p].pop()
            if not edges[p]:del edges[p]
            p=q
            if p==start:break
        if len(line)>100:loops.append(line)
    def area(p):return abs(sum(p[i][0]*p[i-1][1]-p[i][1]*p[i-1][0] for i in range(len(p))))
    p=max(loops,key=area);idx=max(range(len(p)),key=lambda i:math.dist(p[i],p[0]))
    pts=rdp(p[:idx+1])[:-1]+rdp(p[idx:]+p[:1])[:-1]
    x0=min(p[0] for p in pts);y0=min(p[1] for p in pts);x1=max(p[0] for p in pts);y1=max(p[1] for p in pts)
    return {'image':im,'points':pts,'bbox':(x0,y0,x1,y1),'w':(x1-x0)/(y1-y0)*150,'h':150,'dpi':(y1-y0)/150*25.4}

shapes={k:contour(OUT/'assets/backs'/f'BACK-{k}.png') for k in ['K','E']}

def path_for(c,k,x,y,h,front=False):
    sh=shapes[k];x0,y0,x1,y1=sh['bbox'];scale=h/(y1-y0);p=c.beginPath()
    for i,(px,py) in enumerate(sh['points']):
        X=x+((x1-px) if front else (px-x0))*scale;Y=y+(y1-py)*scale
        (p.moveTo if i==0 else p.lineTo)(X,Y)
    p.close();return p

def wrap(s,font,size,width):
    words=s.split();lines=[];line=''
    for word in words:
        trial=(line+' '+word).strip()
        if line and pdfmetrics.stringWidth(trial,font,size)>width:lines.append(line);line=word
        else:line=trial
    if line:lines.append(line)
    return lines

def centre(c,text,x,y,font,size,color=CREAM):
    c.setFillColor(color);c.setFont(font,size);c.drawCentredString(x,y,text)

def face(c,card,x,y,h=150*mm,bleed=False):
    sh=shapes[card['back']];w=h*sh['w']/sh['h'];k=card['back'];sp=card['tier']=='SP';s=h/(150*mm)
    p=path_for(c,k,x,y,h,True);accent=colors.HexColor(TIER[card['tier']][1]);background=BG
    c.saveState()
    if bleed:
        c.setFillColor(background);c.setStrokeColor(background);c.setLineJoin(1);c.setLineWidth(6*mm*s);c.drawPath(p,fill=1,stroke=1)
    c.clipPath(p,stroke=0,fill=0);c.setFillColor(background);c.rect(x,y,w,h,fill=1,stroke=0)
    cx=x+w*(.51 if sp else .50)
    centre(c,'SHUILU',cx,y+h*.89,'Sans',7*s,accent)
    centre(c,TIER[card['tier']][0],cx,y+h*.858,'Sans',5.5*s,accent)
    im=Image.open(OUT/card['asset']); iw,ih=im.size
    boxw=w*(.68 if sp else .76);boxh=h*.52
    scale=min(boxw/iw,boxh/ih);dw,dh=iw*scale,ih*scale
    c.drawImage(ImageReader(im),cx-dw/2,y+h*.316+(boxh-dh)/2,width=dw,height=dh,mask='auto')
    c.setStrokeColor(accent);c.setLineWidth(.4*s);c.line(cx-w*.15,y+h*.305,cx+w*.15,y+h*.305)
    tl=wrap(card['title'],'Bold',7.1*s,w*(.59 if sp else .66))
    ty=y+h*.281
    for line in tl:
        centre(c,line,cx,ty,'Bold',7.1*s,accent);ty-=9*s
    lines=wrap(card['blessing'],'Serif',9.2*s,w*(.56 if sp else .66))
    ty=y+h*.226
    for line in lines:
        centre(c,line,cx,ty,'Serif',9.2*s);ty-=12.3*s
    # Verified against the narrow lower contour and kept above the ornamental tip.
    centre(c,card['sku'],cx,y+h*.091,'Sans',5.9*s,accent)
    centre(c,'COLLECTION 01',cx,y+h*.070,'Sans',5.0*s,accent)
    c.restoreState()
    c.saveState();c.setStrokeColor(accent);c.setLineWidth(.32*s);c.drawPath(p,fill=0,stroke=1);c.restoreState()
    return w

def back(c,k,x,y,h=150*mm,bleed=False):
    sh=shapes[k];im=sh['image'];x0,y0,x1,y1=sh['bbox'];scale=h/(y1-y0)
    # No added outer border or artificial bleed on backs. Preserve approved source only.
    c.saveState();c.clipPath(path_for(c,k,x,y,h),stroke=0,fill=0)
    c.drawImage(ImageReader(im),x-x0*scale,y-(im.height-y1)*scale,width=im.width*scale,height=im.height*scale,mask='auto');c.restoreState()

def set_boxes(file,w,h):
    r=PdfReader(str(file));writer=PdfWriter()
    for p in r.pages:
        p.trimbox=RectangleObject([3*mm,3*mm,(3+w)*mm,(3+h)*mm]);p.bleedbox=RectangleObject([0,0,(w+6)*mm,(h+6)*mm]);writer.add_page(p)
    with open(file,'wb') as f:writer.write(f)

for card in cards:
    sh=shapes[card['back']];file=OUT/'artwork/fronts'/card['faceFile'];c=canvas.Canvas(str(file),pagesize=((sh['w']+6)*mm,156*mm))
    c.setTitle(card['sku']+' | '+card['title']+' | Front');face(c,card,3*mm,3*mm,bleed=True);c.showPage();c.save();set_boxes(file,sh['w'],150)
for k,sh in shapes.items():
    file=OUT/'artwork/backs'/f'BACK-{k}.pdf';c=canvas.Canvas(str(file),pagesize=((sh['w']+6)*mm,156*mm));c.setTitle(f'Back {k} | Original edge | No added border');back(c,k,3*mm,3*mm,bleed=True);c.showPage();c.save();set_boxes(file,sh['w'],150)
    br=PdfReader(file);bw=PdfWriter();bp=br.pages[0];bp.bleedbox=RectangleObject(bp.trimbox);bw.add_page(bp)
    with open(file,'wb') as bf:bw.write(bf)
    for side,mirror in [('FRONT',True),('BACK',False)]:
        x0,y0,x1,y1=sh['bbox'];fac=150/(y1-y0)
        pts=[(((x1-px) if mirror else (px-x0))*fac,(py-y0)*fac) for px,py in sh['points']]
        d='M '+' L '.join(f'{x:.4f},{y:.4f}' for x,y in pts)+' Z'
        svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{sh["w"]:.4f}mm" height="150mm" viewBox="0 0 {sh["w"]:.4f} 150"><title>DIE CONTOUR - BACK {k} - {side} VIEW - vendor smooth and confirm die</title><path d="{d}" fill="none" stroke="#ff00ff" stroke-width="0.08"/></svg>'
        (OUT/'cutlines'/f'BACK-{k}_{side}_REFERENCE.svg').write_text(svg)
    file=OUT/'cutlines'/f'BACK-{k}_REFERENCE.pdf';c=canvas.Canvas(str(file),pagesize=((sh['w']+6)*mm,156*mm));c.setStrokeColor(colors.magenta);c.setLineWidth(.25);c.drawPath(path_for(c,k,3*mm,3*mm,150*mm),fill=0,stroke=1);c.showPage();c.save()

# A single 42-page print file: each front is immediately followed by its own back.
print_file=OUT/'02_SHUILU_21_CARDS_PRINT_42P_R5.pdf'
pc=canvas.Canvas(str(print_file))
pc.setTitle('Shuilu | 21 cards | Front then back | Original back edges')
for card in cards:
    sh=shapes[card['back']]
    for side in ['front','back']:
        pc.setPageSize(((sh['w']+6)*mm,156*mm))
        if side=='front':face(pc,card,3*mm,3*mm,bleed=True)
        else:back(pc,card['back'],3*mm,3*mm,bleed=True)
        pc.showPage()
pc.save()
reader=PdfReader(str(print_file));writer=PdfWriter()
for i,p in enumerate(reader.pages):
    width=shapes[cards[i//2]['back']]['w']
    p.trimbox=RectangleObject([3*mm,3*mm,(width+3)*mm,153*mm])
    p.bleedbox=RectangleObject(p.trimbox) if i%2 else RectangleObject([0,0,(width+6)*mm,156*mm])
    writer.add_page(p)
writer.add_metadata({'/Title':'Shuilu | 21 cards | 42 print pages | 1:1','/Author':'Shuilu'})
with open(print_file,'wb') as f:writer.write(f)

# Two separate technical plates. Spot color is for the cutting workflow, not artwork.
die_file=OUT/'03_SHUILU_K_E_CUTLINES_2P_R5.pdf'
dc=canvas.Canvas(str(die_file))
dc.setTitle('Shuilu | K then E | Back-view die line | CutContour spot color')
for k,sh in shapes.items():
    dc.setPageSize(((sh['w']+6)*mm,156*mm))
    dc.setStrokeColor(colors.PCMYKColorSep(0,100,0,0,spotName='CutContour'))
    dc.setStrokeOverprint(True);dc.setLineWidth(.25)
    dc.drawPath(path_for(dc,k,3*mm,3*mm,150*mm),fill=0,stroke=1)
    dc.showPage()
dc.save()

W,H=210*mm,297*mm
book=OUT/'01_SHUILU_21_CARDS_PROOF_21P_R5.pdf'
c=canvas.Canvas(str(book),pagesize=(W,H));c.setTitle('SHUILU R5 | 21 cards | 20 regular + 1 secret | Finished-size proof');c.setAuthor('SHUILU');page=0
def start(section):
    global page
    page+=1;c.setFillColor(CREAM);c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(BG);c.setFont('Sans',8);c.drawString(16*mm,283*mm,'SHUILU  /  CARD COLLECTION');c.setFont('CJK',8);c.drawRightString(194*mm,283*mm,section)
    c.setStrokeColor(colors.HexColor('#C9C6B6'));c.setLineWidth(.5);c.line(16*mm,278*mm,194*mm,278*mm)
    c.setFont('Sans',7);c.setFillColor(MUTED);c.drawString(16*mm,12*mm,'FINISHED-SIZE PROOF  /  20 OCT 2026  /  R5 - 21 CARDS');c.drawRightString(194*mm,12*mm,f'{page:02d}')
def heading(zh,en):
    c.setFillColor(BG);c.setFont('CJK',22);c.drawString(16*mm,261*mm,zh);c.setFont('Sans',9);c.drawString(16*mm,252*mm,en)
def zhline(text,x,y,size=9,color=BG):
    c.setFillColor(color);c.setFont('CJK',size);c.drawString(x*mm,y*mm,text)
def para(text,x,y,width=178,size=9,leading=5.2,font='CJK',color=BG):
    line='';lines=[]
    for char in text:
        if char=='\n':lines.append(line);line='';continue
        if pdfmetrics.stringWidth(line+char,font,size)>width*mm:lines.append(line);line=char
        else:line+=char
    if line:lines.append(line)
    c.setFont(font,size);c.setFillColor(color)
    for line in lines:c.drawString(x*mm,y*mm,line);y-=leading
    return y

for card in cards:
    start(card['sku']+' / '+('SECRET' if card['tier']=='SP' else 'REGULAR')+' / 卡背 '+card['back'])
    c.setFillColor(BG);c.setFont('Serif',19);c.drawString(16*mm,264*mm,card['title'])
    zhline('图号 '+card['paintingId']+'  /  '+card['workingTitle']+'  /  '+('隐藏款' if card['tier']=='SP' else '常规款'),16,254,9)
    k=card['back'];w=shapes[k]['w'];left=13+(88-w)/2;right=109+(88-w)/2
    centre(c,'FRONT',57*mm,243*mm,'Sans',8,BG);centre(c,'BACK '+k,153*mm,243*mm,'Sans',8,BG)
    face(c,card,left*mm,87*mm);back(c,k,right*mm,87*mm)
    zhline(f'成品参考尺寸：{w:.1f} × 150 mm；本页卡面按 1:1 放置。打印时选“实际大小”。',16,77,8.5)
    c.setStrokeColor(colors.HexColor('#CAC6B7'));c.line(16*mm,70*mm,194*mm,70*mm)
    zhline('正面英文祝福语',16,62,8.5)
    lines=wrap(card['blessing'],'Serif',11,176*mm)
    y=54*mm;c.setFillColor(BG);c.setFont('Serif',11)
    for line in lines:c.drawString(16*mm,y,line);y-=15
    zhline('正面文件：'+card['faceFile'],16,33,8)
    zhline('背面文件：'+card['backFile']+'  |  裁切文件：BACK-'+k+'_FRONT/BACK_REFERENCE.svg',16,27,7.5)
    c.showPage()

c.save()

fields=['frontPage','backPage','sku','paintingId','collectionNumber','workingTitle','deityName','sourceArtworkDate','title','tier','edition','blessing','back','faceFile','backFile','asset']
with open(OUT/'data/card-register.csv','w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');writer.writeheader();writer.writerows(cards)
metadata={'version':'R5-2026-10-20','status':'Physical artwork / 1:1 / backs without bleed / vendor prepress and proof required','dimensionStatus':'Assumed longest edge 150 mm, pending size confirmation','sizes':{k:{'widthMm':round(s['w'],3),'heightMm':150,'backEffectivePpi':round(s['dpi'],1),'frontContourMirrorsBack':True} for k,s in shapes.items()},'cards':cards,'bleed':'Fronts have 3 mm bleed; backs have NO added border and NO artwork bleed. The 3 mm back page margin is blank. Vendor must prepare any required bleed outside the approved trim contour and submit proof; do not add a visible border.','cutlines':'Reference only, vendor smooth and confirm before tooling.','hiddenCards':'Only SL-21 / 9549 is hidden (E). All SL-01 through SL-20 including SL-12 / 5695 and SL-17 / 5702 are regular (K). Existing titles and blessings retained. SL-21 is a contemporary playful adaptation of the supplied source.'}
(OUT/'data/card-register.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2))
readme='SHUILU / R5 / 2026-10-20 / 共21张（20常规 + 1隐藏）\n当前唯一交付版本：R5。此前R4及更早版本留档，均不再用于制作。\n\n01_SHUILU_21_CARDS_PROOF_21P_R5.pdf\n21页成品预览，每页是一张卡的正面与对应背面，顺序SL-01至SL-21。\n本文件展示裁切后效果，不含出血；不是42张卡。\n\n02_SHUILU_21_CARDS_PRINT_42P_R5.pdf\n42页印刷文件，依次为SL-01正/背，SL-02正/背，直至SL-21正/背。\n第1至40页对应原有20张常规款，全部使用K卡背。\n第41/42页是新增SL-21（9549 / A LITTLE PLAYFULNESS）正/背，唯一使用E隐藏款卡背。\n原SL-12（5695）与SL-17（5702）已改为常规款，正面的款式文字、轮廓与卡背对应更新为K。\n其余原有卡片英文标题和祝福语保持不变。\n\n03_SHUILU_K_E_CUTLINES_2P_R5.pdf\n2页独立刀线，K在前、E在后，背面视图，CutContour专色0.25 pt。\ncutlines还包含正面镜像刀线和背面刀线的SVG/PDF参考。刀线不印到成品上。\n\n尺寸沿用：成品长边150 mm。K约77.4 x 150 mm，E约87.8 x 150 mm。\n正面含3 mm出血。卡背保留已确认R4版本的原有边缘，不增加绿色外圈或可见边框；卡背页面3 mm外留白不是已完成的出血。\nTrimBox为成品包围盒，实际裁切以异形刀线为准。卡背如需出血，请厂家在刀线外另行制作并回传确认，不增加可见边框。\n正面外轮廓为背面水平镜像，人物与英文文字不镜像；正反均以上端朝上，翻纸方式由厂家按设备确定。\n\nSL-21蓝袍卡通插画：两只小手代替眼睛，分别比耶和点赞；不另加眼睛。蓝灰软巾替换原帽饰，衣袖与巾尾轻扬，色调与原有20张低饱和矿物色保持协调，保留坐姿、托桃与长须。\n仅插画进入印刷卡面，用户提供的原图只作为来源留档，放在assets/sources中，不单独制成卡片。\n英文标题与workingTitle为设计用名。神祇姓名及原画版本年代另见data/painting-identities.json和人物考证说明.md；杨任原画年代待书名补充核对。\n\n图像保留RGB，英文嵌字；此包不是PDF/X。请厂家按纸张转换CMYK并回传打样。\nK卡背约292 ppi、E约267 ppi。建议每款先打样1张，共21张。\n建议工艺350g白卡、双面彩印、双面哑膜、异形模切；批量与最终工艺由客户确认。\n金色为印刷色，不含烫金；异形尖端、细连接和刀线平滑度需厂家核查并回传确认。\n\nartwork/fronts含21个单面PDF，artwork/backs含2个共用卡背PDF（不是额外卡片）。\nassets保留人物PNG、K/E卡背原PNG、SL-21原始参考图及生成记录。\ndata/card-register.csv和.json包含每张卡的卡背映射、印刷页码与文案。\n'
(OUT/'READ-ME_制作说明.txt').write_text(readme)
shutil.copy2(ROOT/'apps/web/src/lib/painting-identities.json',OUT/'data/painting-identities.json')
shutil.copy2(ROOT/'docs/painting-identification.md',OUT/'data/人物考证说明.md')
shutil.copy2(__file__,OUT/'build_card_handoff.py')
(OUT/'assets/sources').mkdir(exist_ok=True)
for source in ['WechatIMG9549.jpg','9549-generation.json']:
    shutil.copy2(ROOT/'art-source'/source,OUT/'assets/sources'/source)

# Content validation: every front has its exact English blessing and edition.
for card in cards:
    text=' '.join(PdfReader(str(OUT/'artwork/fronts'/card['faceFile'])).pages[0].extract_text().split())
    assert card['blessing'] in text,(card['sku'],text)
    assert card['sku'] in text and TIER[card['tier']][0] in text
    assert not any('\u4e00' <= ch <= '\u9fff' for ch in text),(card['sku'],'unexpected Chinese text on English front')
assert len(cards)==21 and len({c['sku'] for c in cards})==21
assert len({c['paintingId'] for c in cards})==21
assert [c['sku'] for c in cards if c['back']=='E']==['SL-21']
assert sum(c['back']=='K' for c in cards)==20 and sum(c['back']=='E' for c in cards)==1
assert len(PdfReader(str(book)).pages)==21
assert len(PdfReader(str(print_file)).pages)==42
assert len(PdfReader(str(die_file)).pages)==2
print(json.dumps({'pages':21,'cards':21,'regular':20,'hidden':1,'sizes':metadata['sizes'],'book':str(book)},ensure_ascii=False))

# Archive only final deliverables, not intermediate rendering files.
archive=OUT.with_suffix('.zip')
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for file in sorted(OUT.rglob('*')):
        if file.is_file(): z.write(file, str(file.relative_to(OUT.parent)))
(ROOT/'output/pdf/当前交付文件_请先看.txt').write_text('当前交付：SHUILU_21_CARDS_R5_20261020.zip\n共21张：SL-01至SL-20全部常规K卡背，SL-21（9549）唯一隐藏E卡背。\n请只发送R5整包；R4和更早版本均作废但保留留档。\n')
print('ARCHIVE',archive)
