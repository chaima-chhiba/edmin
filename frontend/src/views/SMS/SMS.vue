<template>
  <div>
    <Datatable 
      :data="filteredData" 
      :header="tableHeader" 
      class="datatable"
      @on-filter="applyFilter"
      @on-sort="sort"
    >
      <template v-slot:amountAdded="{ row: sms }">
        {{ sms.amountAdded }}
      </template>
      <template v-slot:schoolName="{ row: sms }">
        {{ sms.schoolName }}
      </template>
      <template v-slot:oldBalance="{ row: sms }">
        {{ sms.oldBalance }}
      </template>
      <template v-slot:newSolde="{ row: sms }">
        {{ sms.newSolde }}
      </template>
      <template v-slot:addedBy="{ row: sms }">
        {{ sms.addedBy }}
      </template>
      <template v-slot:date="{ row: sms }">
        {{ formatDate(sms.date) }}
      </template>
      <template v-slot:comment="{ row: sms }">
        {{ sms.comment }}
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
  name: "SMSCard",
  components: {
    Datatable,
  },
  setup() {
    const tableData = ref([]);
    const tableHeader = ref([
      { columnName: "schoolName", columnLabel: "schoolName", columnWidth: 150, sortEnabled: true, filterEnabled: true },
      { columnName: "Amount Added", columnLabel: "amountAdded", columnWidth: 150, sortEnabled: true, filterEnabled: true },
      { columnName: "Old Sold", columnLabel: "oldBalance", columnWidth: 150, sortEnabled: true, filterEnabled: true },
      { columnName: "New Sold", columnLabel: "newSolde", columnWidth: 150, sortEnabled: true, filterEnabled: true },
      { columnName: "Added by", columnLabel: "addedBy", columnWidth: 150, sortEnabled: true, filterEnabled: true },
      { columnName: "Date", columnLabel: "date", columnWidth: 150, sortEnabled: true, filterEnabled: true },
      { columnName: "Comment", columnLabel: "comment", columnWidth: 150, sortEnabled: true, filterEnabled: true },
    ]);

    const filters = ref({});

    const fetchSMSHistory = async () => {
      try {
        const response = await ApiService.get(`/api/sms/all`);
        tableData.value = response.data;
      } catch (error) {
        console.error("Error fetching sms history:", error);
        ElMessage.error("Error fetching SMS history.");
      }
    };

    const applyFilter = (newFilters) => {
      filters.value = { ...filters.value, ...newFilters };
    };

    const filteredData = computed(() => {
    const labelToFieldMap = {
      schoolName: "schoolName",
    amountAdded: "amountAdded",
    oldBalance: "oldBalance",
    newSolde: "newSolde",
    addedBy: "addedBy",
    date: "date",
    comment: "comment",
};


      return tableData.value.filter((item) => {
        return Object.keys(filters.value).every((key) => {
          const dataField = labelToFieldMap[key];
          if (!dataField) return true;
          return String(item[dataField])
            .toLowerCase()
            .includes(filters.value[key].toLowerCase());
        });
      });
    });

    onMounted(fetchSMSHistory);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
    };

    const sort = (sort) => {
      const reverse = sort.order === "asc";
      const labelToFieldMap = {
        schoolName: "schoolName",
        amountAdded: "amountAdded",
        oldBalance: "oldBalance",
        newSolde: "newSolde",
        addedBy: "addedBy",
        date: "date",
        comment: "comment",
      };

      const field = labelToFieldMap[sort.label] || "schoolName";
      arraySort(tableData.value, field, { reverse });
    };

    return {
      tableHeader,
      filteredData,
      formatDate,
      applyFilter,
      sort,
    };
  },
};
</script>
