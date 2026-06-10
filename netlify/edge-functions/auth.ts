/**
 * Passwortschutz für das interne Wiki.
 *
 * Liegt ein gültiges Cookie vor, wird die Seite normal ausgeliefert.
 * Andernfalls erscheint eine im Wiki-Design gestaltete Passwort-Seite.
 *
 * Das Passwort wird NICHT im Code gespeichert, sondern als Umgebungsvariable
 * `SITE_PASSWORD` im Netlify-Dashboard hinterlegt. Ist keine Variable gesetzt,
 * bleibt die Seite offen (kein versehentliches Aussperren beim Setup).
 */

import type { Context } from "https://edge.netlify.com"

const COOKIE = "gts_auth"
const MAX_AGE = 60 * 60 * 24 * 30 // 30 Tage

async function token(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}::gts-oesterfeld`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("")
}

function gate(error = false): Response {
  const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Pädagogisches Wiki – GTS Österfeld</title>
<style>
  :root {
    --bg: #f7f4ec; --surface: #fffdf8; --ink: #25231f; --muted: #817b6f;
    --line: #ddd5c5; --gold: #a97612; --teal: #2f6f73; --error: #b3261e;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #111412; --surface: #191c1a; --ink: #eeeae1; --muted: #9d927f;
      --line: #33362f; --gold: #d4a840; --teal: #6ebcb8; --error: #f2b8b5;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    padding: 1.5rem; background: var(--bg); color: var(--ink);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  .card {
    width: 100%; max-width: 26rem; background: var(--surface);
    border: 1px solid var(--line); border-radius: 12px; padding: 2.25rem 2rem;
    box-shadow: 0 18px 40px rgba(37, 35, 31, 0.08);
  }
  .kicker {
    text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.72rem;
    font-weight: 600; color: var(--teal); margin: 0 0 0.6rem;
  }
  h1 { font-size: 1.45rem; line-height: 1.25; margin: 0 0 0.5rem; }
  p.lede { color: var(--muted); margin: 0 0 1.6rem; font-size: 0.95rem; line-height: 1.5; }
  label { display: block; font-size: 0.85rem; font-weight: 600; margin: 0 0 0.4rem; }
  input[type="password"] {
    width: 100%; padding: 0.7rem 0.85rem; font-size: 1rem; color: var(--ink);
    background: var(--bg); border: 1px solid var(--line); border-radius: 8px;
  }
  input[type="password"]:focus { outline: 2px solid var(--teal); outline-offset: 1px; border-color: var(--teal); }
  button {
    margin-top: 1.1rem; width: 100%; padding: 0.75rem 1rem; font-size: 1rem; font-weight: 600;
    color: #fff; background: var(--gold); border: 0; border-radius: 8px; cursor: pointer;
  }
  button:hover { filter: brightness(0.95); }
  .error { margin: 0 0 1.1rem; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.88rem;
    color: var(--error); background: color-mix(in srgb, var(--error) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--error) 35%, transparent); }
  .foot { margin: 1.5rem 0 0; font-size: 0.78rem; color: var(--muted); line-height: 1.5; }
</style>
</head>
<body>
  <main class="card">
    <p class="kicker">Interner Bereich</p>
    <h1>Pädagogisches Wiki – GTS Österfeld</h1>
    <p class="lede">Dieses Wiki ist ein internes Arbeitswerkzeug des Teams. Bitte gib das Team-Passwort ein, um fortzufahren.</p>
    ${error ? '<p class="error">Falsches Passwort. Bitte versuche es erneut.</p>' : ""}
    <form method="POST" autocomplete="off">
      <label for="password">Passwort</label>
      <input id="password" name="password" type="password" autofocus required />
      <button type="submit">Anmelden</button>
    </form>
    <p class="foot">Internes, unverbindliches Arbeitsdokument – kein offizielles Angebot der Landeshauptstadt Stuttgart.</p>
  </main>
</body>
</html>`
  return new Response(html, {
    status: error ? 401 : 200,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  })
}

export default async (request: Request, context: Context) => {
  const password = Deno.env.get("SITE_PASSWORD")
  if (!password) return context.next() // kein Passwort gesetzt -> offen

  const expected = await token(password)
  const cookies = request.headers.get("cookie") ?? ""
  const authed = cookies.split(";").some((c) => c.trim() === `${COOKIE}=${expected}`)
  if (authed) return context.next()

  if (request.method === "POST") {
    const form = await request.formData()
    const submitted = String(form.get("password") ?? "")
    if (submitted === password) {
      const url = new URL(request.url)
      return new Response(null, {
        status: 303,
        headers: {
          location: url.pathname + url.search,
          "set-cookie": `${COOKIE}=${expected}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
        },
      })
    }
    return gate(true)
  }

  return gate(false)
}

export const config = { path: "/*" }
