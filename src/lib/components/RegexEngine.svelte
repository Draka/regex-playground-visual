<script>
	// import { motion } from 'motion'; // No usado por ahora
	import * as TWEEN from '@tweenjs/tween.js';
	import { onMount } from 'svelte';
	import { testLessonStep } from '$lib/utils/lessonTester.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		pattern = '',
		text = '',
		speed = 1000,
		expectedMatches = null,
		showValidation = true,
		flags = 'g'
	} = $props();

	let matches = $state([]);
	let currentStep = $state(0);
	let isAnimating = $state(false);
	let validationResult = $state(null);
	// let animationElements = $state([]); // No usado por ahora

	// Función para ejecutar el motor de regex paso a paso
	function executeRegexStepByStep(pattern, text) {
		if (!pattern || !text) return [];

		try {
			// Asegurar que siempre incluye 'g' para iterar sobre todas las coincidencias
			const flagsToUse = flags.includes('g') ? flags : flags + 'g';
			const regex = new RegExp(pattern, flagsToUse);
			const steps = [];
			let match;
			let lastIndex = 0;

			while ((match = regex.exec(text)) !== null) {
				steps.push({
					match: match[0],
					index: match.index,
					length: match[0].length,
					groups: match.slice(1),
					step: steps.length + 1
				});

				// Evitar bucles infinitos con matches de longitud 0
				if (match.index === regex.lastIndex) {
					regex.lastIndex++;
				}
			}

			return steps;
		} catch (error) {
			console.error('Error en regex:', error);
			return [];
		}
	}

	// Función para animar los matches paso a paso
	async function animateMatches() {
		if (isAnimating) return;

		isAnimating = true;
		currentStep = 0;
		matches = executeRegexStepByStep(pattern, text);

		for (let i = 0; i < matches.length; i++) {
			currentStep = i + 1;
			await new Promise(resolve => setTimeout(resolve, speed));
		}

		isAnimating = false;
		validateResults();
	}

	// Validar cuando se complete la animación
	function validateResults() {
		if (expectedMatches !== null && matches.length > 0) {
			const mockStep = {
				pattern,
				testText: text,
				expectedMatches,
				flags
			};
			validationResult = testLessonStep(mockStep);
		}
	}

	// Resetear cuando cambie el pattern o texto
	$effect(() => {
		if (pattern || text) {
			currentStep = 0;
			matches = [];
			validationResult = null;
		}
	});

	// Función para highlight del texto
	function getHighlightedText(text, matches, currentStep) {
		if (!text || matches.length === 0 || currentStep === 0) {
			return [{ text, type: 'normal' }];
		}

		const result = [];
		let lastIndex = 0;

		// Solo mostrar matches hasta el step actual
		const visibleMatches = matches.slice(0, currentStep);

		visibleMatches.forEach((match, index) => {
			// Texto antes del match
			if (match.index > lastIndex) {
				result.push({
					text: text.slice(lastIndex, match.index),
					type: 'normal'
				});
			}

			// El match actual
			result.push({
				text: match.match,
				type: 'match',
				step: match.step,
				isLatest: index === currentStep - 1
			});

			lastIndex = match.index + match.length;
		});

		// Texto después del último match
		if (lastIndex < text.length) {
			result.push({
				text: text.slice(lastIndex),
				type: 'normal'
			});
		}

		return result;
	}

	let highlightedText = $derived(getHighlightedText(text, matches, currentStep));
</script>

<div class="regex-engine">
	<div class="controls mb-6">
		<button
			onclick={animateMatches}
			disabled={isAnimating || !pattern || !text}
			class="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
		>
			{isAnimating ? m.animating() : m.execute_regex()}
		</button>

		{#if matches.length > 0}
			<div class="mt-4 text-sm text-gray-600">
				{m.step_progress({ current: currentStep, total: matches.length, matches: matches.length })}
			</div>
		{/if}

		<!-- Validación automática -->
		{#if showValidation && validationResult && expectedMatches !== null}
			<div class="mt-4 p-3 rounded-lg border {validationResult.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
				{#if validationResult.passed}
					<div class="flex items-center gap-2 text-green-700">
						<span class="text-green-500">✅</span>
						<span class="font-medium">{m.validation_perfect()}</span>
						<span>{m.validation_perfect_description({ count: expectedMatches })}</span>
					</div>
				{:else}
					<div class="flex items-center gap-2 text-red-700">
						<span class="text-red-500">❌</span>
						<span class="font-medium">{m.validation_error()}</span>
					</div>
					<div class="text-red-600 text-sm mt-1">
						{m.validation_error_description({ expected: expectedMatches, actual: validationResult.actual })}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="text-display bg-gray-50 p-6 rounded-lg border-2 border-gray-200 font-mono text-lg leading-relaxed">
		{#each highlightedText as segment, i}
			{#if segment.type === 'match'}
				<span
					class="match {segment.isLatest ? 'latest' : ''}"
					style="--step: {segment.step}"
				>
					{segment.text}
				</span>
			{:else}
				<span class="normal">{segment.text}</span>
			{/if}
		{/each}
	</div>

	{#if matches.length > 0}
		<div class="matches-info mt-6">
			<h3 class="text-lg font-semibold mb-3">{m.matches_details()}</h3>
			<div class="space-y-2">
				{#each matches.slice(0, currentStep) as match, i}
					<div class="match-detail bg-white p-3 rounded border border-gray-200 {i === currentStep - 1 ? 'ring-2 ring-blue-500' : ''}">
						<div class="flex items-center gap-4">
							<span class="step-number bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
								{match.step}
							</span>
							<span class="match-text font-mono bg-yellow-100 px-2 py-1 rounded">
								"{match.match}"
							</span>
							<span class="match-position text-sm text-gray-600">
								{m.position({ start: match.index, end: match.index + match.length - 1 })}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.match {
		background: linear-gradient(120deg, #fef3c7, #fbbf24);
		padding: 2px 4px;
		border-radius: 4px;
		border: 1px solid #f59e0b;
		animation: highlight 0.6s ease-in-out;
		position: relative;
	}

	.match.latest {
		background: linear-gradient(120deg, #dbeafe, #3b82f6);
		border-color: #2563eb;
		animation: pulse 0.8s ease-in-out infinite alternate;
	}

	.normal {
		color: #374151;
	}

	@keyframes highlight {
		0% {
			background: transparent;
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			background: linear-gradient(120deg, #fef3c7, #fbbf24);
			transform: scale(1);
		}
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
		}
		100% {
			box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
		}
	}

	.text-display {
		min-height: 120px;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.match-detail {
		transition: all 0.3s ease;
	}

	.controls button {
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
</style>