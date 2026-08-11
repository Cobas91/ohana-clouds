# Ohana Clouds — Website

Moderne, responsive Internetpräsenz für **Ohana Clouds**, ein familiär geführtes Dampfer-/E-Zigaretten-Fachgeschäft in Elmshorn (Schilfweg 2, 25337 Elmshorn).

## Technologie

Bewusst schlank und ohne Build-Schritt gehalten, damit die Seite überall (jeder Static-Host) läuft, sehr schnell lädt und leicht wartbar ist:

- **HTML5** (semantisch, mehrseitig)
- **CSS3** (eigenes Design-System, Custom Properties, Flexbox/Grid, responsive)
- **Vanilla JavaScript** (kein Framework) für Menü, Altersabfrage, Bewertungs-Slider und den datengetriebenen Blog
- **Google Fonts** (Fraunces + Inter)
- **Strukturierte Daten** (schema.org `Store`) + Open Graph für SEO/Social

Keine externen JS-Frameworks, keine Datenbank, keine Server-Logik nötig.

## Projektstruktur

```
ohana-clouds/
├── index.html            # Startseite
├── sortiment.html        # Sortiment & Beratung
├── ueber-uns.html        # Über uns (Rick & Bea, Werte)
├── aktuelles.html        # Blog / Neuigkeiten (datengetrieben)
├── kontakt.html          # Kontakt, Öffnungszeiten, Karte
├── impressum.html        # Impressum (Platzhalter – zu ergänzen)
├── datenschutz.html      # Datenschutz (Muster – zu prüfen)
├── 404.html
├── robots.txt · sitemap.xml · .nojekyll
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   ├── img/              # Logo, Favicon, OG-Bild
│   └── data/
│       ├── posts.json    # Blog-Beiträge  (einzige Datenquelle)
│       └── reviews.json  # Bewertungs-Slider (Platzhalter)
├── RESEARCH.md
└── README.md
```

## Lokal ansehen

Einfach `index.html` im Browser öffnen. Für die JSON-gestützten Bereiche (Blog, Bewertungen) empfiehlt sich ein lokaler Server, da `fetch` bei `file://` blockiert wird:

```bash
cd ohana-clouds
python3 -m http.server 8080
# → http://localhost:8080
```

## Inhalte pflegen

- **Blog / Aktuelles** → `assets/data/posts.json`. Jeder Eintrag:
  ```json
  {
    "id": "2026-08-sommerpause",
    "date": "2026-08-04",
    "title": "Titel",
    "pinned": true,
    "image": "assets/img/mein-bild.jpg",
    "image_alt": "Bildbeschreibung",
    "body": "Fließtext. Zeilenumbrüche mit \\n."
  }
  ```
  `pinned: true` hebt einen Beitrag hervor und sortiert ihn nach oben. Fehlt `image`, wird automatisch ein Platzhalter angezeigt.
- **Bewertungen** → `assets/data/reviews.json` (aktuell Beispiel-Einträge; später durch echte Google-Bewertungen ersetzen).
- **Fotos** → in `assets/img/` ablegen und im HTML die `.photo-ph`-Platzhalter durch `<img>` ersetzen.

## Geplante Erweiterung: Blog-Pflege per Telegram-Bot

Die Seite ist bereits darauf vorbereitet: `assets/data/posts.json` ist die **einzige Datenquelle**, die das Frontend beim Laden ausliest und rendert. Ein späterer Telegram-Bot muss also nur diese Datei pflegen:

1. **Neuer Beitrag:** Nutzer schickt dem Bot Bild + Text → Bot lädt das Bild nach `assets/img/` hoch und hängt einen neuen Eintrag an `posts.json` an (mit eindeutiger `id`).
2. **Bearbeiten:** Nutzer editiert den Text im Telegram → Bot findet den Eintrag über die `id` und aktualisiert `title`/`body`/`image` in `posts.json`.
3. **Veröffentlichen:** Da GitHub Pages/Static-Hosts keinen Schreibzugriff bieten, committet der Bot die geänderte `posts.json` (z. B. per GitHub-API) oder legt sie auf einem kleinen Speicher/Endpoint ab, von dem das Frontend liest.

Es sind keine Frontend-Änderungen nötig – nur das Schreiben der JSON. (Der Bot selbst ist noch zu entwickeln.)

## Deployment

Reiner Static-Content – deploybar auf jedem kostenlosen Static-Host (GitHub Pages, Netlify, Cloudflare Pages …). `.nojekyll` liegt bereits bei (für GitHub Pages). Bei abweichender Domain die `https://ohanaclouds.de/`-URLs in `sitemap.xml`, `robots.txt` und den `canonical`/`og:url`-Tags anpassen.

## Offene Punkte (mit dem Kunden zu klären)

- Echte Fotos + offizielles Logo einsetzen (siehe RESEARCH.md).
- Impressum & Datenschutz rechtlich vervollständigen.
- Google Fonts für Datenschutz optional lokal einbinden.
