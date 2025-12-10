<script setup>
import { ref, computed, onMounted } from 'vue'
import attendanceJson from '@/data/attendance.json'
import employeeJson from '@/data/employee_info.json'

const attendanceData = ref([])
const employees = computed(() => employeeJson.employeeInformation ?? [])

onMounted(() => {
  // Load attendance data from JSON
  attendanceData.value = attendanceJson.attendanceAndLeave ?? []
})

function getEmployeeName(employeeId) {
  const emp = employees.value.find(e => e.id === employeeId)
  return emp ? emp.name : 'Unknown'
}

function updateStatus(id, status) {
  const record = attendanceData.value.find(a => a.id === id)
  if (record) {
    record.status = status
  }
}

function statusClass(status) {
  if (status === 'approved') return 'approved'
  if (status === 'rejected') return 'rejected'
  return 'pending'
}
</script>

<template>
  <div class="card">
    <h2>Attendance Chart</h2>
    <table class="attendance-table">
      <thead>
        <tr>
          <th>Employee Name</th>
          <th>Dates</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in attendanceData" :key="record.id">
          <td>{{ record.name }}</td>
          <td>{{ record.from }} to {{ record.to }}</td>
          <td>{{ record.reason }}</td>
          <td>
            <span :class="['pill', statusClass(record.status)]">
              {{ record.status }}
            </span>
          </td>
          <td>
            <button @click="updateStatus(record.id, 'approved')" class="btn-success">Approve</button>
            <button @click="updateStatus(record.id, 'rejected')" class="btn-danger">Reject</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  margin-bottom: 20px;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

th {
  background: #f0f0f0;
  font-weight: bold;
}

.pill {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  display: inline-block;
}

.pending {
  background: #dbeafe;
  color: #1d4ed8;
}

.approved {
  background: #dcfce7;
  color: #15803d;
}

.rejected {
  background: #fee2e2;
  color: #b91c1c;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
}

.btn-success {
  background: #15803d;
  color: white;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style>