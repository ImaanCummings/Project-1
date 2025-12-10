<script setup>
  import { computed, ref } from 'vue'
  import employeeJson from '@/data/employee_info.json'
  import attendanceJson from '@/data/attendance.json'

  const timeOffArray = attendanceJson.attendanceAndLeave ?? []
  const employees = employeeJson.employeeInformation ?? []  
  const activeTab = ref('attendance') 


  const processed = computed(() =>
    timeOffArray.map(t => {
      const emp = employees.find(e => Number(e.employeeId) === Number(t.employeeId))
      const name = emp?.name ?? 'Unknown'
      return {
        employeeId: Number(t.employeeId),
        name,
        leaveType: t.leaveType ?? t.leave_type ?? 'N/A',
        startDate: t.startDate ?? t.start_date ?? 'N/A',
        endDate: t.endDate ?? t.end_date ?? 'N/A',
        status: t.status ?? 'N/A',          
      }
    })
  )


  const allAttendance = computed(() => {
    const records = []
    timeOffArray.forEach(emp => {
      emp.attendance?.forEach(att => {
        records.push({
          employeeId: emp.employeeId,
          name: emp.name,
          date: att.date,
          status: att.status
        })
      })
    })
    return records
  })

 
  const allLeaveRequests = computed(() => {
    const records = []
    timeOffArray.forEach(emp => {
      emp.leaveRequests?.forEach(leave => {
        if (leave.status === 'Pending') {
          records.push({
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

    return '#6b7280'
  }
</script>

<template>
  <div class="timeoff-container">
    <h1 class="heading">Time Off & Attendance</h1>

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

  
    <div v-if="activeTab === 'attendance'" class="table-wrapper">
      <table class="timeoff-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, i) in allAttendance" :key="i">
            <td>{{ record.employeeId }}</td>
            <td>{{ record.name }}</td>
            <td>{{ record.date }}</td>
            <td>
              <span class="status-badge" :style="{ backgroundColor: getStatusColor(record.status) }">
                {{ record.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Leave Requests Table -->
    <div v-if="activeTab === 'leave'" class="table-wrapper">
      <table class="timeoff-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, i) in allLeaveRequests" :key="i">
            <td>{{ record.employeeId }}</td>
            <td>{{ record.name }}</td>
            <td>{{ record.date }}</td>
            <td>{{ record.reason }}</td>
            <td>
              <span class="status-badge" :style="{ backgroundColor: getStatusColor(record.status) }">
                {{ record.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.timeoff-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.heading {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
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

.table-wrapper {
  overflow-x: auto;
}

.timeoff-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timeoff-table th {
  background-color: #f3f4f6;
  padding: 1rem;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
}

.timeoff-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #eee;
}

.timeoff-table tbody tr:hover {
  background-color: #f9fafb;
}

.timeoff-table tbody tr:nth-child(odd) {
  background-color: #f5f5f5;
}

.status-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
