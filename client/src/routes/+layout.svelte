<script>
	import DashboardNavbar from '$lib/components/dashboard-navbar.svelte';
	import DashboardSidebar from '$lib/components/dashboard-sidebar.svelte';
	import LoadingOverlay from '$lib/components/loading-overlay.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { getCaseStudyList } from '../lib/stores/caseStudyStore';
	onMount(async () => {
		await getCaseStudyList();
	});
</script>

<body>
	<LoadingOverlay />
	<div class="drawer lg:drawer-open">
		<input id="dashboard-sidebar" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content overflow-x-auto">
			<DashboardNavbar />
			<div class="pt-4 lg:pt-8 px-4 sm:px-8 md:px-8 lg:pl-10 min-h-full">
				<slot />
			</div>
		</div>
		<DashboardSidebar />
	</div>
</body>
