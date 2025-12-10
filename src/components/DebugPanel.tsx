import { useDebugStore } from '@/stores/debugStore';

export default function DebugPanel() {
  const lastError = useDebugStore((s) => s.lastError);
  const clear = useDebugStore((s) => s.clear);

  if (!lastError) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md w-full z-50">
      <div className="bg-red-50 border border-red-200 text-red-900 rounded p-3 shadow">
        <div className="flex justify-between items-start gap-2">
          <div>
            <strong>Debug: {lastError.source}</strong>
            <div className="text-xs text-muted-foreground">{new Date(lastError.time).toLocaleString()}</div>
          </div>
          <button className="text-sm underline" onClick={clear}>Clear</button>
        </div>
        <div className="mt-2 text-sm">
          <div><strong>Message:</strong> {lastError.message ?? '—'}</div>
          <div><strong>Status:</strong> {lastError.status ?? '—'}</div>
          <div className="mt-2"><strong>Details:</strong></div>
          <pre className="text-xs overflow-auto max-h-40 mt-1 bg-white p-2 rounded">{JSON.stringify(lastError.details ?? {}, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
