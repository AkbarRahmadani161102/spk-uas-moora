import { browser } from '$app/environment';
import { selectedCaseStudy } from "$lib/stores/caseStudyStore";
import Swal from 'sweetalert2';

export default function redirectIfNoCaseSelected() {
    selectedCaseStudy.subscribe(n => {
        // ...Your other imports
        if (browser) { // to prevent error window is not defined, because it's SSR
            if (!n) {
                Swal.fire({
                    title: 'Pilih studi kasus terlebih dahulu',
                    timer: 2000,
                }).then(() => {
                    window.location.href = '/';
                })
            }
        }
    })
}