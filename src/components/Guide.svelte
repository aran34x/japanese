<script lang="ts">
  import { t } from '../lib/stores';
  import { fly } from 'svelte/transition';
  import { TAEKIM, bookProgress, toggleChapterRead, markChapterRead, guideTarget, type BookChapter } from '../lib/book';

  type View = 'list' | 'read';
  let view: View = 'list';
  let chapter: BookChapter | null = null;

  $: read = (id: string) => $bookProgress.includes(id);
  $: groups = TAEKIM.groups.map((g) => ({
    ...g,
    chapters: TAEKIM.chapters.filter((c) => c.group === g.id)
  }));
  $: doneCount = $bookProgress.filter((id) => TAEKIM.chapters.some((c) => c.id === id)).length;

  function open(c: BookChapter) {
    chapter = c;
    view = 'read';
    // Reading a chapter for a few seconds counts as read.
    setTimeout(() => { if (chapter?.id === c.id) void markChapterRead(c.id); }, 4000);
    window.scrollTo?.({ top: 0 });
  }

  // Deep-link from a Lesson's "Read the full chapter" button.
  $: if ($guideTarget) {
    const target = TAEKIM.chapters.find((c) => c.id === $guideTarget);
    guideTarget.set(null);
    if (target) open(target);
  }
</script>

<div class="flex-1 overflow-y-auto overflow-x-hidden">
  <div class="mx-auto max-w-3xl px-4 py-8">
    {#if view === 'list'}
      <section in:fly={{ y: 12, duration: 180 }} class="space-y-6">
        <header class="text-center">
          <div class="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{$t('guide')}</div>
          <h2 class="mt-1 text-2xl font-black">{TAEKIM.title}</h2>
          <p class="mt-2 text-sm text-slate-400">{$t('guideIntro')}</p>
          <p class="mt-1 text-xs text-slate-500">{doneCount}/{TAEKIM.chapters.length} {$t('chaptersRead')}</p>
        </header>

        {#each groups as g (g.id)}
          <div>
            <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{g.label}</h3>
            <div class="space-y-2">
              {#each g.chapters as c (c.id)}
                <button
                  class="flex w-full items-center gap-3 rounded-2xl bg-slate-800 p-4 text-left active:scale-[0.99]"
                  on:click={() => open(c)}
                >
                  <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 font-jp text-lg">
                    {read(c.id) ? '✓' : (c.jpTitle?.[0] ?? '本')}
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block font-semibold">{c.title}</span>
                    <span class="block text-xs text-slate-400">
                      {c.level}{#if c.jpTitle} · <span class="font-jp">{c.jpTitle}</span>{/if}
                    </span>
                  </span>
                  <span class="text-slate-500">›</span>
                </button>
              {/each}
            </div>
          </div>
        {/each}

        <p class="pt-2 text-center text-[11px] leading-5 text-slate-500">
          {$t('bookSource')}: {TAEKIM.author} — “{TAEKIM.title}” · {TAEKIM.license}
        </p>
      </section>

    {:else if chapter}
      <article in:fly={{ y: 12, duration: 180 }} class="space-y-6">
        <button class="text-sm text-slate-400" on:click={() => (view = 'list')}>← {$t('guide')}</button>

        <header>
          <div class="text-xs font-bold uppercase tracking-wide text-slate-400">{chapter.level}</div>
          <h2 class="mt-1 text-3xl font-black leading-tight">{chapter.title}</h2>
          {#if chapter.jpTitle}<div class="mt-1 font-jp text-lg text-pink-300">{chapter.jpTitle}</div>{/if}
        </header>

        {#each chapter.sections as section}
          <section class="space-y-3">
            <h3 class="text-lg font-bold text-slate-200">{section.heading}</h3>
            {#each section.blocks as block}
              {#if block.type === 'p'}
                <p class="text-[15px] leading-7 text-slate-300">{block.en}</p>
              {:else if block.type === 'note'}
                <div class="rounded-xl bg-amber-500/15 p-3 text-sm leading-6 text-amber-200">💡 {block.en}</div>
              {:else if block.type === 'example'}
                <div class="space-y-2 rounded-2xl bg-slate-800 p-4">
                  {#each block.items as ex}
                    <div class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span class="font-jp text-2xl leading-snug">{ex.jp}</span>
                      {#if ex.reading}<span class="text-sm font-semibold text-pink-300">{ex.reading}</span>{/if}
                      <span class="text-sm text-slate-400">— {ex.en}</span>
                    </div>
                  {/each}
                </div>
              {:else if block.type === 'table'}
                <div class="overflow-x-auto rounded-2xl bg-slate-800 p-2">
                  <table class="w-full text-center font-jp">
                    <thead>
                      <tr>{#each block.head as h}<th class="p-1 text-xs font-bold text-slate-400">{h}</th>{/each}</tr>
                    </thead>
                    <tbody>
                      {#each block.rows as row}
                        <tr>{#each row as cell, i}<td class="p-1 {i === 0 ? 'text-xs text-slate-500' : 'text-lg'}">{cell}</td>{/each}</tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}
            {/each}
          </section>
        {/each}

        <div class="flex flex-col gap-2 border-t border-slate-700 pt-5">
          <button
            class="w-full rounded-xl py-3 font-semibold {read(chapter.id) ? 'bg-slate-800 text-slate-300' : 'bg-indigo-500'}"
            on:click={() => chapter && toggleChapterRead(chapter.id)}
          >
            {read(chapter.id) ? '✓ ' + $t('markIncomplete') : $t('markRead')}
          </button>
          <p class="text-center text-[11px] leading-5 text-slate-500">
            {$t('bookSource')}: {TAEKIM.author} — “{TAEKIM.title}” · {TAEKIM.license}
          </p>
        </div>
      </article>
    {/if}
  </div>
</div>
