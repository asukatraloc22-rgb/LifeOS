import { useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from './useAuthStore';
import { Button } from '@/shared/components/ui';

export function LockScreen({ children }: { children: ReactNode }) {
  const { mode, ready, hasCredential, unlocked, authError, init, setPin, unlock, signIn, signUp } =
    useAuthStore();

  const [pin, setPinInput] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState('');

  useEffect(() => {
    init();
  }, [init]);

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  if (mode === 'supabase') {
    function submit() {
      if (!email || !password) {
        setError('Renseigne un email et un mot de passe');
        return;
      }
      setError('');
      authMode === 'signin' ? signIn(email, password) : signUp(email, password);
    }

    return (
      <div className="h-screen flex items-center justify-center bg-bg">
        <div className="w-[300px] text-center">
          <div className="font-display text-2xl font-extrabold mb-1">
            Life<span className="text-accent-2">OS</span>
          </div>
          <p className="text-[11px] text-text-3 mb-6">
            {authMode === 'signin' ? 'Connecte-toi à ton espace' : 'Crée ton compte LifeOS'}
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoFocus
            className="w-full bg-bg-3 border border-border-2 rounded-lg px-3 py-2.5 text-sm mb-2 outline-none focus:border-accent"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Mot de passe"
            className="w-full bg-bg-3 border border-border-2 rounded-lg px-3 py-2.5 text-sm mb-3 outline-none focus:border-accent"
          />

          {(error || authError) && <p className="text-danger text-xs mb-3">{error || authError}</p>}

          <Button fullWidth onClick={submit}>
            {authMode === 'signin' ? 'Se connecter' : 'Créer mon compte'}
          </Button>

          <button
            onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
            className="text-[11px] text-text-3 hover:text-text mt-4"
          >
            {authMode === 'signin' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    );
  }

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
          Protection locale sur cet appareil — pas de synchronisation multi-appareils.
        </p>
      </div>
    </div>
  );
}
