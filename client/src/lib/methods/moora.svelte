<script lang="ts">
	import pivot from '$lib/functions/pivot';
	import type IFinalResult from '$lib/interface/IFinalResult';
	import { activeCaseStudy } from '$lib/stores/caseStudyStore';

	interface IFinalResultMoora extends IFinalResult {
		max: number;
		min: number;
	}

	interface ICalculatedYi {
		min: number[];
		max: number[];
		yi: number[];
	}

	let finalResult: IFinalResultMoora[];
	let finalResultScoreName: string;
	let showDetails: boolean = false;

	const criteriaArray = $activeCaseStudy.criteria;
	const alternativeArray = $activeCaseStudy.alternative;

	/**
	 * Calculate divider for each criteria
	 */
	const calculateDivider = () => {
		const scores: number[][] = pivot(alternativeArray.map((a) => a.score.map((s) => s.score)));

		return scores.map((segment) =>
			Math.sqrt(
				segment.reduce((prev, current) => {
					return prev + current ** 2;
				}, 0)
			)
		);
	};

	const calculateNormalized = (calculatedDivider: number[]) => {
		const scores: number[][] = pivot(alternativeArray.map((a) => a.score.map((s) => s.score)));

		const normalized: number[][] = [];
		scores.map((scores, i) => {
			const segment: number[] = [];
			scores.map((score, j) => {
				const value = score / calculatedDivider[i];
				segment.push(value);
			});
			normalized.push(segment);
		});

		return normalized;
	};

	const calculateOptimization = (calculatedNormalized: number[][]) => {
		const optimized: number[][] = [];
		calculatedNormalized.map((scores, i) => {
			const segment: number[] = [];
			scores.map((score, j) => {
				const value = score * criteriaArray[i].weight;
				segment.push(value);
			});
			optimized.push(segment);
		});
		return pivot(optimized);
	};

	const calculateYi = (calculatedOptimization: number[][]) => {
		let result: ICalculatedYi = { min: [], max: [], yi: [] };
		const min: number[] = [];
		const max: number[] = [];
		const yi: number[] = [];
		calculatedOptimization.map((scores, i) => {
			let minElement = scores
				.map((score, i) => {
					if (criteriaArray[i].type.toLowerCase() === 'cost') {
						return score;
					}
					return 0;
				})
				.reduce((prev, current) => {
					return prev + current;
				}, 0);

			let maxElement = scores
				.map((score, i) => {
					if (criteriaArray[i].type.toLowerCase() === 'benefit') {
						return score;
					}
					return 0;
				})
				.reduce((prev, current) => {
					return prev + current;
				}, 0);

			max.push(maxElement);
			min.push(minElement);
			yi.push(maxElement - minElement);
		});
		result.max = max;
		result.min = min;
		result.yi = yi;
		return result;
	};

	const calculateRanks = (calculatedYi: ICalculatedYi) => {
		const ranks: IFinalResultMoora[] = [];

		const sorted = [...calculatedYi.yi].sort((a, b) => {
			if (a < b) {
				return 1;
			} else if (a > b) {
				return -1;
			}
			return 0; // (If Equal then dont sort)
		});

		calculatedYi.yi.map((score, i) => {
			ranks.push({
				altName: alternativeArray[i].title,
				score: score,
				rank: sorted.indexOf(score) + 1,
				max: calculatedYi.max[i],
				min: calculatedYi.min[i]
			});
		});

		return ranks;
	};

	const applyingFinalResult = (calculatedRanks: IFinalResultMoora[]) => {
		// Mapping
		const scoreName = 'Yi Score';
		finalResult = calculatedRanks.map((result) => ({
			altName: result.altName,
			score: result.score,
			rank: result.rank,
			max: result.max,
			min: result.min
		}));

		finalResult.sort((a, b) => {
			if (a.rank > b.rank) {
				return 1;
			} else if (a.rank < b.rank) {
				return -1;
			}
			return 0; // (If Equal then dont sort)
		});

		finalResultScoreName = scoreName;
	};

	const calculatedDivider = calculateDivider();
	const calculatedNormalized = calculateNormalized(calculatedDivider);
	const calculatedOptimization = calculateOptimization(calculatedNormalized);
	const calculatedYi = calculateYi(calculatedOptimization);
	const calculatedRanks = calculateRanks(calculatedYi);
	applyingFinalResult(calculatedRanks);
</script>

<svelte:head>
	<title>DSS Result - Moora</title>
</svelte:head>

<div class="flex flex-col gap-5 mt-5">
	{#if finalResult && finalResultScoreName}
		<table class="table">
			<thead>
				<tr>
					<th>Alternative</th>
					<th>{finalResultScoreName}</th>
					<th>Rank</th>
				</tr>
			</thead>

			<tbody>
				{#each finalResult as result}
					<tr>
						<td>{result.altName}</td>
						<td>{result.score}</td>
						<td>{result.rank}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="collapse bg-base-200">
			<input type="checkbox" name="my-accordion-1" bind:checked={showDetails} />
			<div class="collapse-title text-xl font-medium text-center">Detail Perhitungan</div>
			<div class="collapse-content">
				<p class="text-lg font-bold my-5 ml-4">Normalisasi</p>
				<table class="table">
					<thead>
						<tr>
							<th>Alternatif</th>
							{#each criteriaArray as criteria}
								<th>{criteria.title}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each alternativeArray as alternative, i}
							<tr>
								<td>{alternative.title}</td>
								{#each pivot(calculatedNormalized)[i] as normal}
									<td>{normal}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>

				<p class="text-lg font-bold my-5 ml-4">Optimasi</p>
				<table class="table">
					<thead>
						<tr>
							<th>Alternatif</th>
							{#each criteriaArray as criteria}
								<th>{criteria.title}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each alternativeArray as alternative, i}
							<tr>
								<td>{alternative.title}</td>
								{#each pivot(calculatedOptimization) as optimized}
									<td>{optimized[i]}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>

				<p class="text-lg font-bold my-5 ml-4">Yi Score</p>
				<table class="table">
					<thead>
						<tr>
							<th>Alternatif</th>
							<th>Max</th>
							<th>Min</th>
							<th>Yi</th>
							<th>Rank</th>
						</tr>
					</thead>
					<tbody>
						{#each calculatedRanks as rank}
							<tr>
								<td>{rank.altName}</td>
								<td>{rank.max}</td>
								<td>{rank.min}</td>
								<td>{rank.score}</td>
								<td>{rank.rank}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
