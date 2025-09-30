<script>
	import { CirclePlay, CircleCheck, BookOpen } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		title = '',
		description = '',
		difficulty = 'beginner',
		completed = false,
		onclick = /** @type {any} */(() => {})
	} = $props();

	/** @type {any} */
	const difficultyColors = {
		beginner: 'bg-green-100 text-green-800 border-green-300',
		intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
		advanced: 'bg-red-100 text-red-800 border-red-300'
	};

	/** @type {any} */
	const difficultyLabels = {
		beginner: () => m.lesson_difficulty_beginner(),
		intermediate: () => m.lesson_difficulty_intermediate(),
		advanced: () => m.lesson_difficulty_advanced()
	};

	// Función helper para obtener la etiqueta de dificultad de forma segura
	/**
	 * @param {string} difficulty
	 */
	function getDifficultyLabel(difficulty) {
		const labelFunction = difficultyLabels[difficulty];
		return labelFunction ? labelFunction() : difficulty;
	}
</script>

<div
	class="lesson-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200 overflow-hidden"
	role="button"
	tabindex="0"
	onclick={onclick}
	onkeydown={(e) => e.key === 'Enter' && onclick()}
>
	<div class="p-6 h-[calc(100%-4px)]">
		<div class="flex items-start justify-between mb-4">
			<div class="flex items-center gap-3">
				<BookOpen class="text-blue-500" size="24" />
				<h3 class="font-bold text-lg text-gray-800">{title}</h3>
			</div>

			{#if completed}
				<CircleCheck class="text-green-500 flex-shrink-0" size="24" />
			{:else}
				<CirclePlay class="text-blue-500 flex-shrink-0 group-hover:text-blue-600" size="24" />
			{/if}
		</div>

		<p class="text-gray-600 mb-4 leading-relaxed">{description}</p>

		<div class="flex items-center justify-between">
			<span class="px-3 py-1 rounded-full text-sm font-medium border {difficultyColors[difficulty]}">
				{getDifficultyLabel(difficulty)}
			</span>

			<button
				class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
				onclick={(e) => {
					e.stopPropagation();
					onclick();
				}}
			>
				{completed ? m.lesson_review() : m.lesson_start()}
			</button>
		</div>
	</div>

	{#if completed}
		<div class="h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
	{:else}
		<div class="h-1 bg-gradient-to-r from-blue-400 to-purple-600"></div>
	{/if}
</div>

<style>
	.lesson-card:hover {
		border-color: #3b82f6;
	}

	.lesson-card:focus {
		outline: none;
		box-shadow: 0 0 0 2px #3b82f6;
	}
</style>