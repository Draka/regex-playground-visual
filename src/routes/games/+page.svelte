<script>
	import { Gamepad2, Trophy, Shield, Target, Zap, ArrowLeft, Star } from 'lucide-svelte';
	import { localizeHref, getLocale } from '$lib/paraglide/runtime.js';
	import LanguageSelector from '$lib/components/LanguageSelector.svelte';
	import RegexHunter from '$lib/games/RegexHunter.svelte';
	import RegexDefender from '$lib/games/RegexDefender.svelte';
	import { browser } from '$app/environment';
	import * as m from '$lib/paraglide/messages.js';

	// Estado
	let selectedGame = $state(null);
	let highScores = $state({
		hunter: browser ? (localStorage.getItem('regex-hunter-score') || 0) : 0,
		defender: browser ? (localStorage.getItem('regex-defender-score') || 0) : 0
	});

	// Lista de juegos disponibles
	const games = [
		{
			id: 'hunter',
			title: 'Regex Hunter',
			description: getLocale() === 'es'
				? 'Encuentra todos los elementos ocultos en el texto usando expresiones regulares. ¡Sé rápido y preciso!'
				: 'Find all hidden elements in the text using regular expressions. Be fast and accurate!',
			icon: Target,
			difficulty: getLocale() === 'es' ? 'Intermedio' : 'Intermediate',
			players: '1',
			duration: '5-10 min',
			color: 'from-blue-500 to-cyan-500',
			component: RegexHunter,
			features: getLocale() === 'es'
				? ['3 niveles progresivos', 'Sistema de tiempo', 'Pistas disponibles', 'Puntuación por velocidad']
				: ['3 progressive levels', 'Time system', 'Hints available', 'Speed scoring']
		},
		{
			id: 'defender',
			title: 'Regex Defender',
			description: getLocale() === 'es'
				? '¡Defiende tu torre de strings invasores! Usa regex para destruir enemigos antes de que lleguen a tu base.'
				: 'Defend your tower from invading strings! Use regex to destroy enemies before they reach your base.',
			icon: Shield,
			difficulty: getLocale() === 'es' ? 'Avanzado' : 'Advanced',
			players: '1',
			duration: '10-15 min',
			color: 'from-red-500 to-orange-500',
			component: RegexDefender,
			features: getLocale() === 'es'
				? ['5 oleadas de enemigos', 'Sistema de combos', 'Jefe final', 'Efectos visuales']
				: ['5 enemy waves', 'Combo system', 'Final boss', 'Visual effects']
		}
	];

	// Funciones
	function selectGame(game) {
		selectedGame = game;
	}

	function exitGame(score = 0) {
		if (selectedGame && score > 0 && browser) {
			// Guardar puntuación máxima
			const key = `regex-${selectedGame.id}-score`;
			const currentHigh = parseInt(localStorage.getItem(key) || '0');
			if (score > currentHigh) {
				localStorage.setItem(key, score.toString());
				highScores[selectedGame.id] = score;
			}
		}
		selectedGame = null;
	}

	function backToMenu() {
		selectedGame = null;
	}
</script>

<svelte:head>
	<title>{getLocale() === 'es' ? 'Juegos de Regex' : 'Regex Games'} | Regex Playground Visual</title>
	<meta name="description" content="{getLocale() === 'es'
		? 'Juegos divertidos para aprender regex jugando'
		: 'Fun games to learn regex by playing'}" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
	<!-- Header with navigation -->
	<div class="bg-white border-b border-gray-200 sticky top-0 z-10">
		<div class="max-w-7xl mx-auto px-6 py-4">
			<div class="flex items-center justify-between">
				{#if selectedGame}
					<button
						onclick={backToMenu}
						class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
					>
						<ArrowLeft size="20" />
						{getLocale() === 'es' ? 'Volver al Menú' : 'Back to Menu'}
					</button>
				{:else}
					<a
						href={localizeHref('/')}
						class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
					>
						<ArrowLeft size="20" />
						{m.back_to_home()}
					</a>
				{/if}
				<LanguageSelector />
			</div>
		</div>
	</div>

	{#if selectedGame}
		<!-- Juego seleccionado -->
		<div class="max-w-7xl mx-auto px-4 py-8">
			<!-- Componente del juego -->
			{#if selectedGame.id === 'hunter'}
				<RegexHunter onComplete={exitGame} onBack={backToMenu} />
			{:else if selectedGame.id === 'defender'}
				<RegexDefender onComplete={exitGame} onBack={backToMenu} />
			{/if}
		</div>
	{:else}
		<!-- Menú de juegos -->
		<div class="max-w-6xl mx-auto px-4 py-8">
			<!-- Header -->
			<div class="text-center mb-12">
				<div class="flex items-center justify-center gap-3 mb-4">
					<Gamepad2 class="w-12 h-12 text-purple-600" />
					<h1 class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
						{getLocale() === 'es' ? 'Zona de Juegos Regex' : 'Regex Game Zone'}
					</h1>
				</div>
				<p class="text-xl text-gray-600">
					{getLocale() === 'es'
						? '¡Aprende regex de forma divertida con nuestros mini-juegos!'
						: 'Learn regex the fun way with our mini-games!'}
				</p>
			</div>

			<!-- Grid de juegos -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				{#each games as game}
					{@const GameIcon = game.icon}
					<button
						onclick={() => selectGame(game)}
						class="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
					>
						<!-- Background gradient -->
						<div class="absolute inset-0 bg-gradient-to-br {game.color} opacity-5 group-hover:opacity-10 transition-opacity"></div>

						<div class="relative p-6">
							<!-- Header del juego -->
							<div class="flex items-start gap-4 mb-4">
								<div class="p-3 bg-gradient-to-br {game.color} rounded-xl text-white shadow-lg">
									<GameIcon class="w-8 h-8" />
								</div>
								<div class="flex-1 text-left">
									<h3 class="text-2xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:{game.color} group-hover:bg-clip-text transition-all">
										{game.title}
									</h3>
									<div class="flex gap-3 mt-1">
										<span class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
											{game.difficulty}
										</span>
										<span class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
											{game.duration}
										</span>
									</div>
								</div>
							</div>

							<!-- Descripción -->
							<p class="text-gray-600 text-left mb-4">
								{game.description}
							</p>

							<!-- Características -->
							<div class="grid grid-cols-2 gap-2 mb-4">
								{#each game.features as feature}
									<div class="flex items-center gap-1 text-xs text-gray-500">
										<Star class="w-3 h-3 text-yellow-500" />
										<span>{feature}</span>
									</div>
								{/each}
							</div>

							<!-- High Score -->
							{#if highScores[game.id] > 0}
								<div class="absolute top-4 right-4">
									<div class="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-lg">
										<Trophy class="w-4 h-4 text-yellow-600" />
										<span class="text-sm font-bold text-yellow-700">
											{highScores[game.id].toLocaleString()}
										</span>
									</div>
								</div>
							{/if}

							<!-- Play button -->
							<div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
								<span class="text-sm text-gray-500">
									<Zap class="inline w-4 h-4 text-purple-500" />
									{getLocale() === 'es' ? 'Click para jugar' : 'Click to play'}
								</span>
								<div class="px-4 py-2 bg-gradient-to-r {game.color} text-white rounded-lg font-semibold group-hover:shadow-lg transition-all">
									{getLocale() === 'es' ? 'JUGAR' : 'PLAY'}
								</div>
							</div>
						</div>
					</button>
				{/each}
			</div>

			<!-- Próximamente -->
			<div class="mt-12 p-6 bg-white/50 backdrop-blur rounded-xl border-2 border-dashed border-gray-300">
				<h2 class="text-xl font-bold text-gray-700 mb-3">
					🚀 {getLocale() === 'es' ? 'Próximamente' : 'Coming Soon'}
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
					<div>
						<strong>Pattern Golf:</strong>
						{getLocale() === 'es'
							? 'El regex más corto gana'
							: 'Shortest regex wins'}
					</div>
					<div>
						<strong>Speed Matcher:</strong>
						{getLocale() === 'es'
							? 'Rapidez y precisión'
							: 'Speed and accuracy'}
					</div>
					<div>
						<strong>Regex Puzzle:</strong>
						{getLocale() === 'es'
							? 'Resuelve puzzles complejos'
							: 'Solve complex puzzles'}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.group:hover .group-hover\:shadow-lg) {
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}
</style>