// Renders CMS text fields that carry light emphasis:
//   *word*  -> <span class="ital">word</span>  (the serif italic accent)
//   newline -> <br />
//   the studio email -> a mailto link
// Everything else is HTML-escaped, so CMS text passed through inline() can never
// inject markup. This guarantee covers inline() output only — any other raw
// (set:html) output path must do its own escaping. The JSON-LD in
// src/layouts/Base.astro does, via its own ld() helper.
import studio from '../content/studio.json';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function inline(s: string): string {
  let out = esc(s)
    .replace(/\*([^*\n]+)\*/g, '<span class="ital">$1</span>')
    .replace(/~([^~\n]+)~/g, '<small>$1</small>')
    .replace(/\n/g, '<br />');
  if (studio.email) {
    const emailPattern = studio.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(
      new RegExp(emailPattern, 'g'),
      `<a href="mailto:${studio.email}">${studio.email}</a>`
    );
  }
  return out;
}
