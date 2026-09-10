/**
 * The FAQ, as data.
 *
 * Search engines read a page's questions from JSON-LD, not from its headings,
 * so these have to exist somewhere machine-readable. They are kept here rather
 * than written twice: the page renders its own prose, and this is the faithful
 * short form of the same answers.
 *
 * If an answer on the page changes, change it here too. Markup that disagrees
 * with the page it describes is not a shortcut, it is a reason to be
 * discounted entirely.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "What is PMDD?",
    a: "Premenstrual dysphoric disorder is a cyclical mood disorder tied to the luteal phase — the week or two between ovulation and your period. It is in the DSM-5, and affects somewhere around 3–8% of people who menstruate. It isn't a hormone imbalance: hormone levels in PMDD are typically normal, and the difference is how the brain responds to their ordinary rise and fall. That is why a blood test cannot find it, and why two months of daily records can.",
  },
  {
    q: "How is PMDD different from PMS?",
    a: "By severity and by consequence. PMS is uncomfortable. PMDD takes the fortnight — work, relationships, and often the sense of being recognisably yourself. The diagnostic criteria require significant distress or interference with functioning, and at least one severe mood symptom. There is also PME, premenstrual exacerbation, where an underlying condition gets sharply worse premenstrually but does not clear up after your period.",
  },
  {
    q: "Is the self-check a diagnosis?",
    a: "No, and it cannot be. It is the PSST — the Premenstrual Symptoms Screening Tool, published by Steiner, Macdougall and Brown in 2003 — reproduced as written and scored by its own published rule. A screening tool tells you whether something is worth investigating. A diagnosis of PMDD requires a clinician and a minimum of two cycles of daily prospective ratings.",
  },
  {
    q: "What is the DRSP?",
    a: "The Daily Record of Severity of Problems: the standard daily form used to confirm a premenstrual disorder. You rate a set of symptoms on a 1–6 scale once a day, every day, for two full cycles — recorded on the day, not remembered afterwards. The pattern it produces, symptoms climbing across the luteal phase and dropping when bleeding starts, is what a diagnosis is built on.",
  },
  {
    q: "Is anything I type into the self-check sent anywhere?",
    a: "No. The self-check runs entirely in your browser and the result is worked out there. You don't have to take our word for it: open your browser's developer tools, watch the Network tab, and take the whole thing. Nothing goes out.",
  },
  {
    q: "Why is the Oriyali app iPhone-only?",
    a: "Because one person is building it, and building one platform properly beats building two badly. Native iOS also gives access to HealthKit, proper notification timing for the luteal warning, and on-device processing for anything sensitive. Android is wanted and not promised.",
  },
  {
    q: "What does the Oriyali app cost?",
    a: "The daily logging, cycle tracking and basic graphs are free and stay free. Prediction, the full DRSP export and the coaching features are a subscription, priced locally, including for India. No trial that bills you silently, and no cancellation maze.",
  },
  {
    q: "Do I need an account?",
    a: "No. The app is local-first and works with no account at all. Sign in with Apple exists only if you want encrypted sync across your devices, and that syncs into your own private iCloud database rather than to us.",
  },
  {
    q: "Can my partner see it?",
    a: "Only if you set that up, and only what you choose to share — a heads-up about the coming luteal window without the underlying detail, if that is what you want. It is off by default and revocable.",
  },
  {
    q: "The self-check said nothing much, but I still feel like something is wrong. What now?",
    a: "Then something probably is. The PSST is deliberately strict, it is answered from memory, and your answers depend heavily on where in your cycle you took it. One month is not a pattern. Start writing the days down: two cycles of daily notes will show something a four-minute screener cannot, and if it turns out not to be premenstrual at all, that is worth knowing too.",
  },
];
