<template>
  <div class="flex justify-center">
    <input type="search" v-model="id" @keypress.enter="runScan(id)"
           class="w-1/2 m-10 p-3 border-2 outline-none"
           placeholder="Search TON addresses, domains and transactions...">
  </div>
  <div class="relative overflow-x-auto">
    <table v-if="result" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead v-if="!result['error']" class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">
          timestamp
        </th>
        <th scope="col" class="px-6 py-3">
          hash
        </th>
        <th scope="col" class="px-6 py-3">
          address
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in result['transactions']" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {{ item['utime'] }}
        </th>
        <td class="px-6 py-4">
          {{ item['hash'] }}
        </td>
        <td class="px-6 py-4">
          {{ item['account']['address'] }}
        </td>
      </tr>
      </tbody>
      <p v-if="result['error']" class="flex justify-center">
        {{ result['error'] }}
      </p>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

let result = ref(null)
let id = ref()
let limit = 50

const runScan = async (id) => {
  let url = `https://tonapi.io/v2/blockchain/accounts/${id}/transactions?limit=${limit}`
  const response = await fetch(url)
      .then(response => response.json())
      .then(data => result.value = data)
}
</script>
