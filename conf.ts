// If you send '@your-app answer' in @CHANNEL_ID channel
// Response $message

interface hanakinResponse {
  [key: string]: string;
}

const hanakinResponse: hanakinResponse = {
  Sun: "休みなので、花金である",
  Mon: "花金である",
  Tue: "ちょっと花金である",
  Wed: "花金ではない",
  Thu: "やや花金である",
  Fri: "真の花金100%である",
  Sat: "休みなので、花金である",
};

interface hanakinBars {
  [key: string]: hanakinBar[];
}

interface hanakinBar {
  name: string;
  alcohol: string;
  food: string;
  url: string;
}

const hanakinBar: hanakinBars = {
  家: [{ name: "家", alcohol: "好きなお酒", food: "好きなおつまみ", url: "" }],
  目黒: [
    {
      name: "another8",
      alcohol: "ビール",
      food: "大根の唐揚げ",
      url: "https://sakahachi.jp/another8/",
    },
    {
      name: "いと。",
      alcohol: "日本酒",
      food: "白子ポンず",
      url: "https://tabelog.com/tokyo/A1316/A131601/13246061/",
    },
    {
      name: "なっぱ ごちそう",
      alcohol: "ワイン",
      food: "帆立と鮮魚のカルパッチョ　（サラダ仕立て）",
      url: "https://retty.me/area/PRE13/ARE13/SUB704/100000738931/",
    },
    {
      name: "ゴス",
      alcohol: "ウイスキー",
      food: "ナッツ",
      url: "https://tabelog.com/tokyo/A1316/A131601/13220203/",
    },
  ],
  九段下: [
    {
      // 神楽坂
      name: "クラフトビアサーバーランド",
      alcohol: "ビール",
      food: "穴子の Fish & Chips",
      url: "https://tabelog.com/tokyo/A1309/A130905/13160783/",
    },
    {
      // 神楽坂
      name: "BEER OLYN",
      alcohol: "ビール",
      food: "水餃子",
      url: "https://www.beerolyn.com/",
    },
    {
      // 神楽坂
      name: "亀戸ホルモン",
      alcohol: "ビール",
      food: "ホルモン",
      url: "https://tabelog.com/tokyo/A1309/A130905/13231854/",
    },
    {
      // 神保町
      name: "クラフトビアマーケット",
      alcohol: "ビール",
      food: "クラフトビールキーマカレー",
      url: "https://www.craftbeermarket.jp/jimbocho/",
    },
  ],

  Sydney: [
    {
      name: "Sydney Brewery Surry Hills",
      alcohol: "Beer",
      food: "Sydney Brewery Loaded Burger",
      url: "https://www.sydneybrewery.com/surry-hills/",
    },
    {
      name: "Keg & Brew",
      alcohol: "Beer",
      food: "NACHOS CON FRIJOLES",
      url: "https://www.kegandbrew.com.au/eat-drink/",
    },
  ],
};

// 給料日を設定する日付
export const payday = [
  "2023-11-22",
  "2023-12-22",
  "2024-01-22",
  "2024-02-22",
  "2024-03-22",
  "2024-04-22",
  "2024-05-22",
  "2024-06-21",
  "2024-07-22",
  "2024-08-22",
  "2024-09-20",
  "2024-10-22",
];

export const bonusDay = [
  "2023-12-11",
  "2024-06-10",
  "2024-12-10",
];

export default {
  message: hanakinResponse,
  timezone: "Asia/Tokyo",
  usage:
    "メンションして `今日花金？` って聞いてね。 `今日花金？ EST` のように timezone 指定もできるよ。飲む場所が決まっていれば `今日目黒で花金？` のように聞いてね。お酒が飲めない人は `今日目黒でノンアル花金？` と聞いてみよう。",
  recommended_bar: hanakinBar,
  payday: payday,
  bonusDay: bonusDay,
};
