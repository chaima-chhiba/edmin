<template>
  <div :class="widgetClasses" class="card">
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">{{ title }}</span>
        <span class="text-muted fw-semibold fs-7">{{ subtitle }}</span>
      </h3>
      <div class="card-toolbar">
        <button
          type="button"
          class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
          data-kt-menu-flip="top-end"
        >
          <KTIcon icon-name="category" icon-class="fs-2" />
        </button>
       
      </div>
    </div>

    <div class="card-body p-0 d-flex flex-column">
      <div class="card-p pt-5 bg-body flex-grow-1">
        <div class="row g-0">
          <div class="col mr-8">
            <div class="fs-7 text-muted fw-semibold">{{ averageSaleLabel }}</div>
            <div class="d-flex align-items-center">
              <div class="fs-4 fw-bold">{{ averageSale }}</div>
              <KTIcon icon-name="arrow-up" icon-class="fs-5 text-success d-block ms-1" />
            </div>
          </div>
          <div class="col">
            <div class="fs-7 text-muted fw-semibold">{{ commissionLabel }}</div>
            <div class="fs-4 fw-bold">{{ commission }}</div>
          </div>
        </div>
        <div class="row g-0 mt-8">
          <div class="col mr-8">
            <div class="fs-7 text-muted fw-semibold">{{ annualTaxesLabel }}</div>
            <div class="fs-4 fw-bold">{{ annualTaxes }}</div>
          </div>
        
        </div>
      </div>
      <apexchart
        ref="chartRef"
        class="mixed-widget-3-chart card-rounded-bottom"
        :options="chart"
        :series="series"
        :height="chartHeight"
        type="area"
      ></apexchart>
    </div>
  </div>
</template>


<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import { useThemeStore } from "@/stores/theme";
import type { ApexOptions } from "apexcharts";
import type VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "widget-1",
  components: {
    Dropdown1,
  },
  props: {
    widgetClasses: String,
    title: String,
    subtitle: String,
    averageSaleLabel: String,
    averageSale: Number,
    commissionLabel: String,
    commission: Number,
    annualTaxesLabel: String,
    annualTaxes: Number,
   
    chartColor: String,
    chartHeight: String,
  },
  setup(props) {
    const chartRef = ref<typeof VueApexCharts | null>(null);
    const chart = ref<ApexOptions>({});
    const store = useThemeStore();

    const series = [
      {
        name: "Net Profit",
        data: [30, 25, 45, 30, 55, 55],
      },
    ];

    const themeMode = computed(() => {
      return store.mode;
    });

    onBeforeMount(() => {
      Object.assign(
        chart.value,
        chartOptions(props.chartColor, props.chartHeight)
      );
    });

    const refreshChart = () => {
      if (!chartRef.value) {
        return;
      }

      chartRef.value.updateOptions(
        chartOptions(props.chartColor, props.chartHeight)
      );
    };

    watch(themeMode, () => {
      refreshChart();
    });

    return {
      chart,
      series,
      chartRef,
      getAssetPath,
    };
  },
});

const chartOptions = (
  color: string = "primary",
  height: string = "auto"
): ApexOptions => {
  const baseColor = getCSSVariableValue(`--bs-${color}`);

  return {
    chart: {
      type: "area",
      height: height,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      area: {
        dataLabels: {
          enabled: false, // Disable data labels
        },
        marker: {
          show: false, // Hide markers
        },
      },
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      labels: {
        show: false, // Hide x-axis labels
      },
      tooltip: {
        enabled: false, // Disable x-axis tooltip
      },
    },
    yaxis: {
      labels: {
        show: false, // Hide y-axis labels
      },
    },
    tooltip: {
      enabled: false, // Disable tooltip
    },
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 100],
      },
    },
    colors: [baseColor],
  };
};
</script>
