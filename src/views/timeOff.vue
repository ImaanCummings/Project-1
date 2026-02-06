<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../services/api'

const activeTab = ref('attendance')
const attendanceData = ref([])
const leaveRecords = ref([])
const employees = ref([])
const loadingLeave = ref(false)

const form = ref({
  name: '',
  type: 'Vacation',
  from: '',
  to: '',
  reason: ''
})

const attendanceRows = computed(() => {
  return attendanceData.value.map((row, idx) => {
    const employee = employees.value.find(e => Number(e.employee_id) === Number(row.employee_id))
    return {
      id: row.id ?? `${row.employee_id}-${idx}`,
      employeeId: row.employee_id,
      name: employee?.name ?? `Employee ${row.employee_id}`,
      date: row.attendance_date ?? row.date ?? '',
      status: row.status ?? 'Pending'
    }
  })
})

const allLeaveRequests = computed(() => {
  return leaveRecords.value
    .filter(l => l.status === 'Pending')
    .map((l) => ({
      id: l.employee_id,
      employeeId: l.employee_id,
      name: l.name,
      date: l.date,
      reason: l.reason,
      status: l.status
    }))
})

function statusClass(status) {
  if (status === 'approved' || status === 'Approved') return 'approved'
  if (status === 'rejected' || status === 'Denied') return 'rejected'
  return 'pending'
}

function getStatusColor(status) {
  if (status === 'Pending') return '#f59e0b'
  if (status === 'Approved') return '#10b981'
  if (status === 'Denied') return '#ef4444'
  return '#6b7280'
}

async function loadData() {
  try {
    const [attendanceList, leaveList, employeeList] = await Promise.all([
      api.getAttendance(),
      api.getLeaves(),
      api.getEmployees()
    ])
    attendanceData.value = Array.isArray(attendanceList) ? attendanceList : []
    leaveRecords.value = Array.isArray(leaveList) ? leaveList : []
    employees.value = Array.isArray(employeeList) ? employeeList : []
  } catch (error) {
    console.error('Failed to load time off data:', error)
  }
}

async function submitLeave(event) {
  event.preventDefault()
  if (!form.value.name.trim() || !form.value.from || !form.value.reason.trim()) return

  const combinedReason = `${form.value.type} (${form.value.from}${form.value.to ? ` to ${form.value.to}` : ''}) - ${form.value.reason}`
  loadingLeave.value = true
  try {
    await api.addLeave({
      name: form.value.name,
      date: form.value.from,
      reason: combinedReason,
      status: 'Pending'
    })
    await loadData()
    form.value = { name: '', type: 'Vacation', from: '', to: '', reason: '' }
  } catch (error) {
    console.error('Failed to submit leave request:', error)
  } finally {
    loadingLeave.value = false
  }
}

async function approveLeave(id) {
  try {
    await api.updateLeaveStatus(id, { status: 'Approved' })
    await loadData()
  } catch (error) {
    console.error('Failed to approve leave:', error)
  }
}

async function denyLeave(id) {
  try {
    await api.updateLeaveStatus(id, { status: 'Denied' })
    await loadData()
  } catch (error) {
    console.error('Failed to deny leave:', error)
  }
}

onMounted(loadData)
</script>

<template>
<div class="container">
  <div class="card">
    <h2>Leave Request</h2>
    <form id="requestForm" @submit="submitLeave">
      <label>Employee Name</label>
      <input id="name" v-model="form.name" required />
      <label>Type of Leave:</label>
      <select id="type" v-model="form.type">
      <option>Vacation</option>
      <option>Sick Leave</option>
      <option>Personal</option>
      <option>Unpaid</option>
      </select>
      <label>Date Start</label>
      <input type="date" id="from" v-model="form.from" required />
      <label>Date End</label>
      <input type="date" id="to" v-model="form.to" />
      <label>Reason</label>
      <textarea id="reason" v-model="form.reason"></textarea>
      <button class="btn-primary" type="submit" :disabled="loadingLeave">
        {{ loadingLeave ? 'Submitting...' : 'Submit' }}
      </button>
    </form>
 </div>
 <br>

    <!-- Tab Buttons -->
    <div class="tabs">
      <button 
        @click="activeTab = 'attendance'" 
        :class="{ active: activeTab === 'attendance' }"
        class="tab-btn"
      >
        Attendance Records
      </button>
      <button 
        @click="activeTab = 'leave'" 
        :class="{ active: activeTab === 'leave' }"
        class="tab-btn"
      >
        Leave Requests
      </button>
    </div>

    <!-- Attendance Table -->
    <div v-if="activeTab === 'attendance'" class="card">
      <h2>Attendance Records</h2>
      <table class="attendance-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in attendanceRows" :key="record.id">
            <td>{{ record.name }}</td>
            <td>{{ record.date }}</td>
            <td>
              <span :class="['pill', statusClass(record.status)]">
                {{ record.status }}
              </span>
            </td>
          </tr>
          <tr v-if="attendanceRows.length === 0">
            <td colspan="3" style="text-align: center; color: #999;">No attendance records</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Leave Requests Table -->
    <div v-if="activeTab === 'leave'" class="card">
      <h2>Pending Leave Requests</h2>
      <table class="attendance-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in allLeaveRequests" :key="record.id">
            <td>{{ record.name }}</td>
            <td>{{ record.date }}</td>
            <td>{{ record.reason }}</td>
            <td>
              <span class="status-badge" :style="{ backgroundColor: getStatusColor(record.status) }">
                {{ record.status }}
              </span>
            </td>
            <td>
              <button @click="approveLeave(record.id)" class="btn btn-approve">Approve</button>
              <button @click="denyLeave(record.id)" class="btn btn-deny">Deny</button>
            </td>
          </tr>
          <tr v-if="allLeaveRequests.length === 0">
            <td colspan="5" style="text-align: center; color: #999;">No pending leave requests</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.btn-primary {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

input, select, textarea {
    width: 100%;
    padding: 8px;
    margin-top: 6px;
    border-radius: 6px;
    border: 1px solid #ccc;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.tab-btn.active {
  background: #2563eb;
  color: white;
}

.tab-btn:hover {
  background: #d1d5db;
}

.tab-btn.active:hover {
  background: #1d4ed8;
}

.card {
  background: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
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
  color: #027d2f;
}

.rejected {
  background: #fee2e2;
  color: #b91c1c;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  margin-right: 5px;
  transition: all 0.3s;
}

.btn-approve {
  background: #10b981;
  color: white;
}

.btn-approve:hover {
  background: #059669;
}

.btn-deny {
  background: #ef4444;
  color: white;
}

.btn-deny:hover {
  background: #dc2626;
}
</style>
