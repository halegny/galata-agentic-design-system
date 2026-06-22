"use client";

import { AgentRun, type RunScript } from "@/components/agent-run";

const PROMPT = "Issue a formal breach notice to Meridian Logistics for the overdue invoices.";

const script: RunScript = async (c) => {
  c.user(PROMPT);
  await c.wait(600);

  await c.think(
    "Before sending anything binding, I need to confirm the contract actually permits a breach notice here, what triggers it, and what the notice sets in motion. I'll check the agreement and our prior correspondence, then surface the basis — and get sign-off, since a formal notice has legal effect.",
  );
  await c.wait(400);

  await c.say("Let me review the master services agreement and the payment history.");
  await c.wait(400);

  await c.tool({
    name: "review_contract",
    running: "reading the master services agreement",
    doneSummary: "non-payment clause located",
    input: { document: "Meridian Logistics — MSA", section: "remedies" },
    output: {
      clause: "§7.2 — Non-payment",
      cure_period_days: 30,
      notice_method: "certified email + post",
    },
  });
  await c.wait(500);

  await c.say(
    "The agreement permits a breach notice for non-payment under §7.2 [1], which opens a 30-day cure period. Three invoices are more than 30 days overdue [2], and our last reminder went unanswered on 12 June [3]. The grounds are clear — but a formal notice is legally binding once sent, so I need your approval.",
  );
  await c.wait(300);

  c.sources(
    [
      { title: "Master Services Agreement — §7.2 Non-payment", source: "contracts.internal", href: "#" },
      { title: "Overdue invoices (inv_1043, 1051, 1078)", source: "finance.internal", href: "#" },
      { title: "Payment correspondence, Mar–Jun", source: "mail.internal", href: "#" },
    ],
    "Sources",
  );
  await c.wait(500);

  const decision = await c.ask({
    title: "Send a formal breach notice to Meridian Logistics?",
    action: "Formal breach notice to Meridian Logistics",
    description: "A binding notice with legal effect — it starts the 30-day cure period once delivered.",
    details: [
      { label: "Recipient", value: "Meridian Logistics" },
      { label: "Basis", value: "MSA §7.2 — non-payment" },
      { label: "Effect", value: "Opens 30-day cure period" },
      { label: "Delivery", value: "Certified email + post" },
    ],
  });
  await c.wait(550);

  if (decision === "approved") {
    await c.tool({
      name: "send_notice",
      running: "delivering the notice",
      doneSummary: "notice delivered",
      input: { recipient: "Meridian Logistics", basis: "MSA §7.2" },
      output: { status: "delivered", reference: "NOTICE-2026-0312", cure_deadline: "2026-07-22" },
    });
    await c.wait(400);
    await c.say(
      "The breach notice has been delivered (ref NOTICE-2026-0312). The 30-day cure period ends 22 July; I've put a reminder on the calendar.",
    );
  } else {
    await c.say("Understood — I won't send the notice. Nothing has been filed or delivered.");
  }
};

export default function LegalUseCase() {
  return (
    <AgentRun
      title="Legal — issue a binding notice"
      subtitle="An agent builds the case with cited sources, then pauses before anything legally binding goes out."
      prompt={PROMPT}
      script={script}
    />
  );
}
