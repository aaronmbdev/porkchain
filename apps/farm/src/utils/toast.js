import {toast} from "react-toastify";

export default class Toast {
    static success(message) {
        toast.success(message);
    }

    static warning(message) {
        toast.warning(message);
    }

    static info(message) {
        toast.info(message);
    }

    static error(message) {
        toast.error(message);
    }

}