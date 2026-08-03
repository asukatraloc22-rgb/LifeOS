import { useEffect, useState } from 'react';
import { PageHeader } from '@/shared/layouts/PageHeader';
import { Card, Button } from '@/shared/components/ui';
import { useTasksStore } from './store/useTasksStore';
import { KanbanColumn } from './components/KanbanColumn';

export function TasksPage() {
  const { tasks, loaded, load, addTask } = useTasksStore();
  const [desc, setDesc] = useState('');
  const [project, setProject] = useState('');

  useEffect(() => {
    load();
  }, [load]);

  if (!loaded) return null;

  function submit() {
    if (!desc.trim()) return;
    addTask(desc.trim(), project.trim());
    setDesc('');
  }

  return (
    <div>
      <PageHeader title="Tâches ☑" subtitle="Ta liste de tâches, en un coup d'œil" />

      <Card className="mb-5">
        <div className="flex gap-2">
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Nouvelle tâche..."
            className="flex-1 bg-bg-3 border border-border-2 rounded-md px-3 py-2 text-xs"
          />
          <input
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Projet (optionnel)"
            className="w-40 bg-bg-3 border border-border-2 rounded-md px-3 py-2 text-xs"
          />
          <Button onClick={submit}>Ajouter</Button>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <KanbanColumn title="À faire" tasks={tasks.filter((t) => t.status === 'todo')} tone="accent" />
        <KanbanColumn title="En cours" tasks={tasks.filter((t) => t.status === 'inprogress')} tone="warning" />
        <KanbanColumn title="Terminé" tasks={tasks.filter((t) => t.status === 'done')} tone="success" />
      </div>
    </div>
  );
}
