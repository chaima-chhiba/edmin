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
              @input="searchParents"
              class="form-control form-control-solid w-250px ps-15"
              placeholder="Search Parents"
            />
          </div>
        </div>
        <div class="card-toolbar">
      
        </div>
      </div>
      <div class="card-body pt-0">
        <Datatable :data="tableData" :header="tableHeader" class="datatable">
          
          <template v-slot:userName="{ row: parent }">
            {{ parent.userName }}
          </template>
          <template v-slot:mother="{ row: parent }">
            {{ parent.mother.firstName +" "+parent.mother.lastName }}
          </template>
          <template v-slot:status="{ row: parent }">
            <span :class="[
              'badge',
              parent.status === 'active' ? 'badge-light-success' : 'badge-light-danger'
            ]">
              {{ parent.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </template>
         
          <template v-slot:father="{ row: parent }">
            {{ parent.father.firstName +" "+parent.father.lastName }}
          </template>
          <template v-slot:students="{ row: parent }">
            <li v-for="(b, index) in parent.students" :key="index">
              <el-tag type="primary">
                {{ b.firstName + " " +b.lastName}}
                {{ (index + 1) % 3 }}
              </el-tag>
            </li>
          </template>
          
         
       
          <template v-slot:view="{ row: parent }">
           
            <el-button
              type="primary"
              :icon="Edit"
         
              circle
              @click="modifyuser(parent)"
            />
            <el-popconfirm
            v-if="parent.status === 'active'"
            :title="'Are sure to desactivate this parent ?'"
            @confirm="toggleparentStatus(parent)"
          >
            <template #reference>
              <el-button type="danger" :icon="Close" circle />
            </template>
          </el-popconfirm>
          <el-popconfirm
            v-else
            :title="'Are sure to activate this parent ?'"
            @confirm="toggleparentStatus(parent)"
          >
            <template #reference>
              <el-button type="success" :icon="Check" circle />
            </template>
          </el-popconfirm>
          </template>
        </Datatable>
      </div>
    </div>
  
      <el-dialog v-model="dialogEditVisible" title="Modify Parent" width="500">
      
        <el-form :model="selectedUser" :rules="rules" ref="formRef"  @submit.prevent="updateUser">
          <el-form-item label="Username" prop="userName">
            <el-input v-model="selectedUser.userName" autocomplete="off"></el-input>
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
            @click="updateUser"
           
            >Modify Credentials Parent</el-button
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
import { Check, Delete, Edit, View,Lock ,Close,} from "@element-plus/icons-vue";
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
    const tableHeader = ref([
      {
        columnName: "userName",
        columnLabel: "userName",
        sortEnabled: true,
      },
   
      { columnName: "mother", columnLabel: "mother", sortEnabled: false },
       
      
      
      { columnName: "father", columnLabel: "father", sortEnabled: false },
      { columnName: "Status", columnLabel: "status", width: "10%" },
      { columnName: "child", columnLabel: "students", sortEnabled: false },
      { columnName: "Actions", columnLabel: "view" },
    ]);
    
    const allTableData = ref([]);
    const tableData = ref([]);
    const search = ref("");
    const loading = ref(false);
    const updateFilteredTableData = () => {
  console.log('Filtering with search value:', search.value);
  tableData.value = search.value
    ? allTableData.value.filter(parent => {
        console.log('Parent:', parent);
        return parent.userName && parent.userName.toLowerCase().includes(search.value.toLowerCase());
      })
    : [...allTableData.value];
  console.log('Filtered Table Data:', tableData.value);
};


    const searchParents = () => {
      updateFilteredTableData();
    };

    const resetSearch = () => {
      search.value = "";
      updateFilteredTableData();
    };


  
  const rules = ref({userName: [
    { required: true, message: 'Please input the username', trigger: "change"  }
  ],

  password: [
    { required: true, message: 'Please input the password', trigger: "change"  }
  ],
 

});
ApiService.setDB(db);
const updateUser = async (e) => {
      e.preventDefault();
      if (!selectedUser.value) {
        console.error("selectedUser is null");
        return;
      }

      console.log(selectedUser.value);
      const updates = {
        userName: selectedUser.value.userName,
        password: selectedUser.value.password,
      };

      loading.value = true;

      try {
        await ApiService.patch(`/parents/password/${selectedUser.value.id}`, updates, edmin_base_url)
          .then((response) => {
            fetchUsers();
            ElMessage.success("User updated successfully");
          })
          .catch((error) => {
            console.error("Error updating User", error);
            ElMessage.error("Failed to update User. Please try again.");
          });
      } catch (error) {
        console.error("Unexpected error", error);
        ElMessage.error("An unexpected error occurred. Please try again.");
      } finally {
        dialogEditVisible.value = false;
        loading.value = false;
      }
    };


const selectedUser = ref ({
     id:'',
  userName: '',
 
  password: '',
  


});
const toggleparentStatus = async (parent) => {
  try {
  

    const newStatus = parent.status === "active" ? "inactive" : "active";
    

    const data = {
      
      status: newStatus,
    };

    ApiService.patch(
      `/parents/${parent._id}`,
      {  data },  edmin_base_url
    )
      .then((response) => {
        console.log(response); 
        fetchUsers(); 
        const action = newStatus === "active" ? "activated" : "deactivated";
        ElMessage.success(`parent "${parent.userName}" has been ${action} successfully.`);
      })
      .catch((error) => {
        console.error("Error updating parent status", error);
        ElMessage.error("Failed to update parent status. Please try again.");
      });
  } catch (error) {
    console.error("Error updating parent status", error);
    ElMessage.error("Failed to update parent status. Please try again.");
  }
};
const discardChanges = () => {
     

     dialogEditVisible.value = false;
   };

const modifyuser = (parent) => {
selectedUser.value = {
id: parent._id,

};



dialogEditVisible.value = true; 
};

   

const fetchUsers = () => {
    ApiService.get("/parents",  edmin_base_url)
        .then(response => {
            const data = response.data;
            allTableData.value = data;
            updateFilteredTableData();
        })
        .catch(error => {
            console.error("Error fetching users:", error);
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
      loading,
      Close,
      discardChanges,
      dialogEditVisible,
      resetSearch ,
      searchParents,
      rules,
      search,
      toggleparentStatus,
      selectedUser,
      modifyuser,
      updateUser,
      togglePasswordVisibility,
      showPassword,
     
      
     
    };
  },
});
</script>
