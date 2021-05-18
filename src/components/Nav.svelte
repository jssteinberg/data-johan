<script>
	export let segment;
</script>

<nav>
	<ul>
		<li><a aria-current="{segment === undefined ? 'page' : undefined}" href="/">Front</a></li>
		<li><a aria-current="{segment === 'about' ? 'page' : undefined}" href="/about">About</a></li>

		<!-- for the blog link, we're using sapper:prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
			  <li><a sapper:prefetch aria-current="{segment === 'blog' ? 'page' : undefined}" href="/blog">Blog</a></li>
	</ul>
</nav>
