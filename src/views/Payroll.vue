<script setup>
import { computed } from 'vue'
import payrollJson from '@/data/payroll_data.json'
import employeeJson from '@/data/employee_info.json'

const payrollArray = payrollJson.payrollData ?? []
const employees = employeeJson.employeeInformation ?? []

// Merge payroll records with employee info by employeeId
const processed = computed(() =>
  payrollArray.map(p => {
    const emp = employees.find(e => Number(e.employeeId) === Number(p.employeeId))
    const name = emp?.name ?? 'Unknown'
    const hours = Number(p.hoursWorked ?? p.hours_worked ?? 0)
    const finalSalary = Number(p.finalSalary ?? p.final_salary ?? p.amount ?? 0)
    const hourlyRate = hours > 0 ? finalSalary / hours : 0
    return {
      employeeId: Number(p.employeeId),
      name,
      hours,
      leaveDeductions: p.leaveDeductions ?? p.leave_deductions ?? 0,
      hourlyRate,
      finalSalary,
    }
  })
)

function exportCsv() {
  const headers = ['employeeId','name','hoursWorked','leaveDeductions','hourlyRate','finalSalary']
  const rows = processed.value.map(r => [
    r.employeeId,
    `"${String(r.name).replace(/"/g,'""')}"`,
    r.hours,
    r.leaveDeductions,
    r.hourlyRate ? r.hourlyRate.toFixed(2) : '',
    r.finalSalary ? r.finalSalary.toFixed(2) : ''
  ].join(','))
  const csv = [headers.join(','), ...rows].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'payroll_export.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function downloadPayslip(row) {
  const emp = employees.find(e => Number(e.employeeId) === Number(row.employeeId))
  const payslipContent = `
PAYSLIP
=====================================
Employee ID: ${row.employeeId}
Name: ${row.name}
Position: ${emp?.position ?? 'N/A'}
Department: ${emp?.department ?? 'N/A'}
Contact: ${emp?.contact ?? 'N/A'}

PAYMENT DETAILS
=====================================
Hours Worked: ${row.hours}
Hourly Rate: R ${row.hourlyRate.toFixed(2)}
Leave Deductions: ${row.leaveDeductions}
Final Salary: R ${row.finalSalary.toLocaleString()}

Generated: ${new Date().toLocaleDateString()}
`
  
  const blob = new Blob([payslipContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `payslip_${row.employeeId}_${row.name.replace(/\s+/g, '_')}.txt`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
</script>


<template>
  <div class="p-6">
    <h1 class="payroll-text">Payroll Processor</h1>
    <br>
    <table class="table">
      <thead>
        <tr class="text-left">
          <th class="p-2 border-b">ID</th>
          <th class="p-2 border-b">Employee</th>
          <th class="p-2 border-b">Hours</th>
          <th class="p-2 border-b">Leave Deductions</th>
          <th class="p-2 border-b">Hourly Rate</th>
          <th class="p-2 border-b">Final Salary</th>
          <th class="p-2 border-b">Action</th>
        </tr>
      </thead>
       <tbody>
        <tr v-for="row in processed" :key="row.employeeId" class="align-top">
          <td class="p-2 border-b">{{ row.employeeId }}</td>
          <td class="p-2 border-b">{{ row.name }}</td>
          <td class="p-2 border-b">{{ row.hours }}</td>
          <td class="p-2 border-b">{{ row.leaveDeductions }}</td>
          <td class="p-2 border-b">{{ row.hourlyRate ? 'R ' + row.hourlyRate.toFixed(2) : '-' }}</td>
          <td class="p-2 border-b">{{ row.finalSalary ? 'R ' + row.finalSalary.toLocaleString() : '-' }}</td>
          <td class="p-2 border-b">
            <button @click="downloadPayslip(row)" class="btn btn-download">Download</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="mb-4">
      <button @click="exportCsv" class="btn btn-primary">Export All as CSV</button>
  </div>
</template>


<style scoped>
.table-auto th, .table-auto td { border: 1px solid #e5e7eb; }
.btn { padding: .5rem 1rem; border-radius: .375rem; cursor: pointer; }

.btn-primary {
  background-color: #2563eb;
  color: white;
  border: none;
}

.btn-download {
  background-color: #10b981;
  color: white;
  border: none;
}

.btn-download:hover {
  background-color: #059669;
}

.table-auto th { background-color: #f9fafb; }

.table {
  width: 100%;
  border-collapse: collapse;
  border: solid 1px #ddd;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>