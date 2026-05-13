<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  products: Array,
  catalogError: String,
  savingCatalog: Boolean
})

const emit = defineEmits(['update:products', 'add-product', 'delete-product'])

const showAddForm = ref(false)

const newProduct = ref({
  code: '',
  description: '',
  canUpc: '',
  caseUpc: '',
  casesPerPallet: 0
})

const updateProduct = (index, field, value) => {
  const newProducts = [...props.products]
  newProducts[index] = { ...newProducts[index], [field]: value }
  emit('update:products', newProducts)
}

const toggleInclude = (index) => {
  const newProducts = [...props.products]
  newProducts[index] = { ...newProducts[index], included: !newProducts[index].included }
  
  // Default quantity to 1 if checked and empty
  if (newProducts[index].included && !newProducts[index].quantity) {
    newProducts[index].quantity = '1'
  }
  
  emit('update:products', newProducts)
}

const addProduct = () => {
  emit('add-product', { ...newProduct.value })
}

const resetAddForm = () => {
  newProduct.value = {
    code: '',
    description: '',
    canUpc: '',
    caseUpc: '',
    casesPerPallet: 0
  }
  showAddForm.value = false
}

const deleteProduct = (index) => {
  emit('delete-product', index)
}

const grandTotal = computed(() => {
  return props.products.reduce((acc, curr) => {
    if (curr.included && curr.quantity) {
      return acc + (parseInt(curr.quantity) || 0)
    }
    return acc
  }, 0)
})

defineExpose({ grandTotal, resetAddForm })
</script>

<template>
  <div class="mb-8">
    <div v-if="catalogError" class="mb-4 bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
      {{ catalogError }}
    </div>
    <div class="mb-4">
      <button
        @click="showAddForm = !showAddForm"
        :disabled="savingCatalog"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Add Product
      </button>
    </div>
    <div v-if="showAddForm" class="mb-4 p-4 border border-gray-300 rounded bg-gray-50">
      <form @submit.prevent="addProduct" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="newProduct.code" placeholder="Code" required class="border border-gray-300 rounded px-3 py-2">
        <input v-model="newProduct.description" placeholder="Description" required class="border border-gray-300 rounded px-3 py-2">
        <input v-model="newProduct.canUpc" placeholder="Can UPC" class="border border-gray-300 rounded px-3 py-2">
        <input v-model="newProduct.caseUpc" placeholder="Case UPC" class="border border-gray-300 rounded px-3 py-2">
        <input v-model.number="newProduct.casesPerPallet" placeholder="Cases per Pallet" required class="border border-gray-300 rounded px-3 py-2">
        <button
          type="submit"
          :disabled="savingCatalog"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed col-span-1 md:col-span-2"
        >
          {{ savingCatalog ? 'Saving...' : 'Add Product' }}
        </button>
      </form>
    </div>
    <table class="min-w-full border-collapse border border-gray-300 text-sm">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2 w-16 text-center">Include</th>
          <th class="border border-gray-300 px-4 py-2 w-24 text-center">Pallets</th>
          <th class="border border-gray-300 px-4 py-2 text-center w-24">Cases</th>
          <th class="border border-gray-300 px-4 py-2 text-center w-32">Expiration</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Code</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Description</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Can UPC</th>
          <th class="border border-gray-300 px-4 py-2 text-left">Case UPC</th>
          <th class="border border-gray-300 px-4 py-2 w-16 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="index" :class="{'bg-blue-50': product.included}">
          <!-- Include Checkbox -->
          <td class="border border-gray-300 px-4 py-1 text-center">
            <input 
              type="checkbox" 
              :checked="product.included"
              @change="toggleInclude(index)"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
          </td>

          <!-- Quantity Input -->
          <td class="border border-gray-300 px-2 py-1">
            <input 
              v-if="product.included"
              type="number"
              min="0"
              :value="product.quantity"
              @input="updateProduct(index, 'quantity', $event.target.value)"
              class="w-full text-center border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0"
            >
            <span v-else class="block text-center text-gray-300">-</span>
          </td>

          <!-- Total Cases Column -->
          <td class="border border-gray-300 px-4 py-1 text-center font-bold">
            {{ product.included ? (parseInt(product.quantity) || 0) * (product.casesPerPallet || 0) : '-' }}
          </td>

          <!-- Expiration Date Column -->
          <td class="border border-gray-300 px-2 py-1">
            <input 
              v-if="product.included"
              type="text"
              :value="product.expiration"
              @input="updateProduct(index, 'expiration', $event.target.value)"
              class="w-full text-center border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              placeholder="MM/DD/YY"
            >
            <span v-else class="block text-center text-gray-300">-</span>
          </td>

          <!-- Read-only Data -->
          <td class="border border-gray-300 px-4 py-1 font-mono text-xs">{{ product.code }}</td>
          <td class="border border-gray-300 px-4 py-1 font-medium">{{ product.description }}</td>
          
          <td class="border border-gray-300 px-4 py-1 font-mono text-xs text-gray-500">{{ product.canUpc }}</td>
          <td class="border border-gray-300 px-4 py-1 font-mono text-xs text-gray-500">{{ product.caseUpc }}</td>
          <!-- Actions -->
          <td class="border border-gray-300 px-4 py-1 text-center">
            <button
              @click="deleteProduct(index)"
              :disabled="savingCatalog"
              class="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed text-xl"
            >
              &times;
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
          <tr class="bg-gray-800 text-white font-bold">
              <td class="border border-gray-800 px-2 py-2 text-right uppercase text-xs">Total:</td>
              <td class="border border-gray-800 px-2 py-2 text-center text-sm">{{ grandTotal }} Pallets</td>
              <td class="border border-gray-800 px-2 py-2 text-center text-sm">
                {{ products.reduce((acc, curr) => acc + (curr.included ? (parseInt(curr.quantity) || 0) * (curr.casesPerPallet || 0) : 0), 0) }} Cases
              </td>
              <td colspan="6" class="border border-gray-800 px-4 py-2"></td>
          </tr>
      </tfoot>
    </table>
  </div>
</template>
