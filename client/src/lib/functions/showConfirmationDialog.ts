import Swal from "sweetalert2";

/**
 * @param title Title
 * @param text Description
 * @returns isConfirmed as boolean value
 */
export default async function showConfirmationDialog(title: string, text: string = '',) {
    const { isConfirmed } = await Swal.fire({
        title,
        showConfirmButton: true,
        confirmButtonText: 'Ya',
        showDenyButton: true,
        denyButtonText: 'Tidak',
        text
    })

    return isConfirmed
}