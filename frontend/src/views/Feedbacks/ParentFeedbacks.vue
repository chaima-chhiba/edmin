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

    <!-- Show an alert if there's no feedback available -->
    <div v-if="selectedSchool && tableData.length === 0" style="text-align: center; padding: 20px;">
      <el-alert title="No feedback available for the selected school." type="warning" />
    </div>

    <!-- Display the Datatable if feedback is available -->
    <div v-else>
      <Datatable
        :data="tableData"
        :header="tableHeader"
        class="datatable"
        :enable-items-per-page-dropdown="true"
      >
        <template v-slot:parent="{ row: parent }">
          {{ parent.parent.userName }}
        </template>
        <template v-slot:categories="{ row: parent }">
          <ul>
            <li v-for="(category, index) in parent.categories" :key="index">
              <el-tag type="primary">
                {{ category }}
              </el-tag>
            </li>
          </ul>
        </template>
        <template v-slot:rating="{ row: parent }">
          {{ parent.rating }}
        </template>
        <template v-slot:section="{ row: parent }">
          {{ parent.section }}
        </template>
        <template v-slot:priority="{ row: parent }">
          {{ parent.priority }}
        </template>
        <template v-slot:text="{ row: parent }">
          {{ parent.text }}
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

const edmin_base_url = "http://localhost:8888/api/edmin";

export default defineComponent({
  name: "ParentFeedbacks",
  components: {
    Datatable,
  },
  setup() {
    const tableHeader = ref([
      { columnName: "parent", columnLabel: "parent" },
      { columnName: "categories", columnLabel: "categories" },
      { columnName: "text", columnLabel: "text" },
      { columnName: "rating", columnLabel: "rating" },
      { columnName: "section", columnLabel: "section" },
      { columnName: "priority", columnLabel: "priority" },
    ]);

    const tableData = ref([]);
    const schools = ref([]);
    const selectedSchool = ref("");

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
      ApiService.get("/parents/feedbacks", edmin_base_url)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            tableData.value = response.data;
          } else {
            tableData.value = [];
          }
        })
        .catch(() => {
          tableData.value = [];
        });
    };

    const handleSchoolChange = (dbName) => {
      tableData.value = [];  
      fetchFeedbacks(dbName);  
    };

    onMounted(() => {
      fetchClients();
    });

    return {
      tableData,
      tableHeader,
      schools,
      selectedSchool,
      handleSchoolChange,
    };
  },
});
</script>
