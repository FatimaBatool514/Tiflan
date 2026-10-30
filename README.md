# Tiflan | طفلان
Early learning screening for children aged 4–8 (Arabic + English). Static site: no install, no build step.

## Steps done
- Step 1: design system, Arabic/English RTL switch (css/style.css, js/i18n.js)
- Step 2: hero screen with cursor/touch-tracking baby mascot and live readings (index.html, js/app.js)

- Step 3: consent, child profile, privacy storage (js/onboarding.js, js/i18n-onboard.js)
- Step 4: intake voice agent (js/intake.js, js/config.js, worker/gemini-proxy.js)
- Step 5: games engine, Game 1 Follow the Eyes, Game 2 Rhyme Nest (js/games.js)
- Step 6: Game 3 Silly Word Echo, Game 4 Quick Naming Race (in js/games.js)
- Step 7: Game 5 Letter Twins (match + tracing), Game 6 Clap the Syllables (in js/games.js)
- Step 8: Risk Scoring Agent + results dashboard (js/risk.js). Thresholds are PROTOTYPE values, need specialist review.
- Step 9: exercise plan, center finder, printable PDF report (js/support.js, data/centers.js). Replace the EXAMPLE centers with the official DHA list.
- Step 10: demo mode (?demo=1), behind-the-scenes view, privacy centre, installable PWA (sw.js, manifest), DEMO-SCRIPT.md

## Optional: turn on cloud AI (free)
1. Get a Gemini key at aistudio.google.com.
2. cloudflare.com > Workers & Pages > Create > Worker. Paste worker/gemini-proxy.js and Deploy.
3. Worker > Settings > Variables and Secrets: add secret GEMINI_API_KEY (your key). Optional: MODEL, ALLOWED_ORIGIN (your site URL).
4. Copy the worker URL into js/config.js (aiEndpoint). Leave empty to run without AI.
(Dashboard labels and free limits change, so verify.)

## Run
Open index.html in a browser, or enable GitHub Pages (Settings > Pages > Deploy from branch > main > / (root)).

## Change the name or texts
All text is in js/i18n.js. The brand name is in index.html (class brand-en / brand-ar).

- Fixes: fresh items every play, age tiers, Arabic/English word language choice, automatic speech checking in Games 3 and 4, new Game 6 (Sound Detective), results now open after the games, print report fixed.
- Voice fix: recognition restarts itself when the browser ends a session early, falls back to other Arabic dialect codes, and a "great" is shown only when speech was actually heard.

## Deploy on Vercel (free, no build)
1. Put the project files at the ROOT of a GitHub repository (index.html must be at the top level, not inside a folder).
2. vercel.com > sign in with GitHub > Add New > Project > Import your repository.
3. Framework Preset: Other. Build Command, Output Directory, Install Command: leave empty. Root Directory: ./
4. Deploy. Every later push to GitHub redeploys automatically.
vercel.json (included) only adds safe headers and stops the service worker from being cached.

Microphone problems? Open /mic-test.html on the same address and run the three tests. It shows the exact error.

- Mascots: two 3D babies (assets/*.webp, 4 poses each) look at the pointer. The parent picks the child's gender in the profile step and only that baby is used in the games and chat.

- Babies: look only at the cursor (no random looking). Optional: add assets/boy-front.webp and assets/girl-front.webp to make them look straight when the cursor is still.
