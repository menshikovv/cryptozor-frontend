import { SchoolPageContent } from "./SchoolPage";

export const generateMetadata = async () => ({
  title: "Обучение P2P-арбитражу от CryptoZor — начни зарабатывать на крипте за 7 дней",
  description: "Научись P2P-арбитражу на криптовалюте с нуля и зарабатывай от 15 000₽ в неделю уже через 7 дней. Онлайн-обучение, живые уроки, поддержка после курса.",
  keywords: [
    "обучение P2P арбитражу",
    "курс по P2P криптовалюте",
    "криптоарбитраж",
    "CryptoZor обучение",
    "арбитраж криптовалют",
    "зарабатывать на крипте",
    "курс P2P трейдинг"
  ],
  openGraph: {
    title: "Обучение P2P-арбитражу от CryptoZor — зарабатывай на криптовалюте",
    type: "website",
    url: "https://cryptozor.ru/school",
    description: "Хочешь стабильно зарабатывать на криптовалюте? Обучись P2P-арбитражу с CryptoZor и получи реальные деньги уже через неделю. Живые уроки, готовые аккаунты, поддержка после курса."
  },
});

export default function SchoolPage() {
    return <SchoolPageContent />
}