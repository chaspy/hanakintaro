import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts'
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
  const tz = getTimeZoneArg(res)

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

  const dayOfWeekStr = getDayOfWeekStr(dt)
  const response = getResponse(dayOfWeekStr, keyword)

  return { outputs: { response } }
})

/**
 * @param {string}  res - keyword by the user. Array of '@hanakin "今日花金？"'
 * @returns {string} timezone string. If given by user, return it. Otherwise, return default.
 */
function getTimeZoneArg(res: Array<string>): string {
  if (res.length == 1) {
    return `${env.timezone}`
  } else {
    return res[1]
  }
}

/**
 * @param {string}  dayOfWeek - day of week String. e.g. 'Mon', 'Tue'.
 * @param {string}  keyword - keyword by the user. 2nd part of '@hanakin "今日花金？"'
 * @returns {string} response by the bot.
 */
function getResponse(dayOfWeek: string, res: string): string {
  const noMatchMsg = `${env.usage}`
  const answer = `${env.answer}`
  const dayOfWeekStr = dayOfWeek

  let response = ''
  if (res === answer) {
    response = `${env.message[dayOfWeekStr]}`
  } else {
    response = noMatchMsg
  }
  return response
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
