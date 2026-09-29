import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const resources = {
  'zh-TW': { translation: {
    product: '中・管理台', overview: '總覽', deck: '策展牌組', users: '使用者', settings: '配額與預算',
    adminConsole: '管理控制台', environment: '正式環境', search: '搜尋', searchHint: '搜尋卡牌、使用者…',
    signOut: '登出', language: '語言', nav: '主選單', openMenu: '開啟選單', close: '關閉',
    dashboardTitle: '營運總覽', dashboardSubtitle: '檢視牌組發布進度與 AI 使用狀況。',
    deckProgress: '牌組完成度', published: '已發布', inReview: '待審核', drafts: '草稿', totalCards: '共 50 張',
    aiUsage: '本月 AI 預算', budgetUsed: '已使用 {{percent}}%', remaining: '尚餘 US${{amount}}', viewSettings: '查看設定',
    recentActivity: '近期動態', viewAll: '查看全部', operational: '系統運作正常', keycloakConnected: 'Keycloak 身分服務已連線',
    deckTitle: '策展牌組', deckSubtitle: '審核、排序並發布 50 張雙語引導卡。', publishDeck: '發布牌組',
    cards: '卡牌', filterAll: '全部狀態', status: '狀態', title: '標題', updated: '更新時間', editor: '編輯者', actions: '動作',
    draft: '草稿', review: '待審核', empty: '沒有符合條件的卡牌', edit: '編輯', preview: '預覽',
    selectCard: '選取卡牌', selectedCount: '已選 {{count}} 張', sendReview: '送交審核',
    publishConfirmTitle: '發布目前牌組？', publishConfirmBody: '這會將所有待審核卡牌發布到正式牌組。草稿不會受到影響。', cancel: '取消', confirmPublish: '確認發布',
    usersTitle: '使用者與權限', usersSubtitle: '管理後台存取權及可擴充的角色權限。', inviteUser: '邀請使用者',
    person: '使用者', roles: '角色', lastActive: '最近使用', active: '啟用', invited: '已邀請', suspended: '已停用', never: '尚未登入', manage: '管理',
    roleAdmin: '管理員', roleEditor: '編輯者', roleSupport: '客服', roleViewer: '檢視者', roleAware: '角色權限預覽', roleAwareHint: '每個角色只會看到工作所需的功能。',
    settingsTitle: '配額與預算', settingsSubtitle: '控制每日 AI 使用上限，並在達到全域預算時停止請求。', saveChanges: '儲存變更', saved: '設定已儲存',
    dailyQuota: '每日配額', dailyQuotaHint: '每位使用者於台北時間午夜重設。', anonymous: '匿名訪客', authenticated: '已登入使用者', requestsDay: '次／日',
    globalBudget: '全域預算截止', globalBudgetHint: '跨所有使用者計算本月 AI 供應商費用。', monthlyLimit: '每月預算上限（USD）', cutoff: '達上限時停止 AI 請求', cutoffHint: '達到 100% 後拒絕新的生成請求。', currentUsage: '本月目前用量',
    auditNote: '變更將寫入稽核紀錄', auditDetail: '配額調整立即生效；預算使用量由伺服器端計費事件更新。',
    loading: '載入管理台…', accessDenied: '需要管理員權限', accessDeniedHint: '你的 Keycloak 帳號沒有 admin realm role。請聯絡系統管理員。', signIn: '使用 Keycloak 登入',
    cardEditor: '編輯雙語卡牌', zhTitle: '繁體中文標題', enTitle: '英文標題', zhPrompt: '繁體中文引導', enPrompt: '英文引導', saveCard: '儲存卡牌', cardSaved: '卡牌已儲存', unsaved: '有未儲存的變更',
  } },
  en: { translation: {
    product: 'Zhong Admin', overview: 'Overview', deck: 'Curated deck', users: 'Users', settings: 'Quotas & budget',
    adminConsole: 'Admin console', environment: 'Production', search: 'Search', searchHint: 'Search cards, users…',
    signOut: 'Sign out', language: 'Language', nav: 'Main navigation', openMenu: 'Open menu', close: 'Close',
    dashboardTitle: 'Operations overview', dashboardSubtitle: 'Track deck readiness and AI usage at a glance.',
    deckProgress: 'Deck readiness', published: 'Published', inReview: 'In review', drafts: 'Drafts', totalCards: '50 cards total',
    aiUsage: 'AI budget this month', budgetUsed: '{{percent}}% used', remaining: 'US${{amount}} remaining', viewSettings: 'View settings',
    recentActivity: 'Recent activity', viewAll: 'View all', operational: 'All systems operational', keycloakConnected: 'Keycloak identity service connected',
    deckTitle: 'Curated deck', deckSubtitle: 'Review, order, and publish the 50-card bilingual prompt deck.', publishDeck: 'Publish deck',
    cards: 'Cards', filterAll: 'All statuses', status: 'Status', title: 'Title', updated: 'Updated', editor: 'Editor', actions: 'Actions',
    draft: 'Draft', review: 'In review', empty: 'No cards match these filters', edit: 'Edit', preview: 'Preview', selectCard: 'Select card', selectedCount: '{{count}} selected', sendReview: 'Send to review',
    publishConfirmTitle: 'Publish the current deck?', publishConfirmBody: 'This publishes every card in review to the live deck. Draft cards are not affected.', cancel: 'Cancel', confirmPublish: 'Confirm publish',
    usersTitle: 'Users & access', usersSubtitle: 'Manage admin access with roles designed to grow.', inviteUser: 'Invite user',
    person: 'User', roles: 'Roles', lastActive: 'Last active', active: 'Active', invited: 'Invited', suspended: 'Suspended', never: 'Never signed in', manage: 'Manage',
    roleAdmin: 'Admin', roleEditor: 'Editor', roleSupport: 'Support', roleViewer: 'Viewer', roleAware: 'Role-aware access', roleAwareHint: 'Each role sees only the tools required for their work.',
    settingsTitle: 'Quotas & budget', settingsSubtitle: 'Control daily AI allowances and stop requests at the global budget limit.', saveChanges: 'Save changes', saved: 'Settings saved',
    dailyQuota: 'Daily quota', dailyQuotaHint: 'Resets per user at midnight, Taipei time.', anonymous: 'Anonymous visitor', authenticated: 'Authenticated user', requestsDay: 'requests/day',
    globalBudget: 'Global budget cutoff', globalBudgetHint: 'Monthly AI provider spend across all users.', monthlyLimit: 'Monthly limit (USD)', cutoff: 'Stop AI requests at the limit', cutoffHint: 'Reject new generations after usage reaches 100%.', currentUsage: 'Current month usage',
    auditNote: 'Changes are written to the audit log', auditDetail: 'Quota changes take effect immediately; usage is updated from server-side billing events.',
    loading: 'Loading admin…', accessDenied: 'Admin access required', accessDeniedHint: 'Your Keycloak account does not have the admin realm role. Contact your system administrator.', signIn: 'Sign in with Keycloak',
    cardEditor: 'Edit bilingual card', zhTitle: 'Traditional Chinese title', enTitle: 'English title', zhPrompt: 'Traditional Chinese prompt', enPrompt: 'English prompt', saveCard: 'Save card', cardSaved: 'Card saved', unsaved: 'Unsaved changes',
  } },
} as const

const storedLocale = typeof window !== 'undefined' ? window.localStorage.getItem('zhong-admin-locale') : null
void i18n.use(initReactI18next).init({
  resources,
  lng: storedLocale === 'en' ? 'en' : 'zh-TW',
  fallbackLng: 'zh-TW',
  interpolation: { escapeValue: false },
})

export default i18n
