export type HomeFaqItem = {
  id: string
  question: string
  answer: string
}

export const homeFaqItems: HomeFaqItem[] = [
  {
    id: "ko-moze",
    question: "Ko može da traži kredit preko Stratton Oak Mont-a?",
    answer:
      "Zaposleni i penzioneri mogu da pošalju upit. Konačnu procenu daje banka, na osnovu primanja, postojećih obaveza i izveštaja Kreditnog biroa.",
  },
  {
    id: "usluga-placena",
    question: "Da li se usluga plaća?",
    answer: "Za klijenta, usluga je besplatna.",
  },
  {
    id: "rata-konacna",
    question: "Da li je rata na sajtu konačna ponuda?",
    answer:
      "Obračun je informativan. Konačna rata zavisi od banke i kreditne sposobnosti. Za više informacija pozovite agenta.",
  },
  {
    id: "kreditni-skor",
    question: "Da li prijava na sajtu utiče na kreditni skor?",
    answer:
      "Upit koji ostavite nama je razgovor sa agentom. Formalna provera kod banke nastaje kada se odlučite za zahtev.",
  },
  {
    id: "realizacija",
    question: "Gde se kredit realizuje?",
    answer:
      "Ponudu dobijate od agenta. Zahtev se podnosi u filijali banke.",
  },
  {
    id: "brzina-odgovora",
    question: "Koliko brzo se javljate?",
    answer: "U roku od 1–2 sata, svakog dana, od 00 do 24 časa.",
  },
]
