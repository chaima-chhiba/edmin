<template>
  <div class="container">
    <div class="row">
      <!-- Client Information Section -->
      <div>
        <div class="card card-flush pt-3 mb-5 mb-lg-10">
          <div class="card-body pt-0">
            <!-- Client Details -->
            <div class="d-flex align-items-center p-3 mb-4">
              <!-- Avatar -->
              <div class="me-7 mb-4">
                <div
                  class="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative"
                >
                  <img :src="client.logo" alt="image" />
                </div>
              </div>
              <!--end::Pic-->
              <!-- Info -->
              <div class="flex-grow-1">
                <!-- Title -->
                <div
                  class="d-flex justify-content-between align-items-start flex-wrap mb-2"
                >
                  <!-- User -->
                  <div class="d-flex flex-column align-items-start"> 
                    <!-- Name -->
                    <div class="d-flex align-items-center mb-2">
                      <a
                        href="#"
                        class="text-gray-800 text-hover-primary fs-2 fw-bold me-1"
                      >{{ client.schoolName }}</a
                      >
                      <a href="#">
                        <KTIcon
                          icon-name="verify"
                          icon-class="fs-1 text-primary"
                        />
                      </a>
                    </div>
                    <!--end::Name-->

                    <!-- Info -->
                    <div class="d-flex flex-wrap fw-semibold fs-6 mb-4 pe-2">
                      <a
                      href="#"
                      class="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                    >
                      <KTIcon
                        :icon-name="client.serialNumber"
                        icon-class="fs-4 me-1"
                      />
                      {{ client.serialNumber }} 
                    </a>
                    
                      <a
                        href="#"
                        class="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                      >
                        <KTIcon
                          icon-name="time"
                          icon-class="fs-4 me-1"
                        />
                        ADDED AT {{ formatDate(client.timeOfCreation) }}
                      </a>
                      <a
                        href="#"
                        class="d-flex align-items-center text-gray-500 text-hover-primary mb-2"
                      >
                        <KTIcon icon-name="status"  icon-class="fs-4 me-1" />
                        {{ client.status ? "Active" : "Inactive" }} &nbsp;&nbsp;&nbsp;
                      </a>
                      <a
                        href="#"
                        class="d-flex align-items-center text-gray-500 text-hover-primary mb-2"
                      >              
                        
                      <KTIcon icon-name="brifecase-tick" icon-class="fs-4 me-1" />
                        {{ client.schoolType }} &nbsp;&nbsp;&nbsp;
                      </a>
                      <a
                      href="#"
                      class="d-flex align-items-center text-gray-500 text-hover-primary mb-2"
                    >              
                      
                    <KTIcon icon-name="package" icon-class="fs-4 me-1" />
                      {{ client.pack }} 
                    </a>
                    </div>
                    <!--end::Info-->
                  </div>
                  <!--end::User-->

                  <!--begin::Actions-->
                  <div class="d-flex my-4"></div>
                  <!--end::Actions-->
                </div>
                <!--end::Title-->
              </div>
              <!--end::Info-->
            </div>

            <!-- Navigation Section -->
            <div class="d-flex overflow-auto h-55px" >
              <ul class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold flex-nowrap">
               
                <!-- Users -->
                <li class="nav-item">
                  <router-link
                  :to="{ name: 'profile-users', params: { id: client._id } ,query: { db: client.dbName } }"
                    class="nav-link text-active-primary me-6"
                    active-class="active"
                  >
                    Users
                  </router-link>
                </li>
                <!-- Teachers -->
                <li class="nav-item">
                  <router-link
                    :to="{ name: 'profile-teachers', params: { id: client._id },query: { db: client.dbName } }"
                    class="nav-link text-active-primary me-6"
                    active-class="active"
                  >
                    Teachers
                  </router-link>
                </li>
                <!-- Students -->
                <li class="nav-item">
                  <router-link
                    :to="{ name: 'profile-students', params: { id: client._id },query: { db: client.dbName } }"
                    class="nav-link text-active-primary me-6"
                    active-class="active"
                  >
                    Students
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link
                    :to="{ name: 'profile-parents', params: { id: client._id },query: { db: client.dbName } }"
                    class="nav-link text-active-primary me-6"
                    active-class="active"
                  >
                    Parents
                  </router-link>
                </li>
                 <!-- SMS -->
                 <li class="nav-item">
                  <router-link
                   :to="{ name: 'profile-SMS', params: { id: client._id } ,query: { db: client.dbName } }"
                    class="nav-link text-active-primary me-6"
                    active-class="active"
                  >
                    SMS
                  </router-link>
                </li>
              </ul>
            </div>

            <!-- Content Section (Tabs Content) -->
            <div class="tab-content" id="nav-tabContent">
              <!-- Content for each tab will go here -->
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import ApiService from "@/core/services/ApiService";
import { useRoute ,useRouter } from "vue-router";

export default defineComponent({
  name: "ClientProfile",

  setup() {
    const loading = ref(false);
    const error = ref("");
    const client = ref({
      schoolName: "",
      schoolType: "",
      tel: "",
      serialNumber: "",
      dbName:"",
      logo: "",
      timeOfCreation: "",
      status: "",
    });
    const route = useRoute();
    const showNavbar = ref(true);
    const router = useRouter();
    const fetchClientData = (id) => {
  loading.value = true;

  ApiService.get(`/api/client/${id}`)
    .then(response => {
      client.value = response.data;
      console.log("db", route.query.db);
      router.push({
        name: 'profile-users',
        params: { id: client.value._id },
        query: { db: client.value.dbName }
      });
    })
    .catch(error => {
      error.value = "Failed to fetch client data.";
      console.error("Error fetching client data:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};


    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
    };

    const init = () => {
      const clientId = route.params.id;
      fetchClientData(clientId);
    };

    init(); // Initialize component

    return {
      loading,
      error,
      client,
      formatDate,
      showNavbar 
    };
  },
});
</script>
