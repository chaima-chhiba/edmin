import type { App } from "vue";
import type { AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/JwtService";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Token ${JwtService.getToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
  }
public static setDB(DBName?: string):void{

  ApiService.vueInstance.axios.defaults.headers["db"]= DBName;
}
private static getAxiosForBaseUrl(baseURL?: string) {
  if (!baseURL) {
    return ApiService.vueInstance.axios;
  }
  return axios.create({
    baseURL: baseURL,
    headers: {
      'Authorization': ApiService.vueInstance.axios.defaults.headers.common['Authorization'],
      'Accept': ApiService.vueInstance.axios.defaults.headers.common['Accept'],
      'db': ApiService.vueInstance.axios.defaults.headers['db'] 
    }
  });
}
  public static query(resource, params, baseURL?: string) {
    return ApiService.getAxiosForBaseUrl(baseURL).get(resource, { params });
  }

  public static get(resource,  baseURL?: string) {
   
    return ApiService.getAxiosForBaseUrl(baseURL).get(resource);
  }

  public static post(resource, params, baseURL?: string) {
    return ApiService.getAxiosForBaseUrl(baseURL).post(resource, params);
  }

  public static patch(resource,  params, baseURL?: string) {
    
    return ApiService.getAxiosForBaseUrl(baseURL).patch(resource, params);
  }

  public static put(resource, params, baseURL?: string) {
    return ApiService.getAxiosForBaseUrl(baseURL).put(resource, params);
  }
  public static async deleteWithoutParams(url: string, baseURL?: string): Promise<any> {
    const axiosInstance = ApiService.getAxiosForBaseUrl(baseURL);
    return axiosInstance.delete(url)
      .then((response: AxiosResponse<any>) => response.data)
      .catch((error: any) => {
        throw error;
      });
  }
  public static delete(resource: string, params?: any, baseURL?: string): Promise<AxiosResponse<any>> {
    const axiosInstance = ApiService.getAxiosForBaseUrl(baseURL);
  
    // Check if params are provided
    if (params) {
      return axiosInstance.delete(resource, { data: params }) // Use 'data' for DELETE requests with Axios
        .then((response: AxiosResponse<any>) => {
          // Handle successful response if needed
          return response.data; // Return data if necessary
        })
        .catch((error: any) => {
          // Handle error
          throw error; // Rethrow error for upper layers to handle
        });
    } else {
      // For DELETE requests without params, send the request without the 'data' property
      return axiosInstance.delete(resource)
        .then((response: AxiosResponse<any>) => {
          // Handle successful response if needed
          return response.data; // Return data if necessary
        })
        .catch((error: any) => {
          // Handle error
          throw error; // Rethrow error for upper layers to handle
        });
    }
  }
  
  
}

export default ApiService;
