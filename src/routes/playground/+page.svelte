<script>
	import PlaygroundInterface from '$lib/components/PlaygroundInterface.svelte';
	import LanguageSelector from '$lib/components/LanguageSelector.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';
</script>

<svelte:head>
	<title>{m.playground_interactive()} - {m.app_title()}</title>
	<meta name="description" content={m.playground_subtitle()} />
	<meta name="keywords" content="regex, regular expressions, playground, interactive, visual, tutorial, learn" />
	<meta property="og:title" content="{m.playground_interactive()} - {m.app_title()}" />
	<meta property="og:description" content={m.playground_subtitle()} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{m.playground_interactive()} - {m.app_title()}" />
	<meta name="twitter:description" content={m.playground_subtitle()} />
	<link rel="canonical" href="/playground" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
	<!-- Header with navigation -->
	<div class="bg-white border-b border-gray-200 sticky top-0 z-10">
		<div class="max-w-7xl mx-auto px-6 py-4">
			<div class="flex items-center justify-between">
				<a
					href={localizeHref('/')}
					class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
				>
					<ArrowLeft size="20" />
					{m.back_to_home()}
				</a>
				<LanguageSelector />
			</div>
		</div>
	</div>

	<!-- Playground content -->
	<PlaygroundInterface />
</div>