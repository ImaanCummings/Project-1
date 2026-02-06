import { ref } from 'vue'

const message = ref('')
const type = ref('success')
const visible = ref(false)

export const alertService = {
  showSuccess(msg) {
    message.value = msg
    type.value = 'success'
    visible.value = true
    setTimeout(() => visible.value = false, 3000)
  },

  showError(msg) {
    message.value = msg
    type.value = 'error'
    visible.value = true
    setTimeout(() => visible.value = false, 4000)
  },

  showLoading(msg = 'Loading...') {
    message.value = msg
    type.value = 'loading'
    visible.value = true
  },

  hide() {
    visible.value = false
  },

  message,
  type,
  visible
}

