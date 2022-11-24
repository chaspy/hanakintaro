// If you send '@your-app answer' in @CHANNEL_ID channel
// Response $message

interface hanakinResponse {
  [key: string]: string
}

const hanakinResponse: hanakinResponse = {
  Mon: '花金である',
  Tue: 'ちょっと花金である',
  Wed: '花金ではない',
  Thu: 'やや花金である',
  Fri: '真の花金100%である',
  Sat: '休みなので、花金である',
  Sun: '休みなので、花金である',
}

interface hanakinBars {
  [key: string]: hanakinBar[]
}

interface hanakinBar {
  name: string
  main: string
  url: string
}

const hanakinBar: hanakinBars = {
  目黒: [
    { name: 'another8', main: 'ビール', url: 'https://sakahachi.jp/another8/' },
    {
      name: 'いと。',
      main: '日本酒',
      url: 'https://tabelog.com/tokyo/A1316/A131601/13246061/',
    },
    {
      name: 'なっぱ ごちそう',
      main: 'ワイン',
      url: 'https://retty.me/area/PRE13/ARE13/SUB704/100000738931/',
    },
  ],
}

export default {
  message: hanakinResponse,
  keyword: ['今日花金？', '今日花金?'],
  timezone: 'Asia/Tokyo',
  usage:
    'メンションして `今日花金？` って聞いてね。 `今日花金？ Canada/Pacific` `今日花金？ EST` のように timezone 指定もできるよ',
  recommended_bar: hanakinBar,
}
