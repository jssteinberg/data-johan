<script>
	import A11yWrapper, { a11yTitle } from '../components/A11yAppWrapper.svelte';
	import Nav from '../components/Nav.svelte';

	const updateA11yTitle = () => {
		if (!segment) a11yTitle.set('Home');
		else a11yTitle.set('');
	};

	$: updatedA11yTitle = updateA11yTitle(segment);

	export let segment;
</script>

<style global>
	@import 'floor-typography-css/src/reset.css';
	@import 'floor-typography-css/src/normalize-style.css';
	@import 'floor-typography-css/src/vars.css';
	/* Files below are optional: */
	@import 'floor-typography-css/src/headings-font.css';
	@import 'floor-typography-css/src/headings-font-lg.css' (min-width: 1200px);
	@import 'floor-typography-css/src/headings-margin.css';
	@import 'floor-typography-css/src/classes-sr.css';

	body {
		--space: calc(1rem * (1 + var(--added-lead)));
		--font-system: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

		max-width: 50em;
		margin: var(--space, 1em) auto;
		padding: 0 1ch;
		font-family: var(--font-system);
	}
</style>

<A11yWrapper class="page">
	<div slot="header">
		<Nav {segment}></Nav>
	</div>

	<slot></slot>
</A11yWrapper>
