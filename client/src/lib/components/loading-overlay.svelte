<script>
	import { loadingOverlayStore } from '$lib/stores/loadingOverlayStore';
</script>

{#if $loadingOverlayStore.isLoading}
	<div class="h-screen w-screen fixed bottom-0 left-0 bg-black bg-opacity-50 z-40">
		<div class="flex justify-center items-center h-full gap-5">
			<span class="loading loading-ring h-80 w-80" />
			<span class="text-gray-400 text-2xl animate-pulse absolute"
				>{$loadingOverlayStore.message}</span
			>
		</div>
	</div>
{/if}
