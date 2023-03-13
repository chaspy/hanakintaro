import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "std/testing/asserts.ts";
import ResponseFunction from "./response.ts";
import conf from "../conf.ts";

const { createContext } = SlackFunctionTester("response");

// when: hanakin keyword
// expect: return usage
Deno.test("Response function test -- keyword", async () => {
  const inputs = { message: `<ABCDEFGHIJK> 今日花金？` };
  const { outputs } = await ResponseFunction(createContext({ inputs }));
  assertEquals(outputs?.response, conf.usage);
});

// when: @hanakin keyword
// expect: return answer
Deno.test("Response function test -- keyword without testDayOfWeek", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 今日花金？` };
  const { outputs } = await ResponseFunction(createContext({ inputs }));

  assertEquals(
    Object.values(conf.message).includes(`${outputs?.response}`),
    true,
  );
});

// when: @hanakin keyword on Friday
// expect: return answer on Friday
Deno.test("Response function test -- keyword", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 今日花金？` };
  const env = { testDayOfWeek: "5" };
  const { outputs } = await ResponseFunction(createContext({ inputs, env }));
  assertEquals(
    `${outputs?.response}`,
    "真の花金100%である",
  );
});

// when: @hanakin keyword for Tomorrow on Thursday
// expect: return answer on Friday
Deno.test("Response function test -- keyword", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 明日花金？` };
  const env = { testDayOfWeek: "4" };
  const { outputs } = await ResponseFunction(createContext({ inputs, env }));
  assertEquals(
    `${outputs?.response}`,
    "真の花金100%である",
  );
});

// when: @hanakin keyword for Tomorrow on Saturday
// expect: return answer on Sunday
Deno.test("Response function test -- keyword", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 明日花金？` };
  const env = { testDayOfWeek: "6" };
  const { outputs } = await ResponseFunction(createContext({ inputs, env }));
  assertEquals(
    `${outputs?.response}`,
    "休みなので、花金である",
  );
});

// when: @hanakin keyword (half-width ?) on Friday
// expect: return answer on Friday
Deno.test("Response function test -- keyword (half-width ?)", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 今日花金?` };
  const env = { testDayOfWeek: "5" };
  const { outputs } = await ResponseFunction(createContext({ inputs, env }));
  assertEquals(
    `${outputs?.response}`,
    "真の花金100%である",
  );
});

// when: @hanakin keyword timezone on Friday
// expect: return answer on Friday
Deno.test(
  "Response function test -- keyword with valid timezone (short name)",
  async () => {
    const inputs = { message: `<@ABCDEFGHIJK> 今日花金？ JST` };
    const env = { testDayOfWeek: "5" };
    const { outputs } = await ResponseFunction(createContext({ inputs, env }));
    assertEquals(
      `${outputs?.response}`,
      "真の花金100%である",
    );
  },
);

// when: @hanakin keyword timezone on Friday
// expect: return answer on Friday
Deno.test(
  "Response function test -- keyword with valid timezone (long name)",
  async () => {
    const inputs = {
      message: `<@ABCDEFGHIJK> 今日花金？ Canada/Pacific`,
    };
    const env = { testDayOfWeek: "5" };
    const { outputs } = await ResponseFunction(createContext({ inputs, env }));
    assertEquals(
      `${outputs?.response}`,
      "真の花金100%である",
    );
  },
);
// when: @hanakin keyword invalid-timezone
// expect: return error message
Deno.test(
  "Response function test -- keyword with invalid timezone",
  async () => {
    const inputs = { message: `<@ABCDEFGHIJK> 今日花金？ ABC` };
    const { outputs } = await ResponseFunction(createContext({ inputs }));
    assertEquals(
      `${outputs?.response}`,
      "ABC is invalid timezone. Please refer TZ database name or timezone abbereviation. See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for details.",
    );
  },
);

// when: @hanakin non-keyword
// expect: return usage
Deno.test("Response function test -- non-keyword", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> ABCDEFGH` };
  const { outputs } = await ResponseFunction(createContext({ inputs }));
  assertEquals(outputs?.response, conf.usage);
});

// when: @hanakin 今日目黒で花金?
// expect: return recomended-bar at 目黒
Deno.test("Response function test -- keyword with place", async () => {
  // generate test data
  const answerArray: string[] = [];
  const array = conf.recommended_bar["目黒"];
  array.forEach((e) => {
    answerArray.push(
      `今日は花金！${e.name}で${e.alcohol}を飲もう！${e.url}`,
    );
  });

  // test
  const inputs = { message: `<@ABCDEFGHIJK> 今日目黒で花金?` };
  const { outputs } = await ResponseFunction(createContext({ inputs }));
  assertEquals(answerArray.includes(`${outputs?.response}`), true);
});

// when: @hanakin 今日目黒でノンアル花金?
// expect: return recomended-food at 目黒
Deno.test("Response function test -- keyword with place", async () => {
  // generate test data
  const answerArray: string[] = [];
  const array = conf.recommended_bar["目黒"];
  array.forEach((e) => {
    answerArray.push(
      `今日は花金！${e.name}で${e.food}を食べよう！${e.url}`,
    );
  });

  // test
  const inputs = { message: `<@ABCDEFGHIJK> 今日目黒でノンアル花金?` };
  const { outputs } = await ResponseFunction(createContext({ inputs }));
  assertEquals(answerArray.includes(`${outputs?.response}`), true);
});

// when: @hanakin 今日福岡で花金?
// expect: return usage
Deno.test("Response function test -- keyword with wrong place", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 今日福岡で花金?` };
  const { outputs } = await ResponseFunction(createContext({ inputs }));
  assertEquals(
    outputs?.response,
    "福岡は登録されていないみたいよ。https://github.com/chaspy/hanakintaro/blob/main/conf.ts におすすめの店を追加しよう",
  );
});
