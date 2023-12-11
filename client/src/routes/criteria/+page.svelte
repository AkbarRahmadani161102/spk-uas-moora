<script lang="ts">
	import redirectIfNoCaseSelected from '$lib/functions/redirectIfNoCaseSelected';
	import showConfirmationDialog from '$lib/functions/showConfirmationDialog';
	import showToast from '$lib/functions/showToast';
	import { baseUrlStore } from '$lib/stores/baseUrlStore';
	import { activeCaseStudy, refreshData } from '$lib/stores/caseStudyStore';
	import { Pencil, Trash } from '@inqling/svelte-icons/heroicon-24-outline';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import type ICriteria from '../../../../lib/interfaces/ICriteria';
	import type { CriteriaType } from '../../../../lib/interfaces/ICriteria';
	let addModal: HTMLDialogElement;
	let editModal: HTMLDialogElement;
	let disableDeleteData: boolean;
	$: if ($activeCaseStudy) {
		disableDeleteData = $activeCaseStudy.alternative.some((v) => v.score.length);
	}

	let criteriaTitle: String;
	let criteriaWeight: Number = 0;
	let criteriaType: CriteriaType;
	let editCriteriaId: String;
	let editCriteriaTitle: String;
	let editCriteriaWeight: Number;
	let editCriteriaType: CriteriaType;

	onMount(() => {
		redirectIfNoCaseSelected();
	});

	const showModal = () => addModal.showModal();
	const addCriteria = async () => {
		await axios.post(`${$baseUrlStore}/criteria`, {
			caseStudy_id: $activeCaseStudy._id,
			title: criteriaTitle,
			weight: criteriaWeight,
			type: criteriaType
		});

		await refreshData();

		criteriaTitle = '';
		criteriaWeight = 0;
	};

	const showEditModal = (criteria: ICriteria) => {
		editCriteriaId = criteria._id;
		editCriteriaTitle = criteria.title;
		editCriteriaWeight = criteria.weight;
		editCriteriaType = criteria.type;
		editModal.showModal();
	};

	const updateCriteria = async () => {
		await axios.put(`${$baseUrlStore}/criteria/${editCriteriaId}`, {
			title: editCriteriaTitle,
			weight: editCriteriaWeight,
			type: editCriteriaType
		});

		await refreshData();

		showToast(`Kriteria berhasil diubah`);

		editModal.close();
	};

	const showDeleteModal = async (criteria: ICriteria) => {
		const deleteCriteriaId = criteria._id;
		const isConfirmed = await showConfirmationDialog(
			`Apakah anda yakin menghapus kriteria ${criteria.title}?`
		);
		if (isConfirmed) {
			await axios.delete($baseUrlStore + '/criteria/' + deleteCriteriaId);
			await refreshData();
			showToast(`Criteria ${criteria.title} berhasil dihapus`);
		}
	};
</script>

<svelte:head>
	<title>DSS Criteria</title>
</svelte:head>

<div class="flex items-center gap-5">
	<h1 class="text-2xl font-bold sm:text-3xl">Data Kriteria</h1>
	<button class="btn btn-md" on:click={showModal}>Tambah Kriteria</button>

	<dialog class="modal" bind:this={addModal}>
		<div class="modal-box">
			<form class="flex flex-col gap-2 items-start" on:submit|preventDefault={addCriteria}>
				<div class="flex justify-between w-full">
					<h3 class="font-bold text-lg">Tambah Kriteria</h3>
					<button type="submit" class="btn btn-primary btn-sm">Submit</button>
				</div>
				<div class="form-control w-full">
					<label for="criteria_title">
						<span class="label-text">Nama</span>
					</label>
					<input
						id="criteria_title"
						bind:value={criteriaTitle}
						type="text"
						class="input input-bordered w-full"
						required
					/>
				</div>

				<div class="flex w-full gap-5">
					<div class="form-control w-full">
						<label for="criteria_weight">
							<span class="label-text">Bobot</span>
						</label>
						<input
							id="criteria_weight"
							bind:value={criteriaWeight}
							type="number"
							step=".01"
							class="input input-bordered w-full"
							required
						/>
					</div>

					<div class="form-control w-full">
						<label for="criteria_type">
							<span class="label-text">Tipe</span>
						</label>
						<select
							name="criteria_type"
							id="criteria_type"
							bind:value={criteriaType}
							class="select select-bordered"
							required
						>
							<option value="Benefit">Benefit</option>
							<option value="Cost">Cost</option>
						</select>
					</div>
				</div>
			</form>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</div>
<div class="flex flex-col mt-5">
	<div class="overflow-x-auto">
		<table class="table">
			<thead>
				<tr>
					<th>#</th>
					<th>Nama</th>
					<th>Bobot</th>
					<th>Tipe</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{#if $activeCaseStudy && $activeCaseStudy.criteria.length}
					{#each $activeCaseStudy.criteria as criteria, i}
						<tr>
							<td>{i + 1}</td>
							<td>{criteria.title}</td>
							<td>{criteria.weight}</td>
							<td>{criteria.type}</td>
							<td>
								<button class="btn btn-sm btn-blue" on:click={() => showEditModal(criteria)}>
									<Pencil class="w-4 h-4" />
								</button>
								{#if !disableDeleteData}
									<button class="btn btn-sm btn-red" on:click={() => showDeleteModal(criteria)}>
										<Trash class="w-4 h-4" />
									</button>
								{/if}
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<dialog class="modal" bind:this={editModal}>
	<div class="modal-box">
		<form class="flex flex-col gap-2 items-start" on:submit|preventDefault={updateCriteria}>
			<div class="flex justify-between w-full">
				<h3 class="font-bold text-lg">Edit Kriteria {editCriteriaTitle}</h3>
				<button type="submit" class="btn btn-primary btn-sm">Update</button>
			</div>
			<div class="form-control w-full">
				<label for="edit_criteria_title">
					<span class="label-text">Nama</span>
				</label>
				<input
					id="edit_criteria_title"
					bind:value={editCriteriaTitle}
					type="text"
					class="input input-bordered w-full"
					required
				/>
			</div>

			<div class="flex w-full gap-5">
				<div class="form-control w-full">
					<label for="edit_criteria_weight">
						<span class="label-text">Bobot</span>
					</label>
					<input
						id="edit_criteria_weight"
						bind:value={editCriteriaWeight}
						type="number"
						class="input input-bordered w-full"
						step=".01"
						required
					/>
				</div>

				<div class="form-control w-full">
					<label for="edit_criteria_type">
						<span class="label-text">Tipe</span>
					</label>
					<select
						name="edit_criteria_type"
						id="edit_criteria_type"
						bind:value={editCriteriaType}
						class="select select-bordered"
						required
					>
						<option value="Benefit">Benefit</option>
						<option value="Cost">Cost</option>
					</select>
				</div>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
