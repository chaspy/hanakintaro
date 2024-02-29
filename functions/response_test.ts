import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "std/testing/asserts.ts";
import ResponseFunction from "./response.ts";
import conf from "../conf.ts";
import * as mf from "mock_fetch/mod.ts";

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
Deno.test(
  "Response function test -- keyword without testDayOfWeek",
  async () => {
    const inputs = { message: `<@ABCDEFGHIJK> 今日花金？` };
    const { outputs } = await ResponseFunction(createContext({ inputs }));

    assertEquals(
      Object.values(conf.message).includes(`${outputs?.response}`),
      true
    );
  }
);

// when: @hanakin keyword on Friday
// expect: return answer on Friday
Deno.test("Response function test -- keyword", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 今日花金？` };
  const env = { testDayOfWeek: "5" };
  const { outputs } = await ResponseFunction(createContext({ inputs, env }));
  assertEquals(`${outputs?.response}`, "真の花金100%である");
});

// when: @hanakin keyword for Tomorrow on Thursday
// expect: return answer on Friday
Deno.test("Response function test -- keyword", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 明日花金？` };
  const env = { testDayOfWeek: "4" };
  const { outputs } = await ResponseFunction(createContext({ inputs, env }));
  assertEquals(`${outputs?.response}`, "真の花金100%である");
});

// when: @hanakin keyword for Tomorrow on Saturday
// expect: return answer on Sunday
Deno.test("Response function test -- keyword", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 明日花金？` };
  const env = { testDayOfWeek: "6" };
  const { outputs } = await ResponseFunction(createContext({ inputs, env }));
  assertEquals(`${outputs?.response}`, "休みなので、花金である");
});

// when: @hanakin keyword (half-width ?) on Friday
// expect: return answer on Friday
Deno.test("Response function test -- keyword (half-width ?)", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 今日花金?` };
  const env = { testDayOfWeek: "5" };
  const { outputs } = await ResponseFunction(createContext({ inputs, env }));
  assertEquals(`${outputs?.response}`, "真の花金100%である");
});

// when: @hanakin keyword timezone on Friday
// expect: return answer on Friday
Deno.test(
  "Response function test -- keyword with valid timezone (short name)",
  async () => {
    const inputs = { message: `<@ABCDEFGHIJK> 今日花金？ JST` };
    const env = { testDayOfWeek: "5" };
    const { outputs } = await ResponseFunction(createContext({ inputs, env }));
    assertEquals(`${outputs?.response}`, "真の花金100%である");
  }
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
    assertEquals(`${outputs?.response}`, "真の花金100%である");
  }
);

// when: @hanakin keyword timezone on Friday
// expect: return answer on Friday
Deno.test(
  "Response function test -- keyword with valid timezone (abbereviation in timezone.ts)",
  async () => {
    const inputs = { message: `<@ABCDEFGHIJK> 今日花金？ CEST` };
    const env = { testDayOfWeek: "5" };
    const { outputs } = await ResponseFunction(createContext({ inputs, env }));
    assertEquals(`${outputs?.response}`, "真の花金100%である");
  }
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
      "ABC is invalid timezone. Please refer TZ database name. See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for details. And typical abbereviations are supported. See https://github.com/chaspy/hanakintaro/blob/main/timezone.ts"
    );
  }
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
    answerArray.push(`今日は花金！${e.name}で${e.alcohol}を飲もう！${e.url}`);
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
    answerArray.push(`今日は花金！${e.name}で${e.food}を食べよう！${e.url}`);
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
    "福岡は登録されていないみたいよ。https://github.com/chaspy/hanakintaro/blob/main/conf.ts におすすめの店を追加しよう"
  );
});

// when: @hanakin 今日花金? (GitHub is down)
// expect: return 今日花金
Deno.test("Response function test -- GitHub is down", async () => {
  // Replaces globalThis.fetch with the mocked copy
  mf.install();

  // Response example from https://www.githubstatus.com/api#status
  mf.mock("GET@/api/v2/status.json", () => {
    return new Response(
      JSON.stringify({
        page: {
          id: "kctbh9vrtdwd",
          name: "GitHub",
          url: "https://www.githubstatus.com",
          updated_at: "2023-03-17T08:01:50Z",
        },
        status: {
          description: "Partial System Outage",
          indicator: "major",
        },
      }),
      {
        status: 200,
      }
    );
  });

  const inputs = { message: `<@ABCDEFGHIJK> 今日花金?` };
  const { outputs } = await ResponseFunction(createContext({ inputs }));
  assertEquals(
    outputs?.response,
    "今日は花金！GitHub が落ちてるみたいだからね。https://www.githubstatus.com/ "
  );

  mf.uninstall();
});

// when: @hanakin 今日花金? (GitHub API returns error)
// expect: return 今日花金
Deno.test("Response function test -- GitHub API returns error", async () => {
  // Replaces globalThis.fetch with the mocked copy
  mf.install();

  // Response example from https://www.githubstatus.com/api#status
  mf.mock("GET@/api/v2/status.json", () => {
    const errorMessage = "Fetch error";
    throw new Error(errorMessage);
  });

  const inputs = { message: `<@ABCDEFGHIJK> 今日花金？` };
  const { outputs } = await ResponseFunction(createContext({ inputs }));

  assertEquals(
    Object.values(conf.message).includes(`${outputs?.response}`),
    true
  );

  mf.uninstall();
});

Deno.test("Response function test -- payday", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 今日花金？` };

  const env = { testDate: "2023-11-22" };
  const { outputs } = await ResponseFunction(createContext({ inputs, env }));

  assertEquals(outputs?.response, "今日は給料日だから花金！やったね！");
});

Deno.test("Response function test -- bonusDay", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 今日花金？` };

  const env = { testDate: "2023-12-11" };
  const { outputs } = await ResponseFunction(createContext({ inputs, env }));

  assertEquals(outputs?.response, "今日は賞与支給日だから花金！やったね！");
});

// 閏日かどうかのテスト
Deno.test("Response function test -- leap year", async () => {
  const inputs = { message: `<@ABCDEFGHIJK> 今日花金？` };

  const env = { testDate: "2024-02-29" };
  const { outputs } = await ResponseFunction(createContext({ inputs, env }));

  assertEquals(
    outputs?.response,
    "今日は4年に1度の閏日だからハイパーウルトラクアドラプル花金！やったね！"
  );
});
