---
title: Beitragen
---

<div class="contribution-page">
  <section class="contribution-hero">
    <div class="contribution-hero__copy">
      <p class="contribution-kicker">Quellen vorschlagen</p>
      <h1>Gute Funde sollen nicht im Chatverlauf verschwinden.</h1>
      <p class="contribution-lede">
        Wenn dir ein Artikel, ein Leitfaden oder eine Praxisquelle begegnet, die dem Ganztag an der
        GTS Österfeld helfen könnte, kannst du sie hier kurz einreichen. Aus jedem Hinweis wird erst
        dann Wiki-Inhalt, wenn er fachlich geprüft und bewusst eingepflegt wurde.
      </p>
      <div class="contribution-proof">
        <span>kurz</span>
        <span>geprüft</span>
        <span>nicht automatisch veröffentlicht</span>
      </div>
    </div>
  </section>

  <section class="contribution-process" aria-label="Beitragsprozess">
    <div>
      <p>01</p>
      <strong>Link senden</strong>
      <p>Du teilst eine Quelle mit kurzer Einordnung.</p>
    </div>
    <div>
      <p>02</p>
      <strong>Prüfung</strong>
      <p>Der Hinweis landet per Mail bei Daniel.</p>
    </div>
    <div>
      <p>03</p>
      <strong>Einordnung</strong>
      <p>Nur passende Quellen werden später ins Wiki übernommen.</p>
    </div>
  </section>

  <section class="contribution-form-shell">
    <div class="contribution-form-intro">
      <p class="contribution-kicker">Vorschlag einreichen</p>
      <h2>Ein guter Link reicht für den Anfang.</h2>
      <p>
        Eine kurze Notiz hilft beim Einordnen: Warum ist die Quelle nützlich? Für welches Thema im
        Ganztag könnte sie relevant sein?
      </p>
    </div>

<form class="contribution-form" name="content-suggestion" method="POST" action="/danke" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="content-suggestion" />
<input type="hidden" name="subject" value="Neuer Vorschlag fürs GTS Wiki" />
<p class="contribution-hidden">
<label>Nicht ausfüllen: <input name="bot-field" /></label>
</p>
<label>
<span>Link zum Artikel oder Dokument</span>
<input type="url" name="article_url" placeholder="https://..." autocomplete="url" required />
</label>
<label>
<span>Kurze Notiz</span>
<textarea name="note" rows="5" placeholder="Warum ist die Quelle interessant? Wo könnte sie im Wiki helfen?"></textarea>
</label>
<div class="contribution-form__grid">
<label>
<span>Name</span>
<input type="text" name="name" autocomplete="name" placeholder="Optional" />
</label>
<label>
<span>E-Mail</span>
<input type="email" name="email" autocomplete="email" placeholder="Optional" />
</label>
</div>
<button type="submit">Vorschlag senden</button>
<p class="contribution-note">
Dein Hinweis wird nicht automatisch veröffentlicht. Er dient nur als Vorschlag für die redaktionelle Prüfung.
</p>
</form>
  </section>
</div>
