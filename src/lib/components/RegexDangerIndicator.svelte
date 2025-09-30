<script>
	import { AlertTriangle, Shield, Skull, Info, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { analyzeRegexDanger, formatDangerAnalysis } from '$lib/utils/regexDangerAnalyzer.js';
	import { slide } from 'svelte/transition';

	let { pattern = '', showDetails = false } = $props();

	let expanded = $state(false);
	let analysis = $derived(pattern ? analyzeRegexDanger(pattern) : null);
	let formatted = $derived(analysis ? formatDangerAnalysis(analysis) : null);

	// Iconos según el nivel de peligro
	const dangerIcons = {
		safe: Shield,
		low: Info,
		medium: AlertTriangle,
		high: AlertTriangle,
		critical: Skull
	};

	// Colores según el nivel de peligro
	const dangerStyles = {
		safe: 'bg-green-100 text-green-800 border-green-300',
		low: 'bg-yellow-100 text-yellow-800 border-yellow-300',
		medium: 'bg-orange-100 text-orange-800 border-orange-300',
		high: 'bg-red-100 text-red-800 border-red-300',
		critical: 'bg-red-900 text-white border-red-950'
	};

	/** @type {keyof typeof dangerStyles} */
	const level = $derived(formatted ? formatted.level : 'safe');

	// Componente de ícono dinámico en Svelte 5 (reemplaza <svelte:component>)
	const Icon = $derived(dangerIcons[level]);

	function toggleExpanded() {
		if (showDetails && formatted?.issues?.length > 0) {
			expanded = !expanded;
		}
	}
</script>

{#if formatted}
	<div class="regex-danger-indicator select-none {showDetails ? 'cursor-pointer' : ''}">
		<!-- Indicador principal -->
		{#if showDetails}
			<button
				type="button"
				class="indicator-header {dangerStyles[
					level
				]} flex w-full items-center gap-3 rounded-lg border px-4 py-2 text-left transition-all duration-200 hover:shadow-md"
				onclick={toggleExpanded}
				aria-expanded={expanded}
				aria-controls="regex-danger-details"
			>
				<Icon class="h-5 w-5 flex-shrink-0" />

				<div class="flex-1">
					<div class="text-sm font-semibold">
						{#if formatted.level === 'safe'}
							Patrón Seguro
						{:else if formatted.level === 'low'}
							Riesgo Bajo
						{:else if formatted.level === 'medium'}
							Riesgo Medio
						{:else if formatted.level === 'high'}
							Riesgo Alto
						{:else if formatted.level === 'critical'}
							¡PELIGRO CRÍTICO!
						{/if}
					</div>

					{#if formatted.summary}
						<div class="mt-0.5 text-xs opacity-80">
							{formatted.summary}
						</div>
					{/if}
				</div>

				{#if formatted.issues.length > 0}
					<div class="chevron-icon transition-transform duration-200">
						{#if expanded}
							<ChevronUp class="h-4 w-4" />
						{:else}
							<ChevronDown class="h-4 w-4" />
						{/if}
					</div>
				{/if}
			</button>
		{:else}
			<div
				class="indicator-header {dangerStyles[
					level
				]} flex items-center gap-3 rounded-lg border px-4 py-2 transition-all duration-200 hover:shadow-md"
			>
				<Icon class="h-5 w-5 flex-shrink-0" />

				<div class="flex-1">
					<div class="text-sm font-semibold">
						{#if formatted.level === 'safe'}
							Patrón Seguro
						{:else if formatted.level === 'low'}
							Riesgo Bajo
						{:else if formatted.level === 'medium'}
							Riesgo Medio
						{:else if formatted.level === 'high'}
							Riesgo Alto
						{:else if formatted.level === 'critical'}
							¡PELIGRO CRÍTICO!
						{/if}
					</div>

					{#if formatted.summary}
						<div class="mt-0.5 text-xs opacity-80">
							{formatted.summary}
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Detalles expandibles -->
		{#if showDetails && expanded && formatted.issues.length > 0}
			<div id="regex-danger-details" transition:slide={{ duration: 200 }} class="mt-3 space-y-3">
				<!-- Lista de problemas -->
				<div class="rounded-lg border border-gray-200 bg-white p-4">
					<h4 class="mb-2 text-sm font-semibold text-gray-700">Problemas Detectados:</h4>
					<ul class="space-y-2">
						{#each formatted.issues as issue (issue.description)}
							<li class="flex gap-2 text-sm">
								<span class="text-red-500">•</span>
								<div>
									<span class="font-medium">{issue.description}</span>
									{#if issue.pattern !== pattern}
										<code
											class="ml-2 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-red-600"
										>
											{issue.pattern}
										</code>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Alternativas seguras -->
				{#if formatted.alternatives && formatted.alternatives.length > 0}
					<div class="rounded-lg border border-green-200 bg-green-50 p-4">
						<h4 class="mb-2 text-sm font-semibold text-green-700">Alternativas Seguras:</h4>
						<ul class="space-y-2">
							{#each formatted.alternatives as alt (alt.reason)}
								<li class="text-sm">
									<div class="font-medium text-green-800">{alt.reason}:</div>
									<code
										class="mt-1 block rounded border border-green-300 bg-white px-2 py-1 font-mono text-xs text-green-700"
									>
										{alt.suggested}
									</code>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Complejidad en el peor caso -->
				{#if formatted.worstCase}
					<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
						<h4 class="mb-2 text-sm font-semibold text-yellow-700">Análisis de Complejidad:</h4>
						<div class="space-y-1 text-sm">
							<div>
								<span class="font-medium">Complejidad:</span>
								<code class="ml-1 rounded bg-yellow-100 px-1.5 py-0.5 font-mono text-yellow-800">
									{formatted.worstCase.timeComplexity}
								</code>
							</div>
							<div class="mt-1 text-xs text-yellow-600">
								{formatted.worstCase.description}
							</div>
							{#if formatted.worstCase.inputLength10}
								<div class="mt-2 space-y-0.5 text-xs text-yellow-700">
									{#if formatted.worstCase.inputLength10}
										<div>• 10 caracteres: {formatted.worstCase.inputLength10}</div>
									{/if}
									{#if formatted.worstCase.inputLength20}
										<div>• 20 caracteres: {formatted.worstCase.inputLength20}</div>
									{/if}
									{#if formatted.worstCase.inputLength30}
										<div>• 30 caracteres: {formatted.worstCase.inputLength30}</div>
									{/if}
									{#if formatted.worstCase.inputLength40}
										<div>• 40 caracteres: {formatted.worstCase.inputLength40}</div>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}
