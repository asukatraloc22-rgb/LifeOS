import type { Task } from '../types';
import { Card, Badge } from '@/shared/components/ui';
import { useTasksStore } from '../store/useTasksStore';

export function KanbanColumn({ title, tasks, tone }: { title: string; tasks: Task[]; tone: 'accent' | 'warning' | 'success' }) {
  const cycleStatus = useTasksStore((s) => s.cycleStatus);
  const deleteTask = useTasksStore((s) => s.deleteTask);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xs font-semibold">{title}</h3>
        <Badge tone={tone}>{tasks.length}</Badge>
      </div>
      <div className="space-y-2 min-h-[100px]">
        {tasks.length === 0 && <p className="text-[11px] text-text-3 italic">Aucune tâche</p>}
        {tasks.map((t) => (
          <Card key={t.id} padding="sm">
            <div className="text-xs mb-2">{t.desc}</div>
            <div className="flex items-center justify-between">
              <Badge tone="neutral">{t.project}</Badge>
              <div className="flex gap-1">
                {t.status !== 'todo' && (
                  <button onClick={() => cycleStatus(t.id, 'prev')} className="text-[10px] text-text-2 hover:text-text px-1">◀</button>
                )}
                {t.status !== 'done' && (
                  <button onClick={() => cycleStatus(t.id, 'next')} className="text-[10px] text-success hover:opacity-75 px-1">▶</button>
                )}
                <button onClick={() => deleteTask(t.id)} className="text-[10px] text-danger hover:opacity-75 px-1">✕</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
