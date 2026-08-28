# Siyuan Algebraic Topology Seminar website

This is a static GitHub Pages website organized by academic year.

## File structure

```text
index.html                  Academic-year archive
styles.css                 Shared design for every page
years/
  2025-2026/
    index.html              Fall 2025–Spring 2026 schedule and abstracts
*.pdf                      Seminar notes linked from the year pages
```

## Add a new academic year

1. Copy `years/2025-2026/` to a new folder such as `years/2026-2027/`.
2. Edit the page title, header, schedule, abstracts, and footer in the new `index.html`.
3. Add a new `.year-card` link to the `archive-grid` in the root `index.html`.
4. Keep seminar-note PDFs in the repository root and link to them from a year page with `../../filename.pdf`.
5. Commit and push the changes to the `main` branch. GitHub Pages will publish the update automatically.

The existing 2025–2026 page is available at `/years/2025-2026/`.
