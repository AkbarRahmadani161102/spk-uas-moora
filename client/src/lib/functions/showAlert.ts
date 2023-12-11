import Swal, { type SweetAlertOptions } from "sweetalert2";

/**
 * @param title 
 * @param text Description
 * @param timer Countdown for toast dismiss
 * @param position Show toast based on screen position
 */
export default function showAlert(title: string, text: string = '', icon: SweetAlertOptions['icon'], timer: number = 3000) {

    return Swal.fire({
        title,
        text,
        icon,
        showConfirmButton: false,
        timer,
    });
}