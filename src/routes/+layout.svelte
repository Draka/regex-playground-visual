<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Download, Heart } from 'lucide-svelte';
	import { SiGithub } from '@icons-pack/svelte-simple-icons';
	import { m } from '$lib/paraglide/messages.js';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<!-- Favicon moderno (SVG) para navegadores actuales -->
	<link rel="icon" href={favicon} type="image/svg+xml" />

	<!-- Fallback para navegadores antiguos -->
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

	<!-- Apple Touch Icons -->
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

	<!-- Android Chrome -->
	<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
	<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

	<!-- PWA Manifest -->
	<link rel="manifest" href="/site.webmanifest" />

	<!-- Theme color para navegadores móviles -->
	<meta name="theme-color" content="#3B82F6" />
</svelte:head>

<!-- GitHub Header Bar -->
<div class="bg-gray-900 px-4 py-2 text-white">
	<div class="mx-auto flex max-w-7xl items-center justify-between text-sm">
		<div class="flex items-center gap-4">
			<a
				href="https://github.com/draka/regex-playground-visual"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-2 transition-colors hover:text-gray-300"
			>
				<SiGithub size={16} />
				{m.help_contribute_github()}
			</a>
			<a
				href="https://github.com/draka/regex-playground-visual/archive/main.zip"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-2 transition-colors hover:text-gray-300"
			>
				<Download size="16" />
				{m.download_source_code()}
			</a>
		</div>
		<div class="hidden text-xs text-gray-400 sm:block">
			{m.open_source_message()}
		</div>
	</div>
</div>

<!-- Main content -->
<main>
	{@render children?.()}
</main>

<!-- Footer -->
<footer class="border-t border-gray-200 bg-gray-50 py-6">
	<div class="mx-auto max-w-7xl px-6 text-center">
		<div class="flex items-center justify-center gap-2 text-sm text-gray-600">
			<span>{m.made_with()}</span>
			<Heart size="14" class="text-red-500" />
			<span>{m.by()}</span>
			<a
				href="https://pixeldunord.com"
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold text-blue-600 transition-colors hover:text-blue-800"
			>
				Pixel Du Nord
			</a>
		</div>
		<p class="mt-2 text-xs text-gray-500">
			{m.footer_description()}
		</p>
	</div>
</footer>

<div class="hidden">
	<div style="display:none">
		{#each locales as locale (locale)}
			<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
		{/each}
	</div>
</div>
