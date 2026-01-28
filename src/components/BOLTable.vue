<script setup>
import { computed } from 'vue'

const props = defineProps({
  products: Array
})

const emit = defineEmits(['update:products'])

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

const grandTotal = computed(() => {
  return props.products.reduce((acc, curr) => {
    if (curr.included && curr.quantity) {
      return acc + (parseInt(curr.quantity) || 0)
    }
    return acc
  }, 0)
})

defineExpose({ grandTotal })
</script>

<template>
  <div class="mb-8 overflow-x-auto">
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
              type="date"
              :value="product.expiration"
              @input="updateProduct(index, 'expiration', $event.target.value)"
              class="w-full text-center border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            >
            <span v-else class="block text-center text-gray-300">-</span>
          </td>

          <!-- Read-only Data -->
          <td class="border border-gray-300 px-4 py-1 font-mono text-xs">{{ product.code }}</td>
          <td class="border border-gray-300 px-4 py-1 font-medium">{{ product.description }}</td>
          
          <td class="border border-gray-300 px-4 py-1 font-mono text-xs text-gray-500">{{ product.canUpc }}</td>
          <td class="border border-gray-300 px-4 py-1 font-mono text-xs text-gray-500">{{ product.caseUpc }}</td>
        </tr>
      </tbody>
      <tfoot>
          <tr class="bg-gray-800 text-white font-bold">
              <td class="border border-gray-800 px-2 py-2 text-right uppercase text-xs">Total:</td>
              <td class="border border-gray-800 px-2 py-2 text-center text-sm">{{ grandTotal }} Pallets</td>
              <td class="border border-gray-800 px-2 py-2 text-center text-sm">
                {{ products.reduce((acc, curr) => acc + (curr.included ? (parseInt(curr.quantity) || 0) * (curr.casesPerPallet || 0) : 0), 0) }} Cases
              </td>
              <td colspan="5" class="border border-gray-800 px-4 py-2"></td>
          </tr>
      </tfoot>
    </table>
  </div>
</template>
