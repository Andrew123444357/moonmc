# Minecraft Server Landing Page (Static, Netlify-ready)

A clean, unique single-page site for your Minecraft server. No build step. Just edit `assets/config.js`, push to Git, and deploy to Netlify.

## Quick start

1. **Edit config**
   - Open `assets/config.js` and set:
     - `serverName`, `tagline`, `ip`, `version`, `region`, `gamemode`
     - `discord`, `map`, `store`, `votes[]`
     - `ranks[]` (name, price, perks)
     - Set `enableStatus: true/false` to toggle the live status card.

2. **Run locally**
   - Open `index.html` in your browser (double-click). No server required.

3. **Deploy to Netlify**
   - Create a new repo, commit these files.
   - In Netlify: *New site from Git* → choose your repo → Build command: **none** → Publish directory: **root** (just `/`).
   - Optional: Forms work out of the box via Netlify’s static forms (`#contact`).

## Notes

- **Status** uses the public API `https://api.mcsrvstat.us/2/{ip}`. If your domain blocks CORS or you prefer not to use a third party, set `enableStatus` to `false` in `assets/config.js`.
- Background is a custom canvas “voxel confetti” animation in your theme colors.
- Accessible, responsive, and lightweight (no frameworks).

## Customize further

- Colors: tweak `--accent` and others in `assets/styles.css` or set `themeColor` and `bgColors` in `config.js`.
- Sections: edit HTML sections or populate from `config.js`.
- Favicon/Logo: `assets/cube.svg` (also used for `assets/favicon.svg`). Replace with your own if you like.

Enjoy! 👾
