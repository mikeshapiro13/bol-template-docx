<script setup>
import { computed } from 'vue'

const props = defineProps({
  date: String,
  poNumber: String,
  supplier: Object,
  buyer: Object
})

const emit = defineEmits(['update:date', 'update:poNumber', 'update:supplier', 'update:buyer'])

const localDate = computed({
  get: () => props.date,
  set: (val) => emit('update:date', val)
})

const localPoNumber = computed({
  get: () => props.poNumber,
  set: (val) => emit('update:poNumber', val)
})

const updateSupplier = (field, value) => {
  emit('update:supplier', { ...props.supplier, [field]: value })
}

const updateBuyer = (field, value) => {
  emit('update:buyer', { ...props.buyer, [field]: value })
}
</script>

<template>
  <div class="mb-8 space-y-6">
    <!-- Date & PO Number -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1 uppercase">Date</label>
        <input
          type="date"
          v-model="localDate"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1 uppercase">PO Number</label>
        <input
          type="text"
          v-model="localPoNumber"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter PO number..."
        >
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Supplier Section -->
      <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 class="font-bold text-gray-800 border-b pb-2 mb-4 uppercase">Supplier</h3>

        <div>
          <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Name</label>
          <input
            type="text"
            :value="supplier.name"
            @input="updateSupplier('name', $event.target.value)"
            class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <div>
          <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Address</label>
          <input
            type="text"
            :value="supplier.address"
            @input="updateSupplier('address', $event.target.value)"
            class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <div class="grid grid-cols-6 gap-3">
          <div class="col-span-3">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">City</label>
            <input
              type="text"
              :value="supplier.city"
              @input="updateSupplier('city', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="col-span-1">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">ST</label>
            <input
              type="text"
              :value="supplier.state"
              @input="updateSupplier('state', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="col-span-2">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Zip</label>
            <input
              type="text"
              :value="supplier.zip"
              @input="updateSupplier('zip', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
      </div>

      <!-- Buyer Section -->
      <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 class="font-bold text-gray-800 border-b pb-2 mb-4 uppercase">Buyer</h3>

        <div>
          <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Name</label>
          <input
            type="text"
            :value="buyer.name"
            @input="updateBuyer('name', $event.target.value)"
            class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <div>
          <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Address</label>
          <input
            type="text"
            :value="buyer.address"
            @input="updateBuyer('address', $event.target.value)"
            class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <div class="grid grid-cols-6 gap-3">
          <div class="col-span-3">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">City</label>
            <input
              type="text"
              :value="buyer.city"
              @input="updateBuyer('city', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="col-span-1">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">ST</label>
            <input
              type="text"
              :value="buyer.state"
              @input="updateBuyer('state', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="col-span-2">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Zip</label>
            <input
              type="text"
              :value="buyer.zip"
              @input="updateBuyer('zip', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
