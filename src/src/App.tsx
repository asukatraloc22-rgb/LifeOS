import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/shared/layouts/AppShell';
import { ComingSoon } from '@/shared/components/ComingSoon';
import { PageLoader } from '@/shared/components/PageLoader';

const DashboardPage = lazy(() => import('@/modules/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const FinancePage = lazy(() => import('@/modules/finance/FinancePage').then((m) => ({ default: m.FinancePage })));
const BasketballPage = lazy(() => import('@/modules/basketball/BasketballPage').then((m) => ({ default: m.BasketballPage })));
const HabitsPage = lazy(() => import('@/modules/habits/HabitsPage').then((m) => ({ default: m.HabitsPage })));
const TasksPage = lazy(() => import('@/modules/tasks/TasksPage').then((m) => ({ default: m.TasksPage })));

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/basketball" element={<BasketballPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/academy" element={<ComingSoon title="Academy 📚" subtitle="Cours, quiz, progression et badges" />} />
          <Route path="/real-estate" element={<ComingSoon title="Immobilier 🏠" subtitle="Patrimoine et suivi immobilier" />} />
          <Route path="/goals" element={<ComingSoon title="Objectifs 🎯" subtitle="Tous tes objectifs, tous domaines confondus" />} />
          <Route path="/notes" element={<ComingSoon title="Notes ✎" subtitle="Ta base de connaissance personnelle" />} />
          <Route path="/journal" element={<ComingSoon title="Journal ✦" subtitle="Ton journal quotidien" />} />
          <Route path="/analytics" element={<ComingSoon title="Analytics 📊" subtitle="Statistiques croisées de ta vie" />} />
          <Route path="/settings" element={<ComingSoon title="Réglages ⚙" subtitle="Configuration de LifeOS" />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
