<template>
  <div class="table-responsive">
    <table
      :class="[loading && 'overlay overlay-block']"
      class="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
    >
      <TableHeadRow
        @onSort="onSort"
        @onSelect="selectAll"
        @onFilter="applyFilter"
        :checkboxEnabledValue="check"
        :checkboxEnabled="checkboxEnabled"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        :header="header"
      />
      <TableBodyRow
        v-if="filteredData.length !== 0"
        @onSelect="itemsSelect"
        :currentlySelectedItems="selectedItems"
        :data="filteredData"
        :header="header"
        :checkbox-enabled="checkboxEnabled"
        :checkbox-label="checkboxLabel"
      >
        <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
          <slot :name="name" :row="item" />
        </template>
      </TableBodyRow>
      <template v-else>
        <tr class="odd">
          <td colspan="7">
            <div class="center-content">
              <Loading />
            </div>
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, computed } from "vue";
import TableHeadRow from "@/components/kt-datatable/table-partials/table-content/table-head/TableHeadRow.vue";
import TableBodyRow from "@/components/kt-datatable/table-partials/table-content/table-body/TableBodyRow.vue";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

export default defineComponent({
  name: "TableContent",
  props: {
    header: { type: Array, required: true },
    data: { type: Array, required: true, default: () => [] },
    emptyTableText: { type: String, default: "" },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    loading: { type: Boolean, required: false, default: false },
  },
  emits: ["on-sort", "on-items-select", "on-filter"],
  components: {
    TableHeadRow,
    TableBodyRow,
    Loading,
  },
  setup(props, { emit }) {
    const selectedItems = ref<Array<unknown>>([]);
    const allSelectedItems = ref<Array<unknown>>([]);
    const check = ref<boolean>(false);
    const filters = ref<{ [key: string]: string }>({});

    watch(
      () => props.data,
      (newData) => {
        selectedItems.value = [];
        allSelectedItems.value = [];
        check.value = false;
        if (newData) {
          newData.forEach((item: any) => {
            if (item[props.checkboxLabel]) {
              allSelectedItems.value.push(item[props.checkboxLabel]);
            }
          });
        }
      }
    );

    const selectAll = (checked: any) => {
      check.value = checked;
      if (checked) {
        selectedItems.value = [
          ...new Set([...selectedItems.value, ...allSelectedItems.value]),
        ];
      } else {
        selectedItems.value = [];
      }
    };

    const itemsSelect = (value: any) => {
      selectedItems.value = [];
      value.forEach((item: any) => {
        if (!selectedItems.value.includes(item)) selectedItems.value.push(item);
      });
    };

    const onSort = (sort: Sort) => {
      emit("on-sort", sort);
    };

    const applyFilter = ({ label, value }: { label: string; value: string }) => {
      filters.value[label] = value;
      emit("on-filter", filters.value);
    };

    const filteredData = computed(() => {
      if (!props.data) return [];
      return props.data.filter((item) => {
        return Object.keys(filters.value).every((key) => {
          return String(item[key])
            .toLowerCase()
            .includes(filters.value[key].toLowerCase());
        });
      });
    });

    watch(
      () => [...selectedItems.value],
      (currentValue) => {
        if (currentValue) {
          emit("on-items-select", currentValue);
        }
      }
    );

    onMounted(() => {
      selectedItems.value = [];
      allSelectedItems.value = [];
      check.value = false;
      if (props.data) {
        props.data.forEach((item: any) => {
          if (item[props.checkboxLabel]) {
            allSelectedItems.value.push(item[props.checkboxLabel]);
          }
        });
      }
    });

    return {
      onSort,
      selectedItems,
      selectAll,
      itemsSelect,
      check,
      applyFilter,
      filteredData,
    };
  },
});
</script>

<style scoped>
.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}
</style>
