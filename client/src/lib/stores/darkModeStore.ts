import { writable, type Writable } from "svelte/store";

export let darkModeStore: Writable<boolean> = writable();