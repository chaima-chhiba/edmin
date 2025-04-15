<template>
  <div class="w-lg-500px p-10">
    <VForm
    class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
    id="kt_login_password_reset_link_form"
    :validation-schema="passwordResetSchema"
    @submit="submitForm"
  >
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3">Reset Password</h1>
        <div class="text-gray-500 fw-semibold fs-4">
          Enter your new password.
        </div>
      </div>

      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6">New Password</label>
        <Field
          class="form-control form-control-solid"
          type="password"
          placeholder=""
          name="newPassword"
          autocomplete="on"
          v-model="newPassword"
          rules="required"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="newPassword" />
          </div>
        </div>
      </div>

      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6">Confirm Password</label>
        <Field
          class="form-control form-control-solid"
          type="password"
          placeholder=""
          name="confirmPassword"
          autocomplete="off"
          v-model="confirmPassword"
          rules="required|confirmed:password"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="confirmPassword" />
          </div>
        </div>
      </div>

      <div class="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="submit"
          id="kt_password_reset_link_submit"
          class="btn btn-lg btn-primary fw-bold me-4"
          :disabled="isSubmitting"
        >
          <span class="indicator-label">Reset Password</span>
          <span class="indicator-progress" v-if="isSubmitting">
            Please wait...
            <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
          </span>
        </button>
      </div>
    </VForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ErrorMessage, Field, Form as VForm } from 'vee-validate';
import * as Yup from 'yup';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth"; // Assuming this is your auth store

export default defineComponent({
  name: 'PasswordResetLink',
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const router = useRouter();
    const store = useAuthStore();
    const isSubmitting = ref(false);
    const newPassword = ref('');
    const confirmPassword = ref('');

    const passwordResetSchema = Yup.object().shape({
      newPassword: Yup.string().required('New Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    });

    const submitForm = async () => {
  try {
    // Validate form fields
    const isValid = await passwordResetSchema.validate({
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    });

    if (!isValid) {
      // Show error message if validation fails
      throw new Error('Validation failed');
    }

    // Extract token from URL
    const tokenFromURL = router.currentRoute.value.query.token;
    if (!tokenFromURL) {
      throw new Error('Token not found in URL parameters');
    }

    // Call API to complete password reset
    await store.completePasswordReset(tokenFromURL, newPassword.value, confirmPassword.value);

    // Show success message
    await Swal.fire({
      text: 'Password has been reset successfully!',
      icon: 'success',
      buttonsStyling: false,
      confirmButtonText: 'Ok',
      heightAuto: false,
      customClass: {
        confirmButton: 'btn fw-semibold btn-light-primary',
      },
    });

    // Redirect to sign-in page
    router.push('/sign-in');
  } catch (error) {
    console.error('Password reset failed:', error);

    // Show error message
    await Swal.fire({
      text: error.message || 'Password reset failed.',
      icon: 'error',
      buttonsStyling: false,
      confirmButtonText: 'Try again!',
      heightAuto: false,
      customClass: {
        confirmButton: 'btn fw-semibold btn-light-danger',
      },
    });
  } finally {
    // Reset submitting state
    isSubmitting.value = false;
  }
};

    return {
      submitForm,
      isSubmitting,
      newPassword,
      confirmPassword,
      passwordResetSchema,
    };
  },
});
</script>
