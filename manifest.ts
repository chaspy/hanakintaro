import { Manifest } from "deno-slack-sdk/mod.ts";
import Workflow from "./workflows/workflow.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "hanakintaro",
  description: "Send comment if today is Hanakin or not",
  icon: "assets/hanakintaro-face.png",
  workflows: [Workflow],
  outgoingDomains: ["www.githubstatus.com"],
  botScopes: ["chat:write", "chat:write.public", "app_mentions:read"],
});
