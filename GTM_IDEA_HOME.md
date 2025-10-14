# Strona główna (index.html) — pomysły na poprawę konwersji + plan GTM/GA4

Cel: maksymalizować zapisy na listę oczekujących (newsletter) i zaangażowanie w kluczowe sekcje (How it works, Features, Research), przy zachowaniu Consent Mode.

## KPI i pomiar
- Primary: `form_submit` dla `form_type = newsletter` (wszystkie formularze na stronie)
- Secondary: `cta_click` (lokacje: header/hero/mobile_menu/footer), `form_start`, `scroll_depth` (75%), `section_view` (hero/how_it_works/features/research/faq/newsletter_footer), `time_on_page ≥ 45s`
- Segmentacja: UTM (`utm_source`, `utm_campaign`), urządzenie, nowy/powracający

## Szybkie wygrane (P1)
- Hero: CTA + pole e‑mail w 1 linii
  - Hipoteza: inline pole e‑mail + „Dołącz do listy” w hero zwiększy `form_start` (mniej scroll/klików).
  - Warianty: A: obecny hero, B: hero + pojedyncze pole e‑mail + CTA.
- Copy CTA w header/hero
  - Test: „Dołącz do listy” vs „Odbierz dostęp do wersji beta” vs „Powiadom mnie o premierze”.
- Sticky CTA na mobile (po 3s)
  - Mały pasek dolny: „Powiadom mnie o premierze” → scroll‑agnostyczny dostęp do zapisu.
- Mikrocopy przy polu e‑mail
  - „Zero spamu. Tylko info o premierze i bonusach.”
- Ujednolicenie formularzy
  - Pozostaw 1–2 miejsca zapisu max (hero + stopka), reszta przycisków kieruje anchor do pierwszego formularza.

## Wzmocnienia treści (P2)
- Social proof subtelny pod hero
  - „Tysiące minut bajek w wersjach testowych” lub logo partnerów (gdy gotowe) — delikatne, nieprzesadne.
- Sekcja „Dlaczego teraz?”
  - 3 chipsy: „Wersja beta – early access”, „Specjalne bonusy dla pierwszych”, „Powiadomienie o premierze”.
- FAQ mini (3–4) nad stopką
  - „Kiedy start?”, „Czy wersja podstawowa będzie darmowa?”, „Czy mogę zrezygnować w każdej chwili?”.

## Personalizacja lekka (P2/P3)
- Dynamiczna etykieta CTA wg UTM
  - `utm_source=ads` → „Zarezerwuj dostęp do wersji beta”.
  - Bez UTM → „Dołącz do listy”.
- Pre‑select sekcji
  - Jeśli query `?view=research` → auto‑scroll do „Badania” i fire `section_view`.

## Eksperymenty A/B (przez GTM)
1) Hero layout: formularz inline ON/OFF
   - Mierzymy: `form_start`, `form_submit`, drop‑off.
2) CTA copy (header/hero)
   - Mierzymy: `cta_click` (header/hero) → `form_submit`.
3) Sticky CTA (mobile)
   - Mierzymy: `sticky_cta_click`, `form_submit`, wpływ na bounce.
4) Social proof w hero (ON/OFF)
   - Mierzymy: scroll do 50% i `form_start`.
5) Newsletter: 1 pole vs 2 pola (e‑mail vs e‑mail+imię)
   - Mierzymy: `form_start`, `form_submit`, błąd walidacji.

## Instrumentacja danych (dataLayer → GA4)
Zdarzenia (analogiczne do castingu, z `form_type = newsletter`):

```js
// CTA klik
window.dataLayer.push({
  event: 'cta_click',
  cta_location: 'header' // 'hero' | 'mobile_menu' | 'footer'
});

// Widoczność sekcji (50% w viewport)
window.dataLayer.push({ event: 'section_view', section_id: 'hero' });

// Formularz newslettera
window.dataLayer.push({ event: 'form_view', form_type: 'newsletter' });
window.dataLayer.push({ event: 'form_start', form_type: 'newsletter' });
window.dataLayer.push({ event: 'form_submit', form_type: 'newsletter', status: 'success' });

// Eksperymenty A/B
window.dataLayer.push({ event: 'exp_assign', exp_id: 'HOME_HERO_FORM', variant: 'B' });
```

Parametry dodatkowe (jeśli dostępne): `page_location`, `page_title`, `utm_*`, `cta_text`, `variant`.

## Mapowanie w GTM
- Triggery
  - Click – elementy `[data-cta="header"]`, `[data-cta="hero"]`, `[data-cta="footer"]`.
  - Custom Event – `form_view`, `form_start`, `form_submit`, `section_view`, `exp_assign`.
  - DOM Ready – inicjalizacja IntersectionObservera (Custom HTML tag) do `section_view`.
- Tagi
  - GA4 Event – dla wszystkich powyższych eventów + parametry.
  - Consent Mode – zgodnie z obecnym schematem; wysyłka dopiero przy granted.
- Zmienne
  - Datalayer – `cta_location`, `cta_text`, `form_type`, `section_id`, `exp_id`, `variant`.

## Zmiany w kodzie (lekkie, odwracalne)
- Atrybuty CTA: dodaj `data-cta="header"` do przycisku w header oraz `data-cta="hero"` do hero CTA i `data-cta="footer"` przy formularzu w stopce.
- IntersectionObserver (opcjonalny) – Custom HTML w GTM lub drobny skrypt w `scripts/main.js` emitujący `section_view` przy 50% widoczności.
- Hero inline form (test B) – osadzić uproszczony formularz `data-form-type="newsletter"` bez modyfikacji backendu; wariant przełączać przez GTM (class toggle) lub prosty flag w DOM.
- Sticky CTA (mobile) – mały komponent `position: fixed; bottom: 0;` pokazywany po 3s; `data-cta="mobile_sticky"` → event `cta_click`.

## Copy do testów (PL)
- Header/hero CTA: „Powiadom mnie o premierze” / „Dołącz do wersji beta” / „Odbierz dostęp w pierwszej kolejności”.
- Pod e‑mailem: „Zero spamu. Tylko najważniejsze informacje i bonusy.”
- Social proof: „Dołącz do rodziców, którzy czekają na premierę DawnoTemu.”

## Priorytety wdrożenia
- P1: CTA copy (header/hero), sticky CTA (mobile), dataLayer eventy (cta_click, form_*). 
- P2: Hero inline form test, section_view, social proof pasek.
- P3: 2‑pole newsletter (A/B), dodatkowe warianty hero.

## Walidacja i raportowanie
- GA4 DebugView + Tag Assistant – weryfikacja sekwencji eventów i parametrów.
- Dashboard „Home”:
  - Kafle: `form_submit` (newsletter), CTR (cta_click hero/header), submit rate (form_submit/form_start), scroll 75%, udział kanałów UTM.
- Sukces: +15% tyg./tydz. `form_submit` przy stabilnym ruchu.

---
Uwaga: Wszystkie testy zgodne z Consent Mode; eventy odpalają się po `analytics_storage = granted`. Dla ruchu bez zgody można zbierać jedynie zagregowane sygnały (jak w Consent Mode), bez identyfikatorów.
