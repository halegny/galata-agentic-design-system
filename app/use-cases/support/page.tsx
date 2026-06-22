"use client";

import { AgentRun, type RunScript } from "@/components/agent-run";

const PROMPT = "The customer was charged twice — please refund the duplicate.";

const script: RunScript = async (c) => {
  c.user(PROMPT);
  await c.wait(600);

  await c.think(
    "I shouldn't refund on the customer's word alone — I'll verify there really is a duplicate charge, check it's within policy, and then get approval before moving money back.",
  );
  await c.wait(400);

  const plan = c.status(
    [
      { label: "Verify the duplicate charge", status: "active" },
      { label: "Check refund eligibility", status: "pending" },
      { label: "Issue refund", status: "pending" },
    ],
    "Plan",
  );
  await c.wait(500);

  await c.tool({
    name: "lookup_charges",
    running: "searching recent charges",
    doneSummary: "duplicate confirmed",
    input: { customer: "cus_3192", window: "7d" },
    output: {
      charges: [
        { id: "ch_a1", amount: 129.0, time: "Jun 20, 14:02" },
        { id: "ch_a2", amount: 129.0, time: "Jun 20, 14:02" },
      ],
      verdict: "exact duplicate",
    },
  });
  plan.set([
    { label: "Verify the duplicate charge", status: "done" },
    { label: "Check refund eligibility", status: "active" },
    { label: "Issue refund", status: "pending" },
  ]);
  await c.wait(500);

  await c.tool({
    name: "check_policy",
    running: "checking refund policy",
    doneSummary: "eligible",
    input: { charge: "ch_a2", reason: "duplicate" },
    output: { eligible: true, rule: "duplicate charges refundable within 60 days" },
  });
  plan.set([
    { label: "Verify the duplicate charge", status: "done" },
    { label: "Check refund eligibility", status: "done" },
    { label: "Issue refund", status: "active" },
  ]);
  await c.wait(500);

  await c.say(
    "Confirmed — the customer was charged $129.00 twice at 14:02 on Jun 20, and a duplicate is refundable under policy. Issuing a refund moves real money, so I need your approval.",
  );
  await c.wait(400);

  const decision = await c.ask({
    title: "Refund $129.00 to the customer?",
    action: "Refund $129.00 (duplicate charge)",
    description: "This returns funds to the customer's original payment method.",
    details: [
      { label: "Amount", value: "$129.00" },
      { label: "Charge", value: "ch_a2 (duplicate)" },
      { label: "Customer", value: "cus_3192" },
      { label: "Reason", value: "Duplicate charge" },
    ],
  });
  await c.wait(550);

  if (decision === "approved") {
    await c.tool({
      name: "issue_refund",
      running: "processing the refund",
      doneSummary: "refund issued",
      input: { charge: "ch_a2", amount: 129.0 },
      output: { status: "refunded", refund_id: "re_7741" },
    });
    plan.set([
      { label: "Verify the duplicate charge", status: "done" },
      { label: "Check refund eligibility", status: "done" },
      { label: "Issue refund", status: "done" },
    ]);
    await c.wait(400);
    await c.say(
      "Refund issued (re_7741) — $129.00 is on its way back to the customer's card, typically 5–10 business days.",
    );
  } else {
    await c.say("Understood — no refund was issued. The charge stands until you decide.");
  }
};

export default function SupportUseCase() {
  return (
    <AgentRun
      title="Customer support — issue a refund"
      subtitle="An agent verifies a duplicate charge step by step, then pauses before returning money."
      prompt={PROMPT}
      script={script}
    />
  );
}
