<template>
  <el-form
    ref="ruleFormRef"
    :model="schoolForm"
    :rules="rules"
    label-width="auto"
    label-position="left"
    :size="formSize"
    status-icon
  >
    <el-form-item label="Title" prop="title" required>
      <el-input v-model="schoolForm.title" />
    </el-form-item>

    <el-form-item label="Message" prop="message" required>
      <el-input v-model="schoolForm.message" type="textarea" />
    </el-form-item>

    <el-form-item label="Client" prop="topic_building" required>
      <el-select filterable v-model="schoolForm.topic_building" placeholder="Client" @change="handleClientChange">
        <el-option v-for="client in clients" :key="client.dbName" :label="client.schoolName" :value="client.dbName" />
      </el-select>
    </el-form-item>

    <el-form-item label="Audience" prop="topic_audience">
      <div class="custom-style">
        <el-segmented v-model="schoolForm.topic_audience" :options="AudianceOptions" :disabled="!isClientChosen" @change="handleAudienceChange" />
      </div>
    </el-form-item>

    <el-form-item label="User" prop="user">
      <el-select v-model="schoolForm.user" placeholder="Choose a user" :disabled="!isClientChosen">
        <el-option
          v-if="!loadingUsers"
          v-for="user in users"
          :key="user.id"
          :label="getUserLabel(user)"
          :value="getUserValue(user)"
        />
        <el-option v-else disabled>Loading users...</el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Redirect Screen" prop="screen">
      <el-select v-model="schoolForm.screen" placeholder="No Redirect Screen">
        <el-option v-for="screen in screens" :key="screen.value" :label="screen.name" :value="screen.value" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Create
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from 'vue';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';
import ApiService from "@/core/services/ApiService";
import { ElMessage } from "element-plus";

const edmin_base_url = "http://localhost:8888/api/edmin";

const props = defineProps({
  clients: { type: [Object], required: true },
})

interface RuleForm {
  title: string;
  message: string;
  topic_building: string;
  topic_audience: string;
  user: string;
  screen: string;
}

const formSize = ref<ComponentSize>('default');
const ruleFormRef = ref<FormInstance>();
const schoolForm = reactive<RuleForm>({
  title: '',
  message: '',
  topic_building: '',
  topic_audience: '',
  user: '',
  screen: '',
});

const AudianceOptions = ['Students', 'Parents', 'Teacher'];
const screens = [
  {name: "FOOD", value: '/food'},
  {name: "PAYMENT", value: '/payment'},
  {name: "EMPLOI", value: '/emploi'},
  {name: "PUNITION", value: '/punition'},
  {name: "COURSES", value: '/courses'},
  {name: "DEVOIRS", value: '/devoirs'},
  {name: "BULLTEIN", value: '/bulltein'},
  {name: "ASSIDUITE", value: '/assiduite'},
  {name: "ABOUTUS", value: '/aboutus'},
  {name: "PROFILE", value: '/profile'},
  {name: "EDIT", value: '/edit'},
  {name: "SETTING", value: '/setting'},
  {name: "ACTUALITE", value: '/actualite'},
  {name: "FEEDBACK", value: '/feedback'},
  {name: "CHAT", value: '/chat'},
  {name: "CALENDAR", value: '/calendar'},
  {name: "KUTUBEE", value: '/kutubee'},
];

const rules = reactive<FormRules<RuleForm>>({
  title: [
    { required: true, message: 'Please input title', trigger: 'blur' },
    { min: 3, message: 'Length should be at least 3', trigger: 'blur' },
  ],
  topic_building: [
    { required: true, message: 'Please select Client', trigger: 'change' },
  ],
  topic_audience: [
    { required: true, message: 'Please select Audience', trigger: 'change' },
  ],
  user: [
    { required: true, message: 'Please choose a user', trigger: 'change' },
  ],
});

const isClientChosen = ref(false);
const loadingUsers = ref(false);
const users = ref([]);

const handleClientChange = () => {
  console.log('Client selected:', schoolForm.topic_building);
  isClientChosen.value = !!schoolForm.topic_building;
  ApiService.setDB(schoolForm.topic_building);
  fetchUsersByAudience(schoolForm.topic_audience);
};

const handleAudienceChange = () => {
  console.log('Audience selected:', schoolForm.topic_audience);
  schoolForm.user = '';

  // Only fetch users if both a client and audience are selected
  if (schoolForm.topic_building && schoolForm.topic_audience) {
    fetchUsersByAudience(schoolForm.topic_audience);
  }
};

const fetchUsersByAudience = async (audience: string) => {
  if (!audience || !isClientChosen.value) return;

  console.log('Fetching users for audience:', audience);
  loadingUsers.value = true;

  try {
    if (audience === 'Students') {
      await fetchStudents();
    } else if (audience === 'Parents') {
      await fetchParents();
    } else if (audience === 'Teacher') {
      await fetchTeachers();
    }
  } finally {
    loadingUsers.value = false;
  }
};




const fetchStudents = async () => {
  console.log('Fetching students...');
  try {
    const response = await ApiService.get("/students/student",  edmin_base_url);
    users.value = response.data;
    console.log('Students fetched:', response.data);
  } catch (error) {
    console.error('Failed to fetch students:', error);
  }
};

const fetchParents = async () => {
  console.log('Fetching parents...');
  try {
    const response = await ApiService.get("/parents", edmin_base_url);
    users.value = response.data;
    console.log('Parents fetched:', response.data);
  } catch (error) {
    console.error('Failed to fetch parents:', error);
  }
};

const fetchTeachers = async () => {
  console.log('Fetching teachers...');
  try {
    const response = await ApiService.post("/teachers/filter", { query: {} }, edmin_base_url);
    users.value = response.data;
    console.log('Teachers fetched:', response.data);
  } catch (error) {
    console.error('Failed to fetch teachers:', error);
  }
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      console.log('Form is valid, submitting...');
      const topic = `${schoolForm.topic_building}-${schoolForm.topic_audience}-${schoolForm.user}`;

      ApiService.post('/api/Notif', {
        title: schoolForm.title,
        message: schoolForm.message,
        client: schoolForm.topic_building,
        audience: schoolForm.user,
        screen: schoolForm.screen,
        topic: topic,
      })
        .then(response => {
          console.log('Notification created successfully!', response);
          ElMessage.success({ message: 'Notification sent successfully!', type: 'success' });
          resetForm(ruleFormRef.value);
        })
        .catch(error => {
          console.error('Failed to create notification:', error);
          ElMessage.error({ message: 'Failed to send notification. Please try again.', type: 'error' });
        });
    } else {
      console.log('Validation failed:', fields);
    }
  });
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  
 
  formEl.resetFields();
  
  
  schoolForm.topic_audience = '';
  schoolForm.topic_building = '';
  schoolForm.user = '';
  isClientChosen.value = false;
  users.value = [];
};


onMounted(() => {
  if (schoolForm.topic_building && schoolForm.topic_audience) {
    fetchUsersByAudience(schoolForm.topic_audience);
  }
});

const getUserLabel = (user: any) => {
  if (schoolForm.topic_audience === 'Teacher' || schoolForm.topic_audience === 'Students') {
    return `${user.employee?.lastName || user.lastName || ''} ${user.employee?.firstName || user.firstName || ''}`;
  } else {
    return user.userName || '';
  }
};

const getUserValue = (user: any) => {
  if (schoolForm.topic_audience === 'Teacher' || schoolForm.topic_audience === 'Students') {
    return `${user.employee?.lastName || user.lastName || ''} ${user.employee?.firstName || user.firstName || ''}`;
  } else {
    return user.userName || '';
  }
};
</script>

<style scoped>
.custom-style .el-segmented {
  --el-segmented-item-selected-color: var(--el-text-color-primary);
  --el-segmented-item-selected-bg-color: #885dfe;
  --el-border-radius-base: 16px;
}
</style>
