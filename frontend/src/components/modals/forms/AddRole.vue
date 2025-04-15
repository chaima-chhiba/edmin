<template>
  <div ref="addRoleModalRef">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      @submit.prevent="submit"
    >
      <div class="mb-3">
        <div class="form-check form-switch float-end mb-2">
          <input
            type="checkbox"
            class="form-check-input"
            id="superAdmin"
            v-model="formData.superAdmin"
            @change="selectAllAccess"
          />
          <label class="form-check-label" for="superAdmin">Super Admin</label>
        </div>
      </div>
      <div class="mb-3">
        <label for="roleName" class="form-label required fs-6 fw-semibold mb-2"
          >Role
        </label>
        <el-form-item prop="name">
          <el-input v-model="formData.name" type="text" />
        </el-form-item>
      </div>
      <div
        class="mb-3 form-check"
        v-for="(value, key) in formData.accessList"
        :key="key"
      >
        <input
          type="checkbox"
          class="form-check-input"
          id="usersAccess"
          v-model="formData.accessList[key]"
        />
        <label class="form-check-label" for="usersAccess"
          >Access {{ key }}</label
        >
      </div>
      <div class="mt-4">
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
import { defineComponent, ref, getCurrentInstance } from "vue";
import ApiService from "@/core/services/ApiService";
import { ElMessage } from "element-plus";

interface RoleFormData {
  name: string;
  accessList: {
    Users: boolean;
    Roles: boolean;
    Customers: boolean;
    Feedbacks: boolean;
    Statistique: boolean;
    Packs: boolean;
  };
  superAdmin: boolean;
}

export default defineComponent({
  name: "AddRoleModal",
  setup() {
    const formData = ref<RoleFormData>({
      name: "",
      accessList: {
        Users: false,
        Roles: false,
        Customers: false,
        Feedbacks: false,
        Statistique: false,
        Packs: false,
      },
      superAdmin: false,
    });
    const { emit } = getCurrentInstance();

    const loading = ref<boolean>(false);

    const formRef = ref<any>(null); 

    const rules = {
      name: [
        { required: true, message: "Role Name is required", trigger: "blur" },
      ],
    };

    const submit = async () => {
      try {
        const valid = await formRef.value?.validate();
        if (!valid) return;

        loading.value = true; 

        const response = await ApiService.post("/api/roles", formData.value);
        if (response.status === 201) {
          ElMessage.success("Role added successfully!");
          formData.value = {
            name: "",
            accessList: {  Users: false,
        Roles: false,
        Customers: false,
        Feedbacks: false,
        Statistique: false,
        Packs: false, },
            superAdmin: false,
          };
          emit("form-submitt");
        } else {
          ElMessage.error("Failed to add role. Please try again.");
        }
      } catch (error) {
        console.error("Error adding role:", error);
        ElMessage.error(
          "An error occurred while adding the role. Please try again."
        );
      } finally {
        loading.value = false; // Reset loading state after submission
      }
    };

    const discardForm = () => {
      // Reset the form data
      formData.value = {
        name: "",
        accessList: { Users: false, Roles: false },
        superAdmin: false,
      };
      emit("form-discard");
      ElMessage({
        message: "Form discarded",
        type: "info",
      });
    };

    const selectAllAccess = () => {
      // If Super Admin checkbox is checked, select all access
      const selected = formData.value.superAdmin;
      Object.keys(formData.value.accessList).forEach((key) => {
        formData.value.accessList[key] = selected;
      });
    };

    return {
      formData,
      loading,
      rules,
      submit,
      discardForm,
      selectAllAccess,
      formRef,
    };
  },
});
</script>
