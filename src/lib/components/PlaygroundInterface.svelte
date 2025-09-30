<script>
	import RegexEngine from './RegexEngine.svelte';
	import { Play, RotateCcw, Copy, Share2, BookOpen, Zap, CircleAlert } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let pattern = $state('');
	let testText = $state('');
	let isValid = $state(true);
	let errorMessage = $state('');
	let showExample = $state(false);

	// Flags del regex
	let flags = $state({
		g: true,  // Global por defecto
		i: false, // Ignore case
		m: false, // Multiline
		s: false, // Dotall
		u: false, // Unicode
		y: false  // Sticky
	});

	// Ejemplos predefinidos
	let examples = $derived([
		{
			name: m.example_basic_email(),
			pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
			text: 'Contacta con juan@ejemplo.com o maria.garcia@test.org para más información.'
		},
		{
			name: m.example_phone_numbers(),
			pattern: '\\+?[0-9]{1,4}[\\s-]?\\(?[0-9]{1,3}\\)?[\\s-]?[0-9]{3,4}[\\s-]?[0-9]{3,4}',
			text: 'Llama al +34 123 456 789 o al (555) 123-4567 para soporte técnico.'
		},
		{
			name: m.example_urls(),
			pattern: 'https?://[\\w\\.-]+\\.[a-zA-Z]{2,}[\\w\\./]*',
			text: 'Visita https://ejemplo.com o http://test.org/pagina para más detalles.'
		},
		{
			name: m.example_dates(),
			pattern: '\\d{1,2}/\\d{1,2}/\\d{4}',
			text: 'El evento será el 15/03/2024 y la reunión el 8/12/2023.'
		}
	]);

	// Generar string de flags activos
	let flagsString = $derived(
		Object.entries(flags)
			.filter(([_, enabled]) => enabled)
			.map(([flag]) => flag)
			.join('')
	);

	// Validar patrón regex
	/**
	 * @param {string | RegExp} pattern
	 */
	function validatePattern(pattern) {
		if (!pattern) {
			isValid = true;
			errorMessage = '';
			return;
		}

		try {
			new RegExp(pattern, flagsString);
			isValid = true;
			errorMessage = '';
		} catch (/**@type {any}*/ error) {
			isValid = false;
			errorMessage = error.message;
		}
	}

	/**
	 * @param {'g' | 'i' | 'm' | 's' | 'u' | 'y'} flag
	 */
	function toggleFlag(flag) {
		flags[flag] = !flags[flag];
	}

	// Reactividad para validar cuando cambie el patrón
	$effect(() => {
		validatePattern(pattern);
	});

	/**
	 * @param {{ name?: string; pattern: any; text: any; }} example
	 */
	function loadExample(example) {
		pattern = example.pattern;
		testText = example.text;
		showExample = false;
	}

	function clearAll() {
		pattern = '';
		testText = '';
	}

	/**
	 * @param {string} text
	 */
	async function copyToClipboard(text) {
		try {
			await navigator.clipboard.writeText(text);
			// Podrías agregar una notificación aquí
		} catch (err) {
			console.error('Error al copiar:', err);
		}
	}

	function shareRegex() {
		const url = new URL(window.location.href);
		url.searchParams.set('pattern', encodeURIComponent(pattern));
		url.searchParams.set('text', encodeURIComponent(testText));
		copyToClipboard(url.toString());
	}
</script>

<div class="playground-interface max-w-7xl mx-auto p-6">
	<!-- Header -->
	<div class="text-center mb-8">
		<div class="flex items-center justify-center gap-3 mb-4">
			<Zap class="text-blue-500" size="32" />
			<h2 class="text-3xl font-bold text-gray-800">{m.interactive_playground()}</h2>
		</div>
		<p class="text-gray-600 text-lg max-w-2xl mx-auto">
			{m.playground_subtitle()}
		</p>
	</div>

	<div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
		<!-- Panel de entrada -->
		<div class="xl:col-span-1 space-y-6">
			<!-- Entrada de patrón -->
			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
						<span class="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
						{m.regex_pattern()}
					</h3>
					<div class="flex gap-2">
						<button
							onclick={() => showExample = !showExample}
							class="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
						>
							<BookOpen size="16" />
							{m.examples()}
						</button>
						<button
							onclick={clearAll}
							class="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
						>
							<RotateCcw size="16" />
							{m.clear()}
						</button>
					</div>
				</div>

				<div class="space-y-3">
					<div class="relative">
						<input
							bind:value={pattern}
							placeholder={m.pattern_placeholder()}
							class="w-full p-3 border-2 rounded-lg font-mono text-sm transition-all
								{isValid
									? 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200'
									: 'border-red-300 focus:border-red-500 focus:ring focus:ring-red-200'
								} focus:outline-none"
							style="font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;"
						/>
						{#if pattern}
							<button
								onclick={() => copyToClipboard(pattern)}
								class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							>
								<Copy size="16" />
							</button>
						{/if}
					</div>

					{#if !isValid && errorMessage}
						<div class="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
							<CircleAlert size="16" class="text-red-500 mt-0.5 flex-shrink-0" />
							<div>
								<p class="text-red-700 font-medium text-sm">{m.pattern_error()}</p>
								<p class="text-red-600 text-sm">{errorMessage}</p>
							</div>
						</div>
					{/if}

					<!-- Flags toggles -->
					<div class="pt-3 border-t border-gray-200">
						<h4 class="text-sm font-semibold text-gray-700 mb-3">{m.flags_title()}</h4>
						<div class="grid grid-cols-3 gap-2">
							<button
								onclick={() => toggleFlag('g')}
								class="flex flex-col items-center p-2 rounded-lg transition-all border-2 {flags.g ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'}"
								title={m.flag_g_description()}
							>
								<span class="font-mono font-bold text-lg">g</span>
								<span class="text-[10px] mt-0.5">Global</span>
							</button>
							<button
								onclick={() => toggleFlag('i')}
								class="flex flex-col items-center p-2 rounded-lg transition-all border-2 {flags.i ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'}"
								title={m.flag_i_description()}
							>
								<span class="font-mono font-bold text-lg">i</span>
								<span class="text-[10px] mt-0.5">Case</span>
							</button>
							<button
								onclick={() => toggleFlag('m')}
								class="flex flex-col items-center p-2 rounded-lg transition-all border-2 {flags.m ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'}"
								title={m.flag_m_description()}
							>
								<span class="font-mono font-bold text-lg">m</span>
								<span class="text-[10px] mt-0.5">Multiline</span>
							</button>
							<button
								onclick={() => toggleFlag('s')}
								class="flex flex-col items-center p-2 rounded-lg transition-all border-2 {flags.s ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'}"
								title={m.flag_s_description()}
							>
								<span class="font-mono font-bold text-lg">s</span>
								<span class="text-[10px] mt-0.5">Dotall</span>
							</button>
							<button
								onclick={() => toggleFlag('u')}
								class="flex flex-col items-center p-2 rounded-lg transition-all border-2 {flags.u ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'}"
								title={m.flag_u_description()}
							>
								<span class="font-mono font-bold text-lg">u</span>
								<span class="text-[10px] mt-0.5">Unicode</span>
							</button>
							<button
								onclick={() => toggleFlag('y')}
								class="flex flex-col items-center p-2 rounded-lg transition-all border-2 {flags.y ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'}"
								title={m.flag_y_description()}
							>
								<span class="font-mono font-bold text-lg">y</span>
								<span class="text-[10px] mt-0.5">Sticky</span>
							</button>
						</div>
						{#if flagsString}
							<p class="text-xs text-gray-600 mt-2 text-center font-mono">
								/{pattern || '...'}/{flagsString}
							</p>
						{/if}
					</div>
				</div>

				<!-- Ejemplos dropdown -->
				{#if showExample}
					<div class="mt-4 p-4 bg-gray-50 rounded-lg border">
						<h4 class="font-medium text-gray-700 mb-3">{m.examples_to_try()}</h4>
						<div class="space-y-2">
							{#each examples as example}
								<button
									onclick={() => loadExample(example)}
									class="w-full text-left p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
								>
									<div class="font-medium text-gray-800 text-sm">{example.name}</div>
									<div class="text-xs text-gray-600 font-mono mt-1 break-all">{example.pattern}</div>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Entrada de texto -->
			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
						<span class="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
						{m.test_text()}
					</h3>
					{#if testText && pattern && isValid}
						<button
							onclick={shareRegex}
							class="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
						>
							<Share2 size="16" />
							{m.share()}
						</button>
					{/if}
				</div>

				<div class="relative">
					<textarea
						bind:value={testText}
						placeholder={m.text_placeholder()}
						rows="6"
						class="w-full p-3 border-2 border-gray-300 rounded-lg resize-none focus:border-green-500 focus:ring focus:ring-green-200 focus:outline-none transition-all"
					></textarea>
					{#if testText}
						<button
							onclick={() => copyToClipboard(testText)}
							class="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors"
						>
							<Copy size="16" />
						</button>
					{/if}
				</div>
			</div>

			<!-- Stats rápidas -->
			{#if pattern && testText && isValid}
				<div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-200">
					<div class="grid grid-cols-2 gap-4 text-center">
						<div>
							<div class="text-2xl font-bold text-blue-600">{pattern.length}</div>
							<div class="text-sm text-blue-700">{m.pattern_characters()}</div>
						</div>
						<div>
							<div class="text-2xl font-bold text-green-600">{testText.length}</div>
							<div class="text-sm text-green-700">{m.text_characters()}</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Panel de resultados -->
		<div class="xl:col-span-2">
			<div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 min-h-[500px]">
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
						<span class="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
						{m.live_results()}
					</h3>
					{#if pattern && testText && isValid}
						<div class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
							{m.matches_found()}
						</div>
					{/if}
				</div>

				{#if !pattern && !testText}
					<!-- Estado vacío -->
					<div class="flex flex-col items-center justify-center h-64 text-gray-400">
						<Play size="48" class="mb-4 opacity-50" />
						<h4 class="text-lg font-medium mb-2">{m.start_experimenting()}</h4>
						<p class="text-center max-w-sm">
							{m.start_experimenting_description()}
						</p>
						<button
							onclick={() => {
								pattern = '\\d+';
								testText = 'Tengo 25 años y vivo en el número 123 de la calle Principal.';
							}}
							class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
						>
							{m.try_quick_example()}
						</button>
					</div>
				{:else if !pattern}
					<!-- Falta patrón -->
					<div class="flex flex-col items-center justify-center h-64 text-gray-400">
						<CircleAlert size="48" class="mb-4 opacity-50" />
						<h4 class="text-lg font-medium mb-2">{m.missing_pattern()}</h4>
						<p class="text-center">{m.missing_pattern_description()}</p>
					</div>
				{:else if !testText}
					<!-- Falta texto -->
					<div class="flex flex-col items-center justify-center h-64 text-gray-400">
						<CircleAlert size="48" class="mb-4 opacity-50" />
						<h4 class="text-lg font-medium mb-2">{m.missing_text()}</h4>
						<p class="text-center">{m.missing_text_description()}</p>
					</div>
				{:else if !isValid}
					<!-- Patrón inválido -->
					<div class="flex flex-col items-center justify-center h-64 text-red-400">
						<CircleAlert size="48" class="mb-4" />
						<h4 class="text-lg font-medium mb-2">{m.invalid_pattern()}</h4>
						<p class="text-center">{m.invalid_pattern_description()}</p>
					</div>
				{:else}
					<!-- Mostrar resultados con RegexEngine -->
					<RegexEngine
						pattern={pattern}
						text={testText}
						speed={600}
						showValidation={false}
						flags={flagsString}
					/>
				{/if}
			</div>
		</div>
	</div>

	<!-- Tips section -->
	<div class="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
		<h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
			<Zap class="text-blue-500" size="20" />
			{m.playground_tips_title()}
		</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<div class="bg-white p-4 rounded-lg border border-blue-200">
				<h4 class="font-medium text-gray-800 mb-2">{m.tip_experiment()}</h4>
				<p class="text-sm text-gray-600">{m.tip_experiment_description()}</p>
			</div>
			<div class="bg-white p-4 rounded-lg border border-blue-200">
				<h4 class="font-medium text-gray-800 mb-2">{m.tip_copy()}</h4>
				<p class="text-sm text-gray-600">{m.tip_copy_description()}</p>
			</div>
			<div class="bg-white p-4 rounded-lg border border-blue-200">
				<h4 class="font-medium text-gray-800 mb-2">{m.tip_share()}</h4>
				<p class="text-sm text-gray-600">{m.tip_share_description()}</p>
			</div>
			<div class="bg-white p-4 rounded-lg border border-blue-200">
				<h4 class="font-medium text-gray-800 mb-2">{m.tip_learn()}</h4>
				<p class="text-sm text-gray-600">{m.tip_learn_description()}</p>
			</div>
		</div>
	</div>
</div>

<style>
	.playground-interface {
		min-height: 80vh;
	}

	/* Animación suave para transiciones */
	* {
		transition: all 0.2s ease;
	}

	/* Estilo especial para inputs de código */
	input[style*="font-family"], textarea {
		line-height: 1.4;
	}

	/* Hover effects mejorados */
	button:hover {
		transform: translateY(-1px);
	}
</style>