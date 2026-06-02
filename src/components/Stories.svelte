<script lang="ts">
  import { settings, t } from '../lib/stores';
  import { STORIES, type Story } from '../lib/data/stories';
  import { speakJa } from '../lib/speech';
  import { confetti } from '../lib/confetti';
  import { fly, scale } from 'svelte/transition';

  type View = 'list' | 'read' | 'quiz' | 'done';
  let view: View = 'list';
  let story: Story | null = null;
  const it = () => $settings.uiLang === 'it';

  // Per-line reveal state for translations.
  let showTrans: Record<number, boolean> = {};
  function resetReveal() {
    showTrans = {};
  }

  let qIndex = 0;
  let picked: number | null = null;
  let correctCount = 0;

  function open(s: Story) {
    story = s;
    resetReveal();
    view = 'read';
  }
  function startQuiz() {
    qIndex = 0;
    picked = null;
    correctCount = 0;
    view = 'quiz';
  }
  function answer(i: number) {
    if (picked !== null || !story) return;
    picked = i;
    const correct = story.questions[qIndex].options[i].correct;
    if (correct) {
      correctCount++;
      confetti({ count: 50 });
    }
    setTimeout(() => {
      if (!story) return;
      if (qIndex + 1 >= story.questions.length) {
        view = 'done';
      } else {
        qIndex++;
        picked = null;
      }
    }, 900);
  }
</script>

{#if view === 'list'}
  <section in:fly={{ y: 12, duration: 180 }} class="space-y-3">
    <p class="text-sm text-slate-400">
      {it()
        ? 'Leggi una storia semplice, poi rispondi a domande su ciò che hai letto.'
        : 'Read a simple story, then answer questions about what you read.'}
    </p>
    {#each STORIES as s}
      <button
        class="flex w-full items-center gap-4 rounded-2xl bg-slate-800 p-4 text-left active:scale-[0.98]"
        on:click={() => open(s)}
      >
        <span class="text-4xl">{s.emoji}</span>
        <span class="flex-1">
          <span class="block font-semibold">{s.title[$settings.uiLang]}</span>
          <span class="text-xs text-slate-400">{s.level} · {s.lines.length} {it() ? 'frasi' : 'lines'}</span>
        </span>
        <span class="text-slate-500">›</span>
      </button>
    {/each}
  </section>

{:else if view === 'read' && story}
  <section in:fly={{ y: 12, duration: 180 }} class="space-y-4">
    <button class="text-sm text-slate-400" on:click={() => (view = 'list')}>← {$t('back')}</button>
    <div class="text-center">
      <div class="text-5xl">{story.emoji}</div>
      <h2 class="mt-2 text-xl font-bold">{story.title[$settings.uiLang]}</h2>
    </div>
    <div class="space-y-3">
      {#each story.lines as line, i}
        <div class="rounded-xl bg-slate-800 p-4">
          <div class="flex items-start gap-2">
            <div class="flex-1 font-jp text-lg">{line.jp}</div>
            <button class="shrink-0 rounded-lg bg-slate-700 px-2 py-1 text-sm" title="🔊" on:click={() => speakJa(line.reading)}>🔊</button>
          </div>
          <div class="mt-1 text-xs text-pink-300">{line.reading}</div>

          {#if showTrans[i]}
            <div class="mt-2 text-sm text-slate-300" in:fly={{ y: 4, duration: 120 }}>
              {$settings.uiLang === 'it' ? line.it : line.en}
            </div>
          {:else}
            <button
              class="mt-2 text-xs text-slate-500 underline"
              on:click={() => (showTrans = { ...showTrans, [i]: true })}
            >{it() ? 'Mostra traduzione' : 'Show translation'}</button>
          {/if}
        </div>
      {/each}
    </div>
    <button
      class="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 text-lg font-bold active:scale-[0.98]"
      on:click={startQuiz}
    >📝 {it() ? 'Rispondi alle domande' : 'Answer the questions'}</button>
  </section>

{:else if view === 'quiz' && story}
  <section class="space-y-4">
    <div class="flex items-center justify-between text-sm">
      <button class="text-slate-400" on:click={() => (view = 'read')}>← {it() ? 'Rileggi' : 'Reread'}</button>
      <span class="text-slate-400">{qIndex + 1} / {story.questions.length}</span>
    </div>
    {#key qIndex}
      <div in:fly={{ y: 14, duration: 160 }}>
        <div class="rounded-2xl bg-slate-800 p-5 text-center">
          <div class="text-lg font-medium">{story.questions[qIndex].q[$settings.uiLang]}</div>
        </div>
        <div class="mt-3 grid gap-2">
          {#each story.questions[qIndex].options as opt, i}
            <button
              disabled={picked !== null}
              class="rounded-xl px-4 py-3 text-left text-lg transition-colors
                {picked === i && opt.correct ? 'bg-green-600 text-white' : ''}
                {picked === i && !opt.correct ? 'bg-rose-700 text-white' : ''}
                {picked !== null && picked !== i && opt.correct ? 'bg-green-600/40' : ''}
                {picked === null ? 'bg-slate-800 active:bg-slate-700' : ''}"
              on:click={() => answer(i)}>{opt[$settings.uiLang]}</button>
          {/each}
        </div>
      </div>
    {/key}
  </section>

{:else if view === 'done' && story}
  <section class="grid place-items-center py-12 text-center" in:scale={{ start: 0.8, duration: 300 }}>
    <div class="text-6xl">{correctCount === story.questions.length ? '🏆' : '📖'}</div>
    <h2 class="mt-3 text-xl font-bold">
      {correctCount}/{story.questions.length} {it() ? 'corrette' : 'correct'}
    </h2>
    <div class="mt-5 flex gap-3">
      <button class="rounded-xl bg-indigo-500 px-5 py-3 font-semibold" on:click={() => { if (story) open(story); }}>
        {it() ? 'Rileggi' : 'Read again'}
      </button>
      <button class="rounded-xl bg-slate-700 px-5 py-3 font-semibold" on:click={() => (view = 'list')}>
        {it() ? 'Altre storie' : 'More stories'}
      </button>
    </div>
  </section>
{/if}
