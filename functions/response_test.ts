import { SlackFunctionTester } from 'deno-slack-sdk/mod.ts'
import { assertEquals } from 'std/testing/asserts.ts'
import ResponseFunction from './response.ts'
import env from '../env.ts'

const { createContext } = SlackFunctionTester('response')

// when: @hanakin keyword
// expect: return answer
Deno.test('Response function test -- keyword', async () => {
  const inputs = { message: `<@ABCDEFGHIJK> ${env.answer}` }
  const { outputs } = await ResponseFunction(createContext({ inputs }))
  assertEquals(
    Object.values(env.message).includes(`${outputs?.response}`),
    true
  )
})

// when: @hanakin keyword timezone
// expect: return answer
Deno.test('Response function test -- keyword with timezone', async () => {
  const inputs = { message: `<@ABCDEFGHIJK> ${env.answer} JST` }
  const { outputs } = await ResponseFunction(createContext({ inputs }))
  assertEquals(
    Object.values(env.message).includes(`${outputs?.response}`),
    true
  )
})

// when: @hanakin keyword invalid-timezone
// expect: return error message
Deno.test(
  'Response function test -- keyword with invalid timezone',
  async () => {
    const inputs = { message: `<@ABCDEFGHIJK> ${env.answer} ABC` }
    const { outputs } = await ResponseFunction(createContext({ inputs }))
    assertEquals(`${outputs?.response}`, 'ABC is invalid timezone')
  }
)

// when: @hanakin non-keyword
// expect: return usage
Deno.test('Response function test -- non-keyword', async () => {
  const inputs = { message: `<@ABCDEFGHIJK> ABCDEFGH` }
  const { outputs } = await ResponseFunction(createContext({ inputs }))
  assertEquals(outputs?.response, env.usage)
})
