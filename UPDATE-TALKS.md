# Updating seminar talks

Routine schedule changes require editing only **seminar-data.js**. The homepage
and the 2026–2027 program read from that same file, so the information is never
entered twice.

## Change a title, affiliation, time, or abstract

1. Open **seminar-data.js** on GitHub.
2. Click the pencil icon.
3. Search for the speaker's name.
4. Change the relevant value.
5. Select **Commit changes**.
6. Wait for the GitHub Pages deployment to become green, then refresh the site.

Do not edit **index.html**, **years/2026-2027/index.html**, or
**seminar-render.js** for ordinary talk updates.

## Add a new talk

1. Open **seminar-data.js**.
2. Find **NEW TALK TEMPLATE** near the bottom.
3. Copy the complete talk block into the talks list.
4. Fill in the fields described below.
5. Commit the change.

| Field | What to enter |
|---|---|
| id | A permanent, unique value such as firstname-lastname |
| date | Beijing date in YYYY-MM-DD format |
| time | Beijing time in 24-hour HH:MM format |
| durationMinutes | Usually 120 |
| speaker | Speaker's full name |
| affiliation | Institution |
| title | Use Title to be announced when necessary |
| abstract | The complete abstract; leave empty if it is unavailable |
| location | Room name for an in-person talk; otherwise leave empty |
| resources | Optional recording or notes links; local files are relative to the repository root |
| cancelled | Change to true only when a talk is cancelled |
| published | Use false to hide the record from the rendered pages; use true to show it |

## Automatic behavior

- The first unfinished talk appears as **Next talk**.
- Later talks are sorted chronologically.
- A talk moves to **Past talks** automatically after its scheduled duration,
  including while the page remains open.
- All calculations use Beijing time.
- The homepage displays the next talk and the following two talks.
- A direct link such as /years/2026-2027/#yingxin-li opens the corresponding
  abstract automatically.

## Important safeguards

- Do not change an existing id; old links depend on it.
- Keep commas, quotation marks, braces, and brackets in place.
- Use the exact date and time formats shown above.
- The multiline abstract format preserves ordinary LaTeX notation.
- If an abstract contains a literal backtick character, replace it with an
  apostrophe.
- Use LaTeX delimiters such as \(K(n)\). Do not type a dollar sign immediately
  followed by an opening brace, because that has a special meaning in the data file.
- This is a public GitHub repository. Setting published to false hides a record
  from the website but does not make its contents private. Do not enter
  confidential or embargoed information.
- Every external resource URL should begin with https://.
- For a PDF stored in the repository root, use a path such as
  Speaker notes.pdf; the website will resolve it from either page.
