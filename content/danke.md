---
title: Danke
description: Danke fuer deinen Vorschlag zum GTS Wiki Oesterfeld.
---

<script>
const contentSuggestionKey = String.fromCharCode(99, 111, 110, 116, 101, 110, 116, 83, 117, 103, 103, 101, 115, 116, 105, 111, 110, 83, 101, 110, 116)
if (sessionStorage.getItem(contentSuggestionKey) !== String(1)) {
  window.location.replace(String.fromCharCode(47, 98, 101, 105, 116, 114, 97, 103, 101, 110))
} else {
  sessionStorage.removeItem(contentSuggestionKey)
}
</script>

<div class="contribution-page contribution-thanks">
  <section class="contribution-hero contribution-hero--thanks">
    <div class="contribution-hero__copy">
      <p class="contribution-kicker">Vorschlag angekommen</p>
      <h1>Danke für den Hinweis.</h1>
      <p class="contribution-lede">
        Der Link wurde übermittelt und kann jetzt in Ruhe geprüft werden. Wenn die Quelle fachlich
        passt, wird sie später redaktionell eingeordnet und mit dem Wiki verknüpft.
      </p>
      <p class="contribution-return">
        <a href="/">Zurück zum Wiki</a>
      </p>
    </div>
  </section>
</div>
