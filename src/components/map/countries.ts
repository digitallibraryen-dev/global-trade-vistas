export interface CountryData {
  name: string;
  flag: string;
  path: string;
  labelX: number;
  labelY: number;
}

// Simplified but geographically recognizable SVG paths for Middle East countries
// ViewBox: 0 0 1000 700
export const middleEastCountries: CountryData[] = [
  {
    name: "Turkey",
    flag: "🇹🇷",
    path: "M 220,60 L 260,45 L 310,40 L 360,35 L 410,30 L 460,35 L 510,40 L 550,50 L 580,65 L 560,85 L 530,95 L 500,100 L 460,105 L 420,100 L 380,95 L 340,100 L 310,95 L 280,90 L 250,80 L 230,70 Z",
    labelX: 400,
    labelY: 65,
  },
  {
    name: "Syria",
    flag: "🇸🇾",
    path: "M 380,105 L 420,100 L 460,105 L 490,115 L 500,140 L 490,160 L 460,170 L 430,165 L 400,155 L 385,140 L 375,120 Z",
    labelX: 440,
    labelY: 135,
  },
  {
    name: "Cyprus",
    flag: "🇨🇾",
    path: "M 330,115 L 350,110 L 370,115 L 365,125 L 345,130 L 325,125 Z",
    labelX: 348,
    labelY: 118,
  },
  {
    name: "Lebanon",
    flag: "🇱🇧",
    path: "M 375,160 L 385,155 L 392,165 L 388,180 L 378,185 L 370,175 Z",
    labelX: 380,
    labelY: 170,
  },
  {
    name: "Palestine",
    flag: "🇵🇸",
    path: "M 358,190 L 378,185 L 385,195 L 382,215 L 375,230 L 368,225 L 360,210 L 358,200 Z",
    labelX: 372,
    labelY: 210,
  },
  {
    name: "Jordan",
    flag: "🇯🇴",
    path: "M 385,195 L 420,175 L 450,185 L 460,200 L 450,230 L 430,250 L 400,260 L 382,240 L 375,230 L 382,215 Z",
    labelX: 420,
    labelY: 220,
  },
  {
    name: "Iraq",
    flag: "🇮🇶",
    path: "M 490,115 L 530,105 L 570,110 L 600,125 L 620,150 L 625,180 L 610,210 L 580,230 L 550,240 L 520,235 L 490,220 L 470,200 L 460,170 L 490,160 Z",
    labelX: 550,
    labelY: 170,
  },
  {
    name: "Iran",
    flag: "🇮🇷",
    path: "M 620,70 L 670,55 L 720,50 L 770,60 L 810,80 L 840,110 L 850,150 L 840,190 L 820,220 L 790,245 L 750,260 L 710,265 L 670,255 L 640,235 L 625,210 L 625,180 L 620,150 L 600,125 L 610,100 L 615,85 Z",
    labelX: 730,
    labelY: 155,
  },
  {
    name: "Kuwait",
    flag: "🇰🇼",
    path: "M 560,245 L 580,238 L 595,250 L 590,268 L 575,275 L 558,265 Z",
    labelX: 575,
    labelY: 255,
  },
  {
    name: "Bahrain",
    flag: "🇧🇭",
    path: "M 610,298 L 618,293 L 624,300 L 620,310 L 612,308 Z",
    labelX: 616,
    labelY: 302,
  },
  {
    name: "Qatar",
    flag: "🇶🇦",
    path: "M 622,310 L 632,305 L 638,318 L 635,335 L 625,338 L 618,325 Z",
    labelX: 628,
    labelY: 322,
  },
  {
    name: "UAE",
    flag: "🇦🇪",
    path: "M 650,300 L 700,285 L 740,295 L 745,315 L 730,335 L 695,340 L 665,335 L 645,320 Z",
    labelX: 695,
    labelY: 315,
  },
  {
    name: "Saudi Arabia",
    flag: "🇸🇦",
    path: "M 400,270 L 450,250 L 500,245 L 550,250 L 570,275 L 595,290 L 620,310 L 640,330 L 650,360 L 640,400 L 620,430 L 580,460 L 530,480 L 480,485 L 430,470 L 390,440 L 360,400 L 350,360 L 355,320 L 370,290 Z",
    labelX: 490,
    labelY: 380,
  },
  {
    name: "Oman",
    flag: "🇴🇲",
    path: "M 700,340 L 740,325 L 770,340 L 790,370 L 800,410 L 790,450 L 770,480 L 740,495 L 710,490 L 680,470 L 660,440 L 650,400 L 660,370 L 680,350 Z",
    labelX: 730,
    labelY: 415,
  },
  {
    name: "Yemen",
    flag: "🇾🇪",
    path: "M 480,490 L 530,485 L 580,470 L 620,445 L 650,460 L 670,490 L 660,530 L 630,555 L 580,565 L 530,560 L 490,540 L 470,515 Z",
    labelX: 570,
    labelY: 520,
  },
  {
    name: "Egypt",
    flag: "🇪🇬",
    path: "M 180,210 L 220,195 L 260,200 L 300,210 L 340,230 L 355,260 L 360,300 L 350,340 L 330,370 L 300,385 L 260,390 L 220,380 L 190,360 L 175,330 L 170,290 L 170,250 Z",
    labelX: 265,
    labelY: 295,
  },
  {
    name: "Morocco",
    flag: "🇲🇦",
    path: "M 20,160 L 60,140 L 100,135 L 130,145 L 140,170 L 135,200 L 120,225 L 95,235 L 65,230 L 40,215 L 25,195 Z",
    labelX: 80,
    labelY: 185,
  },
];
