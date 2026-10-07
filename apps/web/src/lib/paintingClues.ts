import type { PaintingId } from './paintings'

export type ClueKey = 'head' | 'hands' | 'robe'
type Bilingual = { zh: string; en: string }

export const clueReadings = {
  goldCrown: { title: { zh: '额冠与火焰纹', en: 'Crown and flames' }, meaning: { zh: '额前冠饰与头后的火焰是两层不同的造型。火焰强化神将的威势，但不能单凭它确定冠名或人物身份。', en: 'The brow crown and flames behind it are separate motifs. Flames heighten the figure’s forceful presence, but do not establish a formal crown name or identity.' } },
  hornedCrown: { title: { zh: '角形冠饰', en: 'Horn-like headpiece' }, meaning: { zh: '上翘的角形装饰使轮廓更威猛。在雷部神将图像中，这种夸张造型可提示非日常的力量，并非某位神明独有的身份证据。', en: 'The upward-curving forms make the silhouette more imposing. In images of thunder generals, such exaggerated shapes suggest extraordinary power; they do not identify one deity on their own.' } },
  officialCap: { title: { zh: '官帽式冠帽', en: 'Official-style cap' }, meaning: { zh: '方顶、侧翼或冠板让人联想到古代官帽。雷部神将也会借用官将装束来表现职司；这里先称“官帽式”，正式名称还需图录核对。', en: 'The square top, side flaps or front panel recall official headwear. Thunder generals may borrow the dress of officials to express their role; the formal name of this cap still needs checking.' } },
  ornateCap: { title: { zh: '纹饰冠帽', en: 'Patterned headpiece' }, meaning: { zh: '冠上的点纹、花饰和卷起的边缘让头部成为视觉焦点。它与武将形象相配，但这些装饰本身不足以确定具体神格。', en: 'Dots, floral details and curling edges draw attention to the head. They suit a martial figure, but are not enough to establish a specific divine identity.' } },
  plume: { title: { zh: '羽饰与发束', en: 'Plume and hair crest' }, meaning: { zh: '高起的羽饰或发束与火焰形线条相呼应，营造出强烈动势。它未必是一顶独立的冠，应先分清发、冠与背景。', en: 'The tall plume or hair crest echoes flame-like lines and adds movement. It may not be a separate crown, so hair, headwear and background should be distinguished first.' } },
  chain: { title: { zh: '链索', en: 'Chain' }, meaning: { zh: '道教神将图像里，索链可以进入拘摄、守护的视觉语言；这张画的具体器名与用途仍需结合题签核实。', en: 'Chains can be part of the visual language of restraint and protection in Daoist guardian imagery. The precise name and use of this chain still need confirmation.' } },
  longWeapon: { title: { zh: '长柄兵器', en: 'Long-handled weapon' }, meaning: { zh: '长柄器物常把神将画成正在执令或护卫的武职形象。仅凭轮廓还不能可靠地区分枪、戟或其他法器。', en: 'A long weapon presents the figure as an armed guardian or enforcer. Its outline alone is not enough to distinguish a spear, halberd or other ritual implement.' } },
  blade: { title: { zh: '剑与刀', en: 'Sword or blade' }, meaning: { zh: '剑刀是雷部神将图像常见的持物，可用来表达威慑与斩邪；许多人物都持剑，不能只凭这一件器物认定身份。', en: 'Blades recur in thunder-general imagery and can express the power to ward off or cut down evil. Many figures carry them, so a blade alone cannot establish identity.' } },
  gesture: { title: { zh: '手势', en: 'Hand gesture' }, meaning: { zh: '屈指或立掌会把视线带到人物的动作。在道教图像中，手势可能与仪式或发令有关，但其具体含义要结合人物和文献判断。', en: 'Raised palms and shaped fingers direct attention to action. In Daoist imagery a gesture may relate to ritual or command, but its specific meaning depends on the figure and sources.' } },
  axe: { title: { zh: '斧形器与手势', en: 'Axe-like object and gesture' }, meaning: { zh: '斧形持物与另一只手的屈指动作一起突出执行和驱邪的力量。这里先描述它的形状，不把它当作某位神将独有的法器。', en: 'The axe-like object and shaped fingers together suggest forceful action. Here the object is described by its shape, without claiming it belongs to one particular figure.' } },
  roundObjects: { title: { zh: '圆形器物与多臂', en: 'Round objects and multiple arms' }, meaning: { zh: '多臂让人物能同时展示几件器物，增强超常力量的印象。圆器可能各有名称；没有逐幅图录时，不宜直接说它们是日月或宝珠。', en: 'Multiple arms display several objects at once and amplify the sense of extraordinary power. The round objects may have distinct names; they should not be called suns, moons or jewels without a matching catalogue.' } },
  wheel: { title: { zh: '轮形法器', en: 'Wheel-shaped implement' }, meaning: { zh: '雷部文献中有火轮、风轮、水轮等不同器物。这张画清楚画出了辐条，但仅凭外观还不能判定它属于哪一种轮。', en: 'Thunder-ritual texts describe fire, wind and water wheels. This painting clearly shows spokes, but its appearance alone does not tell us which kind of wheel it is.' } },
  tray: { title: { zh: '托盘与小人形', en: 'Tray and small figure' }, meaning: { zh: '托举的小人形使这幅画有别于单纯持兵器的武将像。它的身份和用途不能从外形直接推定，需要与画上题签及图录对照。', en: 'The small figure held on a tray distinguishes this image from a simple armed portrait. Its identity and purpose cannot be inferred from appearance alone.' } },
  armour: { title: { zh: '层叠甲衣', en: 'Layered armour' }, meaning: { zh: '护肩、甲片和束带把人物塑造成武将。鲜明的红、绿、蓝色加强层次与动势；不能把每一种颜色直接对应为某项固定神职。', en: 'Shoulder guards, plates and belts give the figure a martial appearance. Vivid red, green and blue clarify the layers and movement; each colour should not be assigned a fixed divine role.' } },
  robe: { title: { zh: '袍服与宽袖', en: 'Robe and broad sleeves' }, meaning: { zh: '宽袖、纹样和层叠衣缘把官将的装束画得华丽。衣服的款式是理解形象的重要线索，但还需要题签与同组图像才能判断具体身份。', en: 'Broad sleeves, patterns and layered borders make the official-warrior costume elaborate. Dress is a useful clue, but the inscription and related images are still needed for identification.' } },
  ribbons: { title: { zh: '甲衣与飘带', en: 'Armour and ribbons' }, meaning: { zh: '甲衣强调武将形象，飘带与云纹让静止的人物像在运动。它们是画面造势的方式，不能单独当作某种法力的证明。', en: 'Armour marks a martial figure, while ribbons and clouds make the still image feel active. They create visual force rather than proving a particular supernatural power.' } },
} as const

export type Motif = keyof typeof clueReadings
export type PaintingClue = { observed: Bilingual; motif: Motif }
const clue = (zh: string, en: string, motif: Motif): PaintingClue => ({ observed: { zh, en }, motif })

export const paintingClues: Record<PaintingId, Record<ClueKey, PaintingClue>> = {
  '5683': {
    head: clue('额前是金色方冠；黑红火焰另画在头后，并非整顶冠都在燃烧。', 'A square gold crown sits on the brow; the black-and-red flames are painted behind the head, not as the crown itself.', 'goldCrown'),
    hands: clue('右手提着一段有方形节扣的链索，另一只手握在腰侧。', 'One hand lifts a chain with rectangular links; the other is clenched by the waist.', 'chain'),
    robe: clue('黑底白色卷纹的护肩压在红蓝甲片上，绿色长带从肩部绕下。', 'Black shoulder guards with white curls sit over red-and-blue armour, with green ribbons circling down.', 'ribbons'),
  },
  '5685': {
    head: clue('深蓝色冠面布满白色点纹，两侧伸出向上卷曲的尖饰。', 'White dots cover the dark-blue headpiece, with two pointed ornaments curling upward.', 'hornedCrown'),
    hands: clue('双手在身前握着一件细长的兵器，尖端高过肩头。', 'Both hands grip a slim, long weapon whose point rises above the shoulder.', 'longWeapon'),
    robe: clue('赤红宽袖罩住绿色内层，腰下露出黄底纹样和层叠甲片。', 'Broad red sleeves cover a green inner layer, while patterned yellow fabric and armour appear below.', 'robe'),
  },
  '5686': {
    head: clue('黑色圆顶冠布满点纹，边缘伸出细长卷饰，前方还有红色纹带。', 'The round black cap is dotted, with thin curling ornaments at the sides and a red band at the front.', 'ornateCap'),
    hands: clue('双手靠近腰带和衣襟；画中没有清晰可辨的刀剑或长杆。', 'The hands rest near the belt and robe; no sword or long staff is clearly visible.', 'gesture'),
    robe: clue('黑底小卷纹上衣配浅绿色领肩，蓝、绿、红三层衣摆在腰下交叠。', 'A black robe of tiny curls meets a pale-green collar, with blue, green and red layers below the waist.', 'robe'),
  },
  '5687': {
    head: clue('黑红冠上两道角形饰向上翻卷，与深色发髻连成高高的轮廓。', 'Two horn-like ornaments curl up from the dark-red crown and merge with the tall hair silhouette.', 'hornedCrown'),
    hands: clue('一侧竖着带红缨的长杆，另一只手握住身前的短柄器物。', 'A long shaft with a red tassel rises at one side; the other hand holds a shorter object in front.', 'longWeapon'),
    robe: clue('赤红外袍、绿甲和白底花纹护片层叠，腰间收以窄带。', 'A red outer robe, green armour and white patterned guards overlap beneath a narrow belt.', 'armour'),
  },
  '5688': {
    head: clue('蓝色面容上方是一顶缀花的小冠，耳旁两束赤色羽状发饰向上展开。', 'A small flowered crown sits above the blue face, while two red plume-like tufts rise beside the ears.', 'plume'),
    hands: clue('双手交叠在胸腹间，宽袖与飘带挡住了部分持物细节。', 'The hands meet near the chest and waist, partly obscured by broad sleeves and ribbons.', 'gesture'),
    robe: clue('青绿宽袖与红色甲片交错，黄色束带垂在裙甲前。', 'Wide blue-green sleeves cross red armour plates, and yellow ties hang over the skirt armour.', 'ribbons'),
  },
  '5689': {
    head: clue('深蓝点纹圆帽中央缀花，帽缘向左右轻轻上翘。', 'A flower marks the centre of the dotted dark-blue cap, whose edges turn up slightly.', 'ornateCap'),
    hands: clue('手臂垂向腰侧，持物并未像邻近几张画那样突出。', 'The arms drop toward the waist; any held object is less prominent than in nearby images.', 'gesture'),
    robe: clue('黑底白卷纹的袍身与绿腰带形成对比，腿部仍露出彩色护甲。', 'White curls on a black robe contrast with a green belt, while coloured leg guards remain visible.', 'robe'),
  },
  '5690': {
    head: clue('头发高高向两侧竖起，发顶只扣着一顶小型黑金冠。', 'Hair rises high on both sides, with only a small black-and-gold cap at the top.', 'plume'),
    hands: clue('一手在面旁屈指作势，另一手提着短柄的斧形器物。', 'One hand shapes a gesture beside the face; the other carries a short-handled axe-like object.', 'axe'),
    robe: clue('红色小花纹宽袍罩着绿领和蓝色下摆，袖口画得特别宽。', 'A broad red robe of tiny floral motifs covers a green collar and blue lower layers, with especially wide cuffs.', 'robe'),
  },
  '5691': {
    head: clue('蓝色面容两侧是高耸的红色发束，头顶又伸出两道黑红卷角；它更像发与角饰的组合。', 'Tall red hair flanks the blue face, while two black-and-red curls rise above it: a combination of hair and horn-like ornament.', 'hornedCrown'),
    hands: clue('上方两手分别托起浅绿与深红圆器，另一手握竖直长杆，形成多臂形象。', 'Two raised hands hold pale-green and dark-red round objects; another grips a vertical staff, creating a multi-armed figure.', 'roundObjects'),
    robe: clue('绿鳞片式腰甲、红色绶带和紫色下裳覆盖蓝色身体。', 'Green scale-like waist armour, red ribbons and a purple skirt layer over the blue body.', 'armour'),
  },
  '5692': {
    head: clue('黑色高冠前有浅金色额片，顶部两侧各有短小的卷饰。', 'A pale-gold front panel marks the tall black cap, with short curling ornaments at its upper sides.', 'officialCap'),
    hands: clue('双手在胸前握住竖起的长剑，剑尖指向画面右上。', 'Both hands grip a raised long sword before the chest, its point aimed toward the upper right.', 'blade'),
    robe: clue('蓝袍是画面的最大色块，外罩红绿护肩与绕身长带。', 'The blue robe is the largest colour field, crossed by red-green shoulder guards and long ribbons.', 'ribbons'),
  },
  '5693': {
    head: clue('暗红冠体紧贴黑发，顶部两侧有向外翻起的角状饰件。', 'A dark-red crown hugs the black hair, with horn-like pieces curling outward on either side.', 'hornedCrown'),
    hands: clue('人物把一柄细长兵器横握在胸前，尖端伸向画面右侧。', 'The figure holds a slim long weapon across the chest, its point extending to the right.', 'blade'),
    robe: clue('浅绿甲片护住腰腿，黑底卷纹护肩衬出赤红衣袖。', 'Pale-green armour protects the waist and legs; black curled shoulder guards frame red sleeves.', 'armour'),
  },
  '5694': {
    head: clue('深蓝点纹帽向两侧伸出扁平帽翼，中央还有一段直立装饰。', 'Flat side flaps extend from the dotted blue cap, with a short upright ornament at the centre.', 'officialCap'),
    hands: clue('一手抬到面颊附近，另一手握着斜穿腰际的长刃。', 'One hand rises near the cheek while the other holds a long blade diagonally across the waist.', 'blade'),
    robe: clue('红袖和绿护肩包住上身，白底花纹甲裙下垂到腿前。', 'Red sleeves and green shoulder guards frame a white patterned armour skirt hanging over the legs.', 'armour'),
  },
  '5695': {
    head: clue('深色高冠上有两个向外卷起的红色角饰，冠前画出细竖线。', 'Two red horn-like curls rise from the tall dark crown, whose front is marked by fine vertical lines.', 'hornedCrown'),
    hands: clue('一手在胸口屈指作势，另一手靠近腰带；器物局部被衣饰遮住。', 'One hand shapes a gesture at the chest while the other stays near the belt; clothing hides part of any object.', 'gesture'),
    robe: clue('绿色袍身外露出花纹护肩与层叠裙甲，细长衣带从腰间垂落。', 'A green robe is edged by patterned shoulder guards and layered skirt armour, with narrow ties hanging from the waist.', 'ribbons'),
  },
  '5696 2': {
    head: clue('黑发高起，两道弯角伸进黄云；额前只露出小块深蓝色冠饰。', 'Tall black hair and two curved ornaments reach into the yellow clouds, while only a small dark-blue crest shows at the brow.', 'hornedCrown'),
    hands: clue('一手高举八辐轮形器，另一手直握长剑，两件器物并排出现。', 'One hand raises an eight-spoked wheel; the other holds an upright sword beside it.', 'wheel'),
    robe: clue('黑底白卷纹披肩、蓝色胸甲和赤红下裳形成三层鲜明对比。', 'A black-and-white curled cape, blue chest armour and red lower robe make three contrasting layers.', 'armour'),
  },
  '5697 2': {
    head: clue('黑色高冠的前面画出白色分格，两侧红色卷角向上伸出。', 'White lines divide the front of the tall black cap, while red curls rise at both sides.', 'officialCap'),
    hands: clue('双手握住竖起的分节长杆，杆顶连着向上翻卷的火焰形纹。', 'Both hands grip a segmented upright staff topped by a curling flame-shaped form.', 'longWeapon'),
    robe: clue('赤红外袖与蓝色下裳交叠，绿色长带绕过腰和腿。', 'Red outer sleeves overlap a blue lower robe as long green ribbons circle the waist and legs.', 'ribbons'),
  },
  '5698': {
    head: clue('头顶是短小的红色羽束和花饰，冠饰低矮，面容也比许多同组人物平静。', 'A short red plume and floral ornament sit low on the head; the face is calmer than many others in the group.', 'plume'),
    hands: clue('一手托起盘上的浅色小人形，另一手握着竖立的长柄。', 'One hand presents a small pale figure on a tray; the other grips an upright shaft.', 'tray'),
    robe: clue('红蓝锦纹上衣接着层叠绿裙，长衣带在身体两侧翻卷。', 'Red-and-blue patterned sleeves meet layered green skirts, with long ribbons curling at each side.', 'robe'),
  },
  '5699': {
    head: clue('直边黑冠前面有白色线条，冠外另伸出两束红黑卷角。', 'White lines mark the front of the straight-edged black cap, with two red-black curls rising outside it.', 'officialCap'),
    hands: clue('一手握分节长杆，另一手在胸前展开；杆上方还有火焰形纹。', 'One hand grips a segmented staff and the other opens at the chest; a flame-like form rises above the staff.', 'longWeapon'),
    robe: clue('红袖、蓝下裳和绿飘带分成清楚的三层，脚下露出云头靴。', 'Red sleeves, a blue lower robe and green ribbons form clear layers above cloud-toed boots.', 'ribbons'),
  },
  '5702': {
    head: clue('主像戴方顶黑帽，以白线勾出冠板；左侧还画有一位红羽帽人物。', 'The main figure wears a square black cap outlined in white; a second figure in a red-plumed cap appears at the left.', 'officialCap'),
    hands: clue('主像一手立掌，身旁长杆带红穗；前景人物也向他伸出双手。', 'The main figure raises a palm beside a red-tasselled staff, while the foreground companion extends both hands toward him.', 'gesture'),
    robe: clue('主像的蓝红宽袖与绿下装，对照前景人物的红色纹甲。', 'The main figure’s blue-red sleeves and green lower robe contrast with the foreground companion’s red patterned armour.', 'robe'),
  },
  '5703': {
    head: clue('头顶是一圈较窄的冠饰，两条红黑角饰从两侧向外弯曲。', 'A narrow band crowns the head, with two red-black horn-like ornaments curving outward.', 'hornedCrown'),
    hands: clue('一手横握长剑，另一手举在胸前，手指屈成固定姿势。', 'One hand holds a long sword across the body; the other raises shaped fingers before the chest.', 'blade'),
    robe: clue('蓝色大袖、绿色胸甲和红色边饰层层叠在腰前。', 'Broad blue sleeves, green chest armour and red borders overlap at the waist.', 'armour'),
  },
  '5704': {
    head: clue('红色高束羽饰从冠顶翻卷，耳旁两块蓝红护耳格外突出。', 'A tall red plume sweeps back from the crown, with blue-red ear guards projecting on both sides.', 'plume'),
    hands: clue('双手握住红色长杆，杆顶在头后接上一大片火焰形纹。', 'Both hands grip a red shaft whose top meets a large flame-shaped form behind the head.', 'longWeapon'),
    robe: clue('红蓝细纹甲片覆在浅绿披肩下，黄色束带在腰际打结。', 'Fine red-blue armour patterns sit beneath a pale-green cape, with yellow ties knotted at the waist.', 'armour'),
  },
  '5705': {
    head: clue('深蓝点纹帽顶部伸出两条卷角；后面的火焰纹属于背景，不一定连在帽上。', 'Two curls rise from the dotted blue cap; the flames behind it belong to the background and may not be attached to the cap.', 'ornateCap'),
    hands: clue('一手握着有连续白色分节的长杆，另一手在胸前屈指。', 'One hand grips a long staff with repeated white segments; the other forms a gesture at the chest.', 'longWeapon'),
    robe: clue('绿袖与蓝护肩包住胸部，黄裙外还有弯曲飘带。', 'Green sleeves and blue shoulder guards frame the chest, while curved ribbons cross a yellow lower robe.', 'ribbons'),
  },
}
