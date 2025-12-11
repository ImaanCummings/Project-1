<script setup>
import { computed, ref } from 'vue'
import attendanceJson from '@/data/attendance.json'

const timeOffArray = computed(() => attendanceJson.attendanceAndLeave ?? [])
const formData = ref({
  name: '',
  type: 'Vacation',
  from: '',
  to: '',
  reason: ''
})

const requests = ref([...timeOffArray.value])

function submitRequest() {
  const entry = {
    id: Date.now().toString(),
    name: formData.value.name,
    type: formData.value.type,
    from: formData.value.from,
    to: formData.value.to,
    reason: formData.value.reason,
    status: 'pending'
  }
  requests.value.push(entry)
  formData.value = { name: '', type: 'Vacation', from: '', to: '', reason: '' }
}

function updateStatus(id, status) {
  const r = requests.value.find(x => x.id === id)
  if (r) r.status = status
}

function statusClass(status) {
  if (status === 'Approved') return 'approved'
  if (status === 'Denied') return 'rejected'
  return 'pending'
}
</script>

<template>
  <div class="container">
    <h1>Attendance and Leave System</h1>

    <div class="card">
      <h2>Leave Request</h2>
      <form @submit.prevent="submitRequest">
        <label>Employee Name</label>
        <input v-model="formData.name" required />

        <label>Type of Leave:</label>
        <select v-model="formData.type">
          <option>Vacation</option>
          <option>Sick Leave</option>
          <option>Personal</option>
          <option>Unpaid</option>
        </select>

        <label>Date Start</label>
        <input v-model="formData.from" type="date" required />

        <label>Date End</label>
        <input v-model="formData.to" type="date" required />

        <label>Reason</label>
        <textarea v-model="formData.reason"></textarea>

        <button class="btn-primary" type="submit">Submit</button>
      </form>
    </div>

    <section class="card p-4">
      <h2>Time Off Requests</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in requests" :key="r.id">
            <td>{{ r.name }}</td>
            <td>{{ r.from }}</td>
            <td>{{ r.to }}</td>
            <td>{{ r.reason }}</td>
            <td><span :class="['pill', statusClass(r.status)]">{{ r.status }}</span></td>
            <td>
              <button @click="updateStatus(r.id,'Approved')" class="btn btn-sm btn-success">Approve</button>
              <button @click="updateStatus(r.id,'Denied')" class="btn btn-sm btn-danger">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.container {
  font-family: Arial;
  padding: 20px;
  background: #f4f4f4;
}
.card {
  background: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  margin-bottom: 20px;
}
input, select, textarea {
  width: 100%;
  padding: 8px;
  margin-top: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-primary {
  background: #2563eb;
  color: white;
}
.btn-success {
  background: #15803d;
  color: white;
}
.btn-danger {
  background: #dc2626;
  color: white;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}
th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.pill {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
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
</style>