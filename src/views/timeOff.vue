<script setup>
import { ref, computed, onMounted } from 'vue'
import attendanceJson from '@/data/attendance.json'
import employeeJson from '@/data/employee_info.json'

const attendanceData = ref([])
const employees = computed(() => employeeJson.employeeInformation ?? [])
const timeOffArray = ref(attendanceJson.attendanceAndLeave ?? [])
const activeTab = ref('attendance')

onMounted(() => {
  // Flatten attendance records from nested structure
  const flattened = []
  const rawData = attendanceJson.attendanceAndLeave ?? []
  
  rawData.forEach((emp, idx) => {
    if (emp.employeeId && emp.attendance) {
      emp.attendance.forEach((att, attIdx) => {
        flattened.push({
          id: `${emp.employeeId}-${attIdx}`,
          employeeId: emp.employeeId,
          name: emp.name ?? 'Unknown',
          date: att.date ?? '',
          status: att.status ?? 'pending'
        })
      })
    }
  })
  
  attendanceData.value = flattened
})

function updateStatus(id, status) {
  const record = attendanceData.value.find(a => a.id === id)
  if (record) {
    record.status = status
  }
}

function statusClass(status) {
  if (status === 'approved' || status === 'Approved') return 'approved'
  if (status === 'rejected' || status === 'Denied') return 'rejected'
  return 'pending'
}

const allLeaveRequests = computed(() => {
  const records = []
  timeOffArray.value.forEach(emp => {
    emp.leaveRequests?.forEach((leave, idx) => {
      if (leave.status === 'Pending') {
        records.push({
          id: `${emp.employeeId}-${idx}`,
          employeeId: emp.employeeId,
          name: emp.name,
          date: leave.date,
          reason: leave.reason,
          status: leave.status
        })
      }
    })
  })
  return records
})

function getStatusColor(status) {
  if (status === 'Pending') return '#f59e0b'
  if (status === 'Approved') return '#10b981'
  if (status === 'Denied') return '#ef4444'
  return '#6b7280'
}

function approveLeave(id) {
  const [empId, idx] = id.split('-')
  const emp = timeOffArray.value.find(e => String(e.employeeId) === empId)
  if (emp && emp.leaveRequests && emp.leaveRequests[idx]) {
    emp.leaveRequests[idx].status = 'Approved'
  }
}

function denyLeave(id) {
  const [empId, idx] = id.split('-')
  const emp = timeOffArray.value.find(e => String(e.employeeId) === empId)
  if (emp && emp.leaveRequests && emp.leaveRequests[idx]) {
    emp.leaveRequests[idx].status = 'Denied'
  }
}
</script>

<template>
<div class="container">
  <div class="card">
    <h2>Leave Request</h2>
    <form id="requestForm">
      <label>Employee Name</label>
      <input id="name" required />
      <label>Type of Leave:</label>
      <select id="type">
      <option>Vacation</option>
      <option>Sick Leave</option>
      <option>Personal</option>
      <option>Unpaid</option>
      </select>
      <label>Date Start</label>
      <input type="date" id="from" required />
      <label>Date End</label>
      <input type="date" id="to" required />
      <label>Reason</label>
      <textarea id="reason"></textarea>
      <button class="btn-primary" type="submit">Submit</button>
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
          <tr v-for="record in attendanceData" :key="record.id">
            <td>{{ record.name }}</td>
            <td>{{ record.date }}</td>
            <td>
              <span :class="['pill', statusClass(record.status)]">
                {{ record.status }}
              </span>
            </td>
          </tr>
          <tr v-if="attendanceData.length === 0">
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