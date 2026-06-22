"use client";

import { AgentRun, type RunScript } from "@/components/agent-run";

const PROMPT = "Start the patient on a course of antibiotics for the infection.";

const script: RunScript = async (c) => {
  c.user(PROMPT);
  await c.wait(600);

  await c.think(
    "Before ordering anything, I must check the patient's allergies and current medications for interactions. An order reaches a real patient, so a clinician has to approve it — I won't place it on my own.",
  );
  await c.wait(400);

  await c.say("Let me pull the chart and screen for allergies and interactions.");
  await c.wait(400);

  await c.tool({
    name: "fetch_patient_record",
    running: "loading the chart",
    doneSummary: "chart loaded",
    input: { patient: "J. Rivera", mrn: "4471" },
    output: {
      allergies: ["penicillin: none recorded"],
      current_medications: ["warfarin 5mg daily"],
    },
  });
  await c.wait(450);

  await c.tool({
    name: "check_interactions",
    running: "screening the first-line antibiotic",
    doneSummary: "1 interaction flagged",
    input: { candidate: "ciprofloxacin", against: ["warfarin"] },
    output: {
      severity: "major",
      detail: "ciprofloxacin can raise warfarin effect, increasing bleeding risk",
      suggestion: "consider an alternative or closer INR monitoring",
    },
  });
  await c.wait(500);

  await c.say(
    "The first-line option, ciprofloxacin, has a major interaction with the patient's warfarin and raises bleeding risk. A safer fit here is amoxicillin, which doesn't carry that interaction. I can't place the order myself — it needs your sign-off.",
  );
  await c.wait(400);

  const decision = await c.ask({
    title: "Order amoxicillin for J. Rivera?",
    action: "Prescription order — amoxicillin for J. Rivera",
    description: "This places a real medication order on the patient's chart and requires clinician approval.",
    details: [
      { label: "Patient", value: "J. Rivera (MRN 4471)" },
      { label: "Medication", value: "Amoxicillin 500 mg" },
      { label: "Course", value: "Three times daily, 7 days" },
      { label: "Note", value: "Chosen over ciprofloxacin (warfarin interaction)" },
    ],
  });
  await c.wait(550);

  if (decision === "approved") {
    await c.tool({
      name: "place_order",
      running: "submitting to the pharmacy",
      doneSummary: "order placed",
      input: { patient: "MRN 4471", drug: "amoxicillin 500mg", course: "7d" },
      output: { status: "submitted", order_id: "RX-55920" },
    });
    await c.wait(400);
    await c.say(
      "Order placed (RX-55920) and sent to the pharmacy. I've noted the avoided interaction in the chart.",
    );
  } else {
    await c.say("Understood — no order was placed. The chart is unchanged.");
  }
};

export default function HealthcareUseCase() {
  return (
    <AgentRun
      title="Healthcare — order a medication"
      subtitle="An agent screens for a dangerous interaction, then leaves the order to a clinician's sign-off."
      prompt={PROMPT}
      script={script}
    />
  );
}
