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
      <el-select filterable multiple v-model="schoolForm.topic_building" placeholder="Client">
        <el-option v-for="client in clients" :label="client.schoolName" :value="client.dbName" />
      </el-select>
    </el-form-item>

    <el-form-item label="Audience" prop="topic_audience">
      <div class="custom-style">
        <el-segmented v-model="schoolForm.topic_audience" :options="AudianceOptions" />
      </div>
    </el-form-item>

    <el-form-item label="Redirect Screen" prop="screen">
      <el-select v-model="schoolForm.screen" placeholder="No Redirect Screen">
        <el-option v-for="screen in screens" :label="screen.name" :value="screen.value" />
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
import { reactive, ref } from 'vue';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';
import ApiService from "@/core/services/ApiService"; 
import {

ElMessage,

} from "element-plus";

const props = defineProps({
  clients: { type: [Object], required: true },
})

interface RuleForm {
  title: string;
  message: string;
  topic_building: string[];
  topic_audience: string;
  screen: string;
}

const formSize = ref<ComponentSize>('default');
const ruleFormRef = ref<FormInstance>();
const schoolForm = reactive<RuleForm>({
  title: '',
  message: '',
  topic_building: [],
  topic_audience: '',
  screen: '',
});

const AudianceOptions = ['All Users', 'Students', 'Parents', 'Teacher'];
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
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      const topics = schoolForm.topic_building.map(client =>
        `${client}-${schoolForm.topic_audience}`
      );
      
      ApiService.post('/api/Notif', {
        title: schoolForm.title,
        message: schoolForm.message,
        client: schoolForm.topic_building,
        audience: schoolForm.topic_audience,
        screen: schoolForm.screen,
        topic: topics,
      })
      .then(response => {
        console.log('Notification created successfully!', response);
        ElMessage.success({ message: 'Notification sent successfully!', type: 'success' });
        
        resetForm(ruleFormRef.value);
      })
      .catch(error => {
        console.error('Failed to create notification:', error);
       
      });
    } else {
      console.log('Validation failed:', fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

</script>

<style scoped>
.custom-style .el-segmented {
  --el-segmented-item-selected-color: var(--el-text-color-primary);
  --el-segmented-item-selected-bg-color: #885dfe;
  --el-border-radius-base: 16px;
}
</style>
