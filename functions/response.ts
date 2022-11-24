import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts'
import { methodsWithCustomTypes } from 'deno-slack-api/typed-method-types/mod.ts'
import { DateTime, datetime } from 'ptera/mod.ts'
import env from '../env.ts'

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const ResponseFunctionDefinition = DefineFunction({
  callback_id: 'response_function',
  title: 'Send a message',
  description: 'Generate a message',
  source_file: 'functions/response.ts',
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: 'Message to the bot',
      },
    },
    required: ['message'],
  },
  output_parameters: {
    properties: {
      response: {
        type: Schema.types.string,
        description: 'Response from the bot',
      },
    },
    required: ['response'],
  },
})

export default SlackFunction(ResponseFunctionDefinition, ({ inputs }) => {
  const { message } = inputs

  const regex = /^(<@.*>) (.*)$/
  const found = message.match(regex)
  const matched = found && found[2]
  const msg = matched ?? ''

  const res = msg.split(' ', 2)
  const keyword = res[0]

  // Logic for Timezone
  // Given TZ by user, use it. Otherwise use default.
  const tz = res[1] ? res[1] : `${env.timezone}`

  let dt = datetime()
  try {
    dt = datetime().toZonedTime(tz)
  } catch (e) {
    if (e instanceof RangeError) {
      const response = `${tz} is invalid timezone`

      // early return
      return { outputs: { response } }
    }
  }

  // Logic for keyword.
  // 1. Response if today is hanakin or not with keyword '今日花金？'
  // 2. Response recommended bar with keyword '今日xxで花金？’
  const askedPlace = isAskingRecommenededPlace(keyword)
  const collectPlace = isRecommendedPlace(keyword)

  if (collectPlace) {
    const response = getRecommendedBar(collectPlace)
    return { outputs: { response } }
  } else if (askedPlace) {
    const response =
      askedPlace +
      'は登録されていないみたいよ。https://github.com/chaspy/hanakintaro/blob/main/env.ts.sample におすすめの店を追加しよう'
    return { outputs: { response } }
  } else {
    const dayOfWeekStr = getDayOfWeekStr(dt)
    const response = getResponse(dayOfWeekStr, keyword)
    return { outputs: { response } }
  }
})

function getRecommendedBar(place: string): string {
  const info = env.recommended_bar[place]
  const length = info.length
  const num = Math.floor(Math.random() * length)
  const bar = info[num]

  return '今日は花金！' + bar.name + 'で' + bar.main + 'を飲もう！' + bar.url
}

/**
 * @param {string}  dayOfWeek - day of week String. e.g. 'Mon', 'Tue'.
 * @param {string}  keyword - keyword by the user. 2nd part of '@hanakin "今日花金？"'
 * @returns {string} response by the bot.
 */
function getResponse(dayOfWeek: string, res: string): string {
  const noMatchMsg = `${env.usage}`
  const keyword = env.keyword
  const dayOfWeekStr = dayOfWeek

  let response = ''
  if (keyword.includes(res)) {
    response = `${env.message[dayOfWeekStr]}`
  } else {
    response = noMatchMsg
  }
  return response
}

/**
 * @param {string}  q - Question to the bot. 2nd part of '@hanakin "今日目黒で花金？"'
 * @returns {string} Place name of param. If it matches regexp, return the name. Otherwise, return ''
 */
function isRecommendedPlace(q: string): string {
  const regexp = /^今日(.+)で花金[？|?]$/
  const result = q.match(regexp)
  const matched = result && result[1]
  const msg = matched ?? ''
  const place = msg
  if (Object.keys(env.recommended_bar).includes(place)) {
    return place
  } else {
    return ''
  }
}

/**
 * @param {string}  q - Question to the bot. 2nd part of '@hanakin "今日目黒で花金？"'
 * @returns {string} Matched regexp
 */
function isAskingRecommenededPlace(q: string): string {
  const regexp = /^今日(.+)で花金[？|?]$/
  const result = q.match(regexp)
  const matched = result && result[1]
  const msg = matched ?? ''
  const place = msg
  if (place) {
    return place
  } else {
    return ''
  }
}

/**
 * @param {DateTime}  dt - DateTime.
 * @returns {string} day-Of-Week String, like '1' (Monday), '3' (Tuesday)
 */
function getDayOfWeekStr(dt: DateTime): string {
  const dayOfWeek = dt.weekDay()
  const dayOfWeekStr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    dayOfWeek
  ]

  return dayOfWeekStr
}
