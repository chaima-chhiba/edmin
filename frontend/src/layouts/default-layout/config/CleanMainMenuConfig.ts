import type { MenuItem } from "@/layouts/default-layout/config/types";
/*

Feedbacks
Statistique
Packs
Users
Roles
Customers
*/
const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "Dashboard",
        access: ["Statistique"],
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "EdMin settings",
    route: "/settings",
    access: ["Users", "Roles"],
    pages: [
      {
        keenthemesIcon: "element-plus",
        bootstrapIcon: "bi-people",
        heading: "Users",
        access: ["Users"],
        route: "/settings/settings/users-listing",
      },
      {
        keenthemesIcon: "element-plus",
        bootstrapIcon: "bi-shield-lock",
        heading: "Roles",
        access: ["Roles"],
        route: "/settings/settings/roles-listing",
      }
    ],
  },
  {
    heading: "customers",
    route: "/Customers",
    access: ["Customers"],
    pages: [
      {
        heading: "Customers",
        route: "/Customers/CustomersManagement",
        access: ["Customers"],
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-building",
      },
    ],
  },

  {
    heading: "packs",
    route: "/Packs",
    access: ["Packs"],
    pages: [
      {
        heading: "Packs",
        route: "/Packs/PacksManagement",
        access: ["Packs"],
        keenthemesIcon: "basket",
        bootstrapIcon: "bi-box",
      },
    ]
  },
  {
    heading: "SMS ",
    route: "/SMS",
    access: ["SMS"],
    pages: [
      {
        heading: "SMS refill logs",
        route: "/SMS",
        access: ["SMS"],
        keenthemesIcon: "sms",
        bootstrapIcon: "bi-box",
      },
    ]
  },
  {
    heading: "Notifications",
    route: "/PushNotifications",
    access: ["PushNotifications"],
    pages: [
      {
        heading: "Push Notifications",
        route: "/PushNotifications",
        access: ["PushNotifications"],
        keenthemesIcon: "notification-on",
        bootstrapIcon: "bi-box",
      },
      {
        heading: "Notifications History",
        route: "/NotificationsHistory",
        access: ["PushNotifications"],
        keenthemesIcon: "notification-on",
        bootstrapIcon: "bi-box",
      },
    ]
  },
  {
    heading: "Feedbacks",
    route: "/Feedbacks",
    access: ["Feedbacks"],
    pages: [
      {
        heading: "Administration",
        route: "/Feedbacks/Administration",
        keenthemesIcon: "message-text-2",
        bootstrapIcon: "bi-chat-left",
        access: ["Feedbacks"],

      },
      {
        heading: "Teachers",
        route: "/Feedbacks/Teachers",
        keenthemesIcon: "message-text-2",
        bootstrapIcon: "bi-chat-left",
        access: ["Feedbacks"],

      },
      {
        heading: "Parents",
        route: "/Feedbacks/Parents",
        keenthemesIcon: "message-text-2",
        bootstrapIcon: "bi-chat-left",
        access: ["Feedbacks"],

      },
    ]
  },


];

export default MainMenuConfig;
