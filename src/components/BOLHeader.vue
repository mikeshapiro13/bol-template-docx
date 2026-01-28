<script setup>
import { computed, ref, onMounted, watch } from 'vue'

const props = defineProps({
  date: String,
  shipFrom: Object,
  shipTo: Object,
  instructions: String
})

const emit = defineEmits(['update:date', 'update:shipFrom', 'update:shipTo', 'update:instructions'])

const localDate = computed({
  get: () => props.date,
  set: (val) => emit('update:date', val)
})

const localInstructions = computed({
  get: () => props.instructions,
  set: (val) => emit('update:instructions', val)
})

const instructionsRef = ref(null)

const autoExpand = () => {
  if (instructionsRef.value) {
    instructionsRef.value.style.height = 'auto'
    instructionsRef.value.style.height = instructionsRef.value.scrollHeight + 'px'
  }
}

onMounted(() => {
  setTimeout(autoExpand, 0) // Ensure DOM is painted
})

watch(() => props.instructions, () => {
  autoExpand()
})

const updateShipFrom = (field, value) => {
  emit('update:shipFrom', { ...props.shipFrom, [field]: value })
}

const updateShipTo = (field, value) => {
  emit('update:shipTo', { ...props.shipTo, [field]: value })
}
</script>

<template>
  <div class="mb-8 space-y-6">
    <!-- Date & Instructions -->
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
        <label class="block text-sm font-bold text-gray-700 mb-1 uppercase">Instructions</label>
        <textarea 
          ref="instructionsRef"
          v-model="localInstructions"
          rows="1"
          @input="autoExpand"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
          placeholder="Enter any instructions for this BOL..."
        ></textarea>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Ship From Section -->
      <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 class="font-bold text-gray-800 border-b pb-2 mb-4 uppercase">Ship From (Shipper)</h3>
        
        <div>
          <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Name</label>
          <input 
            type="text" 
            :value="shipFrom.name"
            @input="updateShipFrom('name', $event.target.value)"
            class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        
        <div>
          <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Address</label>
          <input 
            type="text" 
            :value="shipFrom.address"
            @input="updateShipFrom('address', $event.target.value)"
            class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <div class="grid grid-cols-6 gap-3">
          <div class="col-span-3">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">City</label>
            <input 
              type="text" 
              :value="shipFrom.city"
              @input="updateShipFrom('city', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="col-span-1">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">ST</label>
            <input 
              type="text" 
              :value="shipFrom.state"
              @input="updateShipFrom('state', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="col-span-2">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Zip</label>
            <input 
              type="text" 
              :value="shipFrom.zip"
              @input="updateShipFrom('zip', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
      </div>

      <!-- Ship To Section -->
      <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 class="font-bold text-gray-800 border-b pb-2 mb-4 uppercase">Ship To (Consignee)</h3>
        
        <div>
          <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Name</label>
          <input 
            type="text" 
            :value="shipTo.name"
            @input="updateShipTo('name', $event.target.value)"
            class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        
        <div>
          <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Address</label>
          <input 
            type="text" 
            :value="shipTo.address"
            @input="updateShipTo('address', $event.target.value)"
            class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <div class="grid grid-cols-6 gap-3">
          <div class="col-span-3">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">City</label>
            <input 
              type="text" 
              :value="shipTo.city"
              @input="updateShipTo('city', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="col-span-1">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">ST</label>
            <input 
              type="text" 
              :value="shipTo.state"
              @input="updateShipTo('state', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="col-span-2">
            <label class="block text-[11px] uppercase font-bold text-gray-500 mb-1">Zip</label>
            <input 
              type="text" 
              :value="shipTo.zip"
              @input="updateShipTo('zip', $event.target.value)"
              class="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
