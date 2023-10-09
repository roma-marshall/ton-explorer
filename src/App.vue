<template>
  <div class="flex justify-center">
    <input type="search" v-model="id" @keypress.enter="fetchData(id)"
           class="w-1/2 m-10 p-3 border-2 outline-none"
           placeholder="Search TON addresses, domains and transactions...">
  </div>
<!--  {{ error }}-->
  <div class="relative overflow-x-auto">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead v-if="data && !error" class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
      <tr v-if="data" v-for="(item, i) in data['transactions']" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td class="px-6 py-4 whitespace-nowrap">
          {{ timestamp[i] }}
        </td>
        <td class="px-6 py-4">
          {{ hash[i] }}
        </td>
        <td class="px-6 py-4">
          {{ address[i] }}
        </td>
      </tr>
      </tbody>
      <p v-if="error" class="flex justify-center">
        {{ error }}
      </p>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

let data = ref()
let id = ref()
let limit = 50
let timestamp = ref([])
let hash = ref([])
let error = ref(null)
let address = ref([])

const fetchData = async (id) => {
  let url = `https://tonapi.io/v2/blockchain/accounts/${id}/transactions?limit=${limit}`
  const response = await fetch(url)
  data = await response.json()
  error.value = data['error']
  await getData(data)
}

const getData = async (data) => {
    data['transactions'].forEach(item => {
      // timestamp
      let timestampTemp = new Date(item['utime'] * 1000)
      let month = timestampTemp.toLocaleString('en', { month: 'short' })
      let day = timestampTemp.getDate()
      let hours = timestampTemp.getHours()
      let minutes = (timestampTemp.getMinutes() < 10 ? '0' : '') + timestampTemp.getMinutes()
      timestamp.value.push(`${day} ${month}, ${hours}:${minutes}`)

      // hash
      hash.value.push(item['hash'])

      // address
      address.value.push(item['account']['address'])
    })
}
</script>
