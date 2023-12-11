<script lang="ts">
	import redirectIfNoCaseSelected from '$lib/functions/redirectIfNoCaseSelected';
	import showToast from '$lib/functions/showToast';
	import { baseUrlStore } from '$lib/stores/baseUrlStore';
	import { activeCaseStudy, refreshData } from '$lib/stores/caseStudyStore';
	import axios from 'axios';
	import { onMount } from 'svelte';

	onMount(() => {
		redirectIfNoCaseSelected();
	});

	const changeAlternative = async (e: any) => {
		const _id = e.target.getAttribute('data-id');
		const { value } = e.target;

		await axios.patch(`${$baseUrlStore}/alternative/${_id}`, {
			title: value
		});

		await refreshData();

		showToast('Nama alternatif berhasil diubah');
	};

	const changeScore = async (e: any) => {
		const _id = e.target.getAttribute('data-id');
		const { value } = e.target;

		await axios.patch(`${$baseUrlStore}/score/${_id}`, {
			score: value
		});

		await refreshData();

		showToast('Skor berhasil diubah');
	};

	const assignNewScore = async (e: any) => {
		const row = e.target.parentElement.parentElement.rowIndex - 1;
		const cell = e.target.parentElement.cellIndex - 1;
		const score = e.target.value;

		const criteria = $activeCaseStudy.criteria[cell];
		const alternative = $activeCaseStudy.alternative[row];

		await axios.post($baseUrlStore + '/score', {
			score,
			alternativeId: alternative._id,
			criteriaId: criteria._id
		});
		await refreshData();

		showToast(
			`Berhasil ditambah\nSkor: ${score}\nKriteria: ${criteria.title}\nAlternatif: ${alternative.title}`
		);
	};
</script>

<svelte:head>
	<title>DSS Scoring</title>
</svelte:head>

<div class="flex items-center gap-5">
	<h1 class="text-2xl font-bold sm:text-3xl">Data Skor</h1>
</div>

<div class="flex flex-col mt-5">
	<div class="overflow-x-auto">
		<table class="table">
			<thead>
				<tr>
					<th>Alternatif</th>
					{#if $activeCaseStudy && $activeCaseStudy.criteria.length}
						{#each $activeCaseStudy.criteria as criteria}
							<th>{criteria.title}</th>
						{/each}
					{/if}
				</tr>
			</thead>
			<tbody>
				{#if $activeCaseStudy && $activeCaseStudy.alternative.length}
					{#each $activeCaseStudy.alternative as alternative, alternativeIndex}
						<tr>
							<td class="p-0">
								<input
									type="text"
									value={alternative.title}
									data-id={alternative._id}
									class="h-full w-full p-3"
									step=".01"
									on:change={changeAlternative}
								/>
							</td>
							<!-- {console.log(alternative.score)} -->
							{#each $activeCaseStudy.criteria as criteria, criteriaIndex}
								<!-- {console.log(criteria._id)} -->
								<!-- {console.log('Current Alternative Index: ', alternativeIndex)} -->
								<!-- {console.log('Current Criteria Index: ', criteriaIndex)} -->
								{#if alternative.score[criteriaIndex] && alternative.score[criteriaIndex].criteria && alternative.score[criteriaIndex].criteria._id === criteria._id}
									<td class="p-0">
										<input
											type="number"
											data-id={alternative.score[criteriaIndex]._id}
											value={alternative.score[criteriaIndex].score}
											class="h-full w-full p-3"
											step=".01"
											on:change={changeScore}
										/>
									</td>
								{:else}
									<td class="p-0">
										<input type="number" class="h-full w-full p-3" on:change={assignNewScore} />
									</td>
								{/if}
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
