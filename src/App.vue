<template>
  <div class="flex justify-center">
    <input type="search" v-model="id" @keypress.enter="runScan(id)"
           class="w-1/2 m-10 p-3 border-2 outline-none"
           placeholder="Search TON addresses, domains and transactions...">
  </div>
  <div class="flex justify-center">
    <ul v-if="result">
      <li v-for="item in result['traces']">
        {{ item }}
      </li>
      <li>
        {{ result['error'] }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue"

let result = ref(null)
let id = ref()
let traces = ref()
let limit = 100

const runScan = (id) => {
  traces = `https://tonapi.io/v2/accounts/${id}/traces?limit=${limit}`
  fetch(traces)
      .then(response => response.json())
      .then(data => result.value = data)
}
</script>
