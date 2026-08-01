import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/shared/layouts/AppShell';
import { DashboardPage } from '@/modules/dashboard/DashboardPage';
import { FinancePage } from '@/modules/finance/FinancePage';
import { BasketballPage } from '@/modules/basketball/BasketballPage';
import { ComingSoon } from '@/shared/components/ComingSoon';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/basketball" element={<BasketballPage />} />
        <Route path="/academy" element={<ComingSoon title="Academy 📚" subtitle="Cours, quiz, progression et badges" />} />
        <Route path="/real-estate" element={<ComingSoon title="Immobilier 🏠" subtitle="Patrimoine et suivi immobilier" />} />
        <Route path="/goals" element={<ComingSoon title="Objectifs 🎯" subtitle="Tous tes objectifs, tous domaines confondus" />} />
        <Route path="/habits" element={<ComingSoon title="Habitudes 🔁" subtitle="Suivi quotidien de tes routines" />} />
        <Route path="/tasks" element={<ComingSoon title="Tâches ☑" subtitle="Ta liste de tâches centralisée" />} />
        <Route path="/notes" element={<ComingSoon title="Notes ✎" subtitle="Ta base de connaissance personnelle" />} />
        <Route path="/journal" element={<ComingSoon title="Journal ✦" subtitle="Ton journal quotidien" />} />
        <Route path="/analytics" element={<ComingSoon title="Analytics 📊" subtitle="Statistiques croisées de ta vie" />} />
        <Route path="/settings" element={<ComingSoon title="Réglages ⚙" subtitle="Configuration de LifeOS" />} />
      </Routes>
    </AppShell>
  );
}
