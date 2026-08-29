// Renders CMS text fields that carry light emphasis:
//   *word*  -> <span class="ital">word</span>  (the serif italic accent)
//   ~text~  -> <small>text</small>
//   newline -> <br />
//   the studio email -> a mailto link
// Everything else is HTML-escaped, so CMS text passed through inline() can never
// inject markup. This guarantee covers inline() output only — any other raw
// (set:html) output path must do its own escaping. The JSON-LD in
// src/layouts/Base.astro does, via its own ld() helper.
import studio from '../content/studio.json';

// Quotes are escaped too: the email branch below builds an href attribute, and
// the email address is CMS-editable. Without this, an address like
// `x" onmouseover="alert(1)@example.com` — which satisfies the CMS email
// pattern, since that only forbids @ and whitespace — would break out of the
// attribute and execute.
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export function inline(s: string): string {
  let out = esc(s)
    .replace(/\*([^*\n]+)\*/g, '<span class="ital">$1</span>')
    .replace(/~([^~\n]+)~/g, '<small>$1</small>')
    .replace(/\n/g, '<br />');
  if (studio.email) {
    // Match the already-escaped form of the address, since `out` is escaped.
    const escapedEmail = esc(studio.email);
    const emailPattern = escapedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // encodeURIComponent, not encodeURI: encodeURI leaves ? & # = intact, and
    // the CMS email pattern permits them, so an address like
    // `x?subject=Hi&cc=someone@example.com` would inject headers into the
    // visitor's mail client. Percent-encoding the whole address is valid in a
    // mailto: URI (RFC 6068) and every mail client handles %40.
    // A function replacement is used so `$&`, `$'` etc. inside the address are
    // treated as literal text rather than replacement patterns.
    const anchor = `<a href="mailto:${esc(encodeURIComponent(studio.email))}">${escapedEmail}</a>`;
    out = out.replace(new RegExp(emailPattern, 'g'), () => anchor);
  }
  return out;
}
