<template>
  <div>
    <div class="card">
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
              @input="searchUsers"
              class="form-control form-control-solid w-250px ps-15"
              placeholder="Search Users"
            />
          </div>
        </div>
        <!-- Card toolbar -->
        <div class="card-toolbar">
         
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_user"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" /> Add User
          </button>
        </div>

     
      </div>

      <div class="card-body pt-0">
        <!-- Datatable component -->

        <Datatable
          @on-sort="sort"
          @on-items-select="onItemSelect"
          @on-items-per-page-change="onItemsPerPageChange"
          :data="tableData"
          :header="tableHeader"
          :enable-items-per-page-dropdown="true"
          class="datatable"
        >
          
          <template v-slot:user="{ row: user }">
            <div class="d-flex align-items-center">
              <div class="avatar-wrapper me-2">
            
                <el-avatar v-if="user.avatar" :size="50" :src="user.avatar" />
                
                <el-avatar
                  v-else
                  :size="50"
                  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                />
              </div>
              <span>{{ user.username }}</span>
            </div>
          </template>
          <template v-slot:firstname="{ row: user }">
            {{ user.firstName }}
          </template>
          <template v-slot:lastname="{ row: user }">
            {{ user.lastName }}
          </template>
          <template v-slot:role="{ row: user }">
            {{ user.role }}
          </template>
          <template v-slot:status="{ row: user }">
            <span
              :class="[
                'badge',
                user.status
                  ? 'badge badge-light-success'
                  : 'badge badge-light-danger',
              ]"
            >
              {{ user.status ? "Active" : "Inactive" }}
            </span>
          </template>
          <template v-slot:actions="{ row: user }">
            <el-button
              type="primary"
              :icon="Edit"
              circle
              @click="modifyUser(user)"
            />
            <el-popconfirm
              v-if="user.status"
              :title="'Are sure to desactivate this user ?'"
              @confirm="toggleUserStatus(user)"
            >
              <template #reference>
                <el-button type="danger" :icon="Close" circle />
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-else
              :title="'Are sure to activate this user ?'"
              @confirm="toggleUserStatus(user)"
            >
              <template #reference>
                <el-button type="success" :icon="Check" circle />
              </template>
            </el-popconfirm>
          </template>
        </Datatable>
      </div>
    </div>

    <!-- Add User Modal -->
    <div
      class="modal fade"
      id="kt_modal_add_user"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add User</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <AddUserModel
              @form-submitted="FormSubmitted"
              @form-discarded="FormSubmitted"
              :users="users"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modify User Modal -->
    <div
      class="modal fade"
      id="kt_modal_modify_user"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modify user</h5>
            <button
              type="button"
              class="btn-close"
              @click="discardChanges"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6 mb-3">
                <label for="username" class="required fs-6 fw-semibold mb-2"
                  >UserName</label
                >
                <el-form-item prop="username">
                  <el-input v-model="selectedUser.username" type="text" />
                </el-form-item>
              </div>

              <div class="col-md-6 mb-3">
                <label for="firstName" class="required fs-6 fw-semibold mb-2"
                  >FirstName</label
                >
                <el-form-item prop="firstName">
                  <el-input v-model="selectedUser.firstName" type="text" />
                </el-form-item>
              </div>

              <div class="col-md-6 mb-3">
                <label for="lastName" class="required fs-6 fw-semibold mb-2"
                  >LastName</label
                >
                <el-form-item prop="lastName">
                  <el-input v-model="selectedUser.lastName" type="text" />
                </el-form-item>
              </div>

              <div class="col-md-6 mb-3">
                <label for="email" class="required fs-6 fw-semibold mb-2"
                  >Email</label
                >
                <el-form-item prop="email">
                  <el-input v-model="selectedUser.email" type="email" />
                </el-form-item>
              </div>

              <div class="col-md-6 mb-3">
                <label for="role" class="required fs-6 fw-semibold mb-2"
                  >Role</label
                >
                <el-form-item prop="role">
                  <el-select
                    v-model="selectedUser.role"
                    placeholder="Select a role"
                  >
                    <el-option
                      v-for="role in availableRoles"
                      :key="role.id"
                      :label="role.name"
                      :value="role.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <div class="mt-4">
              <el-button type="primary" @click="updateUser" :loading="loading">
               Modify 
              </el-button>
              <el-button type="default" @click="discardChanges"
                >Discard</el-button
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
import AddUserModel from "@/components/modals/forms/AddUserModel.vue";
import { ElMessage } from "element-plus";
import ApiService from "@/core/services/ApiService";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";

import { Check, Delete, Edit,Close } from "@element-plus/icons-vue";

export default defineComponent({
  name: "UsersListing",
  components: {
    Datatable,
    AddUserModel,
    Check,
    Delete,
    Edit,
    Close,
  },
  setup() {
    
    const tableHeader = ref([
      {
        columnName: "User",
        columnLabel: "user",
      
        sortEnabled: true,
      },
      {
        columnName: "firstname",
        columnLabel: "firstname",
       
        sortEnabled: true,
      },
      {
        columnName: "LastName",
        columnLabel: "lastname",
       
        sortEnabled: true,
      },
      {
        columnName: "Role",
        columnLabel: "role",
       
        sortEnabled: true,
      },
      { columnName: "Status", columnLabel: "status", width: "15%" },
      { columnName: "Actions", columnLabel: "actions", width: "10%" },
    ]);
    const tableData = ref([]);
    const addUserModalRef = ref(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const modifyUserModalRef = ref({});
    const selectedUser = ref<any>({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    });
    const search = ref("");
    const originalTableData = ref([]);
    const selectedIds = ref<Array<number>>([]);

    const availableRoles = ref([]);
    
  

    
  

    const fetchRoles = () => {
  return ApiService.get("/api/roles")
    .then(response => {
      const responseData = response.data;
      if (Array.isArray(responseData.roles)) {
        availableRoles.value = responseData.roles;
      } else {
        console.error("Invalid response format. Expected an array.");
        console.error("Actual response data:", responseData);
        throw new Error("Failed to fetch roles.");
      }
    })
    .catch(error => {
      console.error("Error fetching roles:", error);
      throw error;
    });
};

const fetchUsers = () => {
  loading.value = true;
 

  const url = "/api/users";

  return ApiService.get(url)
    .then(response => {
      const responseData = response.data;

      if (Array.isArray(responseData.users)) {
        originalTableData.value = responseData.users.map((user) => ({
          id: user._id.toString(),
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role ? user.role.name : "", 
          status: user.status,
          avatar: user.avatar, 
        }));

        updateFilteredTableData(); 
        error.value = null;
      } else {
        console.error("Invalid response format. Expected an array.");
        console.error("Actual response data:", responseData);
        error.value = "Failed to fetch users.";
      }
    })
    .catch(error => {
      console.error("Error fetching users:", error);
      ElMessage.error("Failed to fetch users");
      error.value = "Failed to fetch users.";
    })
    .finally(() => {
      loading.value = false;
    });
};

const users = computed(() => {
  console.log('Computed users:', originalTableData.value); 
  return originalTableData.value;
});

   
    const modifyUser = (user) => {
    
      selectedUser.value = { ...user, id: user.id };
      console.log(selectedUser.value);
      const modifyUserModal = document.getElementById("kt_modal_modify_user");
      if (modifyUserModal) {
        modifyUserModal.classList.add("show"); 
        modifyUserModal.style.display = "block";
      }
    };

   

    const updateUser = () => {
  if (!selectedUser.value) {
    console.error("selectedUser is null");
    return;
  }

  const userObjectToSubmit = {
    username: selectedUser.value.username,
    first_name: selectedUser.value.firstName,
    last_name: selectedUser.value.lastName,
    role_name: selectedUser.value.role,

  };

  loading.value = true;

  return ApiService.put(`/api/users/${selectedUser.value.id}`, userObjectToSubmit)
    .then(response => {
      console.log("User updated successfully", response.data);
      console.log("Selected user after modification:", selectedUser.value);

      const modifyUserModal = document.getElementById("kt_modal_modify_user");
      if (modifyUserModal) {
        modifyUserModal.classList.remove("show");
        modifyUserModal.style.display = "none";
      }

      ElMessage.success("User updated successfully");
      fetchUsers();
    })
    .catch(error => {
      console.error("Error updating user", error);
      ElMessage.error("Failed to update user. Please try again.");
    })
    .finally(() => {
      loading.value = false;
    });
};

    
const toggleUserStatus = (user) => {
  const newStatus = !user.status;

  return ApiService.put(`/api/users/${user.id}/status`, { status: newStatus })
    .then(() => {
      const action = newStatus ? "activated" : "deactivated";
      ElMessage.success(
        `User "${user.username}" has been ${action} successfully.`
      );

      user.status = newStatus;
    })
    .catch(error => {
      console.error("Error toggling user status:", error);
      ElMessage.error(
        "Failed to toggle user status. Please try again later."
      );
    });
};


   
    const updateFilteredTableData = () => {
      tableData.value = search.value
        ? originalTableData.value.filter(
            (user) =>
              user.username
                .toLowerCase()
                .includes(search.value.toLowerCase()) ||
              user.firstName
                .toLowerCase()
                .includes(search.value.toLowerCase()) ||
              user.lastName
                .toLowerCase()
                .includes(search.value.toLowerCase()) ||
              user.role.toLowerCase().includes(search.value.toLowerCase())
          )
        : [...originalTableData.value];
    };

    // Search users based on the input
    const searchUsers = () => {
      updateFilteredTableData();
    };

   
    const resetSearch = () => {
      search.value = "";
      updateFilteredTableData();
    };

    const discardChanges = () => {
    
      selectedUser.value = {};
      
      const modalElement = document.getElementById("kt_modal_modify_user");
      if (modalElement) {
        modalElement.classList.remove("show");
        modalElement.style.display = "none";
      }
    };
  

    
    onMounted(async () => {
      try {
        await fetchRoles();
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
      await fetchUsers();
    });
    const FormSubmitted = () => {
      const addUserModal = document.getElementById("kt_modal_add_user");
      const modalBackdrop = document.querySelector(
        ".modal.fade.show .btn-close"
      );

      if (modalBackdrop) {
        modalBackdrop.click();
      }

      if (addUserModal) {
        addUserModal.classList.remove("show");

        setTimeout(
          () => {
            addUserModal.style.display = "none";
       
          } 
        );
      }
      fetchUsers();
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        
        switch (sort.label) {
          case "username":
            arraySort(tableData.value, "username", { reverse });
            break;
          case "firstname":
            arraySort(tableData.value, "firstName", { reverse });
            break;
          case "lastname":
            arraySort(tableData.value, "lastName", { reverse });
            break;
          case "role":
            arraySort(tableData.value, "role", { reverse });
            break;
          case "status":
            arraySort(tableData.value, "status", { reverse });
            break;
          default:
            
            arraySort(tableData.value, "username", { reverse });
            break;
        }
      }
    };
    const onItemsPerPageChange = () => {
      setTimeout(() => {
        MenuComponent.reinitialization();
      }, 0);
    };

    return {
      tableHeader,
      tableData,
      addUserModalRef,
      loading,
      error,
    
      selectedIds,
   
      modifyUser,
      toggleUserStatus,
      modifyUserModalRef,
      selectedUser,
      searchUsers,
      search,
      updateUser,
      FormSubmitted,
      availableRoles,
      discardChanges,
      resetSearch,
      sort,
      onItemSelect,
      onItemsPerPageChange,
    
      Check,
      Delete,
      Edit,
      Close,
      users
    };
  },
});
</script>
