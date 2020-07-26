import jquery from "jquery";
window.jQuery = jquery;
window.$ = jquery;
import popper from "popper.js";
window.Popper = popper;
import "bootstrap";
import "metismenu";
import "gasparesganga-jquery-loading-overlay";

import moment from "moment";
window.moment = moment;
import swal from "sweetalert2";
window.swal = swal;
import toastr from "toastr";
window.toastr = toastr;

toastr.options = { positionClass: "toast-bottom-right" };
