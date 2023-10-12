<template>
  <div class="flex justify-center">
    <input type="search" v-model="ton" @keypress.enter="fetchData()"
           class="w-1/2 m-10 p-3 border-2 outline-none"
           placeholder="Search TON addresses, domains and transactions...">
  </div>
  <div class="relative overflow-x-auto">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead v-if="isOk" class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">
          timestamp
        </th>
        <th scope="col" class="px-6 py-3">
          recipient
        </th>
        <th scope="col" class="px-6 py-3">
          sender
        </th>
        <th scope="col" class="px-6 py-3">
          amount
        </th>
        <th scope="col" class="px-6 py-3">
          status
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="dataBeta" v-for="(item, i) in dataBeta['result']" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td class="px-6 py-4 whitespace-nowrap">
          {{ timestamp[i] }}
        </td>
        <td class="px-6 py-4">
          {{ recipient[i] }}
        </td>
        <td class="px-6 py-4">
          {{ sender[i] }}
        </td>
        <td class="px-6 py-4">
          {{ amount[i] }}
        </td>
        <td class="px-6 py-4">
          {{ status[i] }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// let data = ref()
let ton = null
let limit = 50
let dataBeta = ref()
let timestamp = ref([])
let recipient = ref([])
let sender = ref([])
let amount = ref([])
let status = ref([])
let isOk = ref(null)

const fetchData = async () => {
  const urlAlfa = `https://tonapi.io/v2/blockchain/accounts/${ton}/transactions?limit=${limit}`
  const responseAlfa = await fetch(urlAlfa)
  const dataAlfa = await responseAlfa.json()
  const accountAddress = dataAlfa['transactions'][0]['account']['address']

  const urlBeta = `https://toncenter.com/api/v2/getTransactions?address=${accountAddress}&limit=${limit}&to_lt=0&archival=false`
  const responseBeta = await fetch(urlBeta)
  dataBeta = await responseBeta.json()

  isOk.value = dataBeta['ok']
  await getData(dataBeta)
}

const getData = async (dataBeta) => {
  dataBeta['result'].forEach(item => {
    // timestamp
    let timestampTemp = new Date(item['utime'] * 1000)
    let month = timestampTemp.toLocaleString('en', { month: 'short' })
    let day = timestampTemp.getDate()
    let hours = timestampTemp.getHours()
    let minutes = (timestampTemp.getMinutes() < 10 ? '0' : '') + timestampTemp.getMinutes()
    timestamp.value.push(`${day} ${month}, ${hours}:${minutes}`)

    // recipient, sender, amount, status
    if (item['in_msg']['source'] === '') {
      let recipientTemp = item['out_msgs'][0]['destination']
      let senderTemp = item['out_msgs'][0]['source']
      let amountTemp = item['out_msgs'][0]['value'] / 1000000000
      recipient.value.push(recipientTemp)
      sender.value.push(senderTemp)
      amount.value.push(amountTemp)
      status.value.push('in')
    } else if (item['in_msg']['source'] !== '') {
      let recipientTemp = item['in_msg']['destination']
      let senderTemp = item['in_msg']['source']
      let amountTemp = item['in_msg']['value'] / 1000000000
      recipient.value.push(recipientTemp)
      sender.value.push(senderTemp)
      amount.value.push(amountTemp)
      status.value.push('out')
    }
  })
}
</script>
