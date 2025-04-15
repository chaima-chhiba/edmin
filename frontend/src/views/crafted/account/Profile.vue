<template>
  <div>
    <!-- Profile Details Section -->
    <div class="card mb-5 mb-xl-10">
      <!-- Card Header -->
      <div
        class="card-header border-0 cursor-pointer"
        role="button"
        data-bs-toggle="collapse"
        data-bs-target="#kt_account_profile_details"
        aria-expanded="true"
        aria-controls="kt_account_profile_details"
      >
        <!-- Card Title -->
        <div class="card-title m-0">
          <h3 class="fw-bold m-0">Détails du profil</h3>
        </div>
      </div>

      <!-- Content -->
      <div id="kt_account_profile_details" class="collapse show">
        <!-- Form -->
        <VForm
          id="kt_account_profile_details_form"
          class="form"
          novalidate
          @submit="saveChanges1()"
          :validation-schema="profileDetailsValidator"
        >
          <!-- Card Body -->
          <div class="card-body border-top p-9">
            <!-- Avatar Image Input -->
            <div class="image-input image-input-outline" data-kt-image-input="true">
              <!-- Preview Existing Avatar -->
              <div class="image-input-wrapper w-125px h-125px" :style="{ backgroundImage: `url(${profileDetails.avatar})` }"></div>
              <!-- Label -->
              <label
                class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                data-kt-image-input-action="change"
                data-bs-toggle="tooltip"
                title="Change avatar"
              >
                <i class="bi bi-pencil-fill fs-7"></i>
                <input type="file" name="avatar" accept=".png, .jpg, .jpeg" @change="updateAvatar($event)" />
                <input type="hidden" name="avatar_remove" />
              </label>
              <!-- Remove Button -->
              <span
                class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                data-kt-image-input-action="remove"
                data-bs-toggle="tooltip"
                @click="removeImage()"
                title="Remove avatar"
              >
                <i class="bi bi-x fs-2"></i>
              </span>
            </div>
            <!-- Hint -->
            <div class="form-text">Types de fichiers autorisés: png, jpg, jpeg.</div>

            <!-- Full Name Input Group -->
            <div class="row mb-6">
              <label class="col-lg-4 col-form-label required fw-semibold fs-6">Nom complet</label>
              <div class="col-lg-8">
                <div class="row">
                  <div class="col-lg-6 fv-row">
                    <Field
                      type="text"
                      name="fname"
                      class="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                      placeholder="First name"
                      v-model="profileDetails.first_name"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="fname" />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 fv-row">
                    <Field
                      type="text"
                      name="lname"
                      class="form-control form-control-lg form-control-solid"
                      placeholder="Last name"
                      v-model="profileDetails.last_name"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="lname" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Actions -->
          <div class="card-footer d-flex justify-content-end py-6 px-9">
            <button type="reset" class="btn btn-light btn-active-light-primary me-2">Annuler</button>
            <button type="submit" id="kt_account_profile_details_submit" ref="submitButton1" class="btn btn-primary">
              <span class="indicator-label">Enregistrer les modifications </span>
              <span class="indicator-progress">
                Veuillez patienter...
                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            </button>
          </div>
        </VForm>
      </div>
    </div>
    <!-- End Profile Details Section -->
    <!--begin::Sign-in Method-->
<div class="card mb-5 mb-xl-10">
  <!--begin::Card header-->
  <div
    class="card-header border-0 cursor-pointer"
    role="button"
    data-bs-toggle="collapse"
    data-bs-target="#kt_account_signin_method"
  >
    <div class="card-title m-0">
      <h3 class="fw-bolder m-0">Méthode de connexion</h3>
    </div>
  </div>
  <!--end::Card header-->

  <!--begin::Content-->
  <div id="kt_account_signin_method" class="collapse show">
    <!--begin::Card body-->
    <div class="card-body border-top p-9">
      <!--begin::Username-->
      <div class="d-flex flex-wrap align-items-center mb-8">
        <div id="kt_signin_username" :class="{ 'd-none': usernameFormDisplay }">
          <div class="fs-4 fw-bolder mb-1">Nom d'utilisateur</div>
          <div class="fs-6 fw-semibold text-gray-600">
            example_username
          </div>
        </div>

        <div
          id="kt_signin_username_edit"
          :class="{ 'd-none': !usernameFormDisplay }"
          class="flex-row-fluid"
        >
          <!--begin::Form-->
          <VForm
            id="kt_signin_change_username"
            class="form"
            novalidate
            @submit="updateUsername()"
            :validation-schema="changeUsername"
          >
            <div class="row mb-6">
              <div class="col-lg-6 mb-4 mb-lg-0">
                <div class="fv-row mb-0">
                  <label
                    for="username"
                    class="form-label fs-6 fw-bold mb-3"
                    >Enter New Username</label
                  >
                  <Field
                    type="text"
                    class="form-control form-control-lg form-control-solid fw-semibold fs-6"
                    id="username"
                    placeholder="Username"
                    name="username"
                    value="example_username"
                    v-model="profileDetails.username"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="username" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex">
              <button
                id="kt_signin_submit"
                type="submit"
                ref="updateUsernameButton"
                class="btn btn-primary me-2 px-6"
              >
                <span class="indicator-label"> Mettre à jour le nom d'utilisateur </span>
                <span class="indicator-progress">
                  Veuillez patienter...
                  <span
                    class="spinner-border spinner-border-sm align-middle ms-2"
                  ></span>
                </span>
              </button>
              <button
                id="kt_signin_cancel"
                type="button"
                class="btn btn-color-gray-500 btn-active-light-primary px-6"
                @click="usernameFormDisplay = !usernameFormDisplay"
              >
              Annuler
              </button>
            </div>
          </VForm>
          <!--end::Form-->
        </div>
        <div
          id="kt_signin_username_button"
          :class="{ 'd-none': usernameFormDisplay }"
          class="ms-auto"
        >
          <button
            class="btn btn-light fw-bolder px-6"
            @click="usernameFormDisplay = !usernameFormDisplay"
          >
          Entrez un nouveau nom d'utilisateur
          </button>
        </div>
      </div>
      <!--end::Username-->

      <!--begin::Password-->
      <div class="d-flex flex-wrap align-items-center mb-8">
        <div
          id="kt_signin_password"
          :class="{ 'd-none': passwordFormDisplay }"
        >
          <div class="fs-4 fw-bolder mb-1">Mot de passe</div>
          <div class="fs-6 fw-semibold text-gray-600">************</div>
        </div>
        <div
          id="kt_signin_password_edit"
          class="flex-row-fluid"
          :class="{ 'd-none': !passwordFormDisplay }"
        >
          <div class="fs-6 fw-semibold text-gray-600 mb-4">
            Le mot de passe doit comporter au moins 8 caractères et contenir des symboles
          </div>

          <!--begin::Form-->
          <VForm
            id="kt_signin_change_password"
            class="form"
            novalidate
            @submit="updatePassword()"
            :validation-schema="changePassword"
          >
            <div class="row mb-6">
              <div class="col-lg-4">
                <div class="fv-row mb-0">
                  <label
                    for="currentpassword"
                    class="form-label fs-6 fw-bold mb-3"
                    >Mot de passe actuel</label
                  >
                  <Field
                    type="password"
                    class="form-control form-control-lg form-control-solid fw-semibold fs-6"
                    name="currentpassword"
                    id="currentpassword"
                    v-model="profileDetails.currentpassword"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="currentpassword" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="fv-row mb-0">
                  <label
                    for="newpassword"
                    class="form-label fs-6 fw-bold mb-3"
                    >Nouveau mot de passe</label
                  >
                  <Field
                    type="password"
                    class="form-control form-control-lg form-control-solid fw-semibold fs-6"
                    name="newpassword"
                    id="newpassword"
                    v-model="profileDetails.newpassword"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="newpassword" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="fv-row mb-0">
                  <label
                    for="confirmpassword"
                    class="form-label fs-6 fw-bold mb-3"
                    >Confirmer le nouveau mot de passe</label
                  >
                  <Field
                    type="password"
                    class="form-control form-control-lg form-control-solid fw-semibold fs-6"
                    name="confirmpassword"
                    id="confirmpassword"
                    v-model="profileDetails.confirmpassword"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="confirmpassword" />
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    <!-- Submit & Cancel Buttons -->
                    <div class="d-flex">
                      <button
                        id="kt_password_submit"
                        type="submit"
                        ref="updatePasswordButton"
                        class="btn btn-primary me-2 px-6"
                      >
                        <span class="indicator-label">  Mettre à jour le mot de passe  </span>
                        <span class="indicator-progress">
                          Veuillez patienter...
                          <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      </button>
                      <button
                        id="kt_password_cancel"
                        type="button"
                        @click="passwordFormDisplay = !passwordFormDisplay"
                        class="btn btn-color-gray-500 btn-active-light-primary px-6"
                      >
                      Annuler
                      </button>
                    </div>
                    </VForm>
                    <!-- End Password Form -->
                    </div>
                    <div
                    id="kt_signin_password_button"
                    class="ms-auto"
                    :class="{ 'd-none': passwordFormDisplay }"
                    >
                    <button
                    @click="passwordFormDisplay = !passwordFormDisplay"
                    class="btn btn-light fw-bolder"
                    >
                    Reset Password
                    </button>
                    </div>
                    </div>
                    <!-- End Password Section -->
                    </div>
                    <!-- End Sign-in Method Section -->
                    </div>
                    </div>
                    <!--end::Sign-in Method-->

  </div>
</template>


<script lang="ts">
import ApiService from "@/core/services/ApiService";
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import JwtService from "@/core/services/JwtService";
import {ElMessage } from "element-plus";
import * as Yup from "yup";

interface ProfileDetails {
  avatar: string;
  first_name: string;
  last_name: string;
  username: string;
  currentpassword: string;
  newpassword: string;
  confirmpassword: string;
}

export default defineComponent({
  name: "account-settings",
  components: {
    ErrorMessage,
    Field,
    VForm,
  },
  setup() {
    // Define references and reactive variables
    const submitButton1 = ref<HTMLElement | null>(null);
      const updateUsernameButton = ref<HTMLElement | null>(null);
    const updatePasswordButton = ref<HTMLElement | null>(null);

    const passwordFormDisplay = ref(false);
    const usernameFormDisplay = ref(false);
     

    const changeUsername = Yup.object().shape({
  username: Yup.string().required().label("New Username"),
});


    const profileDetailsValidator = Yup.object().shape({
      fname: Yup.string().required().label("First name"),
      lname: Yup.string().required().label("Last name"),
    });

    const changePassword = Yup.object().shape({
      currentpassword: Yup.string().required().label("Current password"),
      newpassword: Yup.string().min(4).required().label("New password"),
      confirmpassword: Yup.string()
        .min(4)
        .required()
        .oneOf([Yup.ref("newpassword")], "Passwords must match")
        .label("Password Confirmation"),
    });

    const profileDetails = ref<ProfileDetails>({
      avatar: null,
      first_name: "",
      last_name: "",
      username: "",
      currentpassword: "",
      newpassword: "",
      confirmpassword: "",
    });
// Method to update avatar when a new one is selected
const updateAvatar = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = () => {
      // Update the profileDetails.avatar with the data URL of the selected file
      profileDetails.value.avatar = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

    // Method to save changes to profile details
    const saveChanges1 = () => {
  if (submitButton1.value) {
    submitButton1.value.setAttribute("data-kt-indicator", "on");

    // Retrieve token using JwtService
    const token = JwtService.getToken();

    if (token) {
      // Set authorization header with token
      ApiService.setHeader(token);

      // Make API request to save changes
      ApiService.put('/api/profile', profileDetails.value)
        .then(response => {
          // Handle success response
          console.log(response.data);
          ElMessage.success({
            message: "Profile updated successfully!",
            type: "success"
          });
        })
        .catch(error => {
          // Handle error response
          console.error(error);
          ElMessage.error({
            message: "Error updating profile. Please try again.",
            type: "error"
          });
        })
        .finally(() => {
          submitButton1.value?.removeAttribute("data-kt-indicator");
        });
    } else {
      console.error("Token not found");
      ElMessage.error({
        message: "Error: Token not found.",
        type: "error"
      });
    }
  }
};


const updateUsername = () => {
  if (updateUsernameButton.value) {
    updateUsernameButton.value.setAttribute("data-kt-indicator", "on");

    // Retrieve token using JwtService
    const token = JwtService.getToken();

    if (token) {
      // Set authorization header with token
      ApiService.setHeader(token);

      // Prepare data for updating username
      const data = {
        username: profileDetails.value.username,
      };

      // Make API request to update username with token and username data
      ApiService.put('/api/update-username', data)
        .then(response => {
          // Handle success response
          console.log(response.data);
          ElMessage.success({
            message: "Username updated successfully!",
            type: "success"
          });
        })
        .catch(error => {
          // Handle error response
          console.error(error);
          ElMessage.error({
            message: "Error updating username. Please try again.",
            type: "error"
          });
        })
        .finally(() => {
          updateUsernameButton.value?.removeAttribute("data-kt-indicator");
        });
    } else {
      console.error("Token not found");
    }
  }
};


const updatePassword = () => {
  if (updatePasswordButton.value) {
    updatePasswordButton.value.setAttribute("data-kt-indicator", "on");

    // Retrieve token using JwtService
    const token = JwtService.getToken();

    if (token) {
      // Set authorization header with token
      ApiService.setHeader(token);

      // Prepare data for updating password
      const data = {
        currentpassword: profileDetails.value.currentpassword,
        newpassword: profileDetails.value.newpassword,
        confirmpassword: profileDetails.value.confirmpassword,
      };

      // Make API request to update password with token and password data
      ApiService.put('/api/update-password', data)
        .then(response => {
          // Handle success response
          console.log(response.data);
          ElMessage.success({
            message: "Password updated successfully!",
            type: "success"
          });
        })
        .catch(error => {
          // Handle error response
          console.error(error);
          ElMessage.error({
            message: "Error updating password. Please try again.",
            type: "error"
          });
        })
        .finally(() => {
          updatePasswordButton.value?.removeAttribute("data-kt-indicator");
        });
    } else {
      console.error("Token not found");
    }
  }
};


    const removeImage = () => {
      profileDetails.value.avatar = "/media/avatars/blank.png";
    };

    return {
      // Return variables and methods to be used in the template
      submitButton1,
      updatePasswordButton,
      saveChanges1,
      updatePassword,
      profileDetails,
      passwordFormDisplay,
      removeImage,
      profileDetailsValidator,
      changePassword,
      getAssetPath,
      updateAvatar,
      usernameFormDisplay,
      changeUsername,
      updateUsername,
      updateUsernameButton
    };
  },
});
</script>
