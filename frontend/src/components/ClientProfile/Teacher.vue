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
              @input="searchTeachers"
              class="form-control form-control-solid w-250px ps-15"
              placeholder="Search Teachers"
            />
          </div>
        </div>
        
      </div>
      <div class="card-body pt-0">
        <Datatable :data="tableData" :header="tableHeader" class="datatable">
          
          <template v-slot:firstName="{ row: teacher }">
            {{ teacher.employee.firstName + " " + teacher.employee.lastName }}
          </template>
          <template v-slot:status="{ row: teacher }">
            <span :class="[
              'badge',
              teacher.status === 'active' ? 'badge-light-success' : 'badge-light-danger'
            ]">
              {{ teacher.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </template>
          <template v-slot:speciality="{ row: teacher }">
            {{ teacher.speciality }}
          </template>
          <template v-slot:role="{ row: teacher }">
            <li v-for="(roleItem, index) in teacher.role" :key="index">
              <el-tag type="primary">
                {{ roleItem }}
                {{ (index + 1) % 3 }}
              </el-tag>
            </li>
          </template>
          
          <template v-slot:grade="{ row: teacher }">
            {{ teacher.grade }}
          </template>
            <template v-slot:view="{ row: teacher }">
           
              <el-button
                type="primary"
                :icon="Edit"
           
                circle
                @click="modifyuser(teacher)"
              />
              <el-popconfirm
              v-if="teacher.status === 'active'"
              :title="'Are sure to desactivate this teacher ?'"
              @confirm="toggleteacherStatus(teacher)"
            >
              <template #reference>
                <el-button type="danger" :icon="Close" circle />
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-else
              :title="'Are sure to activate this teacher ?'"
              @confirm="toggleteacherStatus(teacher)"
            >
              <template #reference>
                <el-button type="success" :icon="Check" circle />
              </template>
            </el-popconfirm>
            </template>
        </Datatable>
      </div>
    </div>
   
      <el-dialog v-model="dialogEditVisible" title="Modify Teacher" width="500">
      
       <el-form :model="selectedUser" :rules="rules" ref="formRef"  @submit.prevent="updateUser">
        <el-form-item label="Username" prop="username">
          <el-input v-model="selectedUser.username" autocomplete="off"></el-input>
        </el-form-item>
      
        <el-form-item label="Password" prop="password">
          <el-input v-model="selectedUser.password" :type="showPassword ? 'text' : 'password'" placeholder="Enter password">
            <template #append>
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" @click="togglePasswordVisibility"></i>
            </template>
          </el-input>
        </el-form-item>
     
        <!-- Submit Button -->
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            @click="updatuser"
            
            >Modify Teacher</el-button
          >
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
import { Check, Delete, Edit, View, Lock, Close, } from "@element-plus/icons-vue";
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
  
   
      { columnName: "Fullname", columnLabel: "firstName", sortEnabled: false },
       
      { columnName: "Role", columnLabel: "role", sortEnabled: false },
      { columnName: "Status", columnLabel: "status", width: "10%" },
      { columnName: "grade", columnLabel: "grade", sortEnabled: false },
      { columnName: "speciality", columnLabel: "speciality", sortEnabled: false },
      { columnName: "Actions", columnLabel: "view" },
    ]);
    const tableData = ref([]);
  
        const rules = ref({username: [
          { required: true, message: 'Please input the username', trigger: "change"  }
        ],
      
        password: [
          { required: true, message: 'Please input the password', trigger: "change"  }
        ],
       
      
      });
      const discardChanges = () => {
     

     dialogEditVisible.value = false;
   };
   const search = ref("");
   const allTableData = ref([]);
   const updateFilteredTableData = () => {
  console.log('Filtering with search value:', search.value);
  tableData.value = search.value
    ? allTableData.value.filter(teacher => {
        console.log('teacher:', teacher);
        const fullName = `${teacher.employee.firstName} ${teacher.employee.lastName }`.toLowerCase();
        const searchValue = search.value.toLowerCase();
        return fullName.includes(searchValue); // Filter based on full name match
      })
    : [...allTableData.value];
  console.log('Filtered Table Data:', tableData.value);
};



    const searchTeachers = () => {
      updateFilteredTableData();
    };

    const resetSearch = () => {
      search.value = "";
      updateFilteredTableData();
    };


    const updateUser = (e) => {
  e.preventDefault();
  if (!selectedUser.value) {
    console.error("selectedUser is null");
    return;
  }

  console.log(selectedUser.value);

  ApiService.setDB(db);

  const updates = {
    username: selectedUser.value.username,
    password: selectedUser.value.password,
  };

  loading.value = true;

  ApiService.patch(`/teachers/changecredentials/${selectedUser.value.id}`, updates, edmin_base_url)
    .then(() => {
      return fetchUsers();
    })
    .then(() => {
      ElMessage.success("User updated successfully");
    })
    .catch((error) => {
      console.error("Error updating User", error);
      ElMessage.error("Failed to update User. Please try again.");
    })
    .finally(() => {
      dialogEditVisible.value = false;
      loading.value = false;
    });
};
const selectedUser = ref ({
           id:'',
        username: '',
       
        password: '',
        
      

      });
      
      const modifyuser = (teacher) => {
  selectedUser.value = {
    id: teacher._id,
    username: teacher.employee.userName,
    password: teacher.password,
  };
  


  dialogEditVisible.value = true; 
};


const fetchUsers = () => {
  ApiService.setDB(db);

  ApiService.post("/teachers/filter", { query: {} }, edmin_base_url)
    .then((response) => {
      const data = response.data;
      console.log(data);
      allTableData.value = data;
      updateFilteredTableData();
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
     
    });
};

    


    const dialogEditVisible = ref(false);
    
    const toggleteacherStatus = async (teacher) => {
  try {
  

    ApiService.setDB(db);
    const newStatus = teacher.status === "active" ? "inactive" : "active";
    

    const data = {

      status: newStatus,
    };

    ApiService.patch(
      `/teachers/${teacher._id}`,
      {  data },  edmin_base_url
    )
      .then((response) => {
        console.log(response); 
        fetchUsers(); 
        const action = newStatus === "active" ? "activated" : "deactivated";
        ElMessage.success(`teacher "${teacher.employee.firstName}" has been ${action} successfully.`);
      })
      .catch((error) => {
        console.error("Error updating Teacher status", error);
        ElMessage.error("Failed to update Teacher status. Please try again.");
      });
  } catch (error) {
    console.error("Error updating Teacher status", error);
    ElMessage.error("Failed to update Teacher status. Please try again.");
  }
};

    
 onMounted(async () => {
      await fetchUsers();
    
    });
    const showPassword = ref(false); 
      const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
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
      discardChanges,
      dialogEditVisible,
      toggleteacherStatus,
      rules,
      selectedUser,
      modifyuser,
      updateUser,
      resetSearch,
      searchTeachers,
      allTableData,
      search,
      loading,
      showPassword,
      togglePasswordVisibility,
     
   
    };
  },
});
</script>

