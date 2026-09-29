import "dotenv/config";
import { eq } from "drizzle-orm";
import { loadConfig } from "./config.js";
import { createDb } from "./db/index.js";
import { batches, cards, settings, users, type CardContent } from "./db/schema.js";

const foundations = [
  ["玄壇元帥", "Marshal of the Dark Altar", "守正開路", "Clear the way with integrity"],
  ["關聖帝君", "Lord Guan", "義氣長存", "Steadfast in what is right"],
  ["天上聖母", "Mazu", "渡海安瀾", "Safe passage through change"],
  ["文昌帝君", "Wenchang Dijun", "文思澄明", "Clarity for the work ahead"],
  ["福德正神", "Earth God", "腳踏實地", "Good things grow from steady ground"],
  ["九天玄女", "Mysterious Lady", "靜觀全局", "See the whole before you move"],
  ["保生大帝", "Baosheng Dadi", "身心調和", "Make room for restoration"],
  ["鍾馗", "Zhong Kui", "掃除陰霾", "Meet fear with a steady heart"],
  ["月下老人", "Old Man Under the Moon", "善緣相遇", "Treat every bond with care"],
  ["魁星", "Kui Xing", "一筆定志", "Let effort sharpen your aim"],
] as const;
const zhBlessings = ["願你今日心有所定，步步安穩。", "願你看清方向，也保有溫柔。", "願你的努力被看見，勇氣不被消磨。", "願你守住初心，迎來自己的好運。", "願你在變動之中，仍能找到安身之處。"];
const enBlessings = ["May you move steadily with a settled heart.", "May clarity and kindness guide you today.", "May your effort be seen and your courage remain.", "May you keep your center and welcome good fortune.", "May you find firm ground even while things change."];

const config = loadConfig(); const { db, pool } = createDb(config);
try {
  const [admin] = await db.insert(users).values({ subject: "seed-admin", email: "local-admin@example.invalid", displayName: "Local seed administrator", role: "admin" }).onConflictDoUpdate({ target: users.subject, set: { role: "admin" } }).returning();
  let [batch] = await db.select().from(batches).where(eq(batches.title, "Curated foundation deck"));
  if (!batch) [batch] = await db.insert(batches).values({ title: "Curated foundation deck", createdBy: admin!.id, status: "published", generatedAt: new Date(), publishedAt: new Date() }).returning();
  const existing = await db.select().from(cards).where(eq(cards.batchId, batch!.id));
  if (!existing.length) await db.insert(cards).values(Array.from({ length: 50 }, (_, position) => {
    const base = foundations[position % foundations.length]!; const cycle = Math.floor(position / foundations.length); const suffixZh = ["", "雲", "山", "水", "星"][cycle]!; const suffixEn = ["", "Cloud", "Mountain", "Water", "Star"][cycle]!;
    const content: CardContent = { name: { "zh-TW": suffixZh ? `${base[0]}・${suffixZh}` : base[0], en: suffixEn ? `${base[1]} · ${suffixEn}` : base[1] }, epithet: { "zh-TW": base[2], en: base[3] }, keywords: { "zh-TW": ["守護", "勇氣", "安定"], en: ["Protection", "Courage", "Steadiness"] }, blessing: { "zh-TW": zhBlessings[position % 5]!, en: enBlessings[position % 5]! }, story: { "zh-TW": `此卡以水陸畫中的${base[0]}形象為文化線索。卡片提供當代鼓勵，不取代宗教解釋或儀式。`, en: `This card uses the Water-and-Land painting of ${base[1]} as a cultural point of entry. Its message is contemporary encouragement, not religious interpretation or ritual.` }, palette: (["vermilion", "jade", "gold", "indigo"] as const)[position % 4]! };
    return { batchId: batch!.id, position, zh: content.name["zh-TW"], en: content.name.en, content, status: "approved" as const, reviewedBy: admin!.id, reviewedAt: new Date() };
  }));
  for (const [key, value] of [["anonymous_daily_quota", 1], ["authenticated_daily_quota", 3], ["global_budget_units", 1000]] as const) await db.insert(settings).values({ key, value, updatedBy: admin!.id }).onConflictDoNothing();
  console.log(`seed ok: ${existing.length || 50} curated cards`);
} finally { await pool.end(); }
