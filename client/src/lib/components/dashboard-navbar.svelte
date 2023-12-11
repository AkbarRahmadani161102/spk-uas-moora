<script lang="ts">
	import showToast from '$lib/functions/showToast';
	import { baseUrlStore } from '$lib/stores/baseUrlStore';
	import {
		activeCaseStudy,
		caseStudyStore,
		getCaseStudyList,
		selectedCaseStudy
	} from '$lib/stores/caseStudyStore';
	import { darkModeStore } from '$lib/stores/darkModeStore';
	import { Bars3, Minus, Moon, Pencil, Plus, Sun } from '@inqling/svelte-icons/heroicon-24-outline';
	import axios from 'axios';
	import jQuery from 'jquery';
	import { afterUpdate, onMount } from 'svelte';
	let addCaseStudyModal: HTMLDialogElement;
	let editCaseStudyModal: HTMLDialogElement;
	let caseStudyTitle: string;
	let caseStudyDescription: string;

	const toggleAddCaseStudyModal = () => {
		addCaseStudyModal.showModal();
	};

	const toggleEditCaseStudyModal = () => {
		editCaseStudyModal.showModal();
	};

	const addCaseStudy = async () => {
		await axios.post(`${$baseUrlStore}/case-study`, {
			title: caseStudyTitle,
			description: caseStudyDescription
		});
		const res = await getCaseStudyList();
		$selectedCaseStudy = res[res.length - 1];
	};

	const editCaseStudy = async () => {
		console.log($activeCaseStudy._id);
		const data = {
			title: $activeCaseStudy.title,
			description: $activeCaseStudy.description
		};
		await axios.put(`${$baseUrlStore}/case-study/${$activeCaseStudy._id}`, data);
		await getCaseStudyList();

		showToast('Studi kasus berhasil diubah');
	};

	const removeCaseStudy = async () => {
		await axios.delete(`${$baseUrlStore}/case-study/${$selectedCaseStudy._id}`);
		location.reload();
	};

	onMount(() => {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			darkModeStore.set(true);
		} else {
			darkModeStore.set(false);
		}
	});

	afterUpdate(() => {
		if ($darkModeStore) {
			jQuery('html').attr('data-theme', 'dark');
		} else {
			jQuery('html').attr('data-theme', 'light');
		}

		localStorage.setItem('theme', $darkModeStore ? 'dark' : 'light');
	});
</script>

<div class="navbar border-b border-b-base-300 px-2 md:px-8 lg:px-10">
	<div class="flex flex-1 justify-between">
		<div class="flex-none md:hidden">
			<label for="dashboard-sidebar" class="drawer-button btn btn-square btn-ghost">
				<Bars3 class="w-5 h-5" />
			</label>
		</div>
		<div class="flex items-center">
			<label for="study_case_input" class="flex-1">Studi Kasus</label>
			<div class="flex ml-4">
				<select
					name="study_case"
					id="study_case_input"
					class="select select-bordered select-sm"
					bind:value={$selectedCaseStudy}
				>
					{#if $caseStudyStore}
						{#each $caseStudyStore as caseStudy}
							<option value={caseStudy}>{caseStudy.title}</option>
						{/each}
					{/if}
				</select>
			</div>

			{#if $activeCaseStudy}
				<button class="btn btn-circle btn-ghost btn-sm" on:click={toggleEditCaseStudyModal}>
					<Pencil class="w-4 h-4" />
				</button>
			{/if}
			<button class="btn btn-circle btn-ghost btn-sm" on:click={toggleAddCaseStudyModal}>
				<Plus class="w-4 h-4" />
			</button>
			<button class="btn btn-circle btn-ghost btn-sm" on:click={removeCaseStudy}>
				<Minus class="w-4 h-4" />
			</button>
		</div>
		<label class="swap swap-rotate">
			<input type="checkbox" bind:checked={$darkModeStore} />
			<Sun class="w-5 h-5 swap-on" />
			<Moon class="w-5 h-5 swap-off" />
		</label>
	</div>
</div>

<dialog bind:this={addCaseStudyModal} class="modal">
	<div class="modal-box">
		<form
			method="post"
			class="form flex flex-col gap-3 mt-3"
			on:submit|preventDefault={addCaseStudy}
		>
			<div class="flex justify-between">
				<h3 class="font-bold text-lg">Tambah Studi Kasus</h3>
				<button type="submit" class="btn btn-sm btn-primary">Submit</button>
			</div>
			<div class="form-control">
				<label for="caseStudyTitle">
					<span class="label-text">Title</span>
				</label>
				<input
					id="caseStudyTitle"
					type="text"
					class="input input-bordered"
					required
					bind:value={caseStudyTitle}
				/>
			</div>
			<div class="form-control">
				<label for="caseStudyDescription">
					<span class="label-text">Description</span>
				</label>
				<textarea
					id="caseStudyDescription"
					class="textarea textarea-bordered"
					placeholder="Description"
					bind:value={caseStudyDescription}
				/>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

{#if $activeCaseStudy}
	<dialog bind:this={editCaseStudyModal} class="modal">
		<div class="modal-box">
			<form class="form flex flex-col gap-3 mt-3" on:submit|preventDefault={editCaseStudy}>
				<div class="flex justify-between">
					<h3 class="font-bold text-lg">Ubah Studi Kasus</h3>
					<button type="submit" class="btn btn-sm btn-primary">Submit</button>
				</div>
				<div class="form-control">
					<label for="editCaseStudyTitle">
						<span class="label-text">Title</span>
					</label>
					<input
						id="editCaseStudyTitle"
						type="text"
						class="input input-bordered"
						required
						bind:value={$activeCaseStudy.title}
					/>
				</div>
				<div class="form-control">
					<label for="editCaseStudyDescription">
						<span class="label-text">Description</span>
					</label>
					<textarea
						id="editCaseStudyDescription"
						class="textarea textarea-bordered"
						placeholder="Description"
						bind:value={$activeCaseStudy.description}
					/>
				</div>
			</form>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
{/if}
