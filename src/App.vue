<template>
  <div class="flex justify-center">
    <input type="search" v-model="id" @keypress.enter="fetchData(id)"
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
      <tr v-for="(item, i) in result['transactions']" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td class="px-6 py-4 whitespace-nowrap">
          {{ timestamp[i] }}
        </td>
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
let timestamp = ref([])

const fetchData = async (id) => {
  let url = `https://tonapi.io/v2/blockchain/accounts/${id}/transactions?limit=${limit}`
  const response = await fetch(url)
  const data = await response.json()
  result.value = data

  await getTimestamp(data)
}

const getTimestamp = async (data) => {
  for (let i = 0; i <= data['transactions'].length; i++) {
    let temp = new Date(data['transactions'][i]['utime'] * 1000)
    let month = temp.toLocaleString('en', { month: 'short' })
    let day = temp.getDate()
    let hours = temp.getHours()
    let minutes = (temp.getMinutes() < 10 ? '0' : '') + temp.getMinutes()
    let res = `${day} ${month}, ${hours}:${minutes}`
    timestamp.value.push(res)
  }
}
</script>
