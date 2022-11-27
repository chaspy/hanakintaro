import { Trigger } from "deno-slack-api/types.ts";
import Workflow from "../workflows/workflow.ts";

/**
 * Triggers determine when Workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const Trigger: Trigger<typeof Workflow.definition> = {
  type: "event",
  event: {
    event_type: "slack#/events/app_mentioned",
    channel_ids: [`${Deno.env.channel_id}`],
  },
  name: "Send a message",
  description: "Send message to channel",
  workflow: "#/workflows/workflow",
  inputs: {
    channelId: {
      value: "{{data.channel_id}}",
    },
    text: {
      value: "{{data.text}}",
    },
  },
};

export default Trigger;
