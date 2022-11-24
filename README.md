# slack-hanakin-bot

[![test](https://github.com/chaspy/slack-hanakin-bot/actions/workflows/test.yaml/badge.svg)](https://github.com/chaspy/slack-hanakin-bot/actions/workflows/test.yaml)

![hanakin.png](image/hanakin.png)

Illustrated by [@shimiwaka](https://github.com/shimiwaka)

## Feature

Depending on the day of the week, the bot will reply whether today is Hanakin ([花金](https://kotobank.jp/word/%E8%8A%B1%E9%87%91-603416)).

![hanakin.png](image/hanakin.png)

### Support Timezone

The bot can reply whether or not it is Hanakin in the specified timezone. The timezone is specified in the second argument. 

![timezone.png](image/timezone.png)

The default value can be set by `env.timezone` .

## Development

### Work on new Slack platform

This bot will work on [new Slack platform](https://api.slack.com/future?utm_medium=referral&utm_source=partner&utm_campaign=fy23-dev-open-beta-launch) powered by [Deno](https://deno.com/blog/slack-open-beta)

### Local development

```
cp env.ts.sample env.ts
# edit env.ts
slack run
```

### Deploy

```
slack deploy
```

