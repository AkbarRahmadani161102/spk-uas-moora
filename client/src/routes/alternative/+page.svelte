<script lang="ts">
	import redirectIfNoCaseSelected from '$lib/functions/redirectIfNoCaseSelected';
	import showConfirmationDialog from '$lib/functions/showConfirmationDialog';
	import showToast from '$lib/functions/showToast';
	import { baseUrlStore } from '$lib/stores/baseUrlStore';
	import { activeCaseStudy, refreshData } from '$lib/stores/caseStudyStore';
	import { Pencil, Trash } from '@inqling/svelte-icons/heroicon-24-outline';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import type IAlternative from '../../../../lib/interfaces/IAlternative';
	let addModal: HTMLDialogElement;
	let editModal: HTMLDialogElement;
	let alternativeTitle: string;
	let editAlternativeId: string;
	let editAlternativeTitle: string;
	let disableDeleteData: boolean;
	$: if ($activeCaseStudy) {
		disableDeleteData = $activeCaseStudy.criteria.length > 0;
	}

	onMount(() => {
		redirectIfNoCaseSelected();
	});

	const showModal = () => addModal.showModal();

	const addAlternative = async () => {
		await axios.post(`${$baseUrlStore}/alternative`, {
			caseStudy_id: $activeCaseStudy._id,
			title: alternativeTitle
		});

		await refreshData();

		alternativeTitle = '';
	};

	const showEditModal = (alternative: IAlternative) => {
		editAlternativeId = alternative._id;
		editAlternativeTitle = alternative.title;
		editModal.showModal();
	};

	const showDeleteModal = async (alternative: IAlternative) => {
		const deleteCriteriaId = alternative._id;
		const isConfirmed = await showConfirmationDialog(
			`Apakah anda yakin menghapus alternatif ${alternative.title}?`
		);
		if (isConfirmed) {
			await axios.delete($baseUrlStore + '/alternative/' + deleteCriteriaId);
			await refreshData();
			showToast(`Alternatif ${alternative.title} berhasil dihapus`);
		}
	};

	const updateAlternative = async () => {
		await axios.patch(`${$baseUrlStore}/alternative/${editAlternativeId}`, {
			title: editAlternativeTitle
		});

		editModal.close();

		await refreshData();
		showToast(`Alternatif berhasil diubah`);
	};
</script>

<svelte:head>
	<title>DSS Alternative</title>
</svelte:head>

<div class="flex items-center gap-5">
	<h1 class="text-2xl font-bold sm:text-3xl">Data Alternatif</h1>
	<button class="btn btn-md" on:click={showModal}>Tambah Alternatif</button>

	<dialog id="my_modal_2" class="modal" bind:this={addModal}>
		<div class="modal-box">
			<form
				action=""
				class="flex flex-col gap-5 items-start"
				on:submit|preventDefault={addAlternative}
			>
				<div class="flex justify-between w-full">
					<h3 class="font-bold text-lg">Tambah Alternatif</h3>
					<button type="submit" class="btn btn-primary btn-sm">Submit</button>
				</div>
				<input
					bind:value={alternativeTitle}
					type="text"
					class="input input-bordered w-full"
					required
				/>
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
					<th />
				</tr>
			</thead>
			<tbody>
				{#if $activeCaseStudy && $activeCaseStudy.alternative.length}
					{#each $activeCaseStudy.alternative as alternative, i}
						<tr>
							<td>{i + 1}</td>
							<td>{alternative.title}</td>
							<td>
								<button class="btn btn-sm btn-blue" on:click={() => showEditModal(alternative)}>
									<Pencil class="w-4 h-4" />
								</button>
								{#if !disableDeleteData}
									<button class="btn btn-sm btn-red" on:click={() => showDeleteModal(alternative)}>
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
		<form class="flex flex-col gap-2 items-start" on:submit|preventDefault={updateAlternative}>
			<div class="flex justify-between w-full">
				<h3 class="font-bold text-lg">Edit Alternatif {editAlternativeTitle}</h3>
				<button type="submit" class="btn btn-primary btn-sm">Update</button>
			</div>
			<div class="form-control w-full">
				<label for="edit_alternative_title">
					<span class="label-text">Nama</span>
				</label>
				<input
					id="edit_alternative_title"
					bind:value={editAlternativeTitle}
					type="text"
					class="input input-bordered w-full"
					required
				/>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
