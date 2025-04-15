<template>
  <!--begin::Card-->
  <div class="card card-flush pt-3 mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div class="card-header">
      <!--begin::Card title-->
      <div class="card-title">
        <h2 class="fw-bold">
          <el-icon>
            <Box />
          </el-icon>
          {{ packData?.name }}
        </h2>
      </div>
      
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
    
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-3">
      <!--begin::Section-->
      <div class="mb-10">
        <!--begin::Title-->
        <h5 class="mb-4 d-flex align-items-center">
          <el-icon>
            <Tickets />
          </el-icon>
          <span class="ms-2">Description:</span>
        </h5>
        <p>{{ packData?.description }}</p>
    
      
        <!--end::Title-->

        <!--begin::Details-->
        <div class="d-flex flex-wrap py-5">
          <!--begin::Row-->
          <div class="flex-equal me-5">
            <!--begin::Details-->
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <!--begin::Row-->
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">StudentLimit:</td>
                <td class="text-gray-800 min-w-200px">
                  
                    {{packData?.studentLimit}}
                </td>
              </tr>
              <!--end::Row-->

              <!--begin::Row-->
              
            </table>
            <!--end::Details-->
          </div>
          <!--end::Row-->

          <!--begin::Row-->
          <div class="flex-equal">
            <!--begin::Details-->
            <table class="table fs-6 fw-semibold gs-0 gy-2 gx-2 m-0">
              <!--begin::Row-->
              <tr>
                <td class="text-gray-500 min-w-175px w-175px">
                  UserLimit:
                </td>
                <td class="text-gray-800 min-w-200px">
                  
                    {{packData?.userLimit}}
                </td>
              </tr>
              <!--end::Row-->

           
            </table>
            <!--end::Details-->
          </div>
          <!--end::Row-->
        </div>
        <!--end::Row-->
      </div>
      <!--end::Section-->

      <!--begin::Section-->
      <div class="mb-0">
        <!--begin::Title-->
        <h5 class="mb-4"> <el-icon><Unlock /></el-icon> Access:</h5>
        <!--end::Title-->
        <el-tag
        type="primary"
        effect="light"
        round
        class="me-3"
      >
        EdManager
        <span
          :class="[
            'badge', 
            packData?.access.edManager.active ? 'badge-light-success' : 'badge-light-danger'
          ]"
          style="margin-left: 10px;"
        >
          <el-icon v-if="packData?.access.edManager.active" color="green">
            <SuccessFilled />
          </el-icon>
          <el-icon v-else color="red">
            <CircleCloseFilled />
          </el-icon>
        </span>
      </el-tag>

        <!-- Displaying Disabled, Visible, Hidden Attributes for EdManager -->
        <div class="d-flex flex-wrap py-5">
          <div class="flex-equal me-5">
            <!-- Disabled Attributes -->
            <div v-if="getDisabledAttributes('edManager').length > 0" class="d-flex align-items-center mb-2">
              <h4 class="text-gray-500  mb-0">Disabled:</h4>
              <div>
                <el-tag
                  v-for="item in getDisabledAttributes('edManager')"
                  :key="item"
                   type="warning"
                  effect="light"
                  round
                  class="me-1"
                >
                  {{ item }}
                </el-tag>
              </div>
            </div>

            <!-- Visible Attributes -->
            <div v-if="getVisibleAttributes('edManager').length > 0" class="d-flex align-items-center mb-2">
              <h4 class="text-gray-500  mb-0">Visible:</h4>
              <div>
                <el-tag
                  v-for="item in getVisibleAttributes('edManager')"
                  :key="item"
                  type="success"
                  effect="light"
                  round
                  class="me-1"
                >
                  {{ item }}
                </el-tag>
              </div>
            </div>

            <!-- Hidden Attributes -->
            <div v-if="getHiddenAttributes('edManager').length > 0" class="d-flex align-items-center mb-2">
              <h4 class="text-gray-500  mb-0">Hidden:</h4>
              <div>
                <el-tag
                  v-for="item in getHiddenAttributes('edManager')"
                  :key="item"
                  type="danger"
                  effect="light"
                  round
                  class="me-1"
                >
                  {{ item }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
  
  
<!--end::NinthTable-->
<div class="flex-equal">
  <!--begin::Details-->
  <div>
    <h5 class="text-gray-500 min-w-175px w-175px mb-3">Allowed Export Buttons:</h5>
    <div>
      <span
        v-for="btn in packData?.access.edManager.allowedExportBtns"
        :key="btn"
        class="badge badge-light-info me-2 mb-2"
      >
        {{ btn }}
      </span>
    </div>
  </div>
  <!--end::Details-->
</div>



<el-tag
          type="primary"
          effect="light"
          round
          class="me-3"
        >
          EdParent
          <span
            :class="[
              'badge', 
              packData?.access.edParent.active ? 'badge-light-success' : 'badge-light-danger'
            ]"
            style="margin-left: 10px;"
          >
            <el-icon v-if="packData?.access.edParent.active" color="green">
              <SuccessFilled />
            </el-icon>
            <el-icon v-else color="red">
              <CircleCloseFilled />
            </el-icon>
          </span>
        </el-tag>

<div class="d-flex flex-wrap py-5">
  <div class="flex-equal me-5">
    <!-- Disabled Attributes -->
    <div v-if="getDisabledAttributes('edParent').length > 0" class="d-flex align-items-center mb-2">
      <h4 class="text-gray-500  mb-0">Disabled:</h4>
      <div>
        <el-tag
          v-for="item in getDisabledAttributes('edParent')"
          :key="item"
           type="warning"
          effect="light"
          round
          class="me-1"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>
    
    <!-- Visible Attributes -->
    <div v-if="getVisibleAttributes('edParent').length > 0" class="d-flex align-items-center mb-2">
      <h4 class="text-gray-500  mb-0">Visible:</h4>
      <div>
        <el-tag
          v-for="item in getVisibleAttributes('edParent')"
          :key="item"
          type="success"
          effect="light"
          round
          class="me-1"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>

    <!-- Hidden Attributes -->
    <div v-if="getHiddenAttributes('edParent').length > 0" class="d-flex align-items-center mb-2">
      <h4 class="text-gray-500  mb-0">Hidden:</h4>
      <div>
        <el-tag
          v-for="item in getHiddenAttributes('edParent')"
          :key="item"
          type="danger"
          effect="light"
          round
          class="me-1"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>
  </div>
</div>

<el-tag
          type="primary"
          effect="light"
          round
          class="me-3"
        >
          EdLearning
          <span
            :class="[
              'badge', 
              packData?.access.edLearning.active ? 'badge-light-success' : 'badge-light-danger'
            ]"
            style="margin-left: 10px;"
          >
            <el-icon v-if="packData?.access.edLearning.active" color="green">
              <SuccessFilled />
            </el-icon>
            <el-icon v-else color="red">
              <CircleCloseFilled />
            </el-icon>
          </span>
        </el-tag>
<div class="d-flex flex-wrap py-5">
  <div class="flex-equal me-5">
    <!-- Disabled Attributes -->
    <div v-if="getDisabledAttributes('edLearning').length > 0" class="d-flex align-items-center mb-2">
      <h4 class="text-gray-500  mb-0">Disabled:</h4>
      <div>
        <el-tag
          v-for="item in getDisabledAttributes('edLearning')"
          :key="item"
           type="warning"
          effect="light"
          round
          class="me-1"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>
    
    <!-- Visible Attributes -->
    <div v-if="getVisibleAttributes('edLearning').length > 0" class="d-flex align-items-center mb-2">
      <h4 class="text-gray-500  mb-0">Visible:</h4>
      <div>
        <el-tag
          v-for="item in getVisibleAttributes('edLearning')"
          :key="item"
          type="success"
          effect="light"
          round
          class="me-1"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>

    <!-- Hidden Attributes -->
    <div v-if="getHiddenAttributes('edLearning').length > 0" class="d-flex align-items-center mb-2">
      <h4 class="text-gray-500  mb-0">Hidden:</h4>
      <div>
        <el-tag
          v-for="item in getHiddenAttributes('edLearning')"
          :key="item"
          type="danger"
          effect="light"
          round
          class="me-1"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  </div>
  <!--end::Card-->
</template>
<script lang="ts">
  import { ref ,onMounted} from 'vue'; 
  import { getAssetPath } from "@/core/helpers/assets";
  import { defineComponent } from "vue";
  import UserMenu from "@/layouts/default-layout/components/menus/UserAccountMenu.vue";
  import { CaretBottom, SuccessFilled, CircleCloseFilled, Box, Tickets, Unlock} from '@element-plus/icons-vue'
  import { useRoute } from 'vue-router';
  export default defineComponent({
    name: "kt-details",
    components: {
      UserMenu,
      CaretBottom,
       SuccessFilled, 
       CircleCloseFilled,
      Box,
      Tickets,
      Unlock
    },
    setup() {
      const route = useRoute();
    const packData = ref(); 

    onMounted(() => {
  const queryString = route.query.packData?.toString(); 
  if (queryString) {
    try {
      packData.value = JSON.parse(queryString);
    } catch (error) {
      console.error('Error parsing packData:', error);
    }
  }
});
const getAttributesByStatus = (category: string, status: string) => {
        if (!packData.value?.access[category]) return [];
        return Object.keys(packData.value.access[category]).filter(
          (key) => packData.value.access[category][key] === status
        );
      };

      const getDisabledAttributes = (category: string) => getAttributesByStatus(category, 'd');
      const getVisibleAttributes = (category: string) => getAttributesByStatus(category, 'v');
      const getHiddenAttributes = (category: string) => getAttributesByStatus(category, 'h');

    return {
        packData, 
        getAssetPath,
        getDisabledAttributes,
        getVisibleAttributes,
        getHiddenAttributes,
      };
    },
  });
</script>
<style scoped>
.item {
  margin-top: 10px;
  margin-right: 30px;
}

.el-dropdown {
  margin-top: 1.1rem;
}

.badge-light-success {
  color: green;
}

.badge-light-danger {
  color: red;
}
</style>
