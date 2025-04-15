<template>
  <div ref="addUserModalRef">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      @submit.prevent="submit"
    >
    <div class="row g-3 mb-3">
      <label for="avatar" class="col-md-6 col-form-label required fs-6 fw-semibold mb-2">Avatar</label>
      <div class="col-md-6">
        <div class="image-input image-input-outline">
          <label class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="change" data-bs-toggle="tooltip" title="Change avatar">
            <i class="bi bi-pencil-fill fs-7"></i>
            <input type="file" name="avatar" accept=".png, .jpg, .jpeg" @change="handleAvatarChange">
          </label>
          <div class="image-input-wrapper w-125px h-125px">
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar" width="100%" height="100%">
          </div>
        </div>
        <div class="form-text">Allowed file types: png, jpg, jpeg.</div>
      </div>
    </div>
    
    
      <div class="row g-3">
        <div class="col-md-6 mb-3">
          <label for="name" class="required fs-6 fw-semibold mb-2">Name</label>
          <el-form-item prop="first_name">
            <el-input v-model="formData.first_name" type="text" />
          </el-form-item>
        </div>

        <div class="col-md-6 mb-3">
          <label for="lastname" class="required fs-6 fw-semibold mb-2">Lastname</label>
          <el-form-item prop="last_name">
            <el-input v-model="formData.last_name" type="text" />
          </el-form-item>
        </div>

        <div class="col-md-6 mb-3">
          <label for="username" class="required fs-6 fw-semibold mb-2">Username</label>
          <el-form-item prop="username">
            <el-input v-model="formData.username" type="text" />
          </el-form-item>
        </div>

        <div class="col-md-6 mb-3">
          <label for="role" class="required fs-6 fw-semibold mb-2">Role</label>
          <el-form-item prop="role_name">
            <el-select v-model="formData.role_name" placeholder="Select a role">
              <el-option v-for="role in availableRoles" :key="role.id" :label="role.name" :value="role.name" />
            </el-select>
          </el-form-item>
        </div>

        <div class="col-md-6 mb-3">
          <label for="email" class="required fs-6 fw-semibold mb-2"  >Email</label>
          <el-form-item prop="email">
            <el-input v-model="formData.email" type="email" />
          </el-form-item>
        </div>
        <div class="col-md-6 mb-3">
          <label for="password" class="required fs-6 fw-semibold mb-2">Password</label>
          <el-form-item prop="password">
            <el-input v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="Enter password">
              <template #append>
                <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"  @click="togglePasswordVisibility"></i>
              </template>
            </el-input>
          </el-form-item>
        </div>
        
        
        
        
        
        
        
      
        </div>

        <div class="mt-4">
          <!-- Submit button with loading state using v-loading directive -->
          <el-button type="primary" :loading="loading" native-type="submit">
            <span v-if="!loading">Submit</span>
            <span v-else>Loading...</span>
          </el-button>
          <el-button type="default" @click="discardForm">Discard</el-button>
        </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, getCurrentInstance } from "vue";
import ApiService from "@/core/services/ApiService";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "AddUserModel",
  
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  
  setup(props) {
    const { emit } = getCurrentInstance();
    const formRef = ref<null | ElForm>(null);
    const loading = ref<boolean>(false);
    const formData = ref({
      first_name: "",
      last_name: "",
      username: "",
      role_name: "",
      email: "",
      password: "",
      avatar: null,
    });
    const addUserModalRef = ref<HTMLDivElement | null>(null);
    const availableRoles = ref([]);
    const showPassword = ref(false);
    const loadingText = ref<string>("Please wait...");

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const handleAvatarChange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      if (file && file.type.startsWith("image/")) {
        reader.onload = (e) => {
          formData.value.avatar = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        console.error("Invalid file type. Please select an image file.");
      }
    };

    // Username availability check
    const checkUsernameAvailability = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Username is required"));
      }
      try {
        const available = await checkUsernameExists(value);
        if (!available) {
          callback();
        } else {
          callback(new Error("Username already exists"));
        }
      } catch (error) {
        console.error("Error checking username availability:", error);
        callback(new Error("Failed to check username availability"));
      }
    };

    const checkEmailAvailability = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("Email is required"));
  }

  // Check if users prop is defined and is an array
  if (!Array.isArray(props.users) || props.users.length === 0) {
    console.error("Users prop is not an array or is empty.");
    return callback(new Error("Error validating email"));
  }

  // Check if the email exists in the users array
  const emailExists = props.users.some((user) => user.email === value);
  if (emailExists) {
    return callback(new Error("Email already exists"));
  }

  return callback(); // Validation passed
};


    const rules = {
      first_name: [
        { required: true, message: "Name is required", trigger: "change" },
      ],
      last_name: [
        { required: true, message: "Lastname is required", trigger: "change" },
      ],
      username: [
        { required: true, message: "Username is required", trigger: "change" },
        { validator: checkUsernameAvailability, trigger: "change" },
      ],
      role_name: [
        { required: true, message: "Role is required", trigger: "change" },
      ],
      email: [
        { required: true, message: "Email is required", trigger: "change" },
        {
          type: "email",
          message: "Please enter a valid email address",
          trigger: ["change", "blur"],
        },
        { validator: checkEmailAvailability, trigger: ["change", "blur"] },
      ],
      password: [
        { required: true, message: "Password is required", trigger: "change" },
        {
          min: 4,
          message: "Password must be at least 4 characters long",
          trigger: "change",
        },
      ],
    };

    const createUser = (userData) => {
      loading.value = true;

      return ApiService.post("/api/admin/create-user", userData)
        .then((response) => {
          ElMessage.success({
            message: "User created successfully!",
            type: "success",
          });
          return response;
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          throw error;
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const checkUsernameExists = (username) => {
      return ApiService.get(`/api/check-username/${username}`)
        .then((response) => {
          return response.data.exists;
        })
        .catch((error) => {
          console.error(
            `Error checking username existence for ${username}:`,
            error
          );
          throw error;
        });
    };

    const fetchRoles = () => {
      loading.value = true;

      return ApiService.get("/api/roles")
        .then((response) => {
          const responseData = response.data;
          if (Array.isArray(responseData.roles)) {
            availableRoles.value = responseData.roles;
          } else {
            console.error("Invalid response format. Expected an array.");
            console.error("Actual response data:", responseData);
            throw new Error("Failed to fetch roles.");
          }
        })
        .catch((error) => {
          console.error("Error fetching roles:", error);
          throw error;
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const submit = async () => {
      loading.value = true;
      if (formRef.value) {
        formRef.value.validate(async (valid: boolean) => {
          if (valid) {
            try {
              await createUser(formData.value);

              // Reset the form after successful submission
              formRef.value?.resetFields();
              formData.value = {
                first_name: "",
                last_name: "",
                username: "",
                role_name: "",
                email: "",
                password: "",
                avatar: null,
              };

              emit("form-submitted");
            } catch (error) {
              ElMessage.error({
                message: "Failed to create user. Please try again.",
                type: "error",
              });
            }
          } else {
            ElMessage.error({
              message: "Please correct the form errors before submitting.",
              type: "error",
            });
          }
          loading.value = false;
        });
      }
    };

    const discardForm = () => {
      ElMessage({
        message: "Form discarded",
        type: "info",
      });

      emit("form-discarded");
    };

    onMounted(async () => {
      formRef.value = formRef.value as ElForm;

      try {
        await fetchRoles();
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    });

    return {
      formData,
      rules,
      submit,
      formRef,
      loading,
      discardForm,
      availableRoles,
      handleAvatarChange,
      showPassword,
      togglePasswordVisibility,
      addUserModalRef,
      loadingText,
      emit,
    };
  },
});
</script>