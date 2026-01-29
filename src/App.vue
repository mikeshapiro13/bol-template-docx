<script setup>
import { ref, watch } from 'vue'
import BOLHeader from './components/BOLHeader.vue'
import BOLTable from './components/BOLTable.vue'
import BOLFooter from './components/BOLFooter.vue'
import { productCatalogs } from './data/products.js'
import { generateDOCX } from './utils/docxGenerator'

// State for the selected catalog
const catalogNames = Object.keys(productCatalogs)
const selectedCatalog = ref('Monster')

// Initialize products with an 'included' flag and expiration date
const products = ref(productCatalogs[selectedCatalog.value].map(p => ({ ...p, included: false, quantity: '', expiration: '' })))

// Update products when catalog changes
watch(selectedCatalog, (newCatalog) => {
  products.value = productCatalogs[newCatalog].map(p => ({ ...p, included: false, quantity: '', expiration: '' }))
})

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
  generateDOCX(formData.value, products.value, selectedCatalog.value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
    <!-- Toolbar (Hidden on Print) -->
    <div class="max-w-[8.5in] mx-auto mb-6 flex flex-col gap-4 no-print">
      <div class="flex justify-between items-center">
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

      <!-- Catalog Selector -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
        <label for="catalog-select" class="font-semibold text-gray-700">Select Product Catalog:</label>
        <select 
          id="catalog-select" 
          v-model="selectedCatalog"
          class="flex-1 max-w-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="name in catalogNames" :key="name" :value="name">
            {{ name }}
          </option>
        </select>
        <span class="text-sm text-gray-500 italic">Switching catalogs will reset current selections.</span>
      </div>
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
