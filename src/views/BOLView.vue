<script setup>
import { ref, watch } from 'vue'
import BOLHeader from '../components/BOLHeader.vue'
import BOLTable from '../components/BOLTable.vue'
import BOLFooter from '../components/BOLFooter.vue'
import { generateDOCX } from '../utils/docxGenerator'
import { hydrateProducts } from '../utils/products'
import * as catalogClient from '../api/catalogClient'

const props = defineProps({
  productCatalogs: Object,
  catalogNames: Array,
  loadingCatalogs: Boolean
})

const selectedCatalog = ref('Monster')
const products = ref([])
const tableRef = ref(null)
const catalogError = ref('')
const savingCatalog = ref(false)

watch(() => props.loadingCatalogs, (isLoading) => {
  if (isLoading) return
  if (!props.productCatalogs[selectedCatalog.value]) {
    selectedCatalog.value = props.catalogNames[0] || ''
  }
  products.value = hydrateProducts(props.productCatalogs[selectedCatalog.value])
}, { immediate: true })

watch(selectedCatalog, (newCatalog) => {
  products.value = hydrateProducts(props.productCatalogs[newCatalog])
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

const addCatalogProduct = async (product) => {
  if (!selectedCatalog.value) return

  savingCatalog.value = true
  catalogError.value = ''
  try {
    const savedProduct = await catalogClient.addCatalogProduct(selectedCatalog.value, product)
    props.productCatalogs[selectedCatalog.value] = [
      ...(props.productCatalogs[selectedCatalog.value] || []),
      savedProduct
    ]
    products.value = [...products.value, { ...savedProduct, included: false, quantity: '', expiration: '' }]
    tableRef.value?.resetAddForm()
  } catch (error) {
    catalogError.value = error.message || 'Unable to add product.'
  } finally {
    savingCatalog.value = false
  }
}

const deleteCatalogProduct = async (index) => {
  if (!selectedCatalog.value) return

  savingCatalog.value = true
  catalogError.value = ''
  try {
    await catalogClient.deleteCatalogProduct(selectedCatalog.value, index)
    props.productCatalogs[selectedCatalog.value] = (props.productCatalogs[selectedCatalog.value] || [])
      .filter((_, productIndex) => productIndex !== index)
    products.value = products.value.filter((_, productIndex) => productIndex !== index)
  } catch (error) {
    catalogError.value = error.message || 'Unable to delete product.'
  } finally {
    savingCatalog.value = false
  }
}
</script>

<template>
  <div>
    <!-- Toolbar (Hidden on Print) -->
    <div class="max-w-[8.5in] mx-auto mb-6 flex flex-col gap-4 no-print">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">BOL Generator</h1>
        <button
          @click="handlePrint"
          :disabled="loadingCatalogs"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded shadow transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" />
          </svg>
          Generate BOL
        </button>
      </div>

      <!-- Catalog Selector -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
        <label for="bol-catalog-select" class="font-semibold text-gray-700">Select Product Catalog:</label>
        <select
          id="bol-catalog-select"
          v-model="selectedCatalog"
          :disabled="loadingCatalogs || savingCatalog"
          class="flex-1 max-w-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="name in catalogNames" :key="name" :value="name">
            {{ name }}
          </option>
        </select>
        <span class="text-sm text-gray-500 italic">Switching catalogs will reset current selections.</span>
      </div>
      <div v-if="catalogError" class="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
        {{ catalogError }}
      </div>
    </div>

    <!-- Main BOL Container -->
    <div class="doc-container shadow-xl print:shadow-none print:w-full">
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
        ref="tableRef"
        v-model:products="products"
        :catalog-error="catalogError"
        :saving-catalog="savingCatalog"
        @add-product="addCatalogProduct"
        @delete-product="deleteCatalogProduct"
      />

      <BOLFooter />
    </div>
  </div>
</template>
