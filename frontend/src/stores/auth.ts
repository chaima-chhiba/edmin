import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { ElNotification } from 'element-plus';

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  token: string;
  role: Role;
}

interface AccessList {
  [key: string]: boolean;
}

interface Role {
  accessList: AccessList;
  _id: string;
  superAdmin: boolean;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(authUser.token);
  }

  function refreshToken(token: string, role: Role) {
    isAuthenticated.value = true;
    errors.value = {};
    user.value.role = role;
    JwtService.saveToken(token);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
  }

  function login(credentials: User) {
    return ApiService.post("/api/auth/login", credentials)
      .then(({ data }) => {
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function logout() {
    purgeAuth();
  }

  function forgotPassword(email: string) {
    return ApiService.post("/api/auth/password-reset-initiate", { email })
      .then(() => {
        setError({});
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          throw new Error("Email not found");
        } else {
          setError(error.response.data.errors);
        }
      });
  }

  function completePasswordReset(token: string, newPassword: string, confirmPassword: string) {
    return ApiService.post(`/api/auth/password-reset-complete`, {
      newPassword,
      confirmPassword,
      token
    })
      .then(() => {
        // Handle success if needed
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  function verifyAuth() {
    return new Promise((resolve, reject) => {
      if (JwtService.getToken()) {
        ApiService.setHeader();
        ApiService.post("/api/auth/verify-auth", { token: JwtService.getToken() })
          .then(({ data }) => {
            refreshToken(data.token, data.role);
            resolve(true);
          })
          .catch(({ response }) => {
            console.error("Error during token verification:", response);
            setError(response.data.errors);
            purgeAuth();
            ElNotification({
              title: 'Info',
              message: 'Session expired',
              type: 'info',
            });
            reject(false);
          });
      } else {
        purgeAuth();
      
        reject(false);
      }
    });
  }

  function hasAccess(permissions: string | string[]) {
    if (user.value && user.value.role) {
      if (user.value.role.superAdmin) {
        return true;
      }
  
      if (!Array.isArray(permissions)) {
        permissions = [permissions];
      }
  
      return permissions.some(permission => user.value.role.accessList[permission]);
    } else {
      console.error('User role is undefined');
      return false;
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    completePasswordReset,
    forgotPassword,
    verifyAuth,
    hasAccess
  };
});
