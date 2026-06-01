<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { settings } from '../lib/stores';
  import {
    signInWithPassword,
    signUpWithPassword,
    resetPassword,
    getRememberLogin,
    setRememberLogin,
    initSync
  } from '../lib/sync';
  import { fly } from 'svelte/transition';

  const dispatch = createEventDispatcher<{ done: void }>();
  const it = () => $settings.uiLang === 'it';

  type Mode = 'login' | 'signup';
  let mode: Mode = 'login';
  let email = '';
  let password = '';
  let msg = '';
  let busy = false;
  let remember = getRememberLogin();

  // Persist the choice and re-init the client so the session lands in the right
  // storage (localStorage = remembered, sessionStorage = until browser closes).
  async function onRemember() {
    setRememberLogin(remember);
    await initSync();
  }

  $: validEmail = email.includes('@') && email.includes('.');
  $: validPw = password.length >= 6;

  async function submit() {
    if (!validEmail || !validPw) return;
    busy = true;
    msg = '';
    try {
      if (mode === 'signup') {
        const r = await signUpWithPassword(email.trim(), password);
        if (r === 'confirm-email') {
          msg = it()
            ? 'Ti abbiamo inviato un\'email di conferma. Confermala, poi accedi.'
            : "We've sent a confirmation email. Confirm it, then log in.";
          mode = 'login';
        } else {
          dispatch('done');
        }
      } else {
        await signInWithPassword(email.trim(), password);
        dispatch('done');
      }
    } catch (e) {
      msg = friendly(e instanceof Error ? e.message : String(e));
    } finally {
      busy = false;
    }
  }

  async function forgot() {
    if (!validEmail) {
      msg = it() ? 'Inserisci prima la tua email.' : 'Enter your email first.';
      return;
    }
    busy = true;
    msg = '';
    try {
      await resetPassword(email.trim());
      msg = it() ? 'Email di reset inviata.' : 'Password reset email sent.';
    } catch (e) {
      msg = e instanceof Error ? e.message : String(e);
    } finally {
      busy = false;
    }
  }

  function friendly(m: string): string {
    if (/invalid login/i.test(m))
      return it() ? 'Email o password non validi.' : 'Invalid email or password.';
    if (/already registered/i.test(m))
      return it() ? 'Email già registrata. Accedi.' : 'Email already registered. Log in.';
    return m;
  }
</script>

<div class="grid min-h-screen place-items-center bg-slate-950 px-5">
  <div class="w-full max-w-sm" in:fly={{ y: 20, duration: 250 }}>
    <div class="mb-6 text-center">
      <div class="text-4xl font-black">
        <span class="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">日本語</span>
      </div>
      <div class="mt-1 text-lg font-bold">Nihongo Quest</div>
      <p class="mt-1 text-sm text-slate-400">
        {it() ? 'Accedi per salvare i progressi ovunque' : 'Log in to save your progress everywhere'}
      </p>
    </div>

    <div class="mb-4 flex gap-1 rounded-full bg-slate-800 p-1 text-sm">
      <button
        class="flex-1 rounded-full py-2 font-medium {mode === 'login' ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
        on:click={() => { mode = 'login'; msg = ''; }}>{it() ? 'Accedi' : 'Log in'}</button>
      <button
        class="flex-1 rounded-full py-2 font-medium {mode === 'signup' ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
        on:click={() => { mode = 'signup'; msg = ''; }}>{it() ? 'Registrati' : 'Sign up'}</button>
    </div>

    <form on:submit|preventDefault={submit} class="space-y-3">
      <input
        bind:value={email}
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        class="w-full rounded-xl bg-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
      />
      <input
        bind:value={password}
        type="password"
        autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
        placeholder={it() ? 'Password (min 6)' : 'Password (min 6)'}
        class="w-full rounded-xl bg-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
      />
      <label class="flex items-center gap-2 px-1 text-sm text-slate-300">
        <input type="checkbox" bind:checked={remember} on:change={onRemember} class="h-4 w-4 accent-pink-500" />
        {it() ? 'Ricordami su questo dispositivo' : 'Remember me on this device'}
      </label>
      <button
        type="submit"
        disabled={busy || !validEmail || !validPw}
        class="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 text-lg font-bold active:scale-[0.98] disabled:opacity-40"
      >
        {busy ? '…' : mode === 'signup' ? (it() ? 'Crea account' : 'Create account') : (it() ? 'Accedi' : 'Log in')}
      </button>
    </form>

    {#if mode === 'login'}
      <button class="mt-3 w-full text-center text-xs text-slate-500 underline" on:click={forgot}>
        {it() ? 'Password dimenticata?' : 'Forgot password?'}
      </button>
    {/if}

    {#if msg}<div class="mt-3 rounded-lg bg-slate-800 p-3 text-center text-sm text-pink-300">{msg}</div>{/if}

    <button class="mt-6 w-full text-center text-sm text-slate-400 underline" on:click={() => dispatch('done')}>
      {it() ? 'Continua senza account →' : 'Continue without an account →'}
    </button>
  </div>
</div>
