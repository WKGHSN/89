export default function TermsPage() {
  return (
    <div className="bg-lumi-milk min-h-screen py-16">
      <div className="page-container max-w-3xl">
        <h1 className="section-title mb-8">Умови використання</h1>
        <div className="bg-white rounded-3xl shadow-soft p-8 prose prose-sm text-lumi-muted space-y-4">
          <p>Користуючись послугами LumiBeauty, ви погоджуєтесь з такими умовами.</p>
          <h3 className="text-lumi-text font-semibold">Правила запису</h3>
          <p>Будь ласка, скасовуйте запис не пізніше ніж за 2 години до початку сеансу.</p>
          <h3 className="text-lumi-text font-semibold">Відповідальність</h3>
          <p>LumiBeauty не несе відповідальності за результати, що відрізняються від очікуваних через об'єктивні фактори.</p>
          <h3 className="text-lumi-text font-semibold">Зміни умов</h3>
          <p>Ми залишаємо за собою право змінювати ці умови з попереднім повідомленням клієнтів.</p>
        </div>
      </div>
    </div>
  );
}
