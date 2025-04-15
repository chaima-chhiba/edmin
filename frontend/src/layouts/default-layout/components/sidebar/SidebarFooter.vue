<template>
  
  <!--end::Footer-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";

export default defineComponent({
  name: "sidebar-footer",
  components: {},
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
