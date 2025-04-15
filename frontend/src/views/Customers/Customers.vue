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
              @input="searchClients"
              class="form-control form-control-solid w-250px ps-15"
              placeholder="Search customers"
            />
          </div>
        </div>
        <!-- Card toolbar -->
        <div class="card-toolbar">
          <!-- Export and Add User buttons -->
          <div
            class="d-flex justify-content-end"
            data-kt-user-table-toolbar="base"
          >
            <!-- Add New client Button -->
            <!-- Adjusted alignment for symmetry -->
            <button
              type="button"
              class="btn btn-primary"
              @click="() => (dialogAddVisible = true)"
            >
              <KTIcon icon-name="plus" icon-class="fs-2" /> Add School
            </button>
          </div>
        </div>
      </div>
      <div class="card-body pt-0">
        <!-- Datatable component -->
        <!-- Datatable component -->
        <!-- Datatable component -->
        <Datatable
          :data="filteredTableData"
          :header="tableHeader"
          class="datatable"
        >
          <!-- Serial Number Column -->
          <template v-slot:serialNumber="{ row: client }">
            <router-link
              :to="{ name: 'client-profile', params: { id: client._id ,db: client.dbName } }"
            >
              {{ client.serialNumber }}
            </router-link>
          </template>

          <!-- Logo Column -->
          <template v-slot:logo="{ row: client }">
            <div class="avatar-wrapper">
              <el-avatar
                v-if="client.logo"
                :size="50"
                :src="client.logo"
                shape="square"
              />
            </div>
          </template>

          <!-- Time of Creation Column -->
          <template v-slot:timeOfCreation="{ row: client }">
            {{ formatDate(client.timeOfCreation) }}
          </template>

          <!-- School Name Column -->
          <template v-slot:schoolName="{ row: client }">
            {{ client.schoolName }}
          </template>
          <template v-slot:headMaster="{ row: client }">
            {{ client.headMaster }}
          </template>
          <!-- idHubSpot Column -->
          <template v-slot:idHubSpot="{ row: client }">
            <a
              v-if="client.idHubSpot"
              :href="
                'https://app-eu1.hubspot.com/contacts/143644187/record/0-2/' +
                client.idHubSpot
              "
              target="_blank"
              rel="noopener noreferrer"
              class="d-inline-flex align-items-center"
            >
              <el-avatar src="/hubspotLogo.jpeg" :size="25" class="m-2" />
              {{ client.idHubSpot }}
            </a>
            <p v-else>--</p>
          </template>
          <!-- Status Column -->
          <template v-slot:status="{ row: client }">
            <span
              :class="[
                'badge',
                client.status ? 'badge badge-light-success':'badge badge-light-danger',
              ]"
            >
              {{ client.status ? "Active" : "Inactive" }}
            </span>
          </template>

          <!-- School Type Column -->
          <template v-slot:schoolType="{ row: client }">
            {{ client.schoolType }}
          </template>
          <!-- Telephone Column -->
          <template v-slot:tel="{ row: client }">
            {{ client.tel }}
          </template>
          <!-- dbName Column -->
          <template v-slot:dbName="{ row: client }">
            {{ client.dbName }}
          </template>
          <template v-slot:pack="{ row: client }">
            {{ client.pack }}
          </template>
          <template v-slot:actions="{ row: client }">
            <el-button
              type="primary"
              :icon="Edit"
              circle
              @click="modifyClient(client)"
            />
            <el-popconfirm
              v-if="client.status"
              :title="'Are sure to desactivate this client ?'"
              @confirm="toggleclientStatus(client)"
            >
              <template #reference>
                <el-button type="danger" :icon="Close" circle />
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-else
              :title="'Are sure to activate this client ?'"
              @confirm="toggleclientStatus(client)"
            >
              <template #reference>
                <el-button type="success" :icon="Check" circle />
              </template>
            </el-popconfirm>
          </template>
        </Datatable>
      </div>
    </div>
    <!-- Add Client Modal -->
    <el-dialog v-model="dialogAddVisible" title="Add Client" width="600">
      <!-- Add Client Form -->
      <el-form :model="formData" :rules="rules" ref="formRef" @submit="submit">
        <!-- Logo Input Field -->
        <div class="row g-3 mb-3">
          <label
            for="logo"
            class="col-md-6 col-form-label required fs-6 fw-semibold mb-2"
            >Logo</label
          >
          <div class="col-md-6">
            <div class="image-input image-input-outline">
              <label
                class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                data-kt-image-input-action="change"
                data-bs-toggle="tooltip"
                title="Change logo"
              >
                <i class="bi bi-pencil-fill fs-7"></i>
                <input
                  type="file"
                  name="logo"
                  accept=".png, .jpg, .jpeg"
                  @change="handleLogoChange"
                />
              </label>
              <div class="image-input-wrapper w-125px h-125px">
                <img
                  v-if="formData.logo"
                  :src="formData.logo"
                  class="logo"
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
            <div class="form-text">Allowed file types: png, jpg, jpeg.</div>
          </div>
        </div>
        <!-- hubspot id -->
        <el-alert type="info" show-icon :closable="false" class="mb-3">
          <p>HubSpot ID is required to add a new client</p>
        </el-alert>
        <el-form-item label="HubSpot ID" prop="idHubSpot">
          <!-- <el-input v-model="formData.idHubSpot" />-->
          <el-select
            v-model="formData.idHubSpot"
            filterable
            remote
            reserve-keyword
            placeholder="Search client by name in HubSpot"
            :remote-method="remoteMethod"
            :loading="loadingHSSearch"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-skeleton :rows="3" animated v-if="loadingClientSelect" />
        <div v-else>
          <!-- School Name -->
          <el-form-item label="School Name" prop="schoolName">
            <el-input v-model="formData.schoolName" />
          </el-form-item>
          <el-form-item label="DB name" prop="dbName">
            <el-input v-model="formData.dbName" />
          </el-form-item>
          <el-form-item label="Pack" prop="pack">
            <el-select v-model="formData.pack" placeholder="Select a pack">
              <el-option v-for="pack in availablePacks" :key="pack.id" :label="pack.name" :value="pack.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="Base url" prop="base_url">
            <el-select
              v-model="formData.base_url"
              placeholder="Select base URL"
              size="large"
              :fit-input-width="true"
            >
              <el-option
                key="1"
                label="https://api.dev.edtrust.tn"
                value="https://api.dev.edtrust.tn"
              />
              <el-option
                key="2"
                label="https://dev.edtrust.tn"
                value="https://dev.edtrust.tn"
              />
              <el-option
                key="3"
                label="http://localhost:8888 (Dev only)"
                value="http://localhost:8888"
              />
            </el-select>
          </el-form-item>
          
          <!-- School Type -->
          <el-form-item label="School Type" prop="schoolType">
            <el-select v-model="formData.schoolType">
              <el-option
                v-for="type in schoolTypes"
                :key="type"
                :label="type"
                :value="type"
              />
            </el-select>
          </el-form-item>

          <!-- Telephone -->
          <el-form-item label="Telephone" prop="tel">
            <el-input v-model="formData.tel" />
          </el-form-item>
          <!-- Legal Name Input Field -->
<el-form-item label="Legal Name" prop="legalName">
  <el-input v-model="formData.legalName" />
</el-form-item>

<!-- Address Input Field -->
<el-form-item label="Address" prop="address">
  <el-input v-model="formData.address" />
</el-form-item>

<!-- Head Master Input Field -->
<el-form-item label="Head Master" prop="headMaster">
  <el-input v-model="formData.headMaster" />
</el-form-item>

<!-- User Name Input Field -->
<el-form-item label="User Name" prop="user.userName">
  <el-input v-model="formData.user.userName" />
</el-form-item>

<!-- Password Input Field -->
<el-form-item label="Password" prop="user.password">
  <el-input v-model="formData.user.password" :type="showPassword ? 'text' : 'password'" placeholder="Enter password">
    <template #append>
      <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" @click="togglePasswordVisibility"></i>
    </template>
  </el-input>
</el-form-item>

        </div>

        <!-- Submit Button -->
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            @click="submit"
            :loading="loading"
            :disabled="loadingClientSelect"
            >Add Client</el-button
          >
          <el-button type="default" @click="discardForm">Discard</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- Modify Client Modal -->
    <el-dialog v-model="dialogEditVisible" title="Modify School" width="600">
      <!-- Modify Client Form -->
      <el-form
        :model="selectedClient"
        :rules="rules"
        ref="modifyFormRef"
        @submit.prevent="updateClient"
      >
        <!-- Logo Input Field -->
        <!-- Similar to the Add Client Form -->
        <!-- School Name Input Field -->
        <el-form-item label="School Name" prop="schoolName">
          <el-input v-model="selectedClient.schoolName" />
        </el-form-item>
        <el-form-item label="DB name" prop="dbName">
          <el-input v-model="selectedClient.dbName" />
        </el-form-item>
        <el-form-item label="Base url" prop="base_url">
          <el-select
            v-model="selectedClient.base_url"
            placeholder="Select base URL"
            size="large"
            :fit-input-width="true"
          >
            <el-option
              key="1"
              label="https://api.dev.edtrust.tn"
              value="https://api.dev.edtrust.tn"
            />
            <el-option
              key="2"
              label="https://dev.edtrust.tn"
              value="https://dev.edtrust.tn"
            />
            <el-option
              key="3"
              label="http://localhost:8888 (Dev only)"
              value="http://localhost:8888"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Pack" prop="pack">
          <el-select v-model="selectedClient.pack" placeholder="Select a pack">
            <el-option v-for="pack in availablePacks" :key="pack.id" :label="pack.name" :value="pack.name" />
          </el-select>
        </el-form-item>
        <!-- School Type Select Field -->
        <el-form-item label="School Type" prop="schoolType">
          <el-select v-model="selectedClient.schoolType">
            <el-option
              v-for="type in schoolTypes"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        <!-- Telephone Input Field -->
        <el-form-item label="Telephone" prop="tel">
          <el-input v-model="selectedClient.tel" />
        </el-form-item>
           <!-- Legal Name Input Field -->
<el-form-item label="Legal Name" prop="legalName">
  <el-input v-model="selectedClient.legalName" />
</el-form-item>

<!-- Address Input Field -->
<el-form-item label="Address" prop="address">
  <el-input v-model="selectedClient.address" />
</el-form-item>

<!-- Head Master Input Field -->
<el-form-item label="Head Master" prop="headMaster">
  <el-input v-model="selectedClient.headMaster" />
</el-form-item>

<!-- User Name Input Field -->
<el-form-item label="User Name" prop="user.userName">
  <el-input v-model="selectedClient.user.userName" />
</el-form-item>

        <!-- Submit Button -->
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading"
            >Save Changes</el-button
          >
          <el-button type="default" @click="discardChanges">Discard</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import { ElMessage } from "element-plus";

import { Check, Delete, Edit, Close } from "@element-plus/icons-vue";
const edmin_base_url = "http://localhost:8888/api/edmin";
export default defineComponent({
  name: "ClientsListing",
  components: {
    Datatable,
    Check,
    Delete,
    Edit,
    Close,
  },
  setup() {
    
    const tableHeader = ref([
      { columnName: "#", columnLabel: "serialNumber", width: "15%" },
      { columnName: "Logo", columnLabel: "logo", width: "15%" },
      { columnName: "id HubSpot", columnLabel: "idHubSpot" },
      { columnName: "dbName", columnLabel: "dbName" },
      { columnName: "pack", columnLabel: "pack" },
      { columnName: "head Master", columnLabel: "headMaster" },
      { columnName: "Added at", columnLabel: "timeOfCreation", width: "15%" },
      { columnName: "Status", columnLabel: "status", width: "10%" },
      { columnName: " Type", columnLabel: "schoolType", width: "15%" },
      { columnName: "Tel", columnLabel: "tel", width: "15%" },
      { columnName: "Actions", columnLabel: "actions", width: "10%" },
    ]);
    const tableData = ref<any[]>([]);
    const search = ref("");
    const loading = ref(false);
    const availablePacks = ref([]);
    const schoolTypes = [ "jardinEnfant",
      "ecole",
      "college",
      "lycee",
      "collegeEtLycee",
      "primaireEtCollege",];

  
    const fetchClients = () => {
  ApiService.get("/api/client")
    .then((response) => {
      tableData.value = response.data.clients;
    })
    .catch((error) => {
      console.error("Error fetching clients:", error);
      ElMessage.error(
          "Failed to fetch clients."
        );
    });
};

const fetchPacks = () => {
  ApiService.setDB('Root');
  ApiService.post(
    "/packs/filter",
    {
      query: {},
    },
    edmin_base_url
  )
    .then(({ data }) => {
      console.log(data);
      availablePacks.value = data;
    })
    .catch((error) => {
      console.error("Error fetching packs:", error);
      error.value = "Failed to fetch packs.";
    });
};

    
const toggleclientStatus = (client) => {
  const newStatus = !client.status;
  ApiService.put(`/api/client/${client._id}/disable`, {
    status: newStatus,
  })
    .then(() => {
     
      client.status = newStatus;
      const action = newStatus ? "activated" : "deactivated";
      ElMessage.success(
        `Client "${client.schoolName}" has been ${action} successfully.`
      );
    })
    .catch((error) => {
      console.error("Error toggling client status:", error);
      ElMessage.error("Failed to toggle client status. Please try again later.");
    });
};

const filteredTableData = computed(() => {
  return search.value
    ? tableData.value.filter((client) =>
        ['schoolName', 'pack', 'idHubSpot', 'dbName', 'headMaster', 'timeOfCreation', 'status', 'schoolType', 'tel']
          .some((key) =>
            client[key]?.toString().toLowerCase().includes(search.value.toLowerCase())
          )
      )
    : [...tableData.value];
});

const originalTableData = ref([]);
const selectedIds = ref<Array<number>>([]);

const updateFilteredTableData = () => {
  filteredTableData.value = search.value
    ? tableData.value.filter((client) =>
        ['schoolName', 'pack', 'idHubSpot', 'dbName', 'headMaster', 'timeOfCreation', 'status', 'schoolType', 'tel']
          .some((key) =>
            client[key]?.toString().toLowerCase().includes(search.value.toLowerCase())
          )
      )
    : [...originalTableData.value];
};

const searchClients = () => {
  updateFilteredTableData();
};

const resetSearch = () => {
  search.value = "";
  updateFilteredTableData();
};


    
    const formatDate = (dateString: string) => {
    
      const date = new Date(dateString);
     
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
     
      return `${year}-${month < 10 ? "0" : ""}${month}-${
        day < 10 ? "0" : ""
      }${day}`;
    };

    const selectedClient = ref<any>({
      schoolName: "",
      schoolTypes: "",
      tel: "",
      dbName:"",
      idHubSpot:"",  
      base_url: "http://localhost:8888",
      pack:"",
      legalName: "",
      address: "",
       headMaster: "",
  user: {
    userName: "",
    password: ""
  }
    }); 

   
    const modifyClient = (client) => {
      
      selectedClient.value = { ...client };
      selectedClient.value.id = client._id.toString(); 
      
      dialogEditVisible.value = true;
    };

    onMounted(async () => {
      await fetchClients();
      
      await fetchPacks();
    });
    
    const formData = ref({
  idHubSpot: "",
  schoolName: "",
  schoolType: "",
  tel: "",
  base_url: "http://localhost:8888",
  dbName: "",
  logo: null,
  pack: "",
  legalName: "",
  address: "",
  headMaster: "",
  user: {
    userName: "",
    password: ""
  }
});
    const checkDbName = (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error("Please input DB Name"));
      }
      const regex = /^[\s\S]*$/;

      setTimeout(() => {
        if (!regex.test(value)) {
          callback(new Error("DB Name format is invalid"));
        } else {
          callback();
        }
      }, 1000);
    };
    const rules = {
      idHubSpot: [
        {
          required: true,
          message: "HubSpot ID is required",
          trigger: "change",
        },
        {
          min: 10,
          max: 10,
          message: "Length should be 10 digits",
          trigger: "change",
        },
      ],
      schoolName: [
        {
          required: true,
          message: "School Name is required",
          trigger: "change",
        },
      ],
      schoolType: [
        {
          required: true,
          message: "School Type is required",
          trigger: "change",
        },

      ],
      pack: [
        {
          required: true,
          message: "pack is required",
          trigger: "change",
        },
      ],
      tel: [
        { required: true, message: "Telephone is required", trigger: "change" },
      ],
      dbName: [{ required: true, validator: checkDbName, trigger: "change" }],
      legalName: [
    { required: true, message: "Legal Name is required", trigger: "change" }
  ],
  address: [
    { required: true, message: "Address is required", trigger: "change" }
  ],
  headMaster: [
    { required: true, message: "Head Master's Name is required", trigger: "change" }
  ],
  "user.userName": [
    { required: true, message: "Username is required", trigger: "change" }
  ],
  "user.password": [
    { required: true, message: "Password is required", trigger: "change" },
    { min: 4, message: "Password must be at least 4 characters", trigger: "change" }
  ]
    };
    
    const resetFormData = () => {
      formData.value = {
        idHubSpot: "",
        schoolName: "",
        schoolType: "",
        tel: "",
        base_url: "http://localhost:8888",
        dbName: "",
        logo: null,
        pack:"",
        legalName: "",
  address: "",
  headMaster: "",
  user: {
    userName: "",
    password: ""
  }
      };
    };
    const submit = (e) => {
  e.preventDefault();
  console.log("Frontend payload:", formData.value);
  loading.value = true;
  ApiService.setDB("Root");

  const selectedPack = availablePacks.value.find(pack => pack.name === formData.value.pack);

  const clientPayload = {
    building: {
      dbName: formData.value.dbName,
      name: formData.value.schoolName,
      type: formData.value.schoolType,
      legalName: formData.value.legalName,
      adress: formData.value.address,
      phone: formData.value.tel,
      headMaster: formData.value.headMaster,
      base_url: formData.value.base_url,
      sms: {
        solde: 0,
        senderName: "EdTrust"
      }
    },
    user: {
      userName: formData.value.user.userName,
      password: formData.value.user.password
    },
    access: selectedPack ? selectedPack.access : {} 
  };

  ApiService.put("/crm/building", clientPayload, edmin_base_url)
    .then((schoolResponse) => {
      return ApiService.post("/api/client", formData.value); 
    })
    .then((clientResponse) => {
      ElMessage.success({
        message: "Client created successfully!",
        type: "success",
      });

      resetFormData();
      fetchClients();
    })
    .catch((error) => {
      console.error("Error during the creation process:", error);

      let errorMessage = "Failed to add a client. Please try again.";

      if (error.response) {
        if (error.response.status === 409) {
          const apiMessage = error.response.data.message || "Conflict error.";
          const apiError = error.response.data.error || "";
          errorMessage = `${apiMessage} ${apiError}`;
        } else {
          errorMessage = error.response.data.message || "An unexpected error occurred. Please try again.";
        }
      }

      ElMessage.error({
        message: errorMessage,
        type: "error",
      });
    })
    .finally(() => {
      dialogAddVisible.value = false;
      loading.value = false;
    });
};


    const discardForm = () => {
      ElMessage({
        message: "Form discarded",
        type: "info",
      });
      resetFormData();
    };
    const showPassword = ref(false); 
      const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

    
    const handleLogoChange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      if (file && file.type.startsWith("image/")) {
       
        reader.onload = (e) => {
          formData.value.logo = e.target.result; 
        };
        reader.readAsDataURL(file);
      } else {
        console.error("Invalid file type. Please select an image file.");
        
      }
    };
    const updateClient = () => {
  if (!selectedClient.value) {
    console.error("selectedClient is null");
    return;
  }
  console.log(selectedClient.value);

  loading.value = true; 

  ApiService.put(`/api/client/${selectedClient.value.id}`, selectedClient.value)
    .then(() => {
      fetchClients(); 
      ElMessage.success({
        message: "Client updated successfully",
        type: "success",
      });
    })
    .catch((error) => {
      console.error("Error updating client", error);
      ElMessage.error({
        message: "Failed to update client. Please try again.",
        type: "error",
      });
    })
    .finally(() => {
      loading.value = false; 
      dialogEditVisible.value = false; 
    });
};

    const discardChanges = () => {
      selectedClient.value = {};

      dialogEditVisible.value = false;
    };
    const generateDbName = (name) => {
      // Split the string by spaces to isolate each word
      let words = name.split(" ");

      // Map through each word to capitalize the first letter of each (after the first word)
      let processedWords = words.map((word, index) => {
        // If it's the first word, convert the entire word to lowercase
        if (index === 0) {
          return word.toLowerCase();
        } else {
          // Otherwise capitalize the first letter and convert the rest to lowercase
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      });

      // Join all the words together to form the database name
      return processedWords.join("");
    };

    const loadingHSSearch = ref(true);
    const selectHubSpotClient = (id) => {
      loadingClientSelect.value = true;
      let client = options.value.find((e) => e.id == id);
      if (client) {
        formData.value.schoolName = client.name;
        formData.value.dbName = generateDbName(client.name);
        loadingClientSelect.value = false;
      }
    };
    watch(
      () => formData.value.idHubSpot,
      (newValue, oldValue) => {
        console.log(newValue);
        selectHubSpotClient(newValue);
      }
    );
    const options = ref<any>([]);
    const loadingClientSelect = ref(true);
    const remoteMethod = async (query: string) => {
      if (query) {
        loadingHSSearch.value = true;
        await ApiService.get("/api/hubspot/search?query=" + query)
          .then(({ data }) => {
            /* formData.value.schoolName = data.properties.name;
          formData.value.dbName = generateDbName(data.properties.name);*/
            options.value = data.map((item) => ({
              id: item.id,
              name: item.properties.name,
              label: item.properties.name + " (" + item.id + ")",
            }));
            loadingHSSearch.value = false;
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        options.value = [];
      }
    };
    const dialogAddVisible = ref(false);
    const dialogEditVisible = ref(false);

    return {
      tableHeader,
      originalTableData,
      tableData,
      searchClients,
      search,
      formatDate,
      modifyClient,

      formData,
      rules,
      submit,
      discardForm,
      resetFormData,
      handleLogoChange,
      schoolTypes,
      selectedClient,
      updateClient,
      discardChanges,
      toggleclientStatus,
      loading,
      resetSearch,
      selectedIds,
      selectHubSpotClient,
      loadingHSSearch,
      remoteMethod,
      options,
      loadingClientSelect,
      filteredTableData,
      Check,
      Delete,
      Edit,
      Close,
      dialogAddVisible,
      dialogEditVisible,
      fetchPacks,
      availablePacks,
      showPassword,
      togglePasswordVisibility,
    };
  },
});
</script>
