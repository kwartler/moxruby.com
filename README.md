# moxruby.com

A retro Windows-desktop web app for **Old School Magic: The Gathering (93/94)**, running on the NEOS / Atlantic 93/94 card pool. Static site (no build step), hosted on GitHub Pages.

## Apps
- **Old School Precons** - classic archetype decklists with real card images (Scryfall) and an Atlantic 93/94 legality checker.
- **Pack Builder** - random virtual boosters from any legal set (client-side, Scryfall).
- **Rotisserie Draft** - a snake-draft tracker for your playgroup.
- **Pack Images**, **OS MtG Links**, About/Readme.

## Structure
```
index.html          Desktop shell
assets/os.css       Win95 chrome + XP desktop
assets/os.js        Window manager, taskbar, Start menu, clock
assets/scryfall.js  Scryfall API helper (cached in localStorage)
assets/apps.js      All the apps + Atlantic legality rules
data/decks.json     Seeded precon decklists (edit to add more)
assets/sets/        Original set art (from the old MoxRuby repo)
```

Card data and images are fetched live from the free [Scryfall API](https://scryfall.com/docs/api). No server needed.

## Deploy
GitHub Pages, custom domain `moxruby.com` (CNAME). Point the apex A records at GitHub (185.199.108-111.153); the old DigitalOcean droplet can be retired.

Built by [Ted Kwartler](https://tedkwartler.com/).
