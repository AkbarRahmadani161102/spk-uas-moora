import Swal, { type SweetAlertPosition } from "sweetalert2";

/**
 * @param title 
 * @param text Description
 * @param timer Countdown for toast dismiss
 * @param position Show toast based on screen position
 */
export default function showToast(title: string, text: string = '', color: string = 'black', timer: number = 3000, position: SweetAlertPosition = 'bottom-right') {

    return Swal.fire({
        title,
        text,
        toast: true,
        showConfirmButton: false,
        position,
        timer,
        color
    });
}