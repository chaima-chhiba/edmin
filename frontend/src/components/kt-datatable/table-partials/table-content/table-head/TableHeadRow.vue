<template>
  <thead>
    <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
      <th v-if="checkboxEnabled" :style="{ width: '30px' }">
        <div class="form-check form-check-sm form-check-custom form-check-solid me-3">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="checked"
            @change="selectAll()"
          />
        </div>
      </th>
      <template v-for="(column, i) in header" :key="i">
        <th
          :class="{ 'text-end': i === header.length - 1 }"
          :style="{
            minWidth: column.columnWidth ? `${column.columnWidth}px` : '0',
            width: 'auto',
          }"
        >
          <div class="d-flex align-items-center">
            {{ column.columnName }}
            <span
            v-if="column.sortEnabled"
            v-html="getSortArrow(column.columnLabel)"
            class="ms-2"
            @click.stop="onSort(column.columnLabel, column.sortEnabled)" 
            style="cursor: pointer;"
          ></span>
            <i
              class="ms-2 bi bi-funnel"
              v-if="column.filterEnabled"
              @click.stop="toggleFilter(column.columnLabel)"
              style="cursor: pointer;"
            ></i>
          </div>
          <div v-if="isFilterVisible(column.columnLabel)" class="mt-2">
            <input
              type="text"
              class="form-control form-control-sm"
              v-model="filters[column.columnLabel]"
              @input="applyFilter(column.columnLabel)"
              @click.stop
              placeholder="Filter..."
            />
          </div>
        </th>
      </template>
    </tr>
  </thead>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

export default defineComponent({
  name: "table-head-row",
  props: {
    checkboxEnabledValue: { type: Boolean, required: false, default: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    header: { type: Array as () => Array<any>, required: true },
  },
  emits: ["on-select", "on-sort", "on-filter"],
  setup(props, { emit }) {
    const checked = ref<boolean>(false);
    const columnLabelAndOrder = ref<Sort>({
      label: props.sortLabel,
      order: props.sortOrder,
    });
    const filters = ref<{ [key: string]: string }>({});
    const filterVisibility = ref<{ [key: string]: boolean }>({});

    watch(
      () => props.checkboxEnabledValue,
      (currentValue) => {
        checked.value = currentValue;
      }
    );

    const selectAll = () => {
      emit("on-select", checked.value);
    };

    const onSort = (label: string, sortEnabled: boolean) => {
      if (sortEnabled) {
        if (columnLabelAndOrder.value.label === label) {
          columnLabelAndOrder.value.order =
            columnLabelAndOrder.value.order === "asc" ? "desc" : "asc";
        } else {
          columnLabelAndOrder.value.order = "asc";
          columnLabelAndOrder.value.label = label;
        }
        emit("on-sort", columnLabelAndOrder.value);
      }
    };

    const getSortArrow = (label: string) => {
      if (columnLabelAndOrder.value.label === label) {
        return columnLabelAndOrder.value.order === "asc" ? "&#x2191;" : "&#x2193;";
      }
      return "&#x2191;"; // Default arrow, could be empty if no column is sorted.
    };

    const toggleFilter = (label: string) => {
      filterVisibility.value[label] = !filterVisibility.value[label];
    };

    const isFilterVisible = (label: string) => {
      return filterVisibility.value[label] || false;
    };

    const applyFilter = (label: string) => {
      emit("on-filter", { label, value: filters.value[label] });
    };

    // Ensure sorting icon is shown on initial load
    onMounted(() => {
      if (props.sortLabel) {
        onSort(props.sortLabel, true);
      }
    });

    return {
      onSort,
      selectAll,
      checked,
      getSortArrow,
      columnLabelAndOrder,
      filters,
      toggleFilter,
      isFilterVisible,
      applyFilter,
    };
  },
});
</script>
