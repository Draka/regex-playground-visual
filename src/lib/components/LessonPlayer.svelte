<script>
	import RegexEngine from './RegexEngine.svelte';
	import RegexDangerIndicator from './RegexDangerIndicator.svelte';
	import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, Lightbulb } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		lesson = null,
		onComplete = (/** @type {any} */ _id) => {},
		onBack = /** @type {any} */(() => {})
	} = $props();

	let currentStepIndex = $state(0);
	let showTips = $state(false);

	let currentStep = $derived(lesson?.steps[currentStepIndex]);

	function nextStep() {
		if (lesson && currentStepIndex < lesson.steps.length - 1) {
			currentStepIndex++;
			showTips = false;
		} else if (lesson) {
			onComplete(lesson.id);
		}
	}

	function prevStep() {
		if (currentStepIndex > 0) {
			currentStepIndex--;
			showTips = false;
		}
	}

	function resetStep() {
		// Trigger a re-render of the RegexEngine
		if (currentStep) {
			currentStep = { ...currentStep };
		}
	}

	function toggleTips() {
		showTips = !showTips;
	}
</script>
<div class="py-6">
{#if lesson && currentStep}
	<div class=" rounded bg-white/40 max-w-6xl mx-auto p-6 border border-stone-300">
		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<button
				onclick={onBack}
				class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
			>
				<ChevronLeft size="20" />
				{m.back_to_lessons()}
			</button>

			<div class="text-center">
				<h1 class="text-2xl font-bold text-gray-800">{lesson.title}</h1>
				<p class="text-sm text-gray-600 mt-1">
					{m.step_of({ current: currentStepIndex + 1, total: lesson.steps.length })}
				</p>
			</div>

			<div class="w-32"></div> <!-- Spacer -->
		</div>

		<!-- Progress bar -->
		<div class="mb-8">
			<div class="bg-gray-200 rounded-full h-2">
				<div
					class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
					style="width: {((currentStepIndex + 1) / lesson.steps.length) * 100}%"
				></div>
			</div>
		</div>

		<!-- Step content -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Explanation panel -->
			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
				<h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
					<span class="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
						{currentStepIndex + 1}
					</span>
					{currentStep.title}
				</h2>

				<div class="prose prose-gray max-w-none">
					{@html currentStep.explanation.replace(/\n/g, '<br>')}
				</div>

				<!-- Pattern showcase -->
				<div class="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
					<h3 class="font-semibold text-gray-700 mb-2">{m.pattern_to_use()}</h3>
					<code class="text-lg font-mono bg-blue-100 text-blue-800 px-3 py-2 rounded border">
						{currentStep.pattern}
					</code>

					<!-- Danger indicator for lesson 7 -->
					{#if currentStep.dangerLevel}
						<div class="mt-4">
							<RegexDangerIndicator pattern={currentStep.pattern} showDetails={true} />
						</div>
					{/if}
				</div>

				<!-- Tips button -->
				<button
					onclick={toggleTips}
					class="mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors border border-yellow-300"
				>
					<Lightbulb size="16" />
					{showTips ? m.hide_tips() : m.view_tips()}
				</button>

				{#if showTips}
					<div class="mt-4 space-y-2">
						{#each currentStep.tips as tip}
							<div class="flex items-start gap-2 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
								<CheckCircle size="16" class="text-yellow-600 mt-0.5 flex-shrink-0" />
								<p class="text-sm text-yellow-800">{tip}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Regex engine panel -->
			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-800">{m.try_here()}</h3>
					<button
						onclick={resetStep}
						class="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
					>
						<RotateCcw size="16" />
						{m.restart()}
					</button>
				</div>

				<RegexEngine
					pattern={currentStep.pattern}
					text={currentStep.testText}
					speed={800}
					expectedMatches={currentStep.expectedMatches}
					showValidation={true}
					flags={currentStep.flags || 'g'}
				/>

				<div class="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
					<p class="text-sm text-green-800">
						<strong>{m.goal()}</strong> {m.goal_description({ count: currentStep.expectedMatches })}
					</p>
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<div class="mt-8 pt-6 border-t border-gray-200">
			<!-- Progress indicators -->
			<div class="flex justify-center gap-2 mb-6">
				{#each lesson.steps as _, index}
					<div
						class="w-3 h-3 rounded-full transition-colors {index === currentStepIndex ? 'bg-blue-500' : index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}"
					></div>
				{/each}
			</div>

			<!-- Buttons -->
			<div class="flex items-center justify-between gap-4">
				<button
					onclick={prevStep}
					disabled={currentStepIndex === 0}
					class="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors text-sm sm:text-base"
				>
					<ChevronLeft size="16" class="sm:hidden" />
					<ChevronLeft size="20" class="hidden sm:block" />
					<span class="hidden sm:inline">{m.previous()}</span>
					<span class="sm:hidden">Ant.</span>
				</button>

				<button
					onclick={nextStep}
					class="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base"
				>
					<span class="hidden sm:inline">{currentStepIndex === lesson.steps.length - 1 ? m.complete() : m.next()}</span>
					<span class="sm:hidden">{currentStepIndex === lesson.steps.length - 1 ? 'Fin' : 'Sig.'}</span>
					{#if currentStepIndex === lesson.steps.length - 1}
						<CheckCircle size="16" class="sm:hidden" />
						<CheckCircle size="20" class="hidden sm:block" />
					{:else}
						<ChevronRight size="16" class="sm:hidden" />
						<ChevronRight size="20" class="hidden sm:block" />
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
</div>