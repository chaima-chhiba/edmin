<template>
  <div>
    <div style="text-align: right; padding: 20px">
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

    <!--begin::Row-->
    <div class="row g-5 g-xl-8">
      <div class="col-xl-4">
        <MixedWidget3
          widget-classes="card-xl-stretch mb-xl-8"
          height="150px"
          chart-color="primary"
          title="Activity"
          averageSaleLabel="Activity"
          :averageSale="Data.activity_count"
          commissionLabel=""
          commission=""
          annualTaxesLabel=""
          annualTaxes=""
        ></MixedWidget3>
      </div>

      <div class="col-xl-4">
        <MixedWidget3
          widget-classes="card-xl-stretch mb-xl-8"
          height="150px"
          chart-color="danger"
          title="Students"
          averageSaleLabel="Students"
          :averageSale="Data.student_count"
          commissionLabel="Students non_inscrit"
          :commission="Data.student_count_non_inscrit"
          annualTaxesLabel="Students inscrit"
          :annualTaxes="annualTaxesValue"
        ></MixedWidget3>
      </div>

      <div class="col-xl-4">
        <MixedWidget3
          widget-classes="card-xl-stretch mb-xl-8"
          height="150px"
          chart-color="success"
          title="Classes"
          averageSaleLabel="Classes"
          :averageSale="Data.classRoom_count"
          commissionLabel=""
          commission=""
          annualTaxesLabel=""
          annualTaxes=""
        ></MixedWidget3>
      </div>
    </div>
    <!--end::Row-->

    <!--begin::Row-->

    <div class="row">
      <div class="col-xl-4 col-lg-4">
        <div class="card">
          <!-- Center the header text with custom styles -->
          <div class="card-header" style="text-align: center">
            Services / Activities
          </div>
          <div class="card-body" style="height: 362px; overflow: auto">
            <el-timeline style="max-width: 600px">
              <el-timeline-item
                v-for="(activity, index) in Data['service/activity']"
                :key="index"
                :timestamp="activity.activity_count"
              >
                {{ activity.name }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <canvas id="activityPieChart"></canvas>
      </div>
    </div>
  </div>

  <!--end::Row-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref, watch, computed } from "vue";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import MixedWidget3 from "@/components/widgets/mixed/Widget3.vue";
import StatisticsWidget3 from "@/components/widgets/statsistics/Widget3.vue";

import ApiService from "@/core/services/ApiService";

const edmin_base_url = "http://localhost:8888/api/edmin";
export default defineComponent({
  name: "main-dashboard",
  components: {
    StatisticsWidget3,
    MixedWidget3,
  },
  setup() {
    const selectedSchool = ref(null);
    const schools = ref([]);
    const Data = ref([]);
    const fetchStatistiques = async () => {
      try {
        console.log("Selected School:", selectedSchool.value);
        const db = selectedSchool.value;
        ApiService.setDB(db);
        const response = await ApiService.get("/home", edmin_base_url);
        const data = response.data;
        console.log(data);
        Data.value = data;
        updateChart();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Fetch clients from the API
    const fetchClients = async () => {
      try {
        const response = await ApiService.get("/api/client");
        schools.value = response.data.clients;
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    const handleSchoolChange = async () => {
      await fetchStatistiques();
    };

    const colorPalette = [
      "#FFC1E3",
      "#C6E8E8",
      "#B0D7FF",
      "#E3C6F5",
      "#FFF9C4",
      "#FFD7BA",
      "#FFA3A3",
      "#7FDCE9",
      "#B7F2E0",
      "#FFEBE1",
    ];
    let pieChart = null;
    const updateChart = () => {
      if (pieChart) pieChart.destroy();

      // Sort activities by count
      const sortedActivities = [...Data.value["service/activity"]].sort(
        (a, b) => b.activity_count - a.activity_count
      );

      const ctx = document.getElementById("activityPieChart").getContext("2d");
      pieChart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "pie",
        data: {
          labels: sortedActivities.map((a) => a.name),
          datasets: [
            {
              data: sortedActivities.map((a) => a.activity_count),
              backgroundColor: colorPalette,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            datalabels: {
              color: "#fff",
              font: {
                weight: "bold",
              },
              formatter: (value, ctx) => {
                return value;
              },
            },
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  let sum = 0;
                  let dataArr = tooltipItem.dataset.data;
                  dataArr.map((data) => {
                    sum += Number(data);
                  });
                  let percentage =
                    ((tooltipItem.raw * 100) / sum).toFixed(2) + "%";
                  return (
                    tooltipItem.label +
                    ": " +
                    tooltipItem.raw +
                    " (" +
                    percentage +
                    ")"
                  );
                },
              },
            },
          },
        },
      });
    };
    const annualTaxesValue = computed(() => {
      if (!Data.value || !selectedSchool.value) return "";
      const annualTaxes =
        Data.value.student_count - Data.value.student_count_non_inscrit;
      return isNaN(annualTaxes) ? "" : annualTaxes;
    });

    onMounted(async () => {
      await fetchClients();
    });
    return {
      getAssetPath,
      Data,
      selectedSchool,
      schools,
      handleSchoolChange,
      annualTaxesValue,
    };
  },
});
</script>
