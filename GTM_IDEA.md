# Casting — pomysły na poprawę konwersji (A/B + GTM)

Cel strony: prowadzić do zostawienia kontaktu (wysłanie formularza „casting”) bez ujawniania pełnego briefu. Poniżej szybkie „quick wins”, hipotezy testowe i plan implementacji/analityki w GTM + GA4.

## KPI i pomiar
- Primary: `form_submit` (sukces wysyłki formularza castingu)
- Secondary: `cta_click` (wszystkie przyciski do formularza), `form_start`, `role_selected`, `scroll_depth` (75%), `time_on_page ≥ 45s`
- Segmentacja: `role_interest`, urządzenie, źródło/UTM, nowy vs powracający

## Szybkie wygrane (P1)
- Lepiej nazwany CTA w hero
  - Hipoteza: „Odbierz brief i instrukcję” > „Zgłoś się teraz” zwiększy kliknięcia, bo obiecuje konkretną korzyść.
  - Warianty: A: obecne, B: „Odbierz brief i instrukcję”, C: „Zarezerwuj miejsce – limitowane terminy”.
- Sticky CTA na mobile
  - Hipoteza: stały przycisk „Odbierz brief” u dołu ekranu podniesie `cta_click` o 10–20%.
  - Implementacja jako niewielki pasek u dołu widoczny po 2–3s.
- Redukcja tarcia w formularzu (etap 1)
  - Hipoteza: krótszy 1. krok (tylko Imię + Email + Rola) zwiększy `form_start` i `form_submit`.
  - Warianty: A: obecny 1‑krok, B: 2‑krok (krok 2 odsłania pola dodatkowe po kliknięciu „Dalej”).
- Mikrozaufanie przy formularzu
  - Dodaj pod CTA 3 pigułki: „Poufność danych”, „Odpowiadamy w 24h”, „Przyjazny self‑tape”.
- Mikrocopy pod polem email
  - „Wyślemy tylko brief i instrukcję self‑tape. Zero spamu.”

## Wzmocnienia treści (P2)
- Sekcja „Dlaczego warto?” przed formularzem
  - 3 wypunktowania: „Szybki proces”, „Autentyczne historie”, „Elastyczne terminy (Warszawa/Kraków)”.
- Cienka belka social proof
  - „Dołącz do X rodzin i lektorów, którzy już aplikowali” (aktualizowane okresowo, bez fałszu).
- FAQ w akordeonach (3–4 pytania)
  - „Co nagrać w self‑tape?”, „Czy wymagane doświadczenie?”, „Ile trwa odpowiedź?”.

## Personalizacja lekką ręką (P2/P3)
- Prefill roli z URL: `?role=lektor|mama|tata|dziecko-mlodsze|dziecko-starsze|babcia-dziadek|rodzina`
- Dynamiczny nagłówek zgodny z rolą
  - Przykład: jeśli `role=lektor` → nagłówek pomocniczy: „Szukamy ciepłych barw, 2 warianty nastroju”.

## Eksperymenty A/B (do wdrożenia w GTM)
1) Hero CTA copy (A/B/C)
   - Mierzymy: `cta_click` (hero), `form_submit`.
   - Sukces: +10% CTR i +5% submit vs A.
2) Sticky CTA (ON/OFF)
   - Mierzymy: `sticky_cta_click`, `form_submit` (kanibalizacja hero czy realny wzrost?).
3) Formularz 1‑krok vs 2‑krok
   - Mierzymy: `form_start`, `step_1_complete`, `form_submit`, drop‑off.
4) Trust chips przy formularzu (ON/OFF)
   - Mierzymy: `form_submit`, czas do pierwszej interakcji.
5) Obraz hero (casting‑hero vs alternatywa)
   - Mierzymy: `hero_view`→`cta_click` konwersję, scroll_depth.

## Instrumentacja danych (GTM → dataLayer → GA4)
Zdarzenia do ustandaryzowania (push w istniejących handlerach lub przez nasłuchy GTM):

```js
// Kliknięcia CTA (hero, sticky, linki w menu, przy formularzu)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} // już istnieje

// 1) CTA click
window.dataLayer.push({
  event: 'cta_click',
  cta_location: 'hero' | 'sticky' | 'form_top' | 'mobile_menu',
  cta_text: 'Zgłoś się teraz'
});

// 2) Form view/start/submit
window.dataLayer.push({ event: 'form_view', form_type: 'casting' });
window.dataLayer.push({ event: 'form_start', form_type: 'casting' });
window.dataLayer.push({ event: 'form_submit', form_type: 'casting', status: 'success' });

// 3) Form step (dla 2‑kroku)
window.dataLayer.push({ event: 'form_step', form_type: 'casting', step: 1, action: 'complete' });

// 4) Rola wybrana
window.dataLayer.push({ event: 'role_selected', role: 'lektor' });

// 5) Eksperyment przypisanie
window.dataLayer.push({ event: 'exp_assign', exp_id: 'CASTING_CTA_COPY', variant: 'B' });
```

Parametry GA4 sugerowane dla każdego eventu: `page_location`, `page_title`, `role_interest` (jeśli znana), `utm_*`, `device_category` (ustawia GA).

## Mapowanie w GTM
- Triggery
  - Click – elementy z atrybutami `[data-cta="hero"]`, `[data-cta="sticky"]` (można dodać po stronie DOM, albo selektory CSS na tekst/przycisk).
  - DOM Ready – push `form_view` kiedy formularz w viewport (+ threshold 50% IntersectionObserver w Custom HTML tagu).
  - Custom Event – `form_start`, `form_submit`, `role_selected` (z istniejących handlerów w `scripts/forms.js`).
- Tagi
  - GA4 Event – `cta_click`, `form_view`, `form_start`, `form_submit`, `form_step`, `role_selected`, `exp_assign`.
  - Consent Mode – bez zmian; wysyłamy dopiero przy granted.
- Zmienne
  - Data Layer – `cta_location`, `cta_text`, `form_type`, `role`, `exp_id`, `variant`.

## Zmiany w kodzie (lekkie i odwracalne)
- Dodaj atrybuty CTA: `data-cta="hero"` przy głównym przycisku i `data-cta="form_top"` przy pierwszym przycisku nad formularzem.
- (Opcjonalnie) Sticky CTA: prosty div fixed bottom na mobile (`md:hidden`), pokazywany po 2–3s.
- (Opcjonalnie) 2‑krokowy formularz: 
  - Krok 1: Imię, Email, Rola, checkbox zgody.
  - Krok 2: reszta pól (miasto, dostępność, link, motywacja).
  - Push `form_step` przy przejściu.
- Autofill roli z querystring `?role=` – ustawienie `select[name="role_interest"]` i push `role_selected`.

## Treści/copy do przetestowania
- Hero podtytuł: „Pełny brief i instrukcję self‑tape wyślemy w 24h.”
- Chips: „Poufność danych” / „Odpowiadamy w 24h” / „Przyjazny self‑tape”.
- Pod e‑mailem: „Zero spamu. Tylko niezbędne info o castingu.”

## Priorytety wdrożenia
- P1: CTA copy test (A/B/C), sticky CTA (mobile), zdarzenia GTM (cta_click, form_*).
- P2: Trust chips + mikrocopy, prefill roli z `?role=`.
- P3: 2‑krokowy formularz, alternatywny obraz hero.

## Walidacja i raport
- Realtime DebugView + Tag Assistant – sprawdzić sekwencje eventów i parametry.
- Dashboard GA4 – karta „Casting”: 
  - Kafelki: `form_submit`, CTR (cta_click / hero_view), submit rate (form_submit / form_start), udział ról, mobile vs desktop.
- Kryterium sukcesu: +10% `form_submit` tyg./tydz. przy stabilnym ruchu.

---
Uwaga: strona musi pozostać „hookiem” — nie ujawniamy stawek/terminów; zamiast tego obiecujemy szybki zwrot z pełnym briefem. Wszystkie testy realizujemy bez naruszania Consent Mode; eventy odpalamy wyłącznie przy `analytics_storage = granted`.
