import { defineComponent, ref } from "vue";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";

export default defineComponent({
name: "sign-in",
components: {
Field,
VForm,
ErrorMessage,
},
setup() {
const store = useAuthStore();
const router = useRouter();

const submitButton = ref<HTMLButtonElement | null>(null);

//Create form validation object
const login = Yup.object().shape({
email: Yup.string().email().required().label("Email"),
password: Yup.string().min(4).required().label("Password"),
});
// Form submit function
const onSubmitLogin = async (values: any) => {
values = values as User;
// Clear existing errors
store.logout();

if (submitButton.value) {
submitButton.value!.disabled = true;
// Activate indicator
submitButton.value.setAttribute("data-kt-indicator", "on");
}

// Send login request
await store.login(values);
const error = Object.values(store.errors);

console.log('store.errors:', store.errors); // Log errors to the console

if (store.isAuthenticated) {
// Successful login
Swal.fire({
text: "You have successfully logged in!",
icon: "success",
buttonsStyling: false,
confirmButtonText: "Ok, got it!",
heightAuto: false,
customClass: {
confirmButton: "btn fw-semibold btn-light-primary",
},
}).then(() => {
// Go to page after successfully login
router.push({ name: "dashboard" });
});
} else if (error.includes("Invalid email or password")) {
// Display a custom error message for wrong email or password
Swal.fire({
text: "Invalid email or password. Please try again.",
icon: "error",
buttonsStyling: false,
confirmButtonText: "Try again!",
heightAuto: false,
customClass: {
confirmButton: "btn fw-semibold btn-light-danger",
},
});
} else if (error.length > 0) {
// Display other error messages
Swal.fire({
text: error[0] as string,
icon: "error",
buttonsStyling: false,
confirmButtonText: "Try again!",
heightAuto: false,
customClass: {
confirmButton: "btn fw-semibold btn-light-danger",
},
});
}

store.errors = {}; // Clear errors after displaying the message


// Deactivate indicator
submitButton.value?.removeAttribute("data-kt-indicator");
submitButton.value!.disabled = false;
};


return {
onSubmitLogin,
login,
submitButton,
getAssetPath,
};
},
});
