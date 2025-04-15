<template>
  <el-tabs v-model="activeTab" type="border-card" class="demo-tabs">
    <el-tab-pane name="schools">
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><suitcase /></el-icon>
          <span>Schools</span>
        </span>
      </template>
      <!-- Content for Schools tab -->
      <Schools :clients="filteredSchoolClients"/>
    </el-tab-pane>
    <el-tab-pane name="persons">
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><user /></el-icon>
          <span>Persons</span>
        </span>
      </template>
      <Specific :clients="filteredClients"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref, computed} from 'vue';
import { User, Suitcase } from '@element-plus/icons-vue';
import { ElMessage } from "element-plus";
import Schools from './componenets/Schools.vue';
import Specific from './componenets/Specific.vue'
import ApiService from "@/core/services/ApiService";

const activeTab = ref('schools'); // Default active tab
const clients = ref([]);

ApiService.get("/api/client")
    .then((response) => {
      const tempClients = response.data.clients;
      tempClients.unshift({
        schoolName: "ALL Client",
        dbName: "Edtrust"
      });
      clients.value = tempClients;
    })
    .catch((error) => {
      console.error("Error fetching clients:", error);
      ElMessage.error("Failed to fetch clients.");
    });

const filteredSchoolClients = computed(() => clients.value);
const filteredClients = computed(() => clients.value.filter(client => client.schoolName !== 'ALL Client'));

</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #885dfe;
  font-size: 32px;
  font-weight: 600;
}
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
.form-group {
  display: flex;
  align-items: center;
}
.form-floating {
  flex-grow: 1;
}
.form-control.title-input, .form-control.message-input {
  font-size: 12px;
  color: grey;
  width: 800px;
}
.form-select.title-dropdown {
  font-size: 12px;
  color: grey;
  width: 150px;
  margin-left: 10px;
}
.form-floating .title-label, .form-floating .message-label {
  font-size: 12px;
  color: grey;
}
.form-floating.mb-3 {
  margin-bottom: 15px;
}
</style>
