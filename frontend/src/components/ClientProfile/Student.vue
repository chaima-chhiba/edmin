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
              @input="searchStudents"
              class="form-control form-control-solid w-250px ps-15"
              placeholder="Search Students"
            />
          </div>
        </div>
        <div class="card-toolbar">
      
        </div>
      </div>
      <div class="card-body pt-0">
        <Datatable :data="tableData" :header="tableHeader" class="datatable">
          
          <template v-slot:firstName="{ row: student }">
            {{ student.firstName + " " + student.lastName }}
          </template>
         
          <template v-slot:father="{ row: student }">
            {{ student.parent.father.firstName +" "+student.parent.father.lastName }}
          </template>
          <template v-slot:status="{ row: student }">
            <span :class="[
              'badge',
              student.status === 'active' ? 'badge-light-success' : 'badge-light-danger'
            ]">
              {{ student.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </template>
       
          <template v-slot:view="{ row: student }">
            <el-button
                type="primary"
                :icon="Edit"
           
                circle
                @click="modifyuser(student)"
              />
              <el-popconfirm
            v-if="student.status === 'active'"
            :title="'Are sure to desactivate this student ?'"
            @confirm="togglestudentStatus(student)"
          >
            <template #reference>
              <el-button type="danger" :icon="Close" circle />
            </template>
          </el-popconfirm>
          <el-popconfirm
            v-else
            :title="'Are sure to activate this student ?'"
            @confirm="togglestudentStatus(student)"
          >
            <template #reference>
              <el-button type="success" :icon="Check" circle />
            </template>
          </el-popconfirm>
          
          </template>
        </Datatable>
      </div>
    </div>
  
      <el-dialog v-model="dialogEditVisible" title="Modify Student" width="500">
      
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
          
            >Modify Student</el-button
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
      { columnName: "Status", columnLabel: "status", width: "10%" },
      
      
      { columnName: "father", columnLabel: "father", sortEnabled: false },
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
      ApiService.setDB(db);
      const togglestudentStatus = async (student) => {
  try {
  

    
    const newStatus = student.status === "active" ? "inactive" : "active";
    

    const data = {
      
      status: newStatus,
    };

    ApiService.patch(
      `/students/${student._id}`,
      {  data },  edmin_base_url
    )
      .then((response) => {
        console.log(response); // Log the response for debugging
        fetchUsers(); // Update the student list after status update
        const action = newStatus === "active" ? "activated" : "deactivated";
        ElMessage.success(`student "${student.firstName}" has been ${action} successfully.`);
      })
      .catch((error) => {
        console.error("Error updating student status", error);
        ElMessage.error("Failed to update student status. Please try again.");
      });
  } catch (error) {
    console.error("Error updating student status", error);
    ElMessage.error("Failed to update student status. Please try again.");
  }
};
      const discardChanges = () => {
     

     dialogEditVisible.value = false;
   };
   const updateUser = (e) => {
  e.preventDefault();
  if (!selectedUser.value) {
    console.error("selectedUser is null");
    return;
  }

  console.log(selectedUser.value);

  const updates = {
    username: selectedUser.value.username,
    password: selectedUser.value.password,
  };

  loading.value = true; 

  ApiService.patch(`/students/${selectedUser.value.id}`, updates, edmin_base_url)
    .then((response) => {
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
      loading.value = false; 
      dialogEditVisible.value = false; 
    });
};


   
      const selectedUser = ref ({
           id:'',
        username: '',
       
        password: '',
        
      

      });
      
      const modifyuser = (student) => {
  selectedUser.value = {
    id: student._id,
    username: student.userName,
    password: student.password,
  };
  


  dialogEditVisible.value = true; // Show the edit dialog
};
const search = ref("");
const allTableData = ref([]);
const updateFilteredTableData = () => {
  console.log('Filtering with search value:', search.value);
  tableData.value = search.value
    ? allTableData.value.filter(student => {
        console.log('student:', student);
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const searchValue = search.value.toLowerCase();
        return fullName.includes(searchValue); // Filter based on full name match
      })
    : [...allTableData.value];
  console.log('Filtered Table Data:', tableData.value);
};



    const searchStudents = () => {
      updateFilteredTableData();
    };

    const resetSearch = () => {
      search.value = "";
      updateFilteredTableData();
    };

    const fetchUsers = () => {
  ApiService.post("/students/filter", { query: {} }, edmin_base_url)
    .then((response) => {
      const data = response.data;
      allTableData.value = data;
      updateFilteredTableData();
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      ElMessage.error("Failed to fetch students.");
  
    });
};

  
   
       
    

    onMounted(async () => {
      await fetchUsers();
     
    });
    



    const dialogEditVisible = ref(false);
    
    
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
      rules,
      togglestudentStatus,
      selectedUser,
      modifyuser,
      updateUser,
      resetSearch,
      searchStudents,
      allTableData,
      search,
      loading,
      togglePasswordVisibility,
      showPassword,
    
      
      
    
    };
  },
});
</script>
