"use client";

import { AgentRun, type RunScript } from "@/components/agent-run";

const PROMPT = "Free up capacity on the staging cluster.";

// Defined at module scope so its identity is stable across renders.
const script: RunScript = async (c) => {
  c.user(PROMPT);
  await c.wait(600);

  await c.think(
    "They want to free capacity on staging. I'll list the databases and their recent activity, find what's safe to remove, and confirm before deleting anything — dropping a database is irreversible.",
  );
  await c.wait(400);

  await c.say("Let me scan the staging cluster — this can take a moment, and you can stop it anytime.");
  await c.wait(400);

  const scan = await c.interruptible({
    description: "Scanning staging for unused resources",
    ms: 4200,
  });
  if (scan === "stopped") {
    await c.say("Stopped the scan — nothing was inspected further and nothing was changed.");
    return;
  }
  await c.wait(300);

  await c.tool({
    name: "list_databases",
    running: "compiling results",
    doneSummary: "4 databases found",
    input: { env: "staging" },
    output: {
      databases: [
        { name: "staging_old", last_used: "94d ago", size_gb: 128 },
        { name: "staging_ci", last_used: "2h ago", size_gb: 12 },
        { name: "staging_demo", last_used: "1d ago", size_gb: 9 },
        { name: "staging_api", last_used: "8m ago", size_gb: 21 },
      ],
    },
  });
  await c.wait(500);

  await c.say(
    "Only staging_old looks safe to remove — it hasn't been touched in 94 days and holds 128 GB. The other three are active. Dropping a database is irreversible, so I need your approval first.",
  );
  await c.wait(400);

  const decision = await c.ask({
    title: "Drop database staging_old? This cannot be undone.",
    action: "Drop database staging_old (128 GB)",
    description: "All data and automated backups for this database are permanently deleted.",
    details: [
      { label: "Database", value: "staging_old" },
      { label: "Size", value: "128 GB" },
      { label: "Last used", value: "94 days ago" },
      { label: "Environment", value: "staging" },
    ],
  });
  await c.wait(550);

  if (decision === "approved") {
    await c.tool({
      name: "drop_database",
      running: "dropping staging_old",
      doneSummary: "database dropped",
      input: { name: "staging_old", env: "staging" },
      output: { status: "dropped", freed_gb: 128 },
    });
    await c.wait(400);
    await c.say(
      "Done — staging_old is dropped and 128 GB freed. The three active databases were left untouched.",
    );
  } else {
    await c.say("Understood — I won't drop anything. staging_old stays in place.");
  }
};

export default function DevOpsUseCase() {
  return (
    <AgentRun
      title="DevOps — clean up infrastructure"
      subtitle="An agent reclaims capacity, but pauses before an irreversible delete."
      prompt={PROMPT}
      script={script}
    />
  );
}
