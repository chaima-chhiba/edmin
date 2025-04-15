<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Refill SMS Balance -->
      <div class="col-md-8 top-space" style="margin-bottom: 20px;"> <!-- Added margin bottom -->
        <h6>Refill SMS Balance</h6>
        <form @submit.prevent="refill">
          <div class="row mb-3">
            <div class="col-md-6">
              <div class="form-floating">
                <input type="number" class="form-control" id="newSmsSold" v-model="addedAmount" placeholder="Amount to add">
                <label for="addedAmount">Amount to add</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating">
                <input type="text" class="form-control" id="senderName" placeholder="Sender Name" v-model="senderName">
                <label for="senderName">Sender Name</label>
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md">
              <div class="form-floating">
                <input type="text" class="form-control" id="comment" placeholder="Comment" v-model="comment">
                <label for="comment">Comment</label>
              </div>
            </div>
          </div>
          <div>
            <template v-if="addedAmount < 0">
              <el-popconfirm
                title="Are you sure you want to reduce the SMS balance?"
                confirm-button-text="Yes"
                cancel-button-text="No"
                @confirm="refill"
              >
                <template #reference>
                  <button type="button" class="btn btn-primary">Refill</button>
                </template>
              </el-popconfirm>
            </template>
            <button v-else type="button" class="btn btn-primary" @click="refill">Refill</button>
          </div>
          
          
        </form>
      </div>
      <!-- Current SMS Balance -->
      <div class="col-md-4 top-space">
        <h6>SMS Balance</h6>
        <div class="alert alert-info" role="alert">
          Current SMS Balance: {{ smsBalance }}
        </div>
      </div>
    </div>
    <div class="row">
      <!-- SMS Refill History Full-width -->
      <div class="col-12">
        <h6>SMS Refill History</h6>
        <Datatable :data="tableData" :header="tableHeader" class="datatable">
          <template v-slot:amountAdded="{ row: sms }">
            {{ sms.amountAdded }}
          </template>
          <template v-slot:oldBalance="{ row: sms }">
            {{ sms.oldBalance }}
          </template>
          <template v-slot:addedBy="{ row: sms }">
            {{ sms.addedBy }}
          </template>
          <template v-slot:date="{ row: sms }">
            {{ formatDate(sms.date) }}
          </template>
          <template v-slot:comment="{ row: sms }">
            {{ sms.comment }}
          </template>
        </Datatable>
      </div>
    </div>
  </div>
</template>





<script>
import { ref ,onMounted} from 'vue';
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import { ElMessage } from "element-plus";
import { useRoute ,useRouter } from "vue-router";
const edmin_base_url = "http://localhost:8888/api/edmin";
export default {
  name: "SMSCard",
  components: {
    Datatable,
  },
  setup() {
    const route = useRoute();
    const db = route.query.db;
    const clientId = route.params.id;
    const tableData = ref([]);
    const tableHeader = ref([
  { columnName: "Amount Added", columnLabel: "amountAdded", width: "15%" },
  { columnName: "Old Sold", columnLabel: "oldBalance", width: "15%" },
  { columnName: "Added by", columnLabel: "addedBy", width: "15%" },
  { columnName: "Date", columnLabel: "date", width: "15%" },
  { columnName: "Comment", columnLabel: "comment" }, 
]);


    const smsBalance = ref();
    const senderName = ref('');
    const addedAmount = ref(0);
    const comment = ref('');
    
    const fetchSMSData = async () => {
      try {
        ApiService.setDB(db);
        const response = await ApiService.get('/sms/solde',edmin_base_url);
        smsBalance.value = response.data.sms.solde;
        senderName.value = response.data.sms.senderName;
        
      } catch (error) {
        console.error("Failed to fetch SMS data", error);
        ElMessage.error("Error fetching SMS data.");
      }
    };
    const fetchSMSHistory = async () => {
      try {
        const response = await ApiService.get(`/api/sms?clientId=${clientId}`);
        tableData.value = response.data;
      } catch (error) {
        console.error("Error fetching sms history:", error);
        ElMessage.error("Error fetching SMS history.");
      }
    };

    const refill = () => {
  ApiService.setDB(db);
  const oldBalance = smsBalance.value;
  const payload = { addedAmount: addedAmount.value, senderName: senderName.value, clientId: clientId };

  ApiService.patch('/crm/updateSolde', payload, edmin_base_url)
    .then(response => {
      smsBalance.value = response.data.sms.solde;

      const logPayload = {
        clientId: clientId,
        amountAdded: addedAmount.value,
        addedBy: senderName.value,
        comment: comment.value,
        oldBalance: oldBalance,
        newSolde: smsBalance.value,
        date: new Date().toISOString()
      };

      return ApiService.post('/api/sms', logPayload);
    })
    .then(() => {
      ElMessage.success(`SMS balance changed successfully! New balance: ${smsBalance.value}`);
      fetchSMSData();
      fetchSMSHistory();
    })
    .catch(error => {
      console.error("Failed to refill SMS balance", error);
      ElMessage.error("Failed to refill SMS balance.");
    });
};


    
    onMounted(async () => {
      await fetchSMSData();
      
      await fetchSMSHistory();
    });
     // Format date of creation
     const formatDate = (dateString) => {
      // Convert the dateString to a Date object
      const date = new Date(dateString);
      // Get the date components (year, month, day)
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      // Construct the formatted date string
      return `${year}-${month < 10 ? "0" : ""}${month}-${
        day < 10 ? "0" : ""
      }${day}`;
    };
    
    return {
      tableHeader,
      tableData,
      smsBalance,
      senderName,
      addedAmount,
      refill,
      comment,
      formatDate

    };
  },
};
</script>
<style>
  .top-space {
    margin-top: 20px; 
  }
</style>