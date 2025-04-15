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
              placeholder="Search users"
            />
          </div>
        </div>
        <div class="card-toolbar">
        
          <button
            type="button"
            class="btn btn-primary"
            @click="() => (dialogAddVisible = true)"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" /> Add user
          </button>
       
        </div>
      </div>
      <div class="card-body pt-0">
        <Datatable :data="tableData" :header="tableHeader" class="datatable">
          <template v-slot:userName="{ row: user }">
            {{ user.userName }}
          </template>
          <template v-slot:firstName="{ row: user }">
            {{ user.firstName + " " + user.lastName }}
          </template>
          <template v-slot:edtrustAdmin="{ row: user }">
            {{ user.edtrustAdmin }}
          </template>
          <template v-slot:phone="{ row: user }">
            {{ user.phone }}
          </template>
          <template v-slot:role="{ row: user }">
            {{ user.role.role }}
          </template>
          <template v-slot:buildings="{ row: user }">
            <li v-for="(b, index) in user.buildings" :key="index">
              <el-tag type="primary">
                {{ b.name }}
                {{ (index + 1) % 3 }}
              </el-tag>
            </li>
          </template>
          <template v-slot:status="{ row: user }">
            <span :class="[
              'badge',
              user.status === 'active' ? 'badge-light-success' : 'badge-light-danger'
            ]">
              {{ user.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </template>

          <template v-slot:view="{ row: user }">
            <el-button
            
            :icon="Lock"
            :disabled="user.edtrustAdmin"
            circle
            @click="updatePassword(user)"
          />
            <el-button
              type="primary"
              :icon="Edit"
              :disabled="user.edtrustAdmin"
              circle
              @click="modifyuser(user)"
            />
            <el-popconfirm
            v-if="user.status === 'active'"
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
    <el-dialog v-model="dialogAddVisible" title="Add User" width="500">
      <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="submit">
        <el-form-item label="Username" prop="userName">
          <el-input v-model="form.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Enter password">
            <template #append>
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" @click="togglePasswordVisibility"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="Building" prop="buildings">
          <el-select v-model="form.buildings" placeholder="Select a building" multiple>
            <el-option v-for="building in availableBuildings" :key="building._id" :label="building.name" :value="building._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="form.role" placeholder="Select a role">
            <el-option v-for="role in availableRoles" :key="role._id" :label="role.role" :value="role._id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading">Add User</el-button>
          <el-button type="default" @click="discardChanges">Discard</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="dialogEditVisible" title="Modify User" width="500">
      <el-form :model="selectedUser" :rules="rules" ref="formRef" @submit.prevent="updateUser">
        <el-form-item label="Username" prop="userName">
          <el-input v-model="selectedUser.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Building" prop="buildings">
          <el-select v-model="selectedUser.buildings" placeholder="Select a building" multiple>
            <el-option v-for="building in availableBuildings" :key="building._id" :label="building.name" :value="building._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="selectedUser.role" placeholder="Select a role">
            <el-option v-for="role in availableRoles" :key="role._id" :label="role.role" :value="role._id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading">Modify User</el-button>
          <el-button type="default" @click="discardChanges">Discard</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

      <el-dialog v-model="dialogPassVisible" title="Change Password" width="500">
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" @submit.prevent="changePassword">
          <el-form-item label="New Password" prop="password">
            <el-input v-model="passwordForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Enter password">
              <template #append>
                <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" @click="togglePasswordVisibility"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="Confirm Password" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm password">
              <template #append>
                <i :class="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" @click="toggleConfirmPasswordVisibility"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" :loading="loading">Change Password</el-button>
            <el-button type="default" @click="discardChanges">Discard</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      
      
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import { ElMessage } from "element-plus";
import { Check, Delete, Edit, View,Lock, Close, } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
const edmin_base_url = "http://localhost:8888/api/edmin";
export default defineComponent({
  name: "user",
 
  components: {
    Datatable,
  },

  setup() {
    const route = useRoute();
    const db = route.query.db;
    const loading = ref(false);
    const tableHeader = ref([
      {
        columnName: "userName",
        columnLabel: "userName",
        sortEnabled: true,
      },
      {
        columnName: "edtrust Admin ?",
        columnLabel: "edtrustAdmin",
        sortEnabled: false,
      },
      { columnName: "Fullname", columnLabel: "firstName", sortEnabled: false },
      { columnName: "Tel", columnLabel: "phone", sortEnabled: false },
      {
        columnName: "buildings",
        columnLabel: "buildings",
        sortEnabled: false,
        width: "15%",
      },
      { columnName: "Status", columnLabel: "status", width: "10%" },
      { columnName: "role", columnLabel: "role", sortEnabled: false },
      { columnName: "Actions", columnLabel: "view" },
    ]);
    const allTableData = ref([]); 
    const tableData = ref([]);
    const search = ref("");

    const updateFilteredTableData = () => {
        tableData.value = search.value
            ? allTableData.value.filter(user =>
                user.userName.toLowerCase().includes(search.value.toLowerCase())
            )
            : [...allTableData.value];
    };

    
    const searchUsers = () => {
        updateFilteredTableData();
    };

    const resetSearch = () => {
      search.value = "";
      updateFilteredTableData();
    };
    const form = ref({ userName: '',
        
        
        buildings: [],
        role: '',
        password:'',
        status: "active",});
        const rules = {
      userName: [{ required: true, message: "Please input a username", trigger: "blur" }],
      password: [{ required: true, message: "Please input a password", trigger: "blur" }],
      buildings: [{ required: true, message: "Please select a building", trigger: "change" }],
      role: [{ required: true, message: "Please select a role", trigger: "change" }],
    };
      const showPassword = ref(false); 
      const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
  
    const updateUser = async (e) => {
  e.preventDefault();
  if (!selectedUser.value) {
    console.error("selectedUser is null");
    return;
  }
  loading.value = true; 
  try {
    ApiService.setDB("Root");
    const userName = username.value.userName;
    const updates = {
      userName: selectedUser.value.userName,
      role: selectedUser.value.role,
      buildings: selectedUser.value.buildings
    };
    await ApiService.patch(
      `/users`,
      { userName, updates }, edmin_base_url
    ).then((response) => {
      fetchUsers();
    }).finally(() => (dialogEditVisible.value = false));
    ElMessage.success("User updated successfully");
  } catch (error) {
    console.error("Error updating User", error);
    ElMessage.error("Failed to update User. Please try again.");
  } finally {
    loading.value = false; 
  }
};
const discardChanges = () => {
       dialogAddVisible.value=false;
       dialogPassVisible.value=false;

      dialogEditVisible.value = false;
    };

    const updates = ref({});
      const selectedUser = ref ({
        userName: '',
       
        buildings: [],
        role: '',
      

      });
      const username = ref ({
        userName: '',
       
       
      

      });
      
      const modifyuser = (user) => {
        username.value = {
    userName: user.userName,
        },
  
  selectedUser.value = {
    userName: user.userName,
    role: user.role ? user.role._id : null,
    buildings: [], 
  };
  

  
  user.buildings.forEach((building) => {
    selectedUser.value.buildings.push(building._id);
  });

  dialogEditVisible.value = true; 
};
const resetFormData = () => {
      form.value = {
        userName: '',
        buildings: [],
        role: '',
        password:'',
        status: "active",
      };
    };

    const submit = async (e) => {
  e.preventDefault();
  loading.value = true; // Start loading
  try {
    ApiService.setDB("Root");
    await ApiService.put("/users", form.value, edmin_base_url)
      .then((data) => {
        ElMessage.success({
          message: "User created successfully!",
          type: "success",
        });
        fetchUsers();
        resetFormData();
      })
      .finally(() => (dialogAddVisible.value = false));
  } catch (error) {
    console.error("Error creating User:", error);
    ElMessage.error({
      message: "Failed to create User. Please try again.",
      type: "error",
    });
  } finally {
    loading.value = false; 
  }
};

const fetchUsers = () => {
    ApiService.setDB(db);
    ApiService.get("/autorisation/buildingUsers", edmin_base_url)
        .then(response => {
            const data = response.data;
            console.log(data);
            allTableData.value = data;
            updateFilteredTableData();
        })
        .catch(error => {
            console.error("Error fetching users:", error);
            ElMessage.error("Failed to ftech Users.");
        });
};

    const availableRoles = ref([]);
     const availableBuildings = ref([]);
     const fetchRoles = () => {
    ApiService.setDB("Root");
    ApiService.post("/roles/filter", { query: {} }, edmin_base_url)
        .then(response => {
            const data = response.data;
            console.log(data);
            availableRoles.value = data;
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
};

const fetchBuildings = () => {
    ApiService.setDB("Root");
    ApiService.post("/buildings/filter", { query: {} }, edmin_base_url)
        .then(response => {
            const data = response.data;
            console.log(data);
            availableBuildings.value = data;
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
};



    onMounted(async () => {
      await fetchUsers();
      await fetchRoles();
      await fetchBuildings();
    });
    const toggleUserStatus = async (user) => {
  try {
    if (!user || !user.userName || !user.status) {
      console.error("Invalid user data");
      return;
    }

    ApiService.setDB("Root");
    const newStatus = user.status === "active" ? "inactive" : "active";
    const userName = user.userName;

    const updates = {
      
      status: newStatus,
    };

    ApiService.patch(
      `/users`,
      { userName, updates },  edmin_base_url
    )
      .then((response) => {
        console.log(response); 
        fetchUsers(); 
        const action = newStatus === "active" ? "activated" : "deactivated";
        ElMessage.success(`User "${user.userName}" has been ${action} successfully.`);
      })
      .catch((error) => {
        console.error("Error updating User status", error);
        ElMessage.error("Failed to update User status. Please try again.");
      });
  } catch (error) {
    console.error("Error updating User status", error);
    ElMessage.error("Failed to update User status. Please try again.");
  }
};


    const dialogAddVisible = ref(false);
    const dialogEditVisible = ref(false);

    
    const dialogPassVisible = ref(false);
    const showConfirmPassword = ref(false);
    const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

    const passwordForm = ref({
      password: "",
      confirmPassword: "",
      userName : "",
    });
    const updatePassword = (user) => {
  passwordForm.value = {
    password: user.password,
    userName: user.userName,
 
  };
  

  dialogPassVisible.value = true; 
};
const passwordFormRef = ref(null);

const validatePasswordConfirm = (rule, value, callback) => {
  if (value !== passwordForm.value.password) {
    callback(new Error("Passwords do not match"));
  } else {
    callback();
  }
};

const passwordRules = {
  password: [
    { required: true, message: "Please enter a new password", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "Please confirm the password", trigger: "blur" },
    { validator: validatePasswordConfirm, trigger: "blur" },
  ],
};



const changePassword = async (e) => {
  e.preventDefault();
  if (!passwordForm.value) {
    console.error("passwordForm is null");
    return;
  }

  // Validate the form before submission
  const valid = await passwordFormRef.value.validate();
  if (!valid) {
    console.error("Password form validation failed");
    return;
  }

  loading.value = true; 
  try {
    ApiService.setDB("Root");
    const userName = passwordForm.value.userName;
    const updates = {
      password: passwordForm.value.password,
    };
    await ApiService.patch(
      `/users`,
      { userName, updates }, edmin_base_url
    ).then((response) => {
      fetchUsers();
    }).finally(() => (dialogPassVisible.value = false));
    ElMessage.success("Password updated successfully");
  } catch (error) {
    console.error("Error updating Password", error);
    ElMessage.error("Failed to update Password. Please try again.");
  } finally {
    loading.value = false; 
  }
};
   
  
    return {
      tableData,
      tableHeader,
      fetchUsers,
      Check,
      Delete,
      Edit,
      View,
      Lock,
      Close,
      dialogAddVisible,
      dialogEditVisible,
      form,
      rules,
      submit,
      availableRoles,
      availableBuildings,
      selectedUser,
      modifyuser,
      updateUser,
      togglePasswordVisibility,
      updates,
      toggleUserStatus,
      dialogPassVisible,
      passwordForm,
      passwordRules,
      changePassword,
      updatePassword,
      discardChanges,
      showPassword,
      resetFormData,
      loading,
      passwordFormRef,
      showConfirmPassword,
      toggleConfirmPasswordVisibility,
      resetSearch,
      searchUsers,
      search,
      username 
    

    };
  },
});
</script>
