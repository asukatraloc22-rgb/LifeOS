import { useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from './useAuthStore';
import { Button } from '@/shared/components/ui';

export function LockScreen({ children }: { children: ReactNode }) {
  const { ready, hasCredential, unlocked, init, setPin, unlock } = useAuthStore();
  const [pin, setPinInput] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    init();
  }, [init]);

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  async function handleUnlock() {
    const ok = await unlock(pin);
    if (!ok) {
      setError('Code incorrect');
      setPinInput('');
    }
  }

  async function handleSetup() {
    if (pin.length < 4) {
      setError('4 chiffres minimum');
      return;
    }
    if (pin !== confirmPin) {
      setError('Les codes ne correspondent pas');
      return;
    }
    await setPin(pin);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-bg">
      <div className="w-[300px] text-center">
        <div className="font-display text-2xl font-extrabold mb-1">
          Life<span className="text-accent-2">OS</span>
        </div>
        <p className="text-[11px] text-text-3 mb-6">
          {hasCredential ? 'Entre ton code pour continuer' : 'Crée un code pour protéger ton espace'}
        </p>

        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => {
            setPinInput(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && (hasCredential ? handleUnlock() : confirmPin && handleSetup())}
          placeholder="Code"
          autoFocus
          className="w-full bg-bg-3 border border-border-2 rounded-lg px-3 py-2.5 text-center text-lg tracking-[0.3em] mb-3 outline-none focus:border-accent"
        />

        {!hasCredential && (
          <input
            type="password"
            inputMode="numeric"
            value={confirmPin}
            onChange={(e) => {
              setConfirmPin(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSetup()}
            placeholder="Confirme le code"
            className="w-full bg-bg-3 border border-border-2 rounded-lg px-3 py-2.5 text-center text-lg tracking-[0.3em] mb-3 outline-none focus:border-accent"
          />
        )}

        {error && <p className="text-danger text-xs mb-3">{error}</p>}

        <Button fullWidth onClick={hasCredential ? handleUnlock : handleSetup}>
          {hasCredential ? 'Déverrouiller' : 'Créer mon espace'}
        </Button>

        <p className="text-[10px] text-text-3 mt-4">
          Protection locale sur cet appareil — ne remplace pas encore une authentification serveur.
        </p>
      </div>
    </div>
  );
}
