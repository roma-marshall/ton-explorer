<template>
  <div class="flex justify-center">
    <input type="search" v-model="ton" @keypress.enter="fetchData()"
           class="w-1/2 m-10 p-3 border-2 outline-none"
           placeholder="Search TON addresses, domains and transactions...">
  </div>
  <div class="relative overflow-x-auto">
    <div v-if="isOk"
         class="hidden lg:grid grid-cols-12 text-xs bg-gray-50 text-gray-700 uppercase font-bold">
      <div class="lg:px-6 px-1.5 py-3">
        timestamp
      </div>
      <div class="lg:px-6 px-1.5 py-3">
        status
      </div>
      <div class="lg:px-6 px-1.5 py-3 grid col-start-4 col-end-7">
        from
      </div>
      <div class="lg:px-6 px-1.5 py-3 grid col-start-8 col-end-12">
        to
      </div>
      <div class="flex justify-end lg:px-6 px-1.5 py-3">
        amount
      </div>
    </div>
    <div v-if="dataBeta" v-for="(item, i) in dataBeta['transactions']"
         class="grid grid-cols-3 lg:grid-cols-12 text-sm bg-white border-b">
      <div class="lg:px-6 px-1.5 py-4 whitespace-nowrap">
        {{ timestamp[i] }}
      </div>
      <div class="lg:px-6 px-1.5 py-4">
        <span class="flex">
          <In v-if="status[i] === 'in'" class="w-6 h-6 mr-2 -mt-0.5" />
          <Out v-if="status[i] === 'out'" class="w-6 h-6 mr-2 -mt-0.5" />
          <span class="text-right uppercase">{{ status[i] }}</span>
        </span>
      </div>
      <div class="lg:px-6 px-1.5 py-4 hidden lg:grid lg:col-start-4 lg:col-end-7">
        {{ sender[i] }}
      </div>
      <div class="lg:px-6 px-1.5 py-4 grid order-last lg:order-none lg:col-start-8 lg:col-end-12">
        {{ recipient[i] }}
      </div>
      <div class="flex justify-end lg:px-6 px-1.5 py-4 text-right font-semibold">
        <span v-if="status[i] == 'out'" class="text-in">-&nbsp;{{ amount[i] }}&nbsp;TON</span>
        <span v-if="status[i] == 'in'" class="text-out">+&nbsp;{{ amount[i] }}&nbsp;TON</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import In from './assets/in.svg'
import Out from './assets/out.svg'

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
  const urlBeta = `https://tonapi.io/v2/blockchain/accounts/${ton}/transactions?limit=${limit}`
  const responseBeta = await fetch(urlBeta)
  dataBeta = await responseBeta.json()

  if (dataBeta)
      isOk.value = true

  await getData(dataBeta)
}

const getData = async (dataBeta) => {
  dataBeta['transactions'].forEach(item => {
    // timestamp
    let timestampTemp = new Date(item['utime'] * 1000)
    let month = timestampTemp.toLocaleString('en', {month: 'short'})
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
      status.value.push('out')
    } else if (item['in_msg']['source'] !== '') {
      let recipientTemp = item['in_msg']['destination']
      let senderTemp = item['in_msg']['source']
      let amountTemp = item['in_msg']['value'] / 1000000000
      recipient.value.push(recipientTemp)
      sender.value.push(senderTemp)
      amount.value.push(amountTemp)
      status.value.push('in')
    }
  })
}
</script>
