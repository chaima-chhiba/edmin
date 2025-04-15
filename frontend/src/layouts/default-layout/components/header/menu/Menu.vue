<template>
  <!--begin::Menu wrapper-->
  <div
    v-if="headerMenuDisplay"
    class="app-header-menu app-header-mobile-drawer align-items-stretch"
    data-kt-drawer="true"
    data-kt-drawer-name="app-header-menu"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="225px"
  >
    <!--begin::Menu-->
    <div
      class="menu menu-rounded menu-column menu-lg-row my-5 my-lg-0 align-items-stretch fw-semibold px-2 px-lg-0"
      id="kt_app_header_menu"
      data-kt-menu="true"
    >
      <KTMenuPages></KTMenuPages>

      <div
        data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
        data-kt-menu-placement="bottom-start"
        class="menu-item menu-lg-down-accordion menu-sub-lg-down-indention me-0 me-lg-2"
      >
        <!--begin:Menu link
        <span class="menu-link">
          <span class="menu-title">Help</span>
          <span class="menu-arrow d-lg-none"></span> </span
        >-->
        <!--end:Menu link-->
        <!--begin:Menu sub-->
        <div
          class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown px-lg-2 py-lg-4 w-lg-200px"
        >
          <!--begin:Menu item-->

          <!--end:Menu item-->
          <!--begin:Menu item-->

          <!--end:Menu item-->
          <!--begin:Menu item-->

          <!--end:Menu item-->
        </div>
        <!--end:Menu sub-->
      </div>
      <!--end:Menu item-->
    </div>
    <!--end::Menu-->
  </div>
  <div v-else class="align-items-stretch"></div>
  <!--end::Menu wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import KTMenuPages from "@/layouts/default-layout/components/header/menu/MenuPages.vue";
import { version } from "@/core/helpers/system";
import { headerMenuDisplay } from "@/layouts/default-layout/config/helper";

export default defineComponent({
  name: "header-menu",
  components: {
    KTMenuPages,
  },
  setup() {
    return {
      version,
      headerMenuDisplay,
      getAssetPath,
    };
  },
});
</script>
