# DB — Stratton Oak Mont

Model podataka za proizvode kredita, prijave i odlazna pisma. U prvoj verziji nema instalirane baze i aplikacija je ne otvara: stope stoje u kodu, a prijava odlazi emailom. Šema ispod je spremna za trenutak kada stope treba menjati bez izmene koda i kada prijave treba čuvati pored sandučeta.

Dijalekt je PostgreSQL. Imena i ograničenja su dovoljno obična da ista polja mogu da pređu u SQLite.

## 1. Pregled

```
company_profile 1
loan_products   3 reda (kes, stambeni, auto)
inquiries       jedna prijava
email_deliveries  N po prijavi (firma + klijent)
```

`inquiries.product_code` pokazuje na `loan_products.code`. Snimak iznosa, roka, rate i valute ostaje na prijavi i posle kasnije izmene stope u katalogu.

## 2. company_profile

Jedan red. PIB, matični broj i adresa ostaju prazni dok firma ne pošalje prave podatke.

```sql
create table company_profile (
  id smallint primary key default 1 check (id = 1),
  display_name text not null,
  legal_name text,
  pib text,
  registration_number text,
  address text,
  phone_e164 text not null,
  phone_display text not null,
  email text not null,
  hours_label text not null,
  instagram_url text,
  domain text not null,
  privacy_notice text not null,
  intermediary_notice text not null,
  updated_at timestamptz not null default now()
);
```

## 3. loan_products

Katalog koji hrani oba kalkulatora. `annual_rate_percent` ulazi u anuitet i ne prikazuje se na sajtu.

```sql
create table loan_products (
  code text primary key check (code in ('kes', 'stambeni', 'auto')),
  name text not null,
  currency text not null check (currency in ('RSD', 'EUR')),
  min_amount numeric(14, 2) not null,
  max_amount numeric(14, 2) not null,
  amount_step numeric(14, 2) not null,
  min_term integer not null,
  max_term integer not null,
  term_step integer not null default 1,
  term_unit text not null check (term_unit in ('month', 'year')),
  default_amount numeric(14, 2) not null,
  default_term integer not null,
  annual_rate_percent numeric(5, 2) not null,
  show_rate boolean not null default false,
  sort_order smallint not null,
  active boolean not null default true,
  check (min_amount > 0 and min_amount <= max_amount),
  check (amount_step > 0),
  check (min_term > 0 and min_term <= max_term),
  check (term_step > 0),
  check (default_amount between min_amount and max_amount),
  check (default_term between min_term and max_term),
  check (annual_rate_percent > 0),
  check (show_rate = false)
);
```

Početni podaci:

```sql
insert into loan_products (
  code, name, currency,
  min_amount, max_amount, amount_step,
  min_term, max_term, term_step, term_unit,
  default_amount, default_term,
  annual_rate_percent, show_rate, sort_order
) values
  ('kes', 'Keš krediti', 'RSD',
    10000, 3000000, 10000,
    6, 71, 1, 'month',
    500000, 36,
    8.50, false, 1),
  ('stambeni', 'Stambeni krediti', 'EUR',
    4300, 256000, 100,
    5, 30, 1, 'year',
    130100, 18,
    5.00, false, 2),
  ('auto', 'Auto krediti', 'RSD',
    100000, 5000000, 10000,
    12, 84, 1, 'month',
    2550000, 48,
    5.00, false, 3);
```

Izmena stope je `update` na `annual_rate_percent`. Granice klizača se menjaju u istom redu. `show_rate` ostaje `false` dok proizvod tako traži.

## 4. inquiries

Jedna poslata prijava. Rezime kredita je ili potpun ili odsutan. Direktan ulazak na kontakt ostavlja kreditna polja prazna.

Polja koja klijent vidi u rezimeu: `product_code`, `amount`, `term_value`, `installment`, `currency`.

`total_repayment` i `annual_rate_percent` su unutrašnji snimak obračuna. Ne ulaze u rezime na sajtu i ne moraju u telo mejla. Služe da se rata kasnije proveri istom formulom.

```sql
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  message text,

  consent_accepted boolean not null,
  consent_accepted_at timestamptz not null,
  privacy_notice_snapshot text not null,

  product_code text references loan_products (code),
  amount numeric(14, 2),
  term_value integer,
  term_unit text check (term_unit in ('month', 'year')),
  installment numeric(14, 2),
  currency text check (currency in ('RSD', 'EUR')),
  total_repayment numeric(14, 2),
  annual_rate_percent numeric(5, 2),

  source text not null check (source in ('pocetna', 'kalkulatori', 'kontakt')),
  honeypot_tripped boolean not null default false,

  check (consent_accepted = true),
  check (char_length(first_name) between 1 and 80),
  check (char_length(last_name) between 1 and 80),
  check (email like '%_@_%._%'),
  check (char_length(phone) between 6 and 20),
  check (
    (
      product_code is null
      and amount is null
      and term_value is null
      and term_unit is null
      and installment is null
      and currency is null
      and total_repayment is null
      and annual_rate_percent is null
    )
    or (
      product_code is not null
      and amount is not null
      and term_value is not null
      and term_unit is not null
      and installment is not null
      and currency is not null
      and total_repayment is not null
      and annual_rate_percent is not null
    )
  )
);

create index inquiries_created_at_idx on inquiries (created_at desc);
create index inquiries_email_idx on inquiries (email);
```

`source` označava gde je klijent pritisnuo dugme: početna, kalkulatori, ili forma bez kredita (`kontakt`).

Honeypot koji je popunjen ne dobija red i ne dobija pismo. Kolona postoji za slučaj da se odbačeni pokušaj ipak zabeleži.

## 5. email_deliveries

Dva reda po uspešnoj prijavi: jedno pismo firmi, jedno klijentu.

```sql
create table email_deliveries (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references inquiries (id) on delete cascade,
  kind text not null check (kind in ('company', 'client')),
  recipient text not null,
  reply_to text,
  subject text not null,
  sent_at timestamptz,
  error text,
  unique (inquiry_id, kind)
);
```

Za `kind = 'company'` primalac je `nikolanesic001@gmail.com`, a `reply_to` je email klijenta. Za `kind = 'client'` primalac je klijent, a `reply_to` može da ostane prazan.

Telo pisma firmi, kada rezime postoji:

- ime, prezime, email, telefon, poruka
- tip, iznos, rok, rata, valuta

## 6. Veza sa prvom verzijom

| Podatak | Prva verzija | Ova šema |
| --- | --- | --- |
| Granice, korak, stopa, početne vrednosti | `lib/loans.ts` | `loan_products` |
| Telefon, email, radno vreme, napomene | podnožje u kodu | `company_profile` |
| Prijava | dva emaila | `inquiries` + `email_deliveries` |
| Izbor dok klijent ne pošalje | `sessionStorage` u pregledaču | ne čuva se |

Seed u odeljku 3 je obavezan sadržaj kataloga. Aplikacija sme da pusti kalkulator tek kada ta tri reda postoje, ili dok baze nema, kada isti brojevi stoje u kodu.
