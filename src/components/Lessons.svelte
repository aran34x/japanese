<script lang="ts">
  import { settings, t } from '../lib/stores';
  import {
    LESSONS,
    LESSON_CATEGORIES,
    lessonProgress,
    toggleLessonDone,
    markLessonDone,
    lessonSections,
    lessonQuiz,
    type AppLesson,
    type LessonCategory
  } from '../lib/lessons';
  import { fade, fly } from 'svelte/transition';

  type Mode = 'learn' | 'quiz' | 'result';
  type LearnItem =
    | { kind: 'text'; sectionNo: number; title: string; body: string }
    | { kind: 'example'; sectionNo: number; jp: string; reading: string; meaning: string }
    | { kind: 'note'; sectionNo: number; text: string };

  let activeLesson: AppLesson | null = null;
  let mode: Mode = 'learn';
  let sectionIndex = 0;
  let learnIndex = 0;
  let quizIndex = 0;
  let picked: number | null = null;
  let quizCorrect = 0;
  let selectedCategory: LessonCategory | null = null;
  const categoryOrder = ['foundation', 'particles', 'grammar', 'vocabulary', 'reading'] as LessonCategory[];

  $: completed = $lessonProgress.length;
  $: lessonsByCategory = categoryOrder
    .map((category) => ({
      category,
      lessons: LESSONS.filter((lesson) => lesson.category === category)
    }))
    .filter((group) => group.lessons.length > 0);
  $: selectedGroup = selectedCategory
    ? lessonsByCategory.find((group) => group.category === selectedCategory)
    : null;
  $: sections = activeLesson ? lessonSections(activeLesson) : [];
  $: quiz = activeLesson ? lessonQuiz(activeLesson) : [];
  $: learnItems = sections.flatMap((section, index): LearnItem[] => [
    {
      kind: 'text',
      sectionNo: index + 1,
      title: section.title[$settings.uiLang],
      body: section.body[$settings.uiLang]
    },
    ...(section.examples ?? []).map((ex) => ({
      kind: 'example' as const,
      sectionNo: index + 1,
      jp: ex.jp,
      reading: ex.reading,
      meaning: $settings.uiLang === 'it' ? ex.it : ex.en
    })),
    ...(section.note
      ? [{
          kind: 'note' as const,
          sectionNo: index + 1,
          text: section.note[$settings.uiLang]
        }]
      : [])
  ]);
  $: learnItem = learnItems[learnIndex];
  $: question = quiz[quizIndex];
  $: answered = picked !== null;
  $: passed = quizCorrect >= Math.ceil(quiz.length * 0.7);
  $: lessonDone = !!activeLesson && $lessonProgress.includes(activeLesson.id);

  function startLesson(lesson: AppLesson) {
    activeLesson = lesson;
    mode = 'learn';
    sectionIndex = 0;
    learnIndex = 0;
    quizIndex = 0;
    picked = null;
    quizCorrect = 0;
  }

  function closeLesson() {
    activeLesson = null;
    mode = 'learn';
    sectionIndex = 0;
    learnIndex = 0;
    picked = null;
    quizCorrect = 0;
  }

  function toggleActiveLessonDone() {
    if (activeLesson) void toggleLessonDone(activeLesson.id);
  }

  function nextLearnItem() {
    if (learnIndex + 1 < learnItems.length) {
      learnIndex++;
      const item = learnItems[learnIndex];
      sectionIndex = item ? item.sectionNo - 1 : sectionIndex;
      return;
    }
    mode = 'quiz';
    quizIndex = 0;
    picked = null;
    quizCorrect = 0;
  }

  function chooseAnswer(i: number) {
    if (picked !== null || !question) return;
    picked = i;
    if (question.options[i]?.correct) quizCorrect++;
  }

  async function nextQuestion() {
    if (quizIndex + 1 < quiz.length) {
      quizIndex++;
      picked = null;
      return;
    }

    mode = 'result';
    if (passed && activeLesson && !$lessonProgress.includes(activeLesson.id)) {
      await markLessonDone(activeLesson.id);
    }
  }
</script>

<div class="lessons-shell min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
  {#if !activeLesson}
    <div class="lesson-menu min-h-full px-5 py-8">
      <section class="mx-auto flex min-h-full max-w-sm flex-col" in:fly={{ y: 16, duration: 220 }}>
        <div class="pt-8 text-center">
          <div class="lesson-kicker">{$t('lessons')}</div>
          <h1 class="mt-3 text-3xl font-black tracking-tight">{$t('lessonsMenuTitle')}</h1>
          <p class="mx-auto mt-3 max-w-xs text-sm leading-6 opacity-70">{$t('lessonsMenuIntro')}</p>
        </div>

        {#if !selectedGroup}
          <div class="mt-10 space-y-3">
            {#each lessonsByCategory as group}
              {@const doneCount = group.lessons.filter((lesson) => $lessonProgress.includes(lesson.id)).length}
              {@const missingCount = group.lessons.length - doneCount}
              <button
                class="lesson-row category-row"
                on:click={() => (selectedCategory = group.category)}
              >
                <span class="min-w-0">
                  <span class="block truncate text-base font-black">
                    {LESSON_CATEGORIES[group.category].label[$settings.uiLang]}
                  </span>
                  <span class="mt-1 block text-xs font-bold opacity-55">
                    {missingCount ? `${missingCount} ${$t('missingLessons')}` : $t('categoryComplete')}
                  </span>
                </span>
                <span class="lesson-row-mark {missingCount === 0 ? 'done' : ''}">
                  {missingCount === 0 ? '✓' : missingCount}
                </span>
              </button>
            {/each}
          </div>
        {:else}
          <div class="mt-8">
            <button class="soft-pill" on:click={() => (selectedCategory = null)}>
              ← {$t('lessonCategories')}
            </button>
            <div class="lesson-category-title mt-7">
              <span>{LESSON_CATEGORIES[selectedGroup.category].label[$settings.uiLang]}</span>
            </div>
            <div class="mt-3 space-y-3">
              {#each selectedGroup.lessons as lesson}
                {@const done = $lessonProgress.includes(lesson.id)}
                <button
                  class="lesson-row"
                  on:click={() => startLesson(lesson)}
                >
                  <span class="min-w-0">
                    <span class="block truncate text-base font-black">{lesson.title[$settings.uiLang]}</span>
                    <span class="mt-1 block text-xs font-bold {done ? 'text-green-300' : 'text-amber-300'}">
                      {done ? $t('completed') : $t('missingLesson')}
                    </span>
                  </span>
                  <span class="lesson-row-mark {done ? 'done' : 'missing'}">
                    {done ? '✓' : '!'}
                  </span>
                </button>
              {/each}
            </div>
          </div>
        {/if}

        <div class="mt-auto pt-8 text-center text-xs opacity-55">
          {completed}/{LESSONS.length} {$t('completed')}
        </div>
      </section>
    </div>
  {:else}
    <section class="lesson-player relative flex min-h-full flex-col px-5 py-5" transition:fade={{ duration: 160 }}>
      <div class="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-md flex-1 flex-col">
        <div class="flex items-center justify-between gap-3">
          <button class="soft-pill" on:click={closeLesson}>
            ← {$t('lessons')}
          </button>
          {#if lessonDone}
            <button class="soft-pill complete" on:click={toggleActiveLessonDone}>
              ✓ {$t('markIncomplete')}
            </button>
          {/if}
        </div>

        <div class="lesson-header-panel mt-5">
          <div class="lesson-kicker">
            {activeLesson.level}
          </div>
          <h2 class="mt-2 text-2xl font-black leading-tight">{activeLesson.title[$settings.uiLang]}</h2>
        </div>

        {#if mode === 'learn' && learnItem}
          <div class="progress-track mt-5">
            <div class="progress-fill" style="width:{((learnIndex + 1) / learnItems.length) * 100}%"></div>
          </div>

          {#key activeLesson.id + ':' + learnIndex}
            <div class="lesson-step-panel flex flex-1 flex-col justify-center" in:fly={{ y: 28, duration: 280 }}>
              {#if learnItem.kind === 'text'}
                <div class="text-xs font-bold uppercase tracking-[0.22em] opacity-50">
                  {$t('lessonPart')} {learnItem.sectionNo}/{sections.length}
                </div>
                <h3 class="mt-4 text-3xl font-black leading-tight">{learnItem.title}</h3>
                <p class="mt-6 text-xl leading-9 opacity-90">{learnItem.body}</p>
              {:else if learnItem.kind === 'example'}
                <div class="lesson-kicker">{$t('examples')}</div>
                <div class="example-block mt-5 rounded-3xl p-5">
                  <div class="font-jp text-4xl leading-tight">{learnItem.jp}</div>
                  <div class="mt-4 text-base font-bold accent-text">{learnItem.reading}</div>
                  <div class="mt-5 text-xl leading-8 opacity-85">{learnItem.meaning}</div>
                </div>
              {:else}
                <div class="lesson-kicker">{$t('lessonNote')}</div>
                <div class="soft-note mt-5 rounded-3xl p-5 text-xl leading-9">
                  {learnItem.text}
                </div>
              {/if}
            </div>
          {/key}

          <button
            class="primary-action relative z-10 mb-1 w-full"
            on:click={nextLearnItem}
          >
            {learnIndex + 1 < learnItems.length ? $t('continueLesson') : $t('startLessonQuiz')}
          </button>
        {:else if mode === 'quiz' && question}
          <div class="progress-track mt-5">
            <div class="progress-fill" style="width:{((quizIndex + 1) / quiz.length) * 100}%"></div>
          </div>

          {#key activeLesson.id + ':quiz:' + quizIndex}
            <div class="lesson-step-panel flex flex-1 flex-col justify-center" in:fly={{ y: 28, duration: 240 }}>
              <div class="text-xs font-bold uppercase tracking-[0.22em] opacity-50">
                {$t('lessonQuiz')} {quizIndex + 1}/{quiz.length}
              </div>
              <h3 class="mt-4 text-3xl font-black leading-tight">{question.prompt[$settings.uiLang]}</h3>

              <div class="mt-7 grid gap-3">
                {#each question.options as opt, i}
                  <button
                    class="quiz-choice
                      {answered && opt.correct ? 'correct' : ''}
                      {answered && !opt.correct && picked === i ? 'wrong' : ''}
                      {answered && !opt.correct && picked !== i ? 'dimmed' : ''}"
                    disabled={answered}
                    on:click={() => chooseAnswer(i)}
                  >
                    {opt.label[$settings.uiLang]}
                  </button>
                {/each}
              </div>

              {#if answered}
                <div class="soft-surface mt-5 rounded-3xl p-4 text-sm leading-6 opacity-85">
                  {question.explanation[$settings.uiLang]}
                </div>
              {/if}
            </div>
          {/key}

          {#if answered}
            <button class="primary-action relative z-10 mb-1 w-full" on:click={nextQuestion}>
              {quizIndex + 1 < quiz.length ? $t('next') : $t('finishQuiz')}
            </button>
          {/if}
        {:else}
          <div class="lesson-step-panel flex flex-1 flex-col items-center justify-center text-center" in:fly={{ y: 24, duration: 260 }}>
            <div class="result-mark {passed ? 'passed' : ''}">
              {passed ? '✓' : '!'}
            </div>
            <h3 class="mt-6 text-3xl font-black">{passed ? $t('lessonPassed') : $t('lessonRetryTitle')}</h3>
            <p class="mt-3 max-w-xs text-sm leading-6 opacity-65">
              {passed ? $t('lessonCompleteBody') : `${quizCorrect}/${quiz.length} ${$t('correctCount')}`}
            </p>
            <div class="mt-8 grid w-full gap-3">
              {#if passed}
                <button class="primary-action" on:click={closeLesson}>
                  {$t('returnToLessons')}
                </button>
              {:else}
                <button
                    class="primary-action"
                  on:click={() => {
                    mode = 'quiz';
                    quizIndex = 0;
                    picked = null;
                    quizCorrect = 0;
                  }}
                >
                  {$t('retryQuiz')}
                </button>
                <button class="soft-action" on:click={() => {
                  mode = 'learn';
                  sectionIndex = 0;
                  learnIndex = 0;
                }}>
                  {$t('readLessonAgain')}
                </button>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </section>
  {/if}
</div>

<style>
  .lessons-shell {
    color: inherit;
  }

  .lesson-kicker {
    color: var(--accent-text);
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  .lesson-category-title {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0 0.25rem;
    color: var(--accent-text);
    font-size: 0.78rem;
    font-weight: 950;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .lesson-row {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-radius: 18px;
    border: 1px solid var(--box-border);
    background: var(--box-bg);
    backdrop-filter: var(--box-backdrop);
    -webkit-backdrop-filter: var(--box-backdrop);
    padding: 1.1rem 1.15rem;
    text-align: left;
    box-shadow: 0 12px 36px color-mix(in srgb, var(--text) 5%, transparent);
    transition: transform 140ms ease, background 140ms ease;
  }

  .lesson-row:active {
    transform: scale(0.985);
    background: var(--hover);
  }

  .lesson-row-mark {
    display: grid;
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
    place-items: center;
    border-radius: 999px;
    background: var(--box-bg-2);
    color: var(--text-muted);
    font-size: 0.75rem;
    font-weight: 900;
  }

  .lesson-row-mark.done,
  .result-mark.passed {
    background: var(--success);
    color: var(--on-accent);
  }

  .lesson-row-mark.missing {
    background: var(--warning-bg);
    color: var(--warning);
  }

  .soft-pill,
  .soft-action {
    border-radius: 999px;
    border: 1px solid var(--box-border);
    background: var(--box-bg);
    backdrop-filter: var(--box-backdrop);
    -webkit-backdrop-filter: var(--box-backdrop);
    padding: 0.55rem 0.9rem;
    color: inherit;
    font-size: 0.86rem;
    font-weight: 900;
  }

  .soft-pill.complete {
    color: var(--success);
    border-color: var(--success);
    background: var(--success-bg);
  }

  .progress-track {
    height: 0.38rem;
    overflow: hidden;
    border-radius: 999px;
    background: var(--box-bg-2);
  }

  .progress-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    transition: width 220ms ease;
  }

  .soft-surface,
  .quiz-choice {
    border: 1px solid var(--box-border);
    background: var(--box-bg);
    backdrop-filter: var(--box-backdrop);
    -webkit-backdrop-filter: var(--box-backdrop);
    box-shadow: 0 14px 40px color-mix(in srgb, var(--text) 4%, transparent);
  }

  .soft-note {
    border: 1px solid var(--warning);
    background: var(--warning-bg);
    color: inherit;
  }

  .accent-text {
    color: var(--accent-text);
  }

  .quiz-choice {
    border-radius: 18px;
    padding: 0.85rem 1rem;
    text-align: left;
    color: inherit;
    transition: transform 130ms ease, background 130ms ease, opacity 130ms ease;
  }

  .primary-action {
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    color: var(--on-accent);
  }

  .quiz-choice {
    width: 100%;
    font-size: 1rem;
    font-weight: 800;
  }

  .quiz-choice:active {
    transform: scale(0.985);
  }

  .quiz-choice.correct {
    background: var(--success);
    color: var(--on-accent);
  }

  .quiz-choice.wrong {
    background: var(--danger-solid);
    color: var(--on-accent);
  }

  .quiz-choice.dimmed {
    opacity: 0.42;
  }

  .primary-action,
  .soft-action {
    border-radius: 18px;
    padding: 1rem;
    font-weight: 950;
  }

  .primary-action {
    box-shadow: 0 14px 34px color-mix(in srgb, var(--accent) 24%, transparent);
  }

  .soft-action {
    background: var(--box-bg-2);
  }

  .result-mark {
    display: grid;
    width: 6rem;
    height: 6rem;
    place-items: center;
    border-radius: 999px;
    background: var(--warning);
    color: var(--on-accent);
    font-size: 3rem;
    font-weight: 950;
    box-shadow: 0 18px 44px color-mix(in srgb, var(--text) 12%, transparent);
  }

  @media (min-width: 768px) {
    .lesson-menu > section,
    .lesson-player > div {
      max-width: 420px;
    }
  }
</style>
