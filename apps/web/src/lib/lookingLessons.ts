import type { ClueKey } from './paintingClues'

type Bilingual = { zh: string; en: string }

// Contemporary analogies teach a way of looking; they are not historical identifications.
export const lookingLessons: Record<ClueKey, { takeaway: Bilingual; today: Bilingual; question: Bilingual }> = {
  head: {
    takeaway: { zh: '把冠饰、发束和头后的纹样分开看，再看它们怎样组成轮廓。你会更容易分清：画了什么，以及什么让人物显得有力量。', en: 'Separate the headwear, hair and forms behind the head, then look at their combined outline. This helps distinguish what is depicted from what makes the figure feel powerful.' },
    today: { zh: '看电影或游戏里的角色时，我们也常先记住一个轮廓：高起的头饰、展开的发型，都可能让人物更醒目。可以借这个熟悉的经验观察古画的造型。', en: 'In films and games, a character’s silhouette often stays with us first. Tall headwear or spreading hair can make a figure stand out. That familiar experience offers a way to notice shapes in these paintings.' },
    question: { zh: '如果只留下轮廓，你还会认出这个人物吗？', en: 'If only the silhouette remained, would you still recognise this figure?' },
  },
  hands: {
    takeaway: { zh: '先辨认手的位置、动作和持物，再看它们怎样把视线带向人物正在做的事。看清形状，是理解器物之前的一步。', en: 'Locate the hands, gestures and held objects, then notice how they direct attention to the figure’s action. Seeing the shape clearly comes before identifying the object.' },
    today: { zh: '生活里，我们会从一个人拿着的物件和手上的动作，猜测他正在做什么。带着同样的观察方式看画，再把看到的形状与尚未确认的器名分开。', en: 'In everyday life, objects and hand movements give us clues about what someone is doing. Try the same observation here, while keeping visible shapes separate from unconfirmed object names.' },
    question: { zh: '先不猜名字：这个动作让你的视线停在哪里？', en: 'Before guessing a name, where does this gesture draw your eye?' },
  },
  robe: {
    takeaway: { zh: '先找最大的色块，再看甲片、宽袖和飘带怎样层叠。服装既塑造人物的形象，也能让静止的画面产生动势。', en: 'Start with the largest colour field, then follow overlapping armour, sleeves and ribbons. Clothing shapes the figure’s appearance and can give a still image a sense of movement.' },
    today: { zh: '今天，我们也会通过制服、配饰和穿着形成对一个人的第一印象。用这个经验看古画：哪些衣饰影响了你对人物的感受？', en: 'Uniforms, accessories and clothing still shape first impressions today. Use that experience to ask which elements of dress affect how this painted figure feels to you.' },
    question: { zh: '如果换一种穿着，你对这个人物的第一印象会改变吗？', en: 'Would different clothing change your first impression of this figure?' },
  },
}
