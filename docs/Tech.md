# Tech — Stratton Oak Mont

Kako se sajt iz `PRD.md` slaže na postojećem projektu. Šema iz `DB.md` se u prvoj verziji ne povezuje: nema instaliranog drajvera baze, a prijave idu emailom.

## 1. Šta je već u projektu

Provereno u `package.json`, `app/layout.tsx`, `app/globals.css`, `components.json` i `components/ui`.

Instalirano i ostaje:

| Paket | Verzija u projektu | Uloga |
| --- | --- | --- |
| next | 16.3.8 | App Router, metadata, server action za formu |
| react / react-dom | 19.2.8 | UI |
| typescript | 5 | Tipovi, `strict` je uključen |
| tailwindcss + @tailwindcss/postcss | 4 | Stilovi |
| @base-ui/react | 1.9.0 | Osnova shadcn komponenti |
| shadcn | 4.23.0 | CLI, stil `base-nova` |
| class-variance-authority, cn | već u zavisnostima | Varijante dugmadi i spajanje klasa |
| lucide-react | 1.72.0 | Ikonice menija, telefona, Instagrama |
| tw-animate-css | 1.4.0 | Već uključene animacije |
| eslint + eslint-config-next | 9 / 16.3.8 | Lint |

UI komponente koje forma i kartice mogu odmah da koriste: `button`, `card`, `input`, `label`, `textarea`, `checkbox`, `separator`. Badge, alert, tabs, switch, progress i avatar postoje od demo stranice i nisu potrebni za tri javne stranice.

Fontovi su već učitani u `app/layout.tsx`: Figtree kao `--font-heading`, Inter kao `--font-sans`, plus Geist i Geist Mono. Naslovi ostaju Figtree, tekst Inter. Geist se ne uvodi u marketinške stranice.

`components/ui/button.tsx` već ima oštre ivice (`rounded-none`), zlatni okvir glavnog dugmeta i tamnoplavi okvir sekundarnog. Tokeni u `app/globals.css`:

- pozadina bela, `--background: oklch(1 0 0)`
- zlato, `--primary: oklch(0.58 0.13 78)`
- tamnoplava, `--button-secondary-fill: oklch(0.3 0.08 238)`

Tamna paleta u istom fajlu postoji, ali sajt je samo svetao. `html` ne dobija klasu `dark`.

`app/page.tsx` je demo galerija komponenti. Zamenjuje se početnom stranicom. `lang` na `html` je trenutno `en` i menja se u `sr-Latn`.

Nije instalirano, i ne uvodi se u prvu verziju: baza, ORM, klijent za Postgres ili SQLite, Zod, React Hook Form, biblioteka za slanje forme, analitički paket.

Jedina nova runtime zavisnost, u trenutku izrade forme: `nodemailer`, za SMTP ka Gmail-u. Tipovi stižu kroz `@types/nodemailer` ako paket ne donese svoje.

## 2. Arhitektura

Sajt je App Router aplikacija. Stranice su serverske, sa metapodacima po ruti. Interaktivni delovi su klijentske komponente: zaglavlje, kalkulator i kontakt forma.

```
app/
  layout.tsx                 jezik, fontovi, zaglavlje, podnožje
  page.tsx                   početna
  kreditni-kalkulatori/page.tsx
  kontakt/page.tsx
  sitemap.ts
  robots.ts
  actions/send-inquiry.ts    server action
components/
  site-header.tsx
  site-footer.tsx
  loan-calculator.tsx
  contact-form.tsx
lib/
  loans.ts                   parametri i anuitet
  inquiry.ts                 čitanje i upis izbora kredita
  format.ts                  sr-RS brojevi
```

Rute:

| Putanja | Sadržaj |
| --- | --- |
| `/` | Početna, keš kalkulator ugrađen sa `product="kes"` |
| `/kreditni-kalkulatori` | Tri kartice i kalkulator |
| `/kontakt` | Forma |

Query na kalkulatorima:

- `tip=kes|stambeni|auto` bira karticu
- `iznos` i `rok` postoje samo kada se klijent vraća preko **Promeni**, da bi se klizači postavili

Nepoznat `tip` pada na keš. `iznos` i `rok` van opsega padaju na početne vrednosti tog proizvoda.

## 3. Kalkulator

`lib/loans.ts` drži tri proizvoda kao jedini izvor brojeva. Komponenta ne ponavlja min, max, korak, stopu i početne vrednosti.

Anuitet, nominalna godišnja stopa, bez naknada:

```
mesecnaStopa = godisnjaStopa / 100 / 12
rata = iznos * mesecnaStopa * (1 + mesecnaStopa) ^ n / ((1 + mesecnaStopa) ^ n - 1)
ukupno = rata * n
```

Za stambeni kredit `n` je broj godina puta 12. Za keš i auto `n` je broj meseci.

Zaokruživanje ide prvo na ratu, pa je ukupno rata puta broj meseci:

- RSD: rata na ceo dinar, pa ukupno
- EUR: rata na dve decimale, pa ukupno

Prikaz ide preko `Intl.NumberFormat` sa `sr-RS`. Stopa se koristi u formuli i ne renderuje se.

Klizač je `input type="range"` uz postojeće token boja. Vrednost se ispisuje pored, bez drugog polja za unos. Svaka promena odmah računa ratu.

**Zatraži kredit** upisuje izbor i vodi na `/kontakt`.

## 4. Prenos izbora kredita

`sessionStorage`, ključ `som-inquiry-loan`. Vrednost:

```ts
type LoanSelection = {
  product: "kes" | "stambeni" | "auto"
  amount: number
  term: number
  installment: number
  currency: "RSD" | "EUR"
}
```

To su tačno polja koja klijent vidi u rezimeu. Osvežavanje kontakta čita isti ključ.

**Promeni** vodi na `/kreditni-kalkulatori?tip=...&iznos=...&rok=...`. Kalkulator primeni te vrednosti ako su na mreži koraka. Direktan ulazak na `/kontakt` ne pravi rezime i ne šalje polja kredita. Prazan storage znači direktan ulazak.

## 5. Forma i email

Server action `sendInquiry` prima `FormData`.

Validacija u action-u, bez nove biblioteke šema:

- ime, prezime, email i telefon su obavezni i skraćuju se na razumnu dužinu
- email mora da ima oblik adrese
- telefon prima srpske i strane brojeve, uz ograničenje dužine
- poruka sme da bude prazna
- saglasnost mora da bude označena
- honeypot polje, skriveno od korisnika, mora da ostane prazno
- rezime kredita je opcioni; ako stigne, mora da odgovara proizvodu iz `lib/loans.ts`

Honeypot koji nije prazan dobija isti ekran zahvalnosti, bez slanja pošte.

Slanje ide preko Nodemailer-a i Gmail SMTP (`smtp.gmail.com`, port 465). Pošiljalac je `nikolanesic001@gmail.com`. Dva pisma:

1. Firmi, na istu adresu. `Reply-To` je email klijenta. Telo: ime, prezime, email, telefon, poruka, pa rezime kredita ako postoji.
2. Klijentu, potvrda da je prijava primljena i da će ga agent pozvati.

Lozinka aplikacije stoji u `.env.local`, koji se ne komituje:

```
GMAIL_USER=nikolanesic001@gmail.com
GMAIL_APP_PASSWORD=
```

Action čita samo serverske promenljive. Lozinka se ne traži u ćaskanju i ne ulazi u repozitorijum. Ako SMTP nije podešen u lokalnom razvoju, forma vraća jasnu grešku, a stranica ostaje popunjena.

Posle uspeha forma se zamenjuje porukom na istoj stranici. Storage izbora se briše da stari rezime ne ostane na sledećem ulasku.

## 6. Zaglavlje, podnožje, telefon

Zaglavlje je klijentska komponenta. Na širini od `md` naviše sluša smer skrola: nadole se sklanja, nagore se vraća. Ispod `md` ostaje na mestu, a `Menu` ikonica otvara panel učvršćen uz desnu ivicu.

Zlatna linija je donja ivica zaglavlja i gornja ivica sledeće velike sekcije, bojom `--primary`.

Podnožje je serverska komponenta, zajednička u layout-u. Pasus privatnosti ima `id="privatnost"`. Checkbox u formi vodi na `#privatnost`.

Instagram ikonica se renderuje odmah. `href` ostaje prazan dok ne stigne pravi nalog: element je `span` sa ikonicom, bez lažnog profila.

Telefon je link `tel:+381695056765`, vidljiv tekst `+381 69 505 67 65`.

## 7. Tekst i SEO

Figtree i Inter se učitavaju sa `subsets: ["latin", "latin-ext"]`. Trenutni layout traži samo `latin`, pa slova č, ć, đ, š i ž ne bi bila u fajlu fonta.

Svaka stranica eksportuje `metadata` sa svojim `title` i `description`. Root layout postavlja `metadataBase` na `https://strattonoakmontrs.com` kada se domen veže.

Početna u serverski renderovan JSON-LD stavlja `FAQPage` sa šest pitanja iz PRD-a. Druge dve stranice nemaju taj blok.

`app/sitemap.ts` vraća tri rute. `app/robots.ts` dozvoljava sve i pokazuje na mapu.

Mesto za merenje ostaje prazno. Kada stigne ID, ubacuje se jedan komponent u layout, iza promenljive `NEXT_PUBLIC_ANALYTICS_ID`. Bez vrednosti se skripta ne učitava.

## 8. Baza u prvoj verziji

Baza se ne instalira i ne poziva. Parametri kredita žive u `lib/loans.ts`, u istim brojevima kao seed u `DB.md`. Prijava živi u emailu, u poljima iz tabele `inquiries`.

Kada stope treba da se menjaju bez izmene koda, `loan_products` iz `DB.md` postaje izvor, a `lib/loans.ts` čita tu tabelu. Do tada je izmena stope izmena jednog objekta.

## 9. Redosled izrade

1. Tokeni, font `latin-ext`, layout, zaglavlje i podnožje.
2. `lib/loans.ts` i keš kalkulator na početnoj, zatim koraci, brojke i pitanja.
3. Stranica kalkulatora sa tri kartice i query parametrima.
4. Kontakt, storage izbora, server action i Nodemailer.

Posle svake stranice proverava se tok u pregledaču: klizač, dugme, meni na uskom ekranu, pa forma.
