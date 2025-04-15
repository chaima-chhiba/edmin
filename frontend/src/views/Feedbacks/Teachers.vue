<template>
  <div>
    <!-- School Select Dropdown -->
    <div style="text-align: right; padding: 20px;">
      <el-select
        v-model="selectedSchool"
        @change="handleSchoolChange"
        placeholder="Select a school"
        style="width: 240px"
      >
        <el-option
          v-for="school in schools"
          :key="school.id"
          :label="school.schoolName"
          :value="school.dbName"
        />
      </el-select>
    </div>

    <!-- Show Datatable or message based on feedback availability -->
    <div v-if="selectedSchool && tableData.length === 0" style="text-align: center; padding: 20px;">
      <el-alert title="No feedback available for the selected school." type="warning" />
    </div>
    
    <div v-else>
      <Datatable
        :data="tableData"
        :header="tableHeader"
        class="datatable"
        :enable-items-per-page-dropdown="true"
      >
        <template v-slot:teacher="{ row: teacher }">
          {{ teacher.teacher.firstName }} {{ teacher.teacher.lastName }}
        </template>

        <template v-slot:images="{ row: teacher }">
          <ul>
            <li v-for="(image, index) in teacher.images" :key="index">
              <el-link href="javascript:void(0);" @click="handleImageClick(image_base_url + image)">
                {{ getLastSubstring(image) }}
                <el-icon class="el-icon--right"><View /></el-icon>
              </el-link>
            </li>
          </ul>
        </template>

        <template v-slot:text="{ row: teacher }">
          {{ teacher.text }}
        </template>

        <template v-slot:audio="{ row: teacher }">
          <div v-if="teacher.audio">
            <audio :src="image_base_url + teacher.audio" controls style="width: 100px;" />
          </div>
          <div v-else>
            <span>No audio available</span>
          </div>
        </template>
      </Datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import { ElMessage } from "element-plus";
import { Check, Delete, Edit, View } from "@element-plus/icons-vue";

const edmin_base_url = "http://localhost:8888/api/edmin";
const image_base_url = "http://localhost:8888/";

export default defineComponent({
  name: "TeachersFeedbacks",
  components: {
    Datatable,
    Check,
    Delete,
    Edit,
    View
  },
  setup() {
    const tableHeader = ref([
      { columnName: "teacher", columnLabel: "teacher" },
      { columnName: "images", columnLabel: "images" }, 
      { columnName: "text", columnLabel: "text" },
      { columnName: "audio", columnLabel: "audio" },
    ]);

    const tableData = ref([]);
    const schools = ref([]);
    const selectedSchool = ref("");
  
    function getLastSubstring(str) {
      const parts = str.split("\\");
      return parts[parts.length - 1];
    }

    const fetchClients = () => {
      ApiService.get("/api/client")
        .then((response) => {
          schools.value = response.data.clients;
        })
        .catch(() => {
          ElMessage.error("Error fetching clients");
        });
    };

    const fetchFeedbacks = (dbName) => {
      ApiService.setDB(dbName);
      ApiService.get("/teacherFeedback", edmin_base_url)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            tableData.value = response.data;
          } else {
            tableData.value = [];
          }
        })
        .catch(() => {
          tableData.value = [];
          ElMessage.error("Error fetching feedbacks");
        });
    };

    const handleSchoolChange = (dbName) => {
      tableData.value = []; 
      fetchFeedbacks(dbName); 
    };

    const handleImageClick = (imageUrl) => {
      const img = new Image();
      img.src = imageUrl;

      img.onerror = () => {
        ElMessage.warning("Image not found or cannot be loaded.");
      };

      img.onload = () => {
        window.open(imageUrl, "_blank");
      };
    };

    onMounted(() => {
      fetchClients();
    });

    return {
      tableData,
      tableHeader,
      schools,
      selectedSchool,
      getLastSubstring,
      handleSchoolChange,
      Check,
      Delete,
      Edit,
      View,
      image_base_url,
      handleImageClick,
    };
  },
});
</script>
