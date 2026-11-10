# BREAK THE FRAME — Spatial Social
Functional Barcelona panorama prototype by Salah Eddine Louffidi (LOUFFI).

## Run locally
Install Node.js 20.6 or newer. Download and extract the complete repository, open a terminal in its root, then run:

```sh
git clone https://github.com/salahlouffidi/break-the-frame.git
cd break-the-frame
npm run dev
```
Open http://localhost:3000. No npm dependencies, account or API key is required for the panorama, placement and local posting workflow. All panorama, sample and JavaScript assets are included.

## Try the working prototype
Explore the panorama, select Place your presence, upload a photo or short video, choose the position and scale, add a comment and select privacy. Posts are saved in this browser. Privacy is a local role simulation, not production authentication or authorization.

Optional image processing requires your own Meta Model API key and may consume provider credits. Copy `.env.example` to `.env`, set MODEL_API_KEY and DEMO_ALLOW_PAID_AI=true, then run `node --env-file=.env server.mjs`. Never publish that file. Without a configured provider, do not present an unprocessed photo as an AI cutout.

## Verification
`npm test` runs API and simulated XR checks. `npm run build` builds the Worker bundle. Physical headset behavior is not validated by simulated checks.

## Current limits and future vision
People are 2.5D photo/video billboards rather than reconstructed 3D humans. The panorama is a historical photograph, not live Street View. Video upload is implemented; AI video generation is future work. WebXR/Quest interaction is experimental, requires a compatible headset and secure HTTPS origin, and has not been physically verified. Localhost on a headset refers to the headset, not your development computer. Persistent multiuser accounts, real visibility enforcement, location notifications and outdoor AR are future work.

## Source and licensing
Application code: MIT, see LICENSE. Third party assets keep their own licenses; see THIRD_PARTY_NOTICES.md. `public/` contains the interface, panorama and vendor assets; `worker/` contains optional AI processing; `scripts/` contains build and checks; `server.mjs` is the dependency-free local server.

Independent prototype; no Meta endorsement is claimed. Public review build: https://break-the-frame-louffi.cuddly-tapir-5574.chatgpt.site/ . Paid AI requests are disabled on the public build; use your own credentials locally for optional image preparation.
