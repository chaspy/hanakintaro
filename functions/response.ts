import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { DateTime, datetime } from "ptera/mod.ts";
import conf from "../conf.ts";
import { timezoneAbbreviations } from "../timezone.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const ResponseFunctionDefinition = DefineFunction({
  callback_id: "response_function",
  title: "Send a message",
  description: "Generate a message",
  source_file: "functions/response.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to the bot",
      },
    },
    required: ["message"],
  },
  output_parameters: {
    properties: {
      response: {
        type: Schema.types.string,
        description: "Response from the bot",
      },
    },
    required: ["response"],
  },
});

export default SlackFunction(
  ResponseFunctionDefinition,
  async ({ inputs, env }) => {
    const { message } = inputs;

    const parsedMsg = parseInputs(message);
    const keyword = parsedMsg[0];
    const tz = checkTimezone(parsedMsg[1]);

    let dt = datetime();
    try {
      dt = datetime().toZonedTime(tz);
    } catch (e) {
      if (e instanceof RangeError) {
        const response =
          `${tz} is invalid timezone. Please refer TZ database name. See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for details. And typical abbereviations are supported. See https://github.com/chaspy/hanakintaro/blob/main/timezone.ts`;

        // early return
        return { outputs: { response } };
      }
    }

    // Special feature.
    // 2023-09-19 is the day of the StudySapuri for grade 1 renewal.
    const beforeDayOfReleaseG1Renewal = new Date("2023-09-18T23:59:59+09:00")
    const afterDayOfReleaseG1Renewal = new Date("2023-09-19T23:59:59+09:00")

    const today = new Date();
    console.log(afterDayOfReleaseG1Renewal);
    console.log(beforeDayOfReleaseG1Renewal);
    console.log(today);
    if (today < afterDayOfReleaseG1Renewal && today > beforeDayOfReleaseG1Renewal){
      const response =
        `今日は花金！小学1年生リニューアルの日だよ！https://studysapuri.jp/course/elementary/sho1/`;

      // early return
      return { outputs: { response } };
    }

    // If GitHub is down, we will get Hanakin on the day.

    const hasGitHubIncident = await isGitHubDown();
    if (hasGitHubIncident) {
      const response =
        `今日は花金！GitHub が落ちてるみたいだからね。https://www.githubstatus.com/ `;

      // early return
      return { outputs: { response } };
    }

    // From a normal trigger, env.testDayOfWeek is never apperered.
    // This is used when we want to specify a day of the week for testing.
    // If not provided, set -1 as undefined.
    const testDayOfWeek = env.testDayOfWeek ? Number(env.testDayOfWeek) : -1;

    // Logic for keyword.
    // 1. Response if today is hanakin or not with keyword '(今日|明日)花金？'
    // 2. Response recommended bar with keyword '今日xxで花金？’
    // 3. Return usage with invalid keyword
    let response = "";
    const askedPlace = getAskingPlace(keyword);
    const isNonAl = isNonAlcohol(keyword);

    if (isAskingHanakin(keyword)) {
      // pattern1
      const when = isAskingHanakin(keyword);
      const dayOfWeekStr = getDayOfWeekStr(dt, when, testDayOfWeek);
      response = getHanakinResponse(dayOfWeekStr);
    } else if (askedPlace) {
      // pattern2
      response = getRecommendedBar(askedPlace, isNonAl);
    } else {
      // pattern3
      const noMatchMsg = `${conf.usage}`;
      response = noMatchMsg;
    }

    return { outputs: { response } };
  },
);

/**
 * @param {string}  msg - first arg of message
 * @returns {boolean} "今日" or "明日" if user is asking whether today is hanakin or not
 */
function isAskingHanakin(msg: string): string {
  const regex = /^(今日|明日)は?花金[？?]$/;
  const found = msg.match(regex);
  const when = found ? found[1] : "";

  return when;
}

/**
 * @param {string}  tz - timezone string given by message.
 * @returns {string} return timezone if given. otherwise, return default
 */
function checkTimezone(tz: string): string {
  let ret;
  if (isAbbreviationValid(tz)) {
    ret = timezoneAbbreviations.tz;
  } else if (tz) {
    ret = tz;
  } else {
    ret = `${conf.timezone}`;
  }
  return ret;
}

/**
 * @param {string}  abbreviation - timezone abbreviation string given by message.
 * @returns {string} return if the abbreviation exists in timezone.ts
 */
function isAbbreviationValid(abbreviation: string): boolean {
  return abbreviation in timezoneAbbreviations;
}

/**
 * @param {string}  input - input text from users
 * @returns {string[]} return array of splited input text. the array length is 2.
 */
function parseInputs(input: string): string[] {
  const regex = /^(<@.*>) (.*)$/;
  const found = input.match(regex);
  const matched = found && found[2];
  const msg = matched ?? "";

  const res = msg.split(" ", 2);
  return [res[0], res[1]];
}

/**
 * @param {string}  place - place name
 * @returns {string} response from the bot for recommendation bar in the place
 */
function getRecommendedBar(place: string, isNonAlcohol: boolean): string {
  let response = "";

  if (isRecommendedPlace(place)) {
    const info = conf.recommended_bar[place];
    const length = info.length;
    const num = Math.floor(Math.random() * length);
    const bar = info[num];

    if (isNonAlcohol) {
      response = `今日は花金！${bar.name}で${bar.food}を食べよう！${bar.url}`;
    } else {
      response = `今日は花金！${bar.name}で${bar.alcohol}を飲もう！${bar.url}`;
    }
  } else {
    response =
      `${place}は登録されていないみたいよ。https://github.com/chaspy/hanakintaro/blob/main/conf.ts におすすめの店を追加しよう`;
  }

  return response;
}

/**
 * @param {string}  dayOfWeek - day of week String. e.g. 'Mon', 'Tue'.
 * @returns {string} response by the bot.
 */
function getHanakinResponse(dayOfWeek: string): string {
  const dayOfWeekStr = dayOfWeek;
  const response = `${conf.message[dayOfWeekStr]}`;

  return response;
}

/**
 * @param {string}  place - place name for recommendation
 * @returns {boolean} return if the given place name is defined at conf.ts or not
 */
function isRecommendedPlace(place: string): boolean {
  return Object.keys(conf.recommended_bar).includes(place);
}

/**
 * @param {string}  q - Question to the bot. 2nd part of '@hanakin "今日目黒で花金？"'
 * @returns {string} Matched regexp
 */
function getAskingPlace(q: string): string {
  const regexp = /^今日は?(.+)で(ノンアル)?花金[？?]$/;
  const result = q.match(regexp);
  const matched = result && result[1];
  const msg = matched ?? "";
  const place = msg;
  if (place) {
    return place;
  } else {
    return "";
  }
}

/**
 * @param {string}  q - Question to the bot. 2nd part of '@hanakin "今日目黒で花金？"'
 * @returns {boolean} If nonAlchol or not
 */
function isNonAlcohol(q: string): boolean {
  const regexp = /^今日は?(.+)で(ノンアル)?花金[？?]$/;
  const result = q.match(regexp);
  const matched = result && result[2];
  const msg = matched ?? "";
  const NonAlchol = msg;
  if (NonAlchol) {
    return true;
  } else {
    return false;
  }
}

/**
 * @param {DateTime}  dt - DateTime.
 * @param {String}  when - "今日" or "明日".
 * @returns {string} day-Of-Week String, like '1' (Monday), '3' (Tuesday)
 */
function getDayOfWeekStr(
  dt: DateTime,
  when: string,
  testDayOfWeek: number,
): string {
  const num = (when === "明日") ? 1 : 0;
  const dayOfWeek = dt.weekDay();
  const dayOfWeekIntForTest = testDayOfWeek;
  let arg;

  if (dayOfWeekIntForTest >= 0) {
    arg = dayOfWeekIntForTest + num;
  } else {
    arg = dayOfWeek + num;
  }

  const dayOfWeekStr = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ][
    arg % 7
  ];

  return dayOfWeekStr;
}

/**
 * @returns {boolean} If GitHub is down or not
 */
async function isGitHubDown(): Promise<boolean> {
  try {
    const response = await fetch(
      "https://www.githubstatus.com/api/v2/status.json",
    );
    const { status } = await response.json();

    if (status.indicator === "none") {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("GitHub Status API から情報を取得できませんでした。", error);
    return false;
  }
}
