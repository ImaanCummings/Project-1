<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { api } from '../services/api';

    const form = ref({
        employeeId: '',
        reviewText: ''
    });

    const employees = ref([]);
    const reviews = ref([]);
    const loading = ref(false);

    const isFormValid = computed(() => {
        return String(form.value.employeeId).trim() !== '' && form.value.reviewText.trim() !== '';
    });

    async function loadData() {
        try {
            const [employeeList, reviewList] = await Promise.all([
                api.getEmployees(),
                api.getReviews()
            ]);
            employees.value = Array.isArray(employeeList) ? employeeList : [];
            reviews.value = Array.isArray(reviewList) ? reviewList : [];
        } catch (error) {
            console.error('Failed to load reviews:', error);
        }
    }

    const addReview = async () => {
        if (!isFormValid.value) return;
        const employee = employees.value.find(e => String(e.employee_id) === String(form.value.employeeId));
        if (!employee) return;

        loading.value = true;
        try {
            await api.addReview({
                employee_id: Number(form.value.employeeId),
                name: employee.name,
                review: form.value.reviewText
            });
            await loadData();
            form.value.employeeId = '';
            form.value.reviewText = '';
        } catch (error) {
            console.error('Failed to submit review:', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(loadData);
</script>

<template>
    <div class="form-container">
        <div class="form-box">
            <h1 class="heading">Employee Review</h1>
            <div class="mb-3">
                <label for="employeeName" class="form-label">Select Employee Name</label>
                <select v-model="form.employeeId" id="employeeName" class="form-select"> 
                    <option value="">Select</option>
                    <option v-for="emp in employees" :key="emp.employee_id" :value="emp.employee_id">
                      {{ emp.name }}
                    </option>
                </select>
            </div>

            <div class="mb-3">
                <label for="reviewTextarea" class="form-label">Review</label>
                <textarea v-model="form.reviewText" id="reviewTextarea" class="form-control" rows="3"></textarea>
            </div>

            <button @click="addReview" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Submitting...' : 'Submit Review' }}
            </button>
        </div>
    </div>

    <div class="review-table">
        <table class="table table-bordered border-primary">
            <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Review</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(review, idx) in reviews" :key="`${review.employee_id}-${idx}`"> 
                    <td>{{ review.name }}</td>
                    <td>{{ review.review }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
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
