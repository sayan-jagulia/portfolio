# Sayan Jagulia — Portfolio

A recruiter-focused portfolio for Sayan Jagulia, an MCA student and software developer building full-stack web applications and applied AI tools.

The site is a static, dependency-free build: semantic HTML, modern CSS, and vanilla JavaScript. There is no framework, package manager, or build step.

Live site: [sayanjagulia.vercel.app](https://sayanjagulia.vercel.app/)

## What is included

- A concise hero with availability, focus, career objective, and contact links
- Five project case studies covering the problem, implementation, key decisions, and honest next steps
- Verified screenshots and an architecture diagram for the RAG News API
- Skills grouped by category, limited to technologies used in the projects or coursework
- MCA/BCA education and a curated set of public credentials
- A contact form with client-side validation, a honeypot, and Web3Forms delivery
- SEO metadata, Open Graph/Twitter cards, JSON-LD, sitemap, and robots.txt
- Keyboard-accessible navigation, a focus-trapped mobile menu, visible focus states, and reduced-motion support
- Self-hosted Inter and JetBrains Mono fonts; no third-party icon or font CDN

## Run locally

From the project root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

Any static file server works. Opening `index.html` directly also works for most content, but a local server is recommended so fonts and relative asset paths behave consistently.

## Contact form

The form posts to [Web3Forms](https://web3forms.com/) using the access key embedded in `index.html`. The key is public by design; it only authorizes submissions to the configured inbox.

With JavaScript enabled, the form:

1. Validates the name, email, subject, and message fields
2. Checks a hidden honeypot field
3. Submits with `fetch` and shows inline success or error feedback
4. Shows a direct-email fallback message if the request fails

With JavaScript disabled, the form uses native browser validation and a standard form submission.

## Resume

The resume is intentionally private. The resume actions point to a Google Drive file; visitors can request access there. There is no public `resume.pdf` in this repository.

## Project structure

```text
.
├── index.html              # Page markup, metadata, and inline SVG icons
├── styles.css              # Design system, layout, and responsive styles
├── script.js               # Menu, scroll state, reveals, and form handling
├── sitemap.xml
├── robots.txt
├── fonts/                  # Self-hosted Inter and JetBrains Mono
└── images/
    ├── Profile_IMG.webp    # Hero portrait
    ├── og-image.png        # Social preview card
    ├── favicon.png
    ├── favicon.ico
    └── projects/           # Project screenshots and RAG architecture diagram
```

## Deployment

The site is deployed on Vercel from the repository's `main` branch. Vercel serves the files directly; no build command or output directory is required.

## Content notes

- Project descriptions reflect the implementations in the linked repositories, including known limitations.
- SynthMind is not described as having secure authentication because the current code stores passwords in plaintext.
- The Offline Password Manager uses Fernet with a PBKDF2-derived key; it is not described as AES-256.
- SchemeSeeker's live link is kept, but its hosted API may be unavailable while the backend is restored.
- Only publicly accessible certificates are linked. The Google Cloud badge count is verified through Credly.
- No employment history, client work, or production metrics are claimed.

## Credits

Fonts are licensed under the SIL Open Font License; license files are included in `fonts/`. The profile photo and project screenshots are personal work and are not licensed for reuse.
