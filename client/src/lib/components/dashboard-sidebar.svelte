<script>
	import { Bars3, Home, Key, Scale, TableCells } from '@inqling/svelte-icons/heroicon-24-outline';
</script>

<div class="drawer-side">
	<label for="dashboard-sidebar" aria-label="close sidebar" class="drawer-overlay" />
	<ul class="menu p-4 w-80 min-h-full bg-base-100 border-r border-r-base-300">
		<div class="flex justify-between items-center">
			<span class="text-xl font-bold ml-4 my-3">DSS</span>
			<label for="dashboard-sidebar" class="drawer-button btn btn-square btn-ghost md:hidden">
				<Bars3 class="w-5 h-5" />
			</label>
		</div>
		<li><a href="/"><Home class="w-4 h-4" /> Dashboard</a></li>
		<li><a href="/alternative"><Key class="w-4 h-4" /> Alternatif</a></li>
		<li><a href="/criteria"><Scale class="w-4 h-4" /> Kriteria</a></li>
		<li>
			<details>
				<summary><TableCells class="w-4 h-4" /> Scoring</summary>
				<ul>
					<li><a href="/score">Data Skor</a></li>
					<li><a href="/score/result">Hasil Akhir</a></li>
				</ul>
			</details>
		</li>
	</ul>
</div>
