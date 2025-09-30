<script>
	import { page } from '$app/state';
	import flagEs from '$lib/assets/flags/flag-es.svg';
	import flagEn from '$lib/assets/flags/flag-en.svg';
	import { ChevronDown } from 'lucide-svelte';
	import { setLocale, getLocale, localizeHref } from '$lib/paraglide/runtime';

	let showDropdown = $state(false);

	const languages = [
		{ code: 'es', name: 'Español', flag: flagEs },
		{ code: 'en', name: 'English', flag: flagEn }
	];

	/**
	 * @param {'es'|'en'} locale
	 */
	function changeLanguage(locale) {
		showDropdown = false;
		setLocale(locale);
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	// Cerrar dropdown al hacer click fuera
	/**
	 * @param {any} event
	 */
	function handleClickOutside(event) {
		if (!event.target.closest('.language-selector')) {
			showDropdown = false;
		}
	}
	let currentLanguage = /**@type {{code: string, name: string, flag: string}}*/ (
		$derived(languages.find((lang) => lang.code === getLocale()) || languages[0])
	);
	$effect(() => {
		if (showDropdown) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

<div class="language-selector relative">
	<button
		onclick={toggleDropdown}
		class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm transition-colors hover:bg-gray-50"
		aria-label="Select language"
	>
		{#if currentLanguage}
			<img src={currentLanguage.flag} alt={currentLanguage.name} class="h-5 w-5 rounded" />
			<span class="text-sm font-medium text-gray-700">{currentLanguage.name}</span>
		{/if}
		<ChevronDown
			size="16"
			class="text-gray-500 transition-transform {showDropdown ? 'rotate-180' : ''}"
		/>
	</button>

	{#if showDropdown}
		<div
			class="absolute top-full right-0 z-50 mt-1 min-w-full rounded-lg border border-gray-200 bg-white shadow-lg"
		>
			{#each languages as language (language.code)}
				<a
					onclick={() => changeLanguage(/**@type { 'es' | 'en' } */ (language.code))}
					href={localizeHref(page.url.pathname, { locale: language.code })}
					class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50
					{language.code === getLocale() ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}"
				>
					<img src={language.flag} alt={language.name} class="h-5 w-5 rounded" />
					<span class="text-sm font-medium">{language.name}</span>
					{#if language.code === getLocale()}
						<span class="ml-auto text-blue-500">✓</span>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-selector {
		user-select: none;
	}
</style>
