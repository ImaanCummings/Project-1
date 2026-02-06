<script setup>
import { ref, computed, onMounted } from 'vue'
import attendanceService from '@/services/attendanceService'
import leaveService from '@/services/leaveService'

const attendanceData = ref([])
const leaveRequests = ref([])
const activeTab = ref('attendance')

async function loadAttendance() {
  try {
    const data = await attendanceService.getAttendance()

    attendanceData.value = data.map((att, index) => ({
      id: att.id || index,
      employeeId: att.employeeId,
      name: att.name,
      date: att.date,
      status: att.status
    }))
  } catch (err) {
    alert(err)
  }
}

async function loadLeaves() {
  try {
    leaveRequests.value = await leaveService.getLeaves()
  } catch (err) {
    alert(err)
  }
}

async function submitLeave(e) {
  e.preventDefault()

  const payload = {
    name: document.getElementById("name").value,
    type: document.getElementById("type").value,
    from: document.getElementById("from").value,
    to: document.getElementById("to").value,
    reason: document.getElementById("reason").value
  }

  try {
    await leaveService.createLeave(payload)

    alert("Leave submitted successfully")

    await loadLeaves()

    e.target.reset()
  } catch (err) {
    alert(err)
  }
}

async function approveLeave(id) {
  try {
    await leaveService.updateLeave(id, {
      status: "Approved"
    })

    await loadLeaves()
  } catch (err) {
    alert(err)
  }
}

async function denyLeave(id) {
  try {
    await leaveService.updateLeave(id, {
      status: "Denied"
    })

    await loadLeaves()
  } catch (err) {
    alert(err)
  }
}

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

const allLeaveRequests = computed(() => {
  return leaveRequests.value || []
})

onMounted(() => {
  loadAttendance()
  loadLeaves()
})
</script>


<template>
<div class="container">
  <div class="card">
    <h2>Leave Request</h2>
    <form id="requestForm" @submit="submitLeave">
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
