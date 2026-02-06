<template>
  <div class="form-container">
    <div class="form-box">
      <h1 class="heading">Employee Attendance</h1>

      <div class="mb-3">
        <label for="employeeName" class="form-label">Select Employee</label>
        <select v-model="attendanceForm.employeeName" id="employeeName" class="form-select">
          <option value="">Select</option>
          <option v-for="emp in employees" :key="emp.id" :value="emp.name">
            {{ emp.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="status" class="form-label">Attendance Status</label>
        <select v-model="attendanceForm.status" id="status" class="form-select">
          <option value="">Select</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
      </div>

      <div class="mb-3">
        <label>Date Start</label>
        <input v-model="formData.from" type="date" required />
      </div>

      <div class="mb-3">
        <label>Date End</label>
        <input v-model="formData.to" type="date" required />
      </div>

      <div class="mb-3">
        <label>Reason</label>
        <textarea v-model="formData.reason"></textarea>
      </div>

      <button @click="markAttendance" class="btn btn-primary">Submit Attendance</button>
    </div>
  </div>

  <div class="review-table">
    <table class="table table-bordered border-primary">
      <thead>
        <tr>
          <th>Employee Name</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in attendanceRecords" :key="record.id">
          <td>{{ record.employeeName }}</td>
          <td>{{ record.status }}</td>
          <td>{{ new Date(record.date).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup name="AttendanceView">
import { ref, onMounted } from 'vue'
import attendanceService from '@/services/attendanceService'
import employeeService from '@/services/employeeService'

const attendanceForm = ref({
  employeeName: '',
  status: ''
})

const attendanceRecords = ref([])
const employees = ref([])
const error = ref('')
const loading = ref(false)

async function loadData() {
  loading.value = true
  try {
    employees.value = await employeeService.getEmployees()
    attendanceRecords.value = await attendanceService.getAttendance()
  } catch {
    error.value = 'Failed to load data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const isFormValid = () =>
  attendanceForm.value.employeeName.trim() !== '' &&
  attendanceForm.value.status.trim() !== ''

async function markAttendance() {
  if (!isFormValid()) return

  try {
    await attendanceService.markAttendance({
      employeeName: attendanceForm.value.employeeName,
      status: attendanceForm.value.status,
      date: new Date()
    })

    attendanceRecords.value = await attendanceService.getAttendance()

    attendanceForm.value.employeeName = ''
    attendanceForm.value.status = ''
  } catch {
    error.value = 'Failed to submit attendance'
  }
}
</script>

<style scoped>
/* Reuse the same styles as employeeReview.vue */
.heading {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.mb-3 {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: bold;
  color: #000000;
  display: block;
  margin-bottom: 0.5rem;
}

.form-select,
.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-select:focus,
.form-control:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 4px rgba(37, 99, 235, 0.3);
}

.btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn:hover {
  background-color: #1d4ed8;
}

.review-table {
  max-width: 900px;
  margin: 3rem auto;
  padding: 0 2rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table thead {
  background-color: #f3f4f6;
}

.table th,
.table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  font-weight: bold;
  color: #333;
  border: 1px solid #dee2e6;
}

.table td {
  border: 1px solid #dee2e6;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}

.table-bordered {
  border: 1px solid #dee2e6;
}

.border-primary {
  border-color: #2563eb !important;
}
</style>
