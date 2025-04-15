import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: '/settings/settings/users-listing',
        name: 'users-listing',
        component: () => import('@/views/administration/UserList.vue'),
        meta: {
          pageTitle: 'Users',
          breadcrumbs: ['Settings','Administration'],
        },
      },
      {
        path: '/settings/settings/roles-listing',
        name: 'roles-listing',
        component: () => import('@/views/administration/Permission.vue'),
        meta: {
          pageTitle: 'Permissions',
          breadcrumbs: ['Settings','Administration'],
        },
      },
      {
        path: "/Profile",
        name: "profile",
        component: () => import("@/views/crafted/account/Profile.vue"),
        meta: {
          pageTitle: "Profil ",
        },
      },
      {
        path: "/Customers/CustomersManagement",
        name: "customer",
        component: () => import("@/views/Customers/Customers.vue"),
        meta: {
          pageTitle: "Customer ",
          breadcrumbs: ['Customers','CustomersManagement'],
        },
      },
      {
        path: "/Packs/PacksManagement",
        name: "Packs",
        component: () => import("@/views/Packs/Pack.vue"),
        meta: {
          pageTitle: "Packs ",
          breadcrumbs: ['PacksManagement','Packs'],
        },
      },
      {
        path: "/Pack",
        name: "pack-details", 
        component: () => import("@/views/Packs/Details.vue"),
        meta: {
          pageTitle: "Details",
          breadcrumbs: ['Packs','Details'],
        },
      },
      {
        path: "/Feedbacks/Administration",
        name: "Administration",
        component: () => import("@/views/Feedbacks/Admin.vue"),
        meta: {
          pageTitle: "Feedbacks ",
          breadcrumbs: ['Feedbacks','Administration'],
        },
      },
      {
        path: "/Feedbacks/Teachers",
        name: "Teachers-Feedbacks",
        component: () => import("@/views/Feedbacks/Teachers.vue"),
        meta: {
          pageTitle: "Feedbacks ",
          breadcrumbs: ['Feedbacks','Teachers'],
        },
      },
      {
        path: "/Feedbacks/Parents",
        name: "Feedbacks",
        component: () => import("@/views/Feedbacks/ParentFeedbacks.vue"),
        meta: {
          pageTitle: "Feedbacks ",
          breadcrumbs: ['Feedbacks','Parents'],
        },
      },
      {
        path: "/SMS",
        name: "SMS refill logs",
        component: () => import("@/views/SMS/SMS.vue"),
        meta: {
          pageTitle: "SMS refill logs ",
          breadcrumbs: ['SMS refill logs'],
        },
      },
      {
        path: "/PushNotifications",
        name: "Push Notifications",
        component: () => import("@/views/Notifications/PushNotification.vue"),
        meta: {
          pageTitle: "Push Notifications ",
          breadcrumbs: ['Push Notifications'],
        },
      },
      {
        path: "/NotificationsHistory",
        name: "Notifications History",
        component: () => import("@/views/Notifications/NotificationsHistory.vue"),
        meta: {
          pageTitle: "Notifications History",
          breadcrumbs: ['Notifications History'],
        },
      },
      {
        path: "/Profile/:id",
        name: "client-profile",
        component: () => import("@/views/Customers/ClientProfile.vue"),
        props: true, 
        meta: {
          pageTitle: "Profile",
          breadcrumbs: ['Customers', 'CustomersManagement'],
        },
        children: [
          {
            path: "SMS",
            name: "profile-SMS",
            component: () =>
              import("@/components/ClientProfile/SMS.vue"),
            props: route => ({
              db: route.query.db
            }) , 
            meta: {
              pageTitle: "SMS",
            },
          },
          {
            path: "users",
            name: "profile-users",
            component: () =>
              import("@/components/ClientProfile/User.vue"),
            props: route => ({
              db: route.query.db
            }) ,
            meta: {
              pageTitle: "Users",
            },
          },
          {
            path: "teachers",
            name: "profile-teachers",
            component: () =>
              import("@/components/ClientProfile/Teacher.vue"),
            props: route => ({
              db: route.query.db
            }) ,
            meta: {
              pageTitle: "teachers",
            },
          },
          {
            path: "students",
            name: "profile-students",
            component: () =>
              import("@/components/ClientProfile/Student.vue"),
            props: route => ({
              db: route.query.db
            }) , 
            meta: {
              pageTitle: "students",
            },
          },
          {
            path: "parents",
            name: "profile-parents",
            component: () =>
              import("@/components/ClientProfile/Parent.vue"),
            props: route => ({
              db: route.query.db
            }) ,
            meta: {
              pageTitle: "parents",
            },
          },
        ]
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () => import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () => import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
      {
        path: "/password-reset-link",
        name: "password-reset-link",
        component: () => import("@/views/crafted/authentication/basic-flow/PasswordResetLink.vue"),
        meta: {
          pageTitle: "Password Reset Link",
        },
        props: route => ({
          token: route.query.token
        })
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // Set the page title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // Reset layout configuration
  configStore.resetLayoutConfig();

  // Verify authentication token before each page change
  try {
    await authStore.verifyAuth();
    if (to.meta.middleware === "auth" && !authStore.isAuthenticated) {
      next({ name: "sign-in" });
    } else {
      next();
    }
  } catch {
    if (to.meta.middleware === "auth") {
      next({ name: "sign-in" });
    } else {
      next();
    }
  }
});

export default router;
