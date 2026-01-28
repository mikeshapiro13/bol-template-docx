<script setup>
import { ref } from 'vue'
import BOLHeader from './components/BOLHeader.vue'
import BOLTable from './components/BOLTable.vue'
import BOLFooter from './components/BOLFooter.vue'
import { products as initialProducts } from './data/products.js'
import { generateDOCX } from './utils/docxGenerator'

// Initialize products with an 'included' flag and expiration date
const products = ref(initialProducts.map(p => ({ ...p, included: false, quantity: '', expiration: '' })))

const formData = ref({
  date: new Date().toISOString().split('T')[0],
  shipFrom: {
    name: 'MAS',
    address: '2404 NW 32ND ST',
    city: 'BOCA RATON',
    state: 'FL',
    zip: '33431'
  },
  shipTo: {
    name: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  },
  instructions: ''
})

const handlePrint = () => {
  generateDOCX(formData.value, products.value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
    <!-- Toolbar (Hidden on Print) -->
    <div class="max-w-[8.5in] mx-auto mb-6 flex justify-between items-center no-print">
      <h1 class="text-2xl font-bold text-gray-800">BOL Generator</h1>
      <button 
        @click="handlePrint"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
        </svg>
        Generate BOL
      </button>
    </div>

    <!-- Main BOL Container -->
    <div class="bol-container shadow-xl print:shadow-none print:w-full">
      <!-- Header Section -->
      <div class="border-b-2 border-gray-800 mb-6 pb-2">
        <h1 class="text-3xl font-bold uppercase tracking-widest text-center">Bill of Lading</h1>
      </div>

      <BOLHeader 
        v-model:date="formData.date"
        v-model:shipFrom="formData.shipFrom"
        v-model:shipTo="formData.shipTo"
        v-model:instructions="formData.instructions"
      />

      <BOLTable 
        v-model:products="products"
      />

      <BOLFooter />
    </div>
  </div>
</template>
