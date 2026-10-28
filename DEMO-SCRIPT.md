# Tiflan | طفلان: 5-minute demo script

Open the app with `?demo=1` at the end of the URL (or tap "Demo mode" on the first screen). No microphone, Wi-Fi or child needed.

1. **Hook (30 s).** State the problem with a source you have checked yourself (verify the "1 in 5" figure before using it).
2. **Hero (20 s).** Move the pointer: the baby's eyes follow it. "The first game is hidden in the first screen."
3. **Results (60 s).** Show the Demo result: three levels, no red, plain-Arabic voiced explanation. Point at one skill card and its evidence lines.
4. **"How was this calculated?" (30 s).** Open it. "Rules, not a black box. A doctor can trace every number."
5. **Behind the scenes (45 s).** Open it: the agents, their inputs and outputs, and the event log.
6. **Plan, centers, report (60 s).** Weekly plan with tick boxes, center map, Save-as-PDF report for the doctor.
7. **Privacy centre (30 s).** What is stored, what is never stored, what may reach third parties. Delete button.
8. **Close (15 s).** Next steps: clinical validation with a speech-language pathologist, norms from real Gulf-Arabic children, real DHA-verified center list.

## Say it honestly (judges respect this)
- It is a **screening aid**, not a diagnosis.
- Thresholds are **prototype values** and need specialist review.
- The agents are specialised modules. Only the optional chat replies use an LLM; the scoring is rule-based on purpose, so it is explainable.
- Tracing check is simple shape overlap, not AI handwriting analysis.
- Games 3 and 4 check speech automatically with the browser's speech recognition, which may use a cloud service and can mishear children. Results are labelled as a rough signal.

## Likely judge questions
- *How accurate is it?* Not validated yet. The plan is a pilot with clinicians.
- *Why not use an LLM to score?* Explainability and safety for health decisions.
- *Is it private?* See the Privacy centre: local storage, no names or recordings, honest list of third parties.
- *Dialects?* Gulf first; speech recognition quality varies, so we use the recogniser's best alternatives and label it a rough signal.

## Before the demo
- [ ] Replace the EXAMPLE centers in `data/centers.js` with DHA-verified entries (or say clearly they are samples).
- [ ] Open the site once online so fonts cache for offline use; test airplane mode.
- [ ] Test on the exact phone and browser you will present with.
- [ ] Hard refresh to get the latest files.
