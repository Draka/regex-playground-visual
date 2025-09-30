<script>
	import { Trophy, Target, Clock, AlertCircle, ChevronRight, RotateCcw } from 'lucide-svelte';
	import RegexEngine from '$lib/components/RegexEngine.svelte';

	let {
		onComplete = () => {},
		onBack = () => {}
	} = $props();

	// Niveles del juego
	const levels = [
		{
			id: 1,
			title: 'Caza de Emails',
			description: 'Encuentra todos los emails en el texto',
			text: `Contacta a nuestro equipo:
				Para ventas: juan.perez@empresa.com
				Soporte técnico está en support@empresa.com
				El CEO (ceo@empresa.com) está disponible los lunes.
				No olvides escribir a maria_garcia@empresa.es
				Info general: info@empresa.co.uk`,
			targets: ['juan.perez@empresa.com', 'support@empresa.com', 'ceo@empresa.com', 'maria_garcia@empresa.es', 'info@empresa.co.uk'],
			hints: ['Busca el patrón palabra@palabra.extensión', 'Recuerda que los emails pueden tener puntos y guiones'],
			maxTime: 120
		},
		{
			id: 2,
			title: 'Números de Teléfono',
			description: 'Encuentra todos los números de teléfono (varios formatos)',
			text: `Lista de contactos de emergencia:
				Policía: 911
				Bomberos: (555) 123-4567
				Hospital: 555-9876-5432
				Doctor: 555.234.5678
				Veterinario: +1-555-345-6789
				Taxi: 5554443333`,
			targets: ['911', '(555) 123-4567', '555-9876-5432', '555.234.5678', '+1-555-345-6789', '5554443333'],
			hints: ['Los teléfonos pueden tener diferentes separadores', 'Algunos tienen código de país'],
			maxTime: 150
		},
		{
			id: 3,
			title: 'URLs Ocultas',
			description: 'Encuentra todas las URLs válidas',
			text: `Recursos útiles para aprender:
				Documentación oficial: https://www.example.com/docs
				Video tutorial en http://youtube.com/watch?v=abc123
				Repositorio: https://github.com/user/project
				No es URL: www sin protocolo com
				Foro de ayuda: https://forum.example.org/thread/12345
				FTP antiguo: ftp://files.example.net/downloads`,
			targets: ['https://www.example.com/docs', 'http://youtube.com/watch?v=abc123', 'https://github.com/user/project', 'https://forum.example.org/thread/12345', 'ftp://files.example.net/downloads'],
			hints: ['Las URLs empiezan con protocolo://', 'Pueden ser http, https o ftp'],
			maxTime: 180
		}
	];

	// Estado del juego
	let currentLevel = $state(0);
	let playerPattern = $state('');
	let timeLeft = $state(0);
	let score = $state(0);
	let gameState = $state('ready'); // 'ready', 'playing', 'completed', 'failed'
	let showHint = $state(false);
	let hintsUsed = $state(0);
	let matches = $state([]);
	let timerInterval = null;

	// Nivel actual
	let level = $derived(levels[currentLevel]);

	// Validar el patrón del jugador
	function testPattern() {
		if (!playerPattern) {
			matches = [];
			return;
		}

		try {
			const regex = new RegExp(playerPattern, 'g');
			const found = [...(level.text.matchAll(regex) || [])].map(m => m[0]);
			matches = found;

			// Verificar si encontró todos los objetivos
			const foundTargets = level.targets.filter(target =>
				found.some(match => match.includes(target))
			);

			if (foundTargets.length === level.targets.length) {
				// ¡Nivel completado!
				completeLevel();
			}
		} catch (e) {
			// Regex inválido
			matches = [];
		}
	}

	// Iniciar nivel
	function startLevel() {
		gameState = 'playing';
		timeLeft = level.maxTime;
		hintsUsed = 0;
		showHint = false;
		playerPattern = '';
		matches = [];

		// Iniciar timer
		timerInterval = setInterval(() => {
			timeLeft--;
			if (timeLeft <= 0) {
				failLevel();
			}
		}, 1000);
	}

	// Completar nivel
	function completeLevel() {
		clearInterval(timerInterval);
		gameState = 'completed';

		// Calcular puntos
		const timeBonus = timeLeft * 10;
		const hintPenalty = hintsUsed * 50;
		const levelScore = Math.max(0, 1000 + timeBonus - hintPenalty);
		score += levelScore;
	}

	// Fallar nivel
	function failLevel() {
		clearInterval(timerInterval);
		gameState = 'failed';
	}

	// Siguiente nivel
	function nextLevel() {
		if (currentLevel < levels.length - 1) {
			currentLevel++;
			gameState = 'ready';
		} else {
			// Juego completado
			onComplete(score);
		}
	}

	// Reintentar nivel
	function retryLevel() {
		gameState = 'ready';
	}

	// Mostrar pista
	function toggleHint() {
		if (!showHint) {
			hintsUsed++;
			showHint = true;
		} else {
			showHint = false;
		}
	}

	// Formatear tiempo
	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	// Limpiar al desmontar
	$effect(() => {
		return () => {
			if (timerInterval) clearInterval(timerInterval);
		};
	});
</script>

<div class="regex-hunter-game max-w-6xl mx-auto p-6">
	<!-- Header -->
	<div class="bg-white rounded-xl shadow-lg p-6 mb-6">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-4">
				<Trophy class="w-8 h-8 text-yellow-500" />
				<div>
					<h1 class="text-2xl font-bold">Regex Hunter</h1>
					<p class="text-gray-600">Nivel {currentLevel + 1} de {levels.length}</p>
				</div>
			</div>
			<div class="flex items-center gap-6">
				<div class="flex items-center gap-2">
					<Target class="w-5 h-5 text-blue-500" />
					<span class="font-semibold">Puntos: {score}</span>
				</div>
				{#if gameState === 'playing'}
					<div class="flex items-center gap-2 {timeLeft < 30 ? 'text-red-500' : 'text-gray-700'}">
						<Clock class="w-5 h-5" />
						<span class="font-mono font-semibold">{formatTime(timeLeft)}</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Progress bar -->
		<div class="w-full bg-gray-200 rounded-full h-2">
			<div
				class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
				style="width: {((currentLevel + (gameState === 'completed' ? 1 : 0)) / levels.length) * 100}%"
			></div>
		</div>
	</div>

	<!-- Game Area -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Challenge Panel -->
		<div class="bg-white rounded-xl shadow-lg p-6">
			<div class="mb-4">
				<h2 class="text-xl font-bold mb-2">{level.title}</h2>
				<p class="text-gray-600">{level.description}</p>
			</div>

			<!-- Target text with highlights -->
			<div class="bg-gray-50 rounded-lg p-4 mb-4 font-mono text-sm whitespace-pre-line relative">
				{#if matches.length > 0}
					{@html level.text.replace(
						new RegExp(`(${matches.map(m => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g'),
						'<mark class="bg-yellow-300">$1</mark>'
					)}
				{:else}
					{level.text}
				{/if}
			</div>

			<!-- Objectives -->
			<div class="mb-4">
				<h3 class="font-semibold mb-2">Objetivos ({level.targets.filter(t => matches.some(m => m.includes(t))).length}/{level.targets.length}):</h3>
				<div class="space-y-1">
					{#each level.targets as target}
						<div class="flex items-center gap-2">
							{#if matches.some(m => m.includes(target))}
								<div class="w-4 h-4 rounded-full bg-green-500"></div>
								<span class="text-green-700 line-through">{target}</span>
							{:else}
								<div class="w-4 h-4 rounded-full bg-gray-300"></div>
								<span class="text-gray-600">???</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Hints -->
			{#if gameState === 'playing'}
				<button
					onclick={toggleHint}
					class="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
				>
					<AlertCircle class="w-4 h-4" />
					{showHint ? 'Ocultar' : 'Mostrar'} Pista ({hintsUsed}/{level.hints.length})
				</button>

				{#if showHint && hintsUsed > 0}
					<div class="mt-2 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
						<p class="text-sm text-yellow-800">{level.hints[Math.min(hintsUsed - 1, level.hints.length - 1)]}</p>
					</div>
				{/if}
			{/if}
		</div>

		<!-- Input Panel -->
		<div class="bg-white rounded-xl shadow-lg p-6">
			{#if gameState === 'ready'}
				<div class="text-center py-8">
					<Target class="w-16 h-16 text-blue-500 mx-auto mb-4" />
					<h3 class="text-xl font-bold mb-2">¿Listo para cazar?</h3>
					<p class="text-gray-600 mb-6">Encuentra todos los elementos objetivo escribiendo el regex correcto.</p>
					<button
						onclick={startLevel}
						class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
					>
						Comenzar Nivel {currentLevel + 1}
					</button>
				</div>

			{:else if gameState === 'playing'}
				<div>
					<label for="regex-pattern-input" class="block text-sm font-medium text-gray-700 mb-2">
						Tu patrón Regex:
					</label>
					<input
						id="regex-pattern-input"
						type="text"
						bind:value={playerPattern}
						oninput={testPattern}
						placeholder="Escribe tu regex aquí..."
						class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-lg"
					/>

					<div class="mt-4">
						<div class="flex items-center justify-between mb-2">
							<span class="text-sm text-gray-600">Coincidencias encontradas:</span>
							<span class="font-semibold">{matches.length}</span>
						</div>

						{#if matches.length > 0}
							<div class="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
								{#each matches as match, i}
									<div class="text-sm font-mono py-1 px-2 bg-white rounded mb-1">
										{match}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>

			{:else if gameState === 'completed'}
				<div class="text-center py-8">
					<Trophy class="w-16 h-16 text-yellow-500 mx-auto mb-4" />
					<h3 class="text-2xl font-bold mb-2 text-green-600">¡Nivel Completado!</h3>
					<div class="space-y-2 mb-6">
						<p class="text-gray-600">Tiempo restante: {formatTime(timeLeft)}</p>
						<p class="text-gray-600">Pistas usadas: {hintsUsed}</p>
						<p class="text-xl font-semibold">Puntos ganados: {1000 + timeLeft * 10 - hintsUsed * 50}</p>
					</div>
					<button
						onclick={nextLevel}
						class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center gap-2 mx-auto"
					>
						Siguiente Nivel
						<ChevronRight class="w-5 h-5" />
					</button>
				</div>

			{:else if gameState === 'failed'}
				<div class="text-center py-8">
					<AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h3 class="text-2xl font-bold mb-2 text-red-600">¡Tiempo Agotado!</h3>
					<p class="text-gray-600 mb-6">No encontraste todos los objetivos a tiempo.</p>
					<button
						onclick={retryLevel}
						class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center gap-2 mx-auto"
					>
						<RotateCcw class="w-5 h-5" />
						Reintentar
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.regex-hunter-game {
		min-height: 600px;
	}

	:global(mark) {
		padding: 2px 4px;
		border-radius: 3px;
	}
</style>