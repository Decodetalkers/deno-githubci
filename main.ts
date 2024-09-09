import * as core from "@actions/core";

import { CheckUpdate, ForceUpdate } from "@nobody/deno-update";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: "YOUR_GITHUB_TOKEN" });
const update_infos = await CheckUpdate("./");

const owner = core.getInput("owner");
const repo = core.getInput("repo");

const base = core.getInput("base");

if (!update_infos) {
  Deno.exit(0);
}

async function updateGithub() {
  await ForceUpdate(".");
  const denofmt = new Deno.Command("deno", {
    args: ["fmt"],
  });
  await denofmt.output();

  // TODO: make make git commit
  //
  const response = await octokit.pulls.create({
    owner,
    repo,
    title: "",
    head: "", // Branch name
    base,
    body: "",
  });
  core.info(`Pull Request created:, ${response.data.html_url}`);
}

await updateGithub();
