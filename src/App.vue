<script setup>
import { computed, onMounted, ref } from 'vue'
import BOLView from './views/BOLView.vue'
import POView from './views/POView.vue'
import * as catalogClient from './api/catalogClient'

const productCatalogs = ref({})
const loadingCatalogs = ref(true)
const loadError = ref('')
const activeView = ref('bol')

const catalogNames = computed(() => Object.keys(productCatalogs.value))

const loadCatalogs = async () => {
  loadingCatalogs.value = true
  loadError.value = ''
  try {
    productCatalogs.value = await catalogClient.fetchCatalogs()
  } catch (error) {
    loadError.value = error.message || 'Unable to load product catalogs.'
  } finally {
    loadingCatalogs.value = false
  }
}

onMounted(loadCatalogs)
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4 print:p-0 print:bg-white">
    <!-- Tab Bar (Hidden on Print) -->
    <div class="max-w-[8.5in] mx-auto mb-4 flex gap-2 no-print">
      <button
        @click="activeView = 'bol'"
        :class="activeView === 'bol' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
        class="px-4 py-2 rounded font-semibold border border-gray-200 shadow-sm transition-colors"
      >
        Bill of Lading
      </button>
      <button
        @click="activeView = 'po'"
        :class="activeView === 'po' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
        class="px-4 py-2 rounded font-semibold border border-gray-200 shadow-sm transition-colors"
      >
        Purchase Order
      </button>
    </div>

    <div v-if="loadError" class="max-w-[8.5in] mx-auto mb-4 bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm no-print">
      {{ loadError }}
    </div>

    <BOLView
      v-show="activeView === 'bol'"
      :product-catalogs="productCatalogs"
      :catalog-names="catalogNames"
      :loading-catalogs="loadingCatalogs"
    />
    <POView
      v-show="activeView === 'po'"
      :product-catalogs="productCatalogs"
      :catalog-names="catalogNames"
      :loading-catalogs="loadingCatalogs"
    />
  </div>
</template>
