import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const resources = {
  'zh-TW': { translation: {
    loading: '載入中…', loadFailed: '無法連線到服務，請稍後再試。', createFailed: '目前無法生成，請稍後再試。', quotaReached: '今天的生成次數已用完。', saved: '已收藏',
    brand: '吉光', tagline: '每日一位守護神明，一段給自己的話', draw: '今日抽籤', collection: '我的籤冊', create: '自造靈籤', signIn: '登入', signOut: '登出',
    heroEyebrow: '水陸畫文化靈感・每日一抽', heroTitle: '今天，讓哪一道吉光陪你？', heroBody: '從經審核的水陸畫神明卡中，抽取今日守護與祝語。認識圖像、故事，也把一句安定的話帶進生活。', drawNow: '揭開今日靈籤', curatedNote: '僅從已通過文化內容審核的卡片抽取', todayGuardian: '今日守護', readStory: '閱讀神明故事', share: '分享祝語', drawDone: '今天的卡片已為你留好', returnHome: '返回今日抽籤', culturalNote: '文化註記', originalPainting: '原始水陸畫參考', cardMeaning: '今日的提醒', yourCollection: '你的籤冊', collectionLead: '在這台裝置上保存曾與你相遇的守護卡。', emptyCollection: '籤冊還是空的', emptyHelp: '抽出今天的守護卡後，收藏會出現在這裡。', goDraw: '去抽一張',
    createTitle: '把今天的心情，變成一張靈籤', createBody: '選擇你此刻需要的力量。我們會在文化與安全規範內，生成只屬於你的現代祝語卡。', feeling: '此刻的心情', wish: '想得到的力量', style: '畫面氣質', generate: '生成我的靈籤', quotaAnon: '訪客每日可生成 1 次', quotaAuth: '登入後每日可生成 3 次', budget: '生成服務會在全站預算用盡時暫停', placeholderFeeling: '例如：明天要考試，有點緊張', placeholderWish: '例如：專注與沉著', classic: '典雅', lively: '明亮', quiet: '沉靜', authLoading: '正在確認登入狀態…', approved: '已審核', deckCount: '{{count}} 張已發布', footer: '以傳統圖像為起點，為今日留一點安定。', rights: '圖像僅作本專案文化展示與研究參考。', notFound: '找不到這張卡', language: '語言', menu: '開啟選單'
  } },
  en: { translation: {
    loading: 'Loading…', loadFailed: 'The service could not be reached. Please try again.', createFailed: 'Creation is unavailable right now. Please try again.', quotaReached: 'You have reached today’s creation limit.', saved: 'Saved',
    brand: 'Auspicious Light', tagline: 'A guardian and a kind word, every day', draw: 'Daily draw', collection: 'My collection', create: 'Create a card', signIn: 'Sign in', signOut: 'Sign out',
    heroEyebrow: 'Inspired by Water-and-Land paintings · One draw daily', heroTitle: 'What light will accompany you today?', heroBody: 'Draw a daily guardian and blessing from a culturally reviewed deck. Meet the image, learn its story, and carry a steadying thought into your day.', drawNow: 'Reveal today’s card', curatedNote: 'Drawn only from cards approved through cultural review', todayGuardian: 'Today’s guardian', readStory: 'Read the guardian story', share: 'Share blessing', drawDone: 'Your card is saved for today', returnHome: 'Back to today’s draw', culturalNote: 'Cultural note', originalPainting: 'Original painting reference', cardMeaning: 'A thought for today', yourCollection: 'Your collection', collectionLead: 'Cards you meet are kept on this device.', emptyCollection: 'Your collection is waiting', emptyHelp: 'Draw today’s guardian and it will appear here.', goDraw: 'Draw a card',
    createTitle: 'Turn what you feel into a personal card', createBody: 'Choose the strength you need. We’ll create a contemporary blessing within cultural and safety guidelines.', feeling: 'How you feel', wish: 'The strength you need', style: 'Visual mood', generate: 'Create my card', quotaAnon: 'Guests can create once per day', quotaAuth: 'Sign in to create three times per day', budget: 'Creation pauses automatically when the site-wide budget is reached', placeholderFeeling: 'For example: nervous about tomorrow’s exam', placeholderWish: 'For example: focus and calm', classic: 'Classic', lively: 'Bright', quiet: 'Quiet', authLoading: 'Checking sign-in…', approved: 'Reviewed', deckCount: '{{count}} published', footer: 'Traditional imagery, reintroduced as a small moment of steadiness.', rights: 'Images are shown for cultural study and project reference only.', notFound: 'This card could not be found', language: 'Language', menu: 'Open menu'
  } },
} as const

const stored = typeof window !== 'undefined' ? window.localStorage.getItem('zhong-locale') : null
void i18n.use(initReactI18next).init({ resources, lng: stored === 'en' ? 'en' : 'zh-TW', fallbackLng: 'zh-TW', interpolation: { escapeValue: false } })
export default i18n
