# Galata — Design Principles

The thesis, expanded. These are the beliefs every component and token must serve.
If a decision violates one of these, the decision is wrong.

## Consequence is a visual property

The amount of attention a thing demands should be legible *before a word is read*.
An agent that reasons for four paragraphs and then asks to wire $40,000 must not
render those two things with the same weight.

## The four registers

Every piece of agent output belongs to exactly one register. A component earns
its place by knowing which register it's in.

- **Quiet** — reasoning, intermediate thinking, scratch work. Recessive,
  available on demand, never competing with the answer.
- **Medium** — actions the agent took on its own: tool calls, retrievals,
  status. Scannable and neutral — present enough to audit, calm enough to ignore.
- **Loud** — the answer. Highest contrast, primary placement, unmissable.
- **Interrupt** — actions that need human judgment before they happen.
  Deliberately *not* part of the stream. Weighty, distinct, and blocking.

## Never surprise the human with an action

Anything irreversible passes through an Interrupt. The default for consequential
actions is to ask, not to do.

## Design states, not screens

An agent UI is a state machine — pending, streaming, succeeded, failed,
awaiting-approval. Each state is designed deliberately. The state machine *is*
the work.

## Restraint over flash

Reference points: Linear, Vercel, Anthropic. Calm is a feature, especially when
the stakes are high. Density is not sophistication.

## Accessible because the stakes demand it

Streaming text and approval gates are genuine accessibility problems — live
regions, focus management, keyboard paths for consequential controls. Handled in
the core, not deferred. If a screen-reader user can't safely approve a
transaction, the component isn't done.
