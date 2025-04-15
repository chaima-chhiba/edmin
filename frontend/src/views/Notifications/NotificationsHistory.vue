<template>
  <div>
    <Datatable 
      :data="filteredData" 
      :header="tableHeader" 
      class="datatable"
      @on-filter="applyFilter"
      @on-sort="sort"
    >
      <template v-slot:title="{ row: notification }">
        {{ notification.title }}
      </template>
      <template v-slot:message="{ row: notification }">
        {{ notification.message }}
      </template>
      <template v-slot:client="{ row: notification }">
        <ul>
          <li v-for="(client, index) in notification.client" :key="index">
            <el-tag type="primary">
              {{ client }}
            </el-tag>
          </li>
        </ul>
      </template>
      <template v-slot:audience="{ row: notification }">
        {{ notification.audience }}
      </template>
      <template v-slot:redirectScreen="{ row: notification }">
        {{ notification.screen }}
      </template>
    </Datatable>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import { ElMessage } from "element-plus";
import arraySort from "array-sort";

export default {
  name: "NotificationHistory",
  components: {
    Datatable,
  },
  setup() {
    const tableData = ref([]);
    const filters = ref({});
   

    const tableHeader = ref([
      { columnName: "Title", columnLabel: "title", width: "20%", sortEnabled: true, filterEnabled: true },
      { columnName: "Message", columnLabel: "message", width: "30%", sortEnabled: true, filterEnabled: true },
      { columnName: "Client", columnLabel: "client", width: "20%", sortEnabled: true, filterEnabled: true },
      { columnName: "Audience", columnLabel: "audience", width: "15%", sortEnabled: true, filterEnabled: true },
      { columnName: "Redirect Screen", columnLabel: "redirectScreen", width: "15%", sortEnabled: true, filterEnabled: true },
    ]);

    const fetchNotificationsHistory = async () => {
      try {
        const response = await ApiService.get(`/api/Notif`);
        tableData.value = response.data;
      } catch (error) {
        console.error("Error fetching notifications history:", error);
        ElMessage.error("Error fetching notifications history.");
      }
    };

    onMounted(fetchNotificationsHistory);

    const applyFilter = (newFilters) => {
      filters.value = { ...filters.value, ...newFilters };
    };

    
    const filteredData = computed(() => {
      return tableData.value.filter((item) => {
        return Object.keys(filters.value).every((key) => {
          if (!filters.value[key]) return true;
          const value = String(item[key] || "").toLowerCase();
          return value.includes(filters.value[key].toLowerCase());
        });
      });
    });

    const sort = (sort) => {
      const reverse = sort.order === "asc";
      const labelToFieldMap = {
        title: "title",
        message: "message",
        client: "client",
        audience: "audience",
        redirectScreen: "screen",
        
      };

      const field = labelToFieldMap[sort.label] || "client ";
      arraySort(tableData.value, field, { reverse });
    };
    return {
      tableHeader,
      filteredData,
      applyFilter,
      sort,
    };
  },
};
</script>
