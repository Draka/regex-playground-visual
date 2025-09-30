<script>
	import { Shield, Heart, Zap, AlertTriangle, Trophy, Skull, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';

	let {
		onComplete = () => {},
		onBack = () => {}
	} = $props();

	// Configuración del juego
	const GAME_WIDTH = 800;
	const GAME_HEIGHT = 400;
	const ENEMY_SPEED = 1; // pixels por frame
	const TOWER_POSITION = 50; // posición X de la torre

	// Tipos de enemigos por oleada
	const waves = [
		{
			id: 1,
			name: 'Invasión Simple',
			enemies: [
				{ text: 'abc', type: 'simple', health: 1, speed: 1, points: 10 },
				{ text: '123', type: 'simple', health: 1, speed: 1, points: 10 },
				{ text: 'xyz', type: 'simple', health: 1, speed: 1, points: 10 },
				{ text: 'hello', type: 'simple', health: 1, speed: 0.8, points: 15 },
				{ text: 'world', type: 'simple', health: 1, speed: 0.8, points: 15 }
			],
			hint: 'Usa patrones simples como \\w+ o literales',
			bonusPattern: '\\w+', // Patrón que destruye todos
			bonusPoints: 100
		},
		{
			id: 2,
			name: 'Ataque Email',
			enemies: [
				{ text: 'user@mail.com', type: 'email', health: 2, speed: 0.7, points: 25 },
				{ text: 'admin@server.net', type: 'email', health: 2, speed: 0.7, points: 25 },
				{ text: 'hack@evil.org', type: 'email', health: 2, speed: 0.8, points: 30 },
				{ text: 'spam@bot.io', type: 'email', health: 2, speed: 0.8, points: 30 },
				{ text: 'fake@phishing.com', type: 'email', health: 3, speed: 0.6, points: 40 }
			],
			hint: 'Patrón de email: \\w+@\\w+\\.\\w+',
			bonusPattern: '\\w+@\\w+\\.\\w+',
			bonusPoints: 150
		},
		{
			id: 3,
			name: 'Números de Ataque',
			enemies: [
				{ text: '42', type: 'number', health: 1, speed: 1.2, points: 20 },
				{ text: '3.14', type: 'number', health: 2, speed: 1, points: 25 },
				{ text: '-999', type: 'number', health: 2, speed: 1, points: 25 },
				{ text: '0xFF', type: 'hex', health: 3, speed: 0.8, points: 35 },
				{ text: '0b1010', type: 'binary', health: 3, speed: 0.8, points: 35 }
			],
			hint: 'Diferentes tipos: \\d+, -?\\d+\\.?\\d*, 0x[\\da-f]+',
			bonusPattern: '-?\\d+(\\.\\d+)?|0x[\\da-f]+|0b[01]+',
			bonusPoints: 200
		},
		{
			id: 4,
			name: 'Invasión de Código',
			enemies: [
				{ text: '<script>', type: 'danger', health: 3, speed: 0.9, points: 50 },
				{ text: 'alert()', type: 'danger', health: 2, speed: 1.1, points: 40 },
				{ text: '); DROP TABLE', type: 'sql', health: 4, speed: 0.7, points: 60 },
				{ text: '../../etc/passwd', type: 'path', health: 3, speed: 0.8, points: 45 },
				{ text: '<img src=x>', type: 'xss', health: 3, speed: 0.9, points: 50 }
			],
			hint: 'Detecta patrones peligrosos: <script>, alert, DROP, etc.',
			bonusPattern: '<script>|alert\\(|DROP TABLE|\\.\\./|<img',
			bonusPoints: 300
		},
		{
			id: 5,
			name: 'Jefe Final: URLs',
			enemies: [
				{ text: 'http://evil.com', type: 'url', health: 4, speed: 0.6, points: 70 },
				{ text: 'https://secure.bank', type: 'url', health: 4, speed: 0.6, points: 70 },
				{ text: 'ftp://files.net/data', type: 'url', health: 5, speed: 0.5, points: 80 },
				{ text: 'ws://socket.io:3000', type: 'url', health: 5, speed: 0.5, points: 80 },
				{ text: 'https://boss.final/win', type: 'boss', health: 10, speed: 0.3, points: 200 }
			],
			hint: 'URLs completas: (https?|ftp|ws)://[\\w.-]+(:[0-9]+)?(/.*)?',
			bonusPattern: '(https?|ftp|ws)://[\\w.-]+(:[0-9]+)?(/.*)?',
			bonusPoints: 500
		}
	];

	// Estado del juego
	let gameState = $state('menu'); // 'menu', 'playing', 'paused', 'victory', 'defeat'
	let currentWave = $state(0);
	let score = $state(0);
	let lives = $state(5);
	let regexPattern = $state('');
	let enemies = $state([]);
	let projectiles = $state([]);
	let explosions = $state([]);
	let soundEnabled = $state(true);
	let showHint = $state(false);
	let comboCounter = $state(0);
	let maxCombo = $state(0);
	let gameLoop = null;
	let enemySpawnTimer = null;
	let enemySpawnIndex = 0;

	// Wave actual
	let wave = $derived(waves[currentWave] || waves[0]);

	// Validar regex
	let regexValid = $derived(() => {
		try {
			if (!regexPattern) return false;
			new RegExp(regexPattern);
			return true;
		} catch {
			return false;
		}
	});

	// Clase Enemy
	class Enemy {
		constructor(config, index) {
			this.id = `enemy-${Date.now()}-${index}`;
			this.text = config.text;
			this.type = config.type;
			this.health = config.health;
			this.maxHealth = config.health;
			this.speed = config.speed * ENEMY_SPEED;
			this.points = config.points;
			this.x = GAME_WIDTH;
			this.y = 50 + Math.random() * (GAME_HEIGHT - 100);
			this.targetY = this.y + (Math.random() - 0.5) * 50;
			this.wobble = Math.random() * Math.PI * 2;
			this.alive = true;
			this.hitting = false;
		}

		update() {
			if (!this.alive) return;

			// Movimiento
			this.x -= this.speed;

			// Movimiento ondulante
			this.wobble += 0.1;
			this.y += Math.sin(this.wobble) * 0.5;

			// Si llega a la torre
			if (this.x <= TOWER_POSITION) {
				this.hitting = true;
				return true; // Daño a la torre
			}

			return false;
		}

		takeDamage() {
			this.health--;
			if (this.health <= 0) {
				this.alive = false;
				return true; // Destruido
			}
			return false;
		}

		getColor() {
			const colors = {
				simple: '#3b82f6', // blue
				email: '#8b5cf6', // purple
				number: '#10b981', // green
				hex: '#f59e0b', // amber
				binary: '#06b6d4', // cyan
				danger: '#ef4444', // red
				sql: '#dc2626', // red-600
				path: '#f97316', // orange
				xss: '#e11d48', // rose
				url: '#6366f1', // indigo
				boss: '#991b1b' // red-900
			};
			return colors[this.type] || '#6b7280';
		}
	}

	// Clase Projectile
	class Projectile {
		constructor(target) {
			this.id = `proj-${Date.now()}-${Math.random()}`;
			this.x = TOWER_POSITION + 20;
			this.y = GAME_HEIGHT / 2;
			this.target = target;
			this.speed = 10;
			this.alive = true;
		}

		update() {
			if (!this.alive || !this.target.alive) {
				this.alive = false;
				return;
			}

			// Mover hacia el objetivo
			const dx = this.target.x - this.x;
			const dy = this.target.y - this.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < 20) {
				// Impacto
				this.alive = false;
				return true;
			}

			// Normalizar y mover
			this.x += (dx / distance) * this.speed;
			this.y += (dy / distance) * this.speed;

			return false;
		}
	}

	// Clase Explosion
	class Explosion {
		constructor(x, y, color = '#fbbf24') {
			this.id = `exp-${Date.now()}-${Math.random()}`;
			this.x = x;
			this.y = y;
			this.color = color;
			this.size = 0;
			this.maxSize = 40;
			this.alive = true;
		}

		update() {
			this.size += 4;
			if (this.size >= this.maxSize) {
				this.alive = false;
			}
		}
	}

	// Disparar con regex
	function fireRegex() {
		if (!regexValid() || gameState !== 'playing') return;

		try {
			const regex = new RegExp(regexPattern, 'g');
			let hits = 0;

			enemies = enemies.map(enemy => {
				if (enemy.alive && regex.test(enemy.text)) {
					// Crear projectil
					projectiles = [...projectiles, new Projectile(enemy)];
					hits++;

					// Aplicar daño (se hace en el update del projectil)
					setTimeout(() => {
						if (enemy.takeDamage()) {
							// Enemigo destruido
							score += enemy.points * (1 + comboCounter * 0.1);
							comboCounter++;
							if (comboCounter > maxCombo) maxCombo = comboCounter;

							// Crear explosión
							explosions = [...explosions, new Explosion(enemy.x, enemy.y, enemy.getColor())];

							// Sonido
							if (soundEnabled) playSound('hit');
						}
					}, 200);
				}
				regex.lastIndex = 0; // Reset para próxima prueba
				return enemy;
			});

			if (hits === 0) {
				comboCounter = 0;
			}

			// Bonus por destruir todos de una vez
			if (hits === enemies.filter(e => e.alive).length && hits >= 3) {
				score += wave.bonusPoints;
				if (soundEnabled) playSound('bonus');
			}

		} catch (e) {
			console.error('Regex error:', e);
		}
	}

	// Spawn de enemigos
	function spawnNextEnemy() {
		if (enemySpawnIndex < wave.enemies.length && gameState === 'playing') {
			const enemyConfig = wave.enemies[enemySpawnIndex];
			enemies = [...enemies, new Enemy(enemyConfig, enemySpawnIndex)];
			enemySpawnIndex++;

			// Programar siguiente spawn
			enemySpawnTimer = setTimeout(spawnNextEnemy, 2000 + Math.random() * 1000);
		}
	}

	// Game loop principal
	function updateGame() {
		if (gameState !== 'playing') return;

		// Actualizar enemigos
		enemies = enemies.filter(enemy => {
			if (!enemy.alive) return false;

			if (enemy.update()) {
				// Enemigo llegó a la torre
				lives--;
				if (soundEnabled) playSound('damage');

				if (lives <= 0) {
					endGame(false);
				}
				return false;
			}
			return true;
		});

		// Actualizar projectiles
		projectiles = projectiles.filter(proj => {
			if (!proj.alive) return false;
			proj.update();
			return proj.alive;
		});

		// Actualizar explosiones
		explosions = explosions.filter(exp => {
			exp.update();
			return exp.alive;
		});

		// Verificar victoria de oleada
		if (enemySpawnIndex >= wave.enemies.length && enemies.length === 0) {
			nextWave();
		}
	}

	// Iniciar juego
	function startGame() {
		gameState = 'playing';
		currentWave = 0;
		score = 0;
		lives = 5;
		enemies = [];
		projectiles = [];
		explosions = [];
		comboCounter = 0;
		maxCombo = 0;
		enemySpawnIndex = 0;

		// Iniciar spawn de enemigos
		spawnNextEnemy();

		// Iniciar game loop
		gameLoop = setInterval(updateGame, 1000 / 60); // 60 FPS
	}

	// Pausar/reanudar
	function togglePause() {
		if (gameState === 'playing') {
			gameState = 'paused';
			clearInterval(gameLoop);
			clearTimeout(enemySpawnTimer);
		} else if (gameState === 'paused') {
			gameState = 'playing';
			gameLoop = setInterval(updateGame, 1000 / 60);
			enemySpawnTimer = setTimeout(spawnNextEnemy, 1000);
		}
	}

	// Siguiente oleada
	function nextWave() {
		comboCounter = 0;

		if (currentWave < waves.length - 1) {
			currentWave++;
			enemySpawnIndex = 0;
			score += 500; // Bonus por completar oleada

			// Pequeña pausa entre oleadas
			gameState = 'paused';
			setTimeout(() => {
				if (gameState === 'paused') {
					gameState = 'playing';
					spawnNextEnemy();
				}
			}, 3000);
		} else {
			// Victoria total
			endGame(true);
		}
	}

	// Fin del juego
	function endGame(victory) {
		gameState = victory ? 'victory' : 'defeat';
		clearInterval(gameLoop);
		clearTimeout(enemySpawnTimer);

		if (victory) {
			score += lives * 1000; // Bonus por vidas restantes
			score += maxCombo * 50; // Bonus por combo máximo
		}
	}

	// Reiniciar nivel actual
	function retryWave() {
		enemies = [];
		projectiles = [];
		explosions = [];
		enemySpawnIndex = 0;
		lives = 5;
		gameState = 'playing';

		spawnNextEnemy();
		gameLoop = setInterval(updateGame, 1000 / 60);
	}

	// Sonidos (simulados)
	function playSound(type) {
		// Aquí irían los efectos de sonido reales
		console.log('🔊 Sound:', type);
	}

	// Limpiar al desmontar
	onMount(() => {
		return () => {
			clearInterval(gameLoop);
			clearTimeout(enemySpawnTimer);
		};
	});

	// Atajos de teclado
	function handleKeydown(e) {
		if (e.key === 'Enter' && regexValid()) {
			fireRegex();
		} else if (e.key === ' ' && gameState !== 'menu') {
			e.preventDefault();
			togglePause();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="regex-defender-game max-w-7xl mx-auto p-6">
	<!-- Header -->
	<div class="bg-white rounded-xl shadow-lg p-4 mb-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<Shield class="w-8 h-8 text-blue-500" />
				<div>
					<h1 class="text-2xl font-bold">Regex Defender</h1>
					<p class="text-gray-600">Oleada {currentWave + 1}: {wave.name}</p>
				</div>
			</div>

			<div class="flex items-center gap-6">
				<!-- Vidas -->
				<div class="flex items-center gap-2">
					<Heart class="w-5 h-5 text-red-500" />
					<div class="flex gap-1">
						{#each Array(5) as _, i}
							<div class="w-4 h-4 {i < lives ? 'bg-red-500' : 'bg-gray-300'} rounded-sm"></div>
						{/each}
					</div>
				</div>

				<!-- Puntuación -->
				<div class="flex items-center gap-2">
					<Trophy class="w-5 h-5 text-yellow-500" />
					<span class="font-bold text-lg">{score.toLocaleString()}</span>
				</div>

				<!-- Combo -->
				{#if comboCounter > 0}
					<div class="flex items-center gap-2" transition:scale>
						<Zap class="w-5 h-5 text-purple-500" />
						<span class="font-bold text-purple-600">x{comboCounter}</span>
					</div>
				{/if}

				<!-- Controles -->
				<div class="flex gap-2">
					<button
						onclick={() => soundEnabled = !soundEnabled}
						class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
						aria-label="Toggle sound"
					>
						{#if soundEnabled}
							<Volume2 class="w-5 h-5" />
						{:else}
							<VolumeX class="w-5 h-5 text-gray-400" />
						{/if}
					</button>

					{#if gameState === 'playing' || gameState === 'paused'}
						<button
							onclick={togglePause}
							class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
							aria-label="Pause game"
						>
							{#if gameState === 'playing'}
								<Pause class="w-5 h-5" />
							{:else}
								<Play class="w-5 h-5" />
							{/if}
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Game Area -->
	<div class="bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 relative overflow-hidden"
		 style="min-height: 500px;">

		{#if gameState === 'menu'}
			<!-- Menu principal -->
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
					<Shield class="w-20 h-20 text-blue-500 mx-auto mb-4" />
					<h2 class="text-3xl font-bold mb-4">Regex Defender</h2>
					<p class="text-gray-600 mb-6">
						¡Defiende tu base de los strings invasores usando el poder de las expresiones regulares!
					</p>
					<button
						onclick={startGame}
						class="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
					>
						Comenzar Juego
					</button>

					<div class="mt-6 text-left bg-gray-50 rounded-lg p-4">
						<h3 class="font-semibold mb-2">Cómo jugar:</h3>
						<ul class="text-sm text-gray-600 space-y-1">
							<li>• Escribe un regex para destruir enemigos</li>
							<li>• Presiona Enter o el botón para disparar</li>
							<li>• Combos aumentan tu puntuación</li>
							<li>• No dejes que lleguen a tu torre</li>
							<li>• Espacio para pausar</li>
						</ul>
					</div>
				</div>
			</div>

		{:else if gameState === 'playing' || gameState === 'paused'}
			<!-- Campo de batalla -->
			<div class="relative" style="height: {GAME_HEIGHT}px;">
				<!-- Torre del jugador -->
				<div class="absolute left-0 top-1/2 -translate-y-1/2"
					 style="left: {TOWER_POSITION - 20}px;">
					<div class="w-16 h-24 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-lg relative">
						<Shield class="w-8 h-8 text-blue-400 absolute top-2 left-1/2 -translate-x-1/2" />
						{#each Array(lives) as _, i}
							<div class="absolute w-2 h-2 bg-red-500 rounded-full animate-pulse"
								 style="bottom: {4 + i * 3}px; left: 50%; transform: translateX(-50%);"></div>
						{/each}
					</div>
				</div>

				<!-- Enemigos -->
				{#each enemies as enemy (enemy.id)}
					{#if enemy.alive}
						<div class="absolute transition-all duration-100"
							 style="left: {enemy.x}px; top: {enemy.y}px; transform: translate(-50%, -50%);"
							 in:fly={{ x: 100, duration: 300 }}
							 out:scale={{ duration: 200 }}>
							<div class="relative">
								<!-- Barra de vida -->
								<div class="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full">
									<div class="h-full bg-green-500 rounded-full transition-all"
										 style="width: {(enemy.health / enemy.maxHealth) * 100}%"></div>
								</div>

								<!-- Texto del enemigo -->
								<div class="px-3 py-1 rounded-lg text-white font-mono text-sm font-bold shadow-lg transform transition-transform hover:scale-110"
									 style="background-color: {enemy.getColor()};"
									 class:animate-pulse={enemy.hitting}>
									{enemy.text}
								</div>
							</div>
						</div>
					{/if}
				{/each}

				<!-- Proyectiles -->
				{#each projectiles as proj (proj.id)}
					{#if proj.alive}
						<div class="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-lg animate-pulse"
							 style="left: {proj.x}px; top: {proj.y}px; transform: translate(-50%, -50%);">
							<div class="absolute inset-0 bg-yellow-300 rounded-full animate-ping"></div>
						</div>
					{/if}
				{/each}

				<!-- Explosiones -->
				{#each explosions as exp (exp.id)}
					{#if exp.alive}
						<div class="absolute rounded-full opacity-60 pointer-events-none"
							 style="left: {exp.x}px; top: {exp.y}px;
									width: {exp.size}px; height: {exp.size}px;
									background-color: {exp.color};
									transform: translate(-50%, -50%);"
							 out:fade={{ duration: 300 }}>
						</div>
					{/if}
				{/each}

				<!-- Mensaje de pausa -->
				{#if gameState === 'paused'}
					<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
						 transition:fade>
						<div class="bg-white rounded-lg p-6 text-center">
							<Pause class="w-12 h-12 text-gray-600 mx-auto mb-2" />
							<p class="text-xl font-bold">Juego Pausado</p>
							<p class="text-gray-600">Presiona Espacio para continuar</p>
						</div>
					</div>
				{/if}
			</div>

			<!-- Control de regex -->
			<div class="mt-6 bg-white rounded-lg p-4">
				<div class="flex gap-4 items-end">
					<div class="flex-1">
						<label for="regex-input" class="block text-sm font-medium text-gray-700 mb-1">
							Tu Arma Regex:
						</label>
						<div class="flex gap-2">
							<input
								id="regex-input"
								type="text"
								bind:value={regexPattern}
								placeholder="Escribe tu patrón regex..."
								disabled={gameState === 'paused'}
								class="flex-1 px-4 py-2 border-2 {regexValid() ? 'border-green-500' : regexPattern ? 'border-red-500' : 'border-gray-300'}
									   rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg"
							/>
							<button
								onclick={fireRegex}
								disabled={!regexValid() || gameState === 'paused'}
								class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300
									   disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
							>
								<Zap class="w-5 h-5" />
								Disparar
							</button>
						</div>
					</div>

					<button
						onclick={() => showHint = !showHint}
						class="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
					>
						<AlertTriangle class="w-5 h-5" />
					</button>
				</div>

				{#if showHint}
					<div class="mt-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
						<p class="text-sm text-yellow-800">💡 <strong>Pista:</strong> {wave.hint}</p>
						{#if wave.bonusPattern}
							<p class="text-xs text-yellow-600 mt-1">🎯 Patrón bonus: <code class="bg-yellow-100 px-1 rounded">{wave.bonusPattern}</code></p>
						{/if}
					</div>
				{/if}
			</div>

		{:else if gameState === 'victory'}
			<!-- Pantalla de victoria -->
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
					<Trophy class="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
					<h2 class="text-3xl font-bold mb-4 text-green-600">¡Victoria!</h2>
					<div class="space-y-2 mb-6">
						<p class="text-xl">Puntuación Final: <strong>{score.toLocaleString()}</strong></p>
						<p class="text-gray-600">Vidas restantes: {lives} × 1000 = {lives * 1000}</p>
						<p class="text-gray-600">Combo máximo: {maxCombo} × 50 = {maxCombo * 50}</p>
					</div>
					<button
						onclick={() => onComplete(score)}
						class="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold"
					>
						Continuar
					</button>
				</div>
			</div>

		{:else if gameState === 'defeat'}
			<!-- Pantalla de derrota -->
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
					<Skull class="w-20 h-20 text-red-500 mx-auto mb-4" />
					<h2 class="text-3xl font-bold mb-4 text-red-600">¡Derrota!</h2>
					<p class="text-gray-600 mb-6">
						Los enemigos destruyeron tu torre.<br/>
						Puntuación: <strong>{score.toLocaleString()}</strong>
					</p>
					<div class="flex gap-4 justify-center">
						<button
							onclick={retryWave}
							class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center gap-2"
						>
							<RotateCcw class="w-5 h-5" />
							Reintentar
						</button>
						<button
							onclick={() => gameState = 'menu'}
							class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
						>
							Menú
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.regex-defender-game {
		user-select: none;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	:global(.animate-pulse) {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>