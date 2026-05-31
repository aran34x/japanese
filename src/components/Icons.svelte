<script lang="ts">
  import { settings, t } from '../lib/stores';
  import { game, unlockPerson } from '../lib/game/state';
  import {
    PEOPLE,
    CATEGORY_META,
    ROLES,
    buildPersonChallenge,
    buildPersonLesson,
    type RealPerson,
    type PersonCategory,
    type PQuestion
  } from '../lib/game/people';
  import { getWiki, type WikiInfo } from '../lib/game/wiki';
  import WikiImage from './WikiImage.svelte';
  import { fly, scale } from 'svelte/transition';

  type View = 'grid' | 'detail' | 'challenge' | 'cleared';
  let view: View = 'grid';
  let cat: PersonCategory = 'music';
  let person: RealPerson | null = null;

  const cats = Object.keys(CATEGORY_META) as PersonCategory[];
  $: roster = PEOPLE.filter((p) => p.category === cat);
  $: isUnlocked = (p: RealPerson) => $game.unlockedPeople.includes(p.id);

  // --- detail bio ---
  let bio: WikiInfo | undefined;
  async function openDetail(p: RealPerson) {
    person = p;
    bio = undefined;
    view = 'detail';
    bio = await getWiki(p.wiki);
  }

  // --- challenge ---
  let questions: PQuestion[] = [];
  let qIndex = 0;
  let picked: number | null = null;
  let wrong = false;
  let showLesson = false;

  function startChallenge() {
    if (!person) return;
    questions = buildPersonChallenge(person);
    qIndex = 0;
    picked = null;
    wrong = false;
    showLesson = false;
    view = 'challenge';
  }

  async function answer(i: number) {
    if (picked !== null) return;
    picked = i;
    const correct = questions[qIndex].options[i].correct;
    if (!correct) {
      wrong = true;
      setTimeout(() => (showLesson = true), 500);
      return;
    }
    setTimeout(async () => {
      if (qIndex + 1 >= questions.length) {
        if (person) await unlockPerson(person.id, person.xp, person.name);
        view = 'cleared';
      } else {
        qIndex += 1;
        picked = null;
      }
    }, 650);
  }

  function retry() {
    // reshuffle the current question's options so retry isn't just position memory
    if (person) {
      const fresh = buildPersonChallenge(person);
      questions[qIndex] = fresh[qIndex];
    }
    picked = null;
    wrong = false;
    showLesson = false;
  }

  $: lesson = person ? buildPersonLesson(person) : null;
  function roleLabel(p: RealPerson) {
    const r = ROLES[p.role];
    return $settings.uiLang === 'it' ? r.it : r.en;
  }
</script>

{#if view === 'grid'}
  <section in:fly={{ y: 12, duration: 180 }}>
    <p class="mb-3 text-sm text-slate-400">
      {$settings.uiLang === 'it'
        ? 'Sfida figure reali della cultura giapponese. Foto e bio dal vivo da Wikipedia.'
        : 'Challenge real figures of Japanese culture. Photos & bios live from Wikipedia.'}
    </p>
    <div class="mb-4 flex gap-2 overflow-x-auto pb-1">
      {#each cats as c}
        <button
          class="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium {cat === c
            ? 'bg-indigo-500 text-white'
            : 'bg-slate-800 text-slate-300'}"
          on:click={() => (cat = c)}
        >{CATEGORY_META[c].emoji} {CATEGORY_META[c].label[$settings.uiLang]}</button>
      {/each}
    </div>

    <div class="grid grid-cols-3 gap-3">
      {#each roster as pp (pp.id)}
        <button class="text-center" on:click={() => openDetail(pp)}>
          <div class="aspect-square">
            <WikiImage title={pp.wiki} blurred={!isUnlocked(pp)} />
          </div>
          <div class="mt-1 truncate text-xs font-medium">{pp.name}</div>
          <div class="text-[10px] text-slate-500">{isUnlocked(pp) ? '✓' : '🔒'}</div>
        </button>
      {/each}
    </div>
  </section>

{:else if view === 'detail' && person}
  <section in:fly={{ y: 12, duration: 180 }} class="space-y-4">
    <button class="text-sm text-slate-400" on:click={() => (view = 'grid')}>← {$t('back')}</button>
    <div class="mx-auto h-44 w-44">
      <WikiImage title={person.wiki} blurred={!isUnlocked(person)} />
    </div>
    <div class="text-center">
      <div class="text-xl font-bold">{person.name}</div>
      <div class="font-jp text-lg text-pink-300">{person.ja}</div>
      <div class="text-sm text-slate-400">{person.reading} · {roleLabel(person)}</div>
    </div>

    {#if isUnlocked(person)}
      {#if bio?.extract}
        <p class="rounded-2xl bg-slate-800 p-4 text-sm leading-relaxed text-slate-300">{bio.extract}</p>
      {/if}
      {#if person.fact}
        <p class="rounded-xl bg-amber-500/10 p-3 text-sm text-amber-200">💡 {person.fact[$settings.uiLang]}</p>
      {/if}
      {#if bio?.pageUrl}
        <a href={bio.pageUrl} target="_blank" rel="noopener" class="block text-center text-sm text-sky-400 underline">
          {$settings.uiLang === 'it' ? 'Apri su Wikipedia' : 'Open on Wikipedia'} ↗
        </a>
      {/if}
      <button class="w-full rounded-xl bg-slate-700 py-3 font-semibold" on:click={startChallenge}>
        ↺ {$settings.uiLang === 'it' ? 'Rigioca la sfida' : 'Replay challenge'}
      </button>
    {:else}
      <p class="text-center text-sm text-slate-400">
        {$settings.uiLang === 'it'
          ? 'Supera la sfida per svelare la foto e la biografia.'
          : 'Beat the challenge to reveal the photo and biography.'}
      </p>
      <button
        class="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 text-lg font-bold active:scale-[0.98]"
        on:click={startChallenge}>⚔ {$settings.uiLang === 'it' ? 'Affronta la sfida' : 'Take the challenge'}</button>
    {/if}
  </section>

{:else if view === 'challenge' && person}
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
        <div class="mb-2 font-bold text-amber-300">
          📖 {$settings.uiLang === 'it' ? 'Mini-lezione' : 'Mini-lesson'}
        </div>
        <div class="space-y-2">
          {#each lesson.vocab as v}
            <div class="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2">
              <span class="font-jp text-xl">{v.jp}</span>
              <span class="text-sm text-pink-300">{v.reading}</span>
              <span class="ml-auto text-sm text-slate-300">{v.meaning[$settings.uiLang]}</span>
            </div>
          {/each}
        </div>
        <p class="mt-3 text-sm italic text-slate-400">{lesson.tip[$settings.uiLang]}</p>
        <button class="mt-3 w-full rounded-xl bg-indigo-500 py-2 font-semibold" on:click={retry}>
          {$settings.uiLang === 'it' ? 'Ho capito — riprova' : 'Got it — retry'}
        </button>
      </div>
    {/if}
  </section>

{:else if view === 'cleared' && person}
  <section class="grid place-items-center py-10 text-center" in:scale={{ start: 0.8, duration: 300 }}>
    <div class="h-40 w-40"><WikiImage title={person.wiki} /></div>
    <div class="mt-3 text-2xl">🌟</div>
    <div class="text-xl font-black">{person.name}</div>
    <div class="font-jp text-pink-300">{person.ja}</div>
    <div class="mt-1 text-sm text-slate-400">
      {$settings.uiLang === 'it' ? 'Sbloccato!' : 'Unlocked!'} +{person.xp} XP
    </div>
    <div class="mt-5 flex gap-3">
      <button class="rounded-xl bg-indigo-500 px-5 py-3 font-semibold" on:click={() => openDetail(person)}>
        {$settings.uiLang === 'it' ? 'Vedi bio' : 'View bio'}
      </button>
      <button class="rounded-xl bg-slate-700 px-5 py-3 font-semibold" on:click={() => (view = 'grid')}>
        {$t('back')}
      </button>
    </div>
  </section>
{/if}
