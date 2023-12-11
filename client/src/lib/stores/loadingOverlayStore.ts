import type ILoadingOverlay from "$lib/interface/ILoadingOverlay";
import { writable, type Writable } from "svelte/store";

export let loadingOverlayStore: Writable<ILoadingOverlay> = writable(
    {
        isLoading: false,
        message: "",
    }
);

export const loadingOverlay: {
    set: (isLoading: boolean, message: string) => void;
    dismiss: () => void;
} = {
    set: (isLoading: boolean, message: string = '') => {
        loadingOverlayStore.set({ isLoading, message });
    },

    dismiss: () => {
        loadingOverlayStore.set({ isLoading: false, message: "" });
    }
}