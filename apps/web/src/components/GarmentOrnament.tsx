/** Quiet linework derived from 5698's green ribbons, red lining and blue robe trim. */
export function GarmentOrnament({ variant = 'ribbon', className = '' }: { variant?: 'ribbon' | 'hem'; className?: string }) {
  return <svg className={`garment-ornament ${className}`} viewBox="0 0 600 180" fill="none" aria-hidden="true" focusable="false">
    <path d="M-30 130C70 215 108 6 209 67S344 181 433 97 529 27 630 57L630 75C521 38 516 78 444 116S323 179 201 85 76 235-30 151Z" fill="#a9c7b6" stroke="#809e8b" strokeWidth="1.2"/>
    <path d="M-30 130C70 215 108 6 209 67S344 181 433 97 529 27 630 57" stroke="#f7f0da" strokeWidth="4"/>
    <path d="M-20 112C77 180 117 8 210 58S335 164 426 85 541 16 620 44L620 51C532 24 513 40 433 94S325 160 206 68 82 197-20 124Z" fill="#d6a48e" stroke="#b78e78" strokeWidth=".8"/>
    <path d="M-30 145C72 226 108 27 207 80S342 194 439 110 531 42 630 71" stroke="#e8edda" strokeWidth="1.5"/>
    {variant === 'hem' ? <g transform="translate(35 110) rotate(-9)">
      <path d="M0 0Q235 88 510-50L510-21Q240 118 0 26Z" fill="#8aa3ac" stroke="#bda677" strokeWidth="2"/>
      {[0,1,2,3,4,5,6,7,8].map(i => <g key={i} transform={`translate(${35+i*50} ${13+22*Math.sin(i*.43) - i*4}) rotate(${-i*3})`} stroke="#f3e9cd" strokeWidth="1.5"><path d="M-12 0C-13-13 7-14 9-4S-5 7-4-1 3-4 3-1M13-7C26-4 23 12 12 9"/><circle cx="-17" cy="3" r="1.5"/></g>)}
    </g> : <g transform="translate(307 126)" stroke="#93a591" strokeWidth="1.1">
      <path d="M0 0C-43-2-43-39-21-24L0 0C7-37 36-26 22-11Z" fill="#bdd0bd"/>
      <path d="M-3 2C-22 13-31 25-48 20-22 42-9 22 4 9M5 1C32-8 45 31 69 24 53 46 25 20 5 9" fill="#d6a48e"/>
      <ellipse rx="6" ry="8" fill="#cfbd8b"/>
    </g>}
  </svg>
}
