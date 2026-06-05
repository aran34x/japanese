<script lang="ts">
  import { settings, t } from '../lib/stores';
  import { game, unlockPerson } from '../lib/game/state';
  import { speakJa } from '../lib/speech';
  import {
    PEOPLE,
    ROLES,
    buildPersonChallenge,
    type RealPerson,
    type PQuestion
  } from '../lib/game/people';
  import { getWiki, type WikiInfo } from '../lib/game/wiki';
  import WikiImage from './WikiImage.svelte';
  import QuizQuestion from './QuizQuestion.svelte';
  import { fly, scale } from 'svelte/transition';

  type View = 'grid' | 'detail' | 'challenge' | 'cleared';
  let view: View = 'grid';
  let person: RealPerson | null = null;

  $: roster = PEOPLE;
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
  let exNonce = 0;

  function startChallenge() {
    if (!person) return;
    questions = buildPersonChallenge(person);
    qIndex = 0;
    exNonce++;
    view = 'challenge';
  }

  let correctCount = 0;
  async function onAnswer(correct: boolean) {
    if (correct) correctCount++;
  }

  async function onNext() {
    if (qIndex + 1 >= questions.length) {
      if (correctCount >= questions.length && person) {
        await unlockPerson(person.id, person.xp, person.name);
        view = 'cleared';
      } else {
        if (correctCount <= qIndex) {
            if (person) {
                const fresh = buildPersonChallenge(person);
                questions[qIndex] = fresh[qIndex];
                exNonce++;
            }
        } else {
            qIndex++;
            exNonce++;
        }
      }
    } else {
       if (correctCount <= qIndex) {
         if (person) {
            const fresh = buildPersonChallenge(person);
            questions[qIndex] = fresh[qIndex];
            exNonce++;
         }
      } else {
         qIndex++;
         exNonce++;
      }
    }
  }

  function roleLabel(p: RealPerson) {
    const r = ROLES[p.role];
    return $settings.uiLang === 'it' ? r.it : r.en;
  }
</script>

{#if view === 'grid'}
  <section in:fly={{ y: 12, duration: 180 }}>
    <div class="mb-4 flex items-center justify-between">
      <p class="text-sm text-slate-400">
        {$t('iconsIntro')}
      </p>
      <div class="text-sm font-bold text-indigo-400">
        {PEOPLE.filter(isUnlocked).length} / {PEOPLE.length}
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {#each roster as pp (pp.id)}
        <button class="text-center" on:click={() => openDetail(pp)}>
          <div class="aspect-square">
            <WikiImage title={pp.wiki} blurred={!isUnlocked(pp)} rounded="rounded-xl" />
          </div>
          <div class="mt-1 truncate text-xs font-medium {isUnlocked(pp) ? '' : 'text-slate-500'}">
            {isUnlocked(pp) ? pp.name : '???'}
          </div>
          <div class="text-[10px] text-slate-500">{isUnlocked(pp) ? '✓' : '🔒'}</div>
        </button>
      {/each}
    </div>
  </section>

{:else if view === 'detail' && person}
  <section in:fly={{ y: 12, duration: 180 }} class="space-y-4">
    <button class="text-sm text-slate-400" on:click={() => (view = 'grid')}>← {$t('back')}</button>
    <div class="mx-auto h-44 w-44">
      <WikiImage title={person.wiki} blurred={!isUnlocked(person)} rounded="rounded-3xl" />
    </div>
    <div class="text-center">
      <div class="flex items-center justify-center gap-2">
        <div class="text-xl font-bold">{isUnlocked(person) ? person.name : '???'}</div>
        {#if isUnlocked(person)}
          <button
            class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px]"
            on:click={() => speakJa(person.name)}
            title="🔊">🔊</button>
        {/if}
      </div>
      <div class="flex items-center justify-center gap-2 font-jp text-lg text-pink-300">
        {isUnlocked(person) ? person.ja : '???'}
        {#if isUnlocked(person)}
          <button
            class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px]"
            on:click={() => speakJa(person.ja)}
            title="🔊">🔊</button>
        {/if}
      </div>
      <div class="text-sm text-slate-400">
        {isUnlocked(person) ? person.reading + ' · ' : ''}{isUnlocked(person) ? roleLabel(person) : '???'}
      </div>
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
          {$t('openWikipedia')} ↗
        </a>
      {/if}
      <button class="w-full rounded-xl bg-slate-700 py-3 font-semibold" on:click={startChallenge}>
        ↺ {$t('replayChallenge')}
      </button>
    {:else}
      <p class="text-center text-sm text-slate-400">
        {$t('iconsLockedHint')}
      </p>
      <button
        class="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 text-lg font-bold active:scale-[0.98]"
        on:click={startChallenge}>⚔ {$t('takeChallenge')}</button>
    {/if}
  </section>

{:else if view === 'challenge' && person}
  {@const q = questions[qIndex]}
  <section class="space-y-4">
    <div class="flex items-center justify-between text-sm">
      <button class="text-slate-400" on:click={() => (view = 'detail')}>✕</button>
      <span class="text-slate-400">{qIndex + 1} / {questions.length}</span>
    </div>

    {#key exNonce}
      <div in:fly={{ y: 14, duration: 160 }}>
        <QuizQuestion
            prompt={q.show || ''}
            instruction={q.instruction[$settings.uiLang] || ''}
            options={q.options.map(o => ({ label: o.text || o[$settings.uiLang] || '', correct: o.correct }))}
            lesson={q.lesson}
            on:answer={(e) => onAnswer(e.detail.correct)}
            on:next={onNext}
        />
      </div>
    {/key}
  </section>

{:else if view === 'cleared' && person}
  <section class="grid place-items-center py-10 text-center" in:scale={{ start: 0.8, duration: 300 }}>
    <div class="h-40 w-40"><WikiImage title={person.wiki} /></div>
    <div class="mt-3 text-2xl">🌟</div>
    <div class="text-xl font-black">{person.name}</div>
    <div class="font-jp text-pink-300">{person.ja}</div>
    <div class="mt-1 text-sm text-slate-400">
      {$t('unlocked')} +{person.xp} XP
    </div>
    <div class="mt-5 flex gap-3">
      <button class="rounded-xl bg-indigo-500 px-5 py-3 font-semibold" on:click={() => person && openDetail(person)}>
        {$t('viewBio')}
      </button>
      <button class="rounded-xl bg-slate-700 px-5 py-3 font-semibold" on:click={() => (view = 'grid')}>
        {$t('back')}
      </button>
    </div>
  </section>
{/if}
