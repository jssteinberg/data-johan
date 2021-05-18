<script context="module">
	import { writable } from 'svelte/store';
	/** @type {string} a11yTitle - A store to use for the title to announce on
	  * route change for screen readers. */
	export const a11yTitle = writable('');
</script>

<script>
	import { stores } from '@sapper/app';
	import { tick } from 'svelte';

	export {
		classes as class,
		language as lang,
	};
	export let toMainLabel = 'Main content';
	export let toTopLabel = 'Top of page';

	const { page } = stores();
	const accessibleRouteChange = async () => {
		if (!elWrapper) return;
		// Two ticks are needed for some reason for Sapper to finish route change
		// stuff, including scrolling to top
		await tick(); await tick();
		// Focus wrapper without scroll (Sapper does that)
		elWrapper.focus({ preventScroll: true });
	};
	const focusMain = () => {
		if (!elMain) return;
		elMain.focus({ preventScroll: true });
		elMain.scrollIntoView({ behavior: 'smooth' });
	};
	const focusTop = () => {
		if (!elWrapper) return;
		elWrapper.focus({ preventScroll: true });
		elWrapper.scrollIntoView({ behavior: 'smooth' });
	};

	let classes = null;
	let language = null;
	let elMain;
	let elWrapper;
	let pathname = '';

	page.subscribe(val => {
		pathname = val.path.replace(/\/$/, '');
		accessibleRouteChange();
	});
</script>

<div
	tabindex="-1"
	bind:this={elWrapper}
	class="{classes ? classes : undefined}"
	lang="{language ? language : undefined}"
	>
	<a
		href={pathname}#main
		class="sr-only-focusable link-skip to-main"
		on:click|preventDefault={focusMain}
		>
		<span class=inner-wrapper aria-hidden=true>
			{toMainLabel}
		</span>
	</a>

	<header>
		<slot name="header"></slot>
	</header>

	<main id="main" tabindex="-1" bind:this="{elMain}">
		<slot></slot>
	</main>

	<footer>
		<slot name="footer">
			<hr>
			<!-- Part of a11y SPA routing: announce title (equivalent) on route change. -->
			<p aria-live="polite" role="region">
				<em>
					{$a11yTitle || pathname.replace(/^\//, '').replace(/^\w/, c => c.toUpperCase()) || 'Front'}
				</em>
			</p>
		</slot>

		<a
			href="{pathname}#"
			class="link-skip to-top"
			on:click|preventDefault={focusTop}
			>
			<slot name="to-top-link">
				{toTopLabel}
			</slot>
		</a>
	</footer>
</div>

<style>
	[tabindex="-1"] {
		outline: none;
	}
</style>
