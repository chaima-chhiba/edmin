<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <TableContent
      @on-items-select="onItemSelect"
      @on-sort="onSort"
      @on-filter="applyFilter"
      :header="header"
      :data="dataToDisplay"
      :checkboxEnabled="checkboxEnabled"
      :checkboxLabel="checkboxLabel"
      :empty-table-text="emptyTableText"
      :sort-label="sortLabel"
      :sort-order="sortOrder"
      :loading="loading"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
        <slot :name="name" :row="item" />
      </template>
    </TableContent>
    <TableFooter
      @page-change="pageChange"
      :current-page="currentPage"
      v-model:itemsPerPage="itemsInTable"
      :count="totalItems"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import TableContent from "@/components/kt-datatable/table-partials/table-content/TableContent.vue";
import TableFooter from "@/components/kt-datatable/table-partials/TableFooter.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

export default defineComponent({
  name: "KTDataTable",
  props: {
    header: { type: Array, required: true },
    data: { type: Array, required: true },
    itemsPerPage: { type: Number, default: 10 },
    itemsPerPageDropdownEnabled: {
      type: Boolean, required: false, default: true
    },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    total: { type: Number, required: false },
    loading: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc", required: false, default: "asc"
    },
    emptyTableText: { type: String, required: false, default: "No data found" },
    currentPage: { type: Number, required: false, default: 1 }
  },
  emits: [
    "page-change",
    "on-sort",
    "on-items-select",
    "on-items-per-page-change"
  ],
  components: {
    TableContent,
    TableFooter
  },
  setup(props, { emit }) {
    const currentPage = ref(props.currentPage);
    const itemsInTable = ref<number>(props.itemsPerPage);
    const filters = ref<{ [key: string]: string }>({});

    watch(
      () => itemsInTable.value,
      (val) => {
        currentPage.value = 1;
        emit("on-items-per-page-change", val);
      }
    );

    const pageChange = (page: number) => {
      currentPage.value = page;
      emit("page-change", page);
    };

    const applyFilter = (filtersValue: { [key: string]: string }) => {
      filters.value = filtersValue;
    };

    const filteredData = computed(() => {
      return props.data.filter((item) => {
        return Object.keys(filters.value).every((key) => {
          return String(item[key])
            .toLowerCase()
            .includes(filters.value[key].toLowerCase());
        });
      });
    });

    const dataToDisplay = computed(() => {
      const data = filteredData.value;
      if (data.length <= itemsInTable.value) {
        return data;
      } else {
        const sliceFrom = (currentPage.value - 1) * itemsInTable.value;
        return data.slice(sliceFrom, sliceFrom + itemsInTable.value);
      }
    });

    const totalItems = computed(() => {
      return filteredData.value.length;
    });

    const onSort = (sort: Sort) => {
      emit("on-sort", sort);
    };

    const onItemSelect = (selectedItems: any) => {
      emit("on-items-select", selectedItems);
    };

    return {
      pageChange,
      dataToDisplay,
      onSort,
      onItemSelect,
      itemsInTable,
      totalItems,
      applyFilter
    };
  },
});
</script>
