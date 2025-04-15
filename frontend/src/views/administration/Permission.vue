<template>
  <div>
    <div class="card">
      <!-- Card Header -->
      <div class="card-header border-0 pt-6">
        <div class="card-title">
          <!-- Search Input -->
          <!-- Adjusted alignment for symmetry -->
          <div class="d-flex align-items-center position-relative my-1">
            <KTIcon
              icon-name="magnifier"
              icon-class="fs-1 position-absolute ms-6"
            />
            <input
              type="text"
              v-model="search"
              @input="searchRoles"
              class="form-control form-control-solid w-250px ps-15"
              placeholder="Search Roles"
            />
          </div>
        </div>
        <div class="card-toolbar">
          <!--begin::Export-->

          <!--end::Export-->
          <!-- Add New Role Button -->
          <!-- Adjusted alignment for symmetry -->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_role"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" /> Add role
          </button>
          <!-- Checkbox for filtering active/inactive users -->
        </div>
      </div>

      <div class="card-body pt-0">
        <Datatable
          :data="tableData"
          :header="tableHeader"
          class="datatable"
          :enable-items-per-page-dropdown="true"
        >
          <!-- Slot for role -->
          <template v-slot:name="{ row: role }">
            <div>
              {{ role.name }}
            </div>
          </template>
          <template v-slot:accessList="{ row: role }">
            <ul>
              <li v-if="role.superAdmin">
                <el-tag type="success"> Super admin </el-tag>
              </li>
              <li v-for="(value, key) in role.filteredAccesslist" :key="key">
                <el-tag type="primary">
                  {{ value }}
                </el-tag>
              </li>
            </ul>
          </template>
          <template v-slot:actions="{ row: role }">
            <el-button
              type="primary"
              :icon="Edit"
              circle
              @click="modifyRole(role)"
            />
            <el-popconfirm
              :title="'Are sure to delete this role ?'"
              @confirm="deleteRole(role)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  :icon="Delete"
                  :disabled="role.superAdmin"
                  circle
                />
              </template>
            </el-popconfirm>
          </template>
        </Datatable>
      </div>
    </div>

    <!-- Add Role Modal -->
    <div
      class="modal fade"
      id="kt_modal_add_role"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add role</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Include the AddRoleModal component here -->
            <AddRoleModal
              @role-added="fetchRoles"
              @form-submitt="FormSubmitted"
              @form-discard="FormSubmitted"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Modify Role Modal -->
    <div
      class="modal fade"
      id="kt_modal_modify_role"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modify role</h5>
            <button
              type="button"
              class="btn-close"
              @click="discardChanges"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label
                for="roleName"
                class="form-label required fs-6 fw-semibold mb-2"
                >Rôle</label
              >
              <el-form-item prop="name">
                <el-input v-model="selectedRole.name" type="text" />
              </el-form-item>
            </div>
            <!-- Access list checkboxes -->
            <div
              class="mb-3 form-check"
              v-for="(value, key) in selectedRole.accessList"
              :key="key"
            >
              <input
                type="checkbox"
                class="form-check-input"
                id="usersAccess"
                v-model="selectedRole.accessList[key]"
              />
              <label class="form-check-label" for="usersAccess"
                >Accès {{ key }}</label
              >
            </div>

            <div class="mt-4">
              <el-button type="primary" @click="updateRole" :loading="loading">
                <span v-if="!loading">Update role</span>
                <span v-else>Please waint...</span>
              </el-button>
              <el-button type="default" @click="discardChanges">
                Discard</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import AddRoleModal from "@/components/modals/forms/AddRole.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getAssetPath } from "@/core/helpers/assets";

import { Check, Delete, Edit } from "@element-plus/icons-vue";
export default defineComponent({
  name: "roles-listing",
  components: {
    Datatable,
    AddRoleModal,
    Check,
    Delete,
    Edit,
  },
  setup() {
    const tableHeader = ref([
      { columnName: "Role", columnLabel: "name", sortEnabled: true },
      { columnName: "Access", columnLabel: "accessList", sortEnabled: true },
      { columnName: "Actions", columnLabel: "actions", sortEnabled: false },
    ]);
    const selectedRole = ref<any>({
      name: "",
      accessList: { Users: false, Roles: false },
    });
    const tableData = ref([]);

    const search = ref("");
    const loading = ref(false);
    const error = ref<string | null>(null);
    const originalTableData = ref([]);


    
    const fetchRoles = () => {
  loading.value = true;
  ApiService.setHeader();

  return ApiService.get("/api/roles")
    .then((response) => {
      const responseData = response.data;

      if (Array.isArray(responseData.roles)) {
        originalTableData.value = responseData.roles.map((role) => ({
          id: role._id.toString(),
          name: role.name,
          superAdmin: role.superAdmin,
          accessList: role.accessList,
          filteredAccesslist: Object.keys(role.accessList).filter(
            (key) => role.accessList[key]
          ),
        }));
        updateFilteredTableData();
        error.value = null;
      } else {
        console.error("Invalid response format. Expected an array of roles.");
        console.error("Actual response data:", responseData);
        error.value = "Failed to fetch roles.";
      }
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
      error.value = "Failed to fetch roles.";
      ElMessage.error("Failed to fetch roles .");
    })
    .finally(() => {
      loading.value = false;
    });
};



const deleteRole = (role) => {
  return ApiService.delete(`/api/roles/${role.id}`)
    .then(() => {
      return fetchRoles()
        .then(() => {
          ElMessage.success("Role deleted successfully");
        })
        .catch((error) => {
          console.error("Error fetching roles after deletion:", error);
          ElMessage.error("Failed to fetch roles after deletion.");
        });
    })
    .catch((error) => {
      console.error("Error deleting role:", error);
      ElMessage.error("Failed to delete role. Please try again.");
    });
};


    const searchRoles = () => {
      updateFilteredTableData();
    };

    const updateFilteredTableData = () => {
      tableData.value = search.value
        ? originalTableData.value.filter((role: any) =>
            role.name.toLowerCase().includes(search.value.toLowerCase())
          )
        : [...originalTableData.value];
    };

    const resetSearch = () => {
      search.value = "";
      updateFilteredTableData();
    };

    const modifyRole = async (role) => {
      try {
     
        selectedRole.value = { ...role };

       
        const modifyRoleModal = document.getElementById("kt_modal_modify_role");
        if (modifyRoleModal) {
          modifyRoleModal.classList.add("show");
          modifyRoleModal.style.display = "block";
        }
      } catch (error) {
        console.error("Error modifying role:", error);
      }
    };

    const updateRole = () => {
  console.log("Updating role with ID:", selectedRole.value.id);
  loading.value = true;

  return ApiService.put(`/api/roles/${selectedRole.value.id}`, selectedRole.value)
    .then((response) => {
      console.log("Role updated successfully", response.data);
      const modifyRoleModal = document.getElementById("kt_modal_modify_role");
      if (modifyRoleModal) {
        modifyRoleModal.classList.remove("show");
        modifyRoleModal.style.display = "none";
      }

      return fetchRoles()
        .then(() => {
          ElMessage.success("Role updated successfully");
        })
        .catch((error) => {
          console.error("Error fetching roles after update:", error);
          ElMessage.error("Failed to fetch roles after update.");
        });
    })
    .catch((error) => {
      console.error("Error updating role:", error);
      ElMessage.error("Failed to update role. Please try again.");
    })
    .finally(() => {
      loading.value = false;
    });
};

    const discardChanges = () => {
      selectedRole.value = {};
      const modifyRoleModal = document.getElementById("kt_modal_modify_role");
      if (modifyRoleModal) {
        modifyRoleModal.classList.remove("show");
        modifyRoleModal.style.display = "none";
      }
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    };
    const FormSubmitted = () => {
      const addRoleModal = document.getElementById("kt_modal_add_role");
      const modalBackdrop = document.querySelector(
        ".modal.fade.show .btn-close"
      );

      if (modalBackdrop) {
        modalBackdrop.click();
      }

      if (addRoleModal) {
        addRoleModal.classList.remove("show");

        setTimeout(
          () => {
            addRoleModal.style.display = "none";
       
          } 
        );
      }
      fetchRoles();
    };

    onMounted(async () => {
      await fetchRoles();
    });

    return {
      tableData,
      tableHeader,
      search,
      searchRoles,
      selectedRole,
      modifyRole,
      deleteRole,
      updateRole,
      discardChanges,
      loading,
      fetchRoles,
      error,
      
      FormSubmitted,
      resetSearch,
      getAssetPath,
      Check,
      Delete,
      Edit,
    };
  },
});
</script>
