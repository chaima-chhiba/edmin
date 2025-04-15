<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <img
            :src="user.avatar || getAssetPath('media/avatars/blank.png')"
            class="rounded-3"
            alt="user"
          />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold d-flex align-items-center fs-5">
            {{ user.username }}
          </div>
          <a href="#" class="fw-semibold text-muted text-hover-primary fs-7">{{
            user.email
          }}</a>
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <router-link to="/Profile" class="menu-link px-5">
        My Profile
      </router-link>
    </div>

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5"> Sign Out </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import ApiService from "@/core/services/ApiService";
import { computed, defineComponent, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import JwtService from "@/core/services/JwtService";

export default defineComponent({
  name: "kt-user-menu",
  components: {},
  setup() {
    const router = useRouter();
    const i18n = useI18n();
    const store = useAuthStore();
    const user = ref({ username: "", email: "", avatar: "" });

    i18n.locale.value = localStorage.getItem("lang")
      ? (localStorage.getItem("lang") as string)
      : "en";

    const countries = {
      en: {
        flag: getAssetPath("media/flags/united-states.svg"),
        name: "English",
      },
      es: {
        flag: getAssetPath("media/flags/spain.svg"),
        name: "Spanish",
      },
      de: {
        flag: getAssetPath("media/flags/germany.svg"),
        name: "German",
      },
      ja: {
        flag: getAssetPath("media/flags/japan.svg"),
        name: "Japanese",
      },
      fr: {
        flag: getAssetPath("media/flags/france.svg"),
        name: "French",
      },
    };

    const signOut = () => {
      store.logout();
      router.push({ name: "sign-in" });
    };

    const setLang = (lang: string) => {
      localStorage.setItem("lang", lang);
      i18n.locale.value = lang;
    };

    const currentLanguage = computed(() => {
      return i18n.locale.value;
    });

    const currentLangugeLocale = computed(() => {
      return countries[i18n.locale.value as keyof typeof countries];
    });
    const fetchUserInfo = async () => {
      try {
        const token = JwtService.getToken();
        if (token) {
          // Set authorization header with token
          ApiService.setHeader(token);

          // Make GET request to fetch user profile information
          const response = await ApiService.get("/api/profile");

          // Assuming the response contains user data
          const userData = response.data.user;

          // Update user info in Vue component's reactive data
          user.value.username = userData.username;
          user.value.email = userData.email;
          user.value.avatar = userData.avatar;
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
    onMounted(fetchUserInfo);
    return {
      signOut,
      setLang,
      currentLanguage,
      currentLangugeLocale,
      countries,
      getAssetPath,
      user,
      fetchUserInfo,
    };
  },
});
</script>
