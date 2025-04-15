<template>
  <div>
    <!-- Client Name Select Dropdown -->
    <div style="text-align: right; padding: 20px">
      <el-select
        v-model="selectedClientName"
        @change="fetchFeedback"
        placeholder="Select a client"
        style="width: 240px"
      >
        <el-option
          v-for="client in clientNames"
          :key="client"
          :label="client"
          :value="client"
        />
      </el-select>
    </div>

    <div class="card">
      <div class="card-body pt-0">
        <Datatable
          :data="filteredFeedback"
          :header="tableHeader"
          class="datatable"
          :enable-items-per-page-dropdown="true"
        >
          <template v-slot:userName="{ row: user }">
            {{ user.userName }}
          </template>
          <template v-slot:clientName="{ row: user }">
            {{ user.clientName }}
          </template>
          <template v-slot:desc="{ row: user }">
            {{ user.desc }}
          </template>
          <template v-slot:audio="{ row: user }">
            <div v-if="user.audio">
              <audio :src="image_base_url + user.audio" controls ref="audioPlayer" style="width: 100px;" />
            </div>
            <div v-else>
              <span>No audio available</span>
              <!-- Alternatively, you can use an icon -->
              <!-- <el-icon><icon-sound-off /></el-icon> -->
            </div>
          </template>
          <template v-slot:categories="{ row: user }">
            <ul>
              <li v-for="(category, index) in user.categories" :key="index">
                <el-tag type="primary">
                  {{ category }}
                </el-tag>
              </li>
            </ul>
          </template>
          <template v-slot:images="{ row: user }">
            <ul>
              <li v-for="(image, index) in user.images" :key="index">
                <el-link 
                  href="javascript:void(0);" 
                  @click="handleImageClick(image_base_url + image)"
                >
                  {{ getLastSubstring(image) }}
                  <el-icon class="el-icon--right"><icon-view /></el-icon>
                </el-link>
              </li>
            </ul>
          </template>
          
        </Datatable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import { ElMessage, ElSelect, ElOption } from "element-plus";
import { Check, Delete, Edit, View as IconView } from "@element-plus/icons-vue";
const edmin_base_url = "http://localhost:8888/api/edmin";
const image_base_url = "http://localhost:8888/";

export default defineComponent({
  name: "AdminFeedbacks",
  components: {
    Datatable,
    ElSelect,
    ElOption,
    Check,
    Delete,
    Edit,
    IconView,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "userName",
        columnLabel: "userName",
        sortEnabled: true,
      },
      { columnName: "images", columnLabel: "images", sortEnabled: true },
      {
        columnName: "categories",
        columnLabel: "categories",
        sortEnabled: true,
      },
      {
        columnName: "clientName",
        columnLabel: "clientName",
        sortEnabled: true,
      },
      { columnName: "desc", columnLabel: "desc", sortEnabled: true },
      { columnName: "audio", columnLabel: "audio", sortEnabled: true },
    ]);

    const tableData = ref([]);
    const clientNames = ref([]);
    const selectedClientName = ref("");
    
    function getLastSubstring(str) {
      // Split the string by backslash and get the last part
      const parts = str.split("\\");
      return parts[parts.length - 1];
    }

    const fetchFeedback = async () => {
      try {
        ApiService.setDB("Root");
        const response = await ApiService.get(
          `/managerFeedbacks`,
          edmin_base_url
        );
        const feedbackData = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Extract unique client names for the dropdown
        const clients = new Set(
          feedbackData.map((feedback) => feedback.clientName)
        );
        clientNames.value = Array.from(clients);

        // Only update tableData if a client is selected
        if (selectedClientName.value) {
          tableData.value = feedbackData.filter(
            (feedback) => feedback.clientName === selectedClientName.value
          );
        } else {
          tableData.value = [];
        }
      } catch (error) {
        ElMessage.error("Failed to fetch feedback");
      }
    };

    const filteredFeedback = computed(() => {
      return selectedClientName.value ? tableData.value : [];
    });

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

    const playAudio = () => {
      const audioElement = document.querySelector('audio');
      if (audioElement) {
        audioElement.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
    };

    onMounted(() => {
      fetchFeedback();
    });

    return {
      tableData,
      tableHeader,
      clientNames,
      selectedClientName,
      filteredFeedback,
      fetchFeedback,
      Check,
      Delete,
      Edit,
      getLastSubstring,
      image_base_url,
      handleImageClick,
      playAudio
    };
  },
});
</script>
