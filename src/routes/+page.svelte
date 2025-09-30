<script>
	import { onMount } from 'svelte';
	import LessonCard from '$lib/components/LessonCard.svelte';
	import LessonPlayer from '$lib/components/LessonPlayer.svelte';
	import LanguageSelector from '$lib/components/LanguageSelector.svelte';
	import { getLessons } from '$lib/lessons/index.js';
	import { Zap, BookOpen, Trophy, Sparkles, Play, Gamepad2 } from 'lucide-svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import { page } from '$app/state';

	let currentView = $state('home'); // 'home', 'lesson'
	let currentLesson = $state(null);
	let completedLessons = $state(new Set());

	// Obtener idioma actual desde Paraglide
	let lessons = $derived(getLessons(getLocale()));

	/**
	 * @param {null} lesson
	 */
	function startLesson(lesson) {
		currentLesson = lesson;
		currentView = 'lesson';
	}

	/**
	 * @param {any} lessonId
	 */
	function completeLesson(lessonId) {
		completedLessons.add(lessonId);
		currentView = 'home';
		currentLesson = null;
	}

	function goHome() {
		currentView = 'home';
		currentLesson = null;
	}
</script>

<svelte:head>
	<title>{m.app_title()}</title>
	<meta name="description" content={m.app_subtitle()} />
	<meta
		name="keywords"
		content="regex, regular expressions, learn, tutorial, visual, interactive, lessons, playground"
	/>
	<meta property="og:title" content={m.app_title()} />
	<meta property="og:description" content={m.app_subtitle()} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={m.app_title()} />
	<meta name="twitter:description" content={m.app_subtitle()} />
	<link rel="canonical" href="/" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
	{#if currentView === 'home'}
		<!-- Hero Section -->
		<div class="relative overflow-hidden">
			<div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
			<div class="relative mx-auto max-w-7xl px-6 py-16">
				<!-- Language Selector -->
				<div class="absolute top-4 right-6">
					<LanguageSelector />
				</div>
				<div class="text-center">
					<div class="mb-6 flex items-center justify-center gap-3">
						<Zap class="text-blue-500" size="48" />
						<h1
							class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent"
						>
							{m.app_title()}
						</h1>
						<Sparkles class="text-purple-500" size="48" />
					</div>

					<p class="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600">
						{m.app_subtitle()}
					</p>

					<div class="mb-8 flex items-center justify-center gap-8 text-sm text-gray-500">
						<div class="flex items-center gap-2">
							<BookOpen size="20" class="text-blue-500" />
							<span>{m.features_interactive_lessons()}</span>
						</div>
						<div class="flex items-center gap-2">
							<Zap size="20" class="text-yellow-500" />
							<span>{m.features_realtime_animations()}</span>
						</div>
						<div class="flex items-center gap-2">
							<Trophy size="20" class="text-green-500" />
							<span>{m.features_gamified_progress()}</span>
						</div>
					</div>

					<!-- Quick Actions -->
					<div class="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
						<a
							href={localizeHref('/playground')}
							class="flex transform items-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
						>
							<Play size="24" />
							{m.playground_interactive()}
						</a>
						<button
							onclick={() => {
								document.getElementById('lessons-section')?.scrollIntoView({ behavior: 'smooth' });
							}}
							class="flex transform items-center gap-3 rounded-xl border border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-xl"
						>
							<BookOpen size="24" />
							{m.guided_lessons()}
						</button>
						<a
							href={localizeHref('/games')}
							class="flex transform items-center gap-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl"
						>
							<Gamepad2 size="24" />
							🎮 {getLocale() === 'es' ? 'Mini-Juegos' : 'Mini-Games'}
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Lessons Section -->
		<div id="lessons-section" class="mx-auto max-w-6xl px-6 py-12">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-800">{m.start_adventure()}</h2>
				<p class="text-lg text-gray-600">
					{m.start_adventure_subtitle()}
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each lessons as lesson}
					<LessonCard
						title={lesson.title}
						description={lesson.description}
						difficulty={lesson.difficulty}
						completed={completedLessons.has(lesson.id)}
						onclick={() => startLesson(lesson)}
					/>
				{/each}
			</div>
		</div>

		<!-- Stats Section -->
		{#if completedLessons.size > 0}
			<div class="mx-auto max-w-4xl px-6 py-12">
				<div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
					<h3 class="mb-6 text-center text-2xl font-bold text-gray-800">{m.progress_title()}</h3>
					<div class="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
						<div class="rounded-lg border border-green-200 bg-green-50 p-4">
							<div class="text-3xl font-bold text-green-600">{completedLessons.size}</div>
							<div class="font-medium text-green-700">{m.progress_lessons_completed()}</div>
						</div>
						<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
							<div class="text-3xl font-bold text-blue-600">
								{Math.round((completedLessons.size / lessons.length) * 100)}%
							</div>
							<div class="font-medium text-blue-700">{m.progress_total_progress()}</div>
						</div>
						<div class="rounded-lg border border-purple-200 bg-purple-50 p-4">
							<div class="text-3xl font-bold text-purple-600">🌟</div>
							<div class="font-medium text-purple-700">{m.progress_keep_going()}</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{:else if currentView === 'lesson' && currentLesson}
		<LessonPlayer lesson={currentLesson} onComplete={completeLesson} onBack={goHome} />
	{/if}
</div>
