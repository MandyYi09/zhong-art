import type { Painting } from '@/lib/paintings'

export function PaintingIdentity({ painting, en = false }: { painting: Painting; en?: boolean }) {
  const identity = painting.identity
  const language = en ? 'en' : 'zh'
  return <section className="painting-identity" aria-label={en ? 'Figure and source date' : '人物与原画年代'}>
    <span className="overline">{en ? 'FIGURE / SOURCE' : '人物 / 原画资料'}</span>
    <h2>{identity.name[language]}</h2>
    <p className="identity-date"><strong>{en ? 'Source artwork: ' : '原画版本：'}</strong>{identity.date[language]}</p>
    <p className="identity-source"><strong>{en ? 'Source: ' : '出处：'}</strong>{identity.source[language]}</p>
    <details><summary>{en ? 'Source and dating notes' : '查看出处与年代说明'}</summary>
      <p><strong>{en ? 'Image reference: ' : '图像定位：'}</strong>{identity.location[language]}</p><p>{identity.note[language]}</p>
      {identity.catalogueUrl && <a href={identity.catalogueUrl} target="_blank" rel="noreferrer">{en ? 'Tenri Library catalogue ↗' : '天理图书馆版本著录 ↗'}</a>}
      {identity.facsimileUrl && <a href={identity.facsimileUrl} target="_blank" rel="noreferrer">{en ? 'Compare the facsimile ↗' : '对照原书影印图 ↗'}</a>}
    </details>
  </section>
}
