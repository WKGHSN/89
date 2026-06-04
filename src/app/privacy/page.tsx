export default function PrivacyPage() {
  return (
    <div className="bg-lumi-milk min-h-screen py-16">
      <div className="page-container max-w-3xl">
        <h1 className="section-title mb-8">Політика конфіденційності</h1>
        <div className="bg-white rounded-3xl shadow-soft p-8 prose prose-sm text-lumi-muted space-y-4">
          <p>Ця Політика конфіденційності описує, як LumiBeauty збирає, використовує та захищає вашу особисту інформацію.</p>
          <h3 className="text-lumi-text font-semibold">Збір інформації</h3>
          <p>Ми збираємо інформацію, яку ви надаєте безпосередньо нам: ім'я, email, телефон для здійснення записів.</p>
          <h3 className="text-lumi-text font-semibold">Використання інформації</h3>
          <p>Ваша інформація використовується виключно для управління записами та покращення сервісу.</p>
          <h3 className="text-lumi-text font-semibold">Захист даних</h3>
          <p>Ми вживаємо всіх необхідних заходів для захисту ваших персональних даних від несанкціонованого доступу.</p>
        </div>
      </div>
    </div>
  );
}
