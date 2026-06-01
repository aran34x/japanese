<script lang="ts">
  import { settings, t } from '../lib/stores';
  import { game, unlockFictional } from '../lib/game/state';
  import {
    CHARACTERS_FICTIONAL,
    FRANCHISE_META,
    buildCharChallenge,
    buildCharLesson,
    type FictionalChar,
    type Franchise,
    type FQuestion
  } from '../lib/game/fictional';
  import { getWiki, type WikiInfo } from '../lib/game/wiki';
  import { fly, scale } from 'svelte/transition';

  type View = 'grid' | 'detail' | 'challenge' | 'cleared';
  let view: View = 'grid';
  let fr: Franchise = 'pokemon';
  let ch: FictionalChar | null = null;

  const franchises = Object.keys(FRANCHISE_META) as Franchise[];
  $: roster = CHARACTERS_FICTIONAL.filter((x) => x.franchise === fr);
  $: isUnlocked = (x: FictionalChar) => $game.unlockedFictional.includes(x.id);

  let bio: WikiInfo | undefined;
  async function openDetail(x: FictionalChar) {
    ch = x;
    bio = undefined;
    view = 'detail';
    bio = await getWiki(x.wiki);
  }

  let questions: FQuestion[] = [];
  let qIndex = 0;
  let picked: number | null = null;
  let wrong = false;
  let showLesson = false;

  function startChallenge() {
    if (!ch) return;
    questions = buildCharChallenge(ch);
    qIndex = 0;
    picked = null;
    wrong = false;
    showLesson = false;
    view = 'challenge';
  }

  async function answer(i: number) {
    if (picked !== null && !wrong) return;
    picked = i;
    if (!questions[qIndex].options[i].correct) {
      wrong = true;
      setTimeout(() => (showLesson = true), 450);
      return;
    }
    setTimeout(async () => {
      if (qIndex + 1 >= questions.length) {
        if (ch) await unlockFictional(ch.id, ch.xp, ch.name);
        view = 'cleared';
      } else {
        qIndex += 1;
        picked = null;
        wrong = false;
        showLesson = false;
      }
    }, 600);
  }

  function retry() {
    if (ch) questions[qIndex] = buildCharChallenge(ch)[qIndex];
    picked = null;
    wrong = false;
    showLesson = false;
  }

  $: lesson = ch ? buildCharLesson(ch) : null;
</script>

{#if view === 'grid'}
  <section in:fly={{ y: 12, duration: 180 }}>
    <p class="mb-3 text-sm text-slate-400">
      {$settings.uiLang === 'it'
        ? 'Personaggi di fantasia: leggi i loro nomi giapponesi reali. Bio dal vivo da Wikipedia (niente immagini protette).'
        : 'Fictional characters: read their real Japanese names. Live bios from Wikipedia (no copyrighted art).'}
    </p>
    <div class="mb-4 flex flex-wrap gap-2">
      {#each franchises as f}
        <button
          class="rounded-full px-3 py-1.5 text-sm font-medium {fr === f
            ? 'bg-indigo-500 text-white'
            : 'bg-slate-800 text-slate-300'}"
          on:click={() => (fr = f)}>{FRANCHISE_META[f].emoji} {FRANCHISE_META[f].label}</button>
      {/each}
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {#each roster as x (x.id)}
        {@const unlocked = isUnlocked(x)}
        <button
          class="flex items-center gap-3 rounded-2xl p-3 text-left active:scale-[0.98]"
          style="background:linear-gradient(135deg,{x.color}22,#1e293b)"
          on:click={() => openDetail(x)}
        >
          <div
            class="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
            style="background:{x.color}33"
          >{unlocked ? x.emoji : '❔'}</div>
          <div class="min-w-0">
            <div class="truncate text-sm font-semibold">{unlocked ? x.name : '???'}</div>
            <div class="truncate font-jp text-sm {unlocked ? 'text-pink-300' : 'blur-sm select-none text-slate-400'}">
              {x.ja}
            </div>
          </div>
        </button>
      {/each}
    </div>
  </section>

{:else if view === 'detail' && ch}
  <section in:fly={{ y: 12, duration: 180 }} class="space-y-4">
    <button class="text-sm text-slate-400" on:click={() => (view = 'grid')}>← {$t('back')}</button>
    <div class="grid place-items-center">
      <div class="grid h-28 w-28 place-items-center rounded-3xl text-6xl" style="background:{ch.color}33">
        {isUnlocked(ch) ? ch.emoji : '❔'}
      </div>
      <div class="mt-3 text-center">
        <div class="text-xl font-bold">{isUnlocked(ch) ? ch.name : '???'}</div>
        <div class="font-jp text-lg {isUnlocked(ch) ? 'text-pink-300' : 'blur-md select-none'}">{ch.ja}</div>
        <div class="text-xs text-slate-500">{FRANCHISE_META[ch.franchise].emoji} {FRANCHISE_META[ch.franchise].label}</div>
      </div>
    </div>

    {#if isUnlocked(ch)}
      <div class="text-center font-jp text-sm text-slate-300">{ch.reading} · {ch.romaji}</div>
      {#if bio?.extract}
        <p class="rounded-2xl bg-slate-800 p-4 text-sm leading-relaxed text-slate-300">{bio.extract}</p>
      {/if}
      <p class="rounded-xl bg-amber-500/10 p-3 text-sm text-amber-200">💡 {ch.fact[$settings.uiLang]}</p>
      {#if bio?.pageUrl}
        <a href={bio.pageUrl} target="_blank" rel="noopener" class="block text-center text-sm text-sky-400 underline">
          {$settings.uiLang === 'it' ? 'Apri su Wikipedia' : 'Open on Wikipedia'} ↗
        </a>
      {/if}
      <button class="w-full rounded-xl bg-slate-700 py-3 font-semibold" on:click={startChallenge}>
        ↺ {$settings.uiLang === 'it' ? 'Rigioca' : 'Replay'}
      </button>
    {:else}
      <p class="text-center text-sm text-slate-400">
        {$settings.uiLang === 'it'
          ? 'Leggi il nome giapponese per sbloccare il personaggio e la sua bio.'
          : 'Read the Japanese name to unlock the character and its bio.'}
      </p>
      <button
        class="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 text-lg font-bold active:scale-[0.98]"
        on:click={startChallenge}>⚔ {$settings.uiLang === 'it' ? 'Affronta la sfida' : 'Take the challenge'}</button>
    {/if}
  </section>

{:else if view === 'challenge' && ch}
  <section class="space-y-4">
    <div class="flex items-center justify-between text-sm">
      <button class="text-slate-400" on:click={() => (view = 'detail')}>✕</button>
      <span class="text-slate-400">{qIndex + 1} / {questions.length}</span>
    </div>

    {#key qIndex}
      <div in:fly={{ y: 14, duration: 160 }}>
        <div class="rounded-2xl bg-slate-800 p-5 text-center">
          <div class="mb-2 text-xs uppercase tracking-wide text-slate-500">
            {questions[qIndex].instruction[$settings.uiLang]}
          </div>
          {#if questions[qIndex].show}
            <div class="py-4 font-jp text-5xl">{questions[qIndex].show}</div>
          {/if}
        </div>
        <div class="mt-3 grid gap-2">
          {#each questions[qIndex].options as opt, i}
            <button
              disabled={picked !== null && !wrong}
              class="rounded-xl px-4 py-3 text-left text-lg font-jp transition-colors
                {picked === i && opt.correct ? 'bg-green-600 text-white' : ''}
                {picked === i && !opt.correct ? 'bg-rose-700 text-white' : ''}
                {picked !== i ? 'bg-slate-800 active:bg-slate-700' : ''}"
              on:click={() => answer(i)}>{opt.text}</button>
          {/each}
        </div>
      </div>
    {/key}

    {#if showLesson && lesson}
      <div in:scale={{ start: 0.9, duration: 200 }} class="rounded-2xl border border-amber-500/30 bg-slate-900 p-4">
        <div class="mb-2 font-bold text-amber-300">📖 {$settings.uiLang === 'it' ? 'Mini-lezione' : 'Mini-lesson'}</div>
        {#each lesson.vocab as v}
          <div class="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2">
            <span class="font-jp text-xl">{v.jp}</span>
            <span class="text-sm text-pink-300">{v.reading}</span>
            <span class="ml-auto text-sm text-slate-300">{v.meaning[$settings.uiLang]}</span>
          </div>
        {/each}
        <p class="mt-3 text-sm italic text-slate-400">{lesson.tip[$settings.uiLang]}</p>
        <button class="mt-3 w-full rounded-xl bg-indigo-500 py-2 font-semibold" on:click={retry}>
          {$settings.uiLang === 'it' ? 'Ho capito — riprova' : 'Got it — retry'}
        </button>
      </div>
    {/if}
  </section>

{:else if view === 'cleared' && ch}
  <section class="grid place-items-center py-10 text-center" in:scale={{ start: 0.8, duration: 300 }}>
    <div class="grid h-32 w-32 place-items-center rounded-3xl text-7xl" style="background:{ch.color}33">{ch.emoji}</div>
    <div class="mt-3 text-2xl">🎉</div>
    <div class="text-xl font-black">{ch.name}</div>
    <div class="font-jp text-pink-300">{ch.ja}</div>
    <div class="mt-1 text-sm text-slate-400">
      {$settings.uiLang === 'it' ? 'Sbloccato!' : 'Unlocked!'} +{ch.xp} XP
    </div>
    <div class="mt-5 flex gap-3">
      <button class="rounded-xl bg-indigo-500 px-5 py-3 font-semibold" on:click={() => ch && openDetail(ch)}>
        {$settings.uiLang === 'it' ? 'Vedi bio' : 'View bio'}
      </button>
      <button class="rounded-xl bg-slate-700 px-5 py-3 font-semibold" on:click={() => (view = 'grid')}>{$t('back')}</button>
    </div>
  </section>
{/if}
