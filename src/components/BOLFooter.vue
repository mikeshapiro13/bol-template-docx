<script setup>
</script>

<template>
  <div class="mt-8 border-t-[0.5px] border-gray-400 pt-4 text-[11px] font-normal text-gray-800">
    <div class="mb-6">
      <p class="text-justify leading-tight">
        If this shipment is to be delivered to the consignee without recourse on the consignor, the consignor shall sign the following statement: The carrier
        shall not make delivery of this shipment without payment of freight and all other lawful charges.
      </p>
      <div class="flex gap-12 mt-6">
        <div class="flex-1">
          <div class="border-b-[0.5px] border-gray-400 h-6"></div>
          <label class="uppercase mt-1 block">(Signature of Shipper)</label>
        </div>
        <div class="flex-1">
          <div class="border-b-[0.5px] border-gray-400 h-6"></div>
          <label class="uppercase mt-1 block">(Signature of Receiver)</label>
        </div>
      </div>
    </div>

    <div class="mt-10 space-y-6">
      <!-- Carrier Line -->
      <div>
        <div class="border-b-[0.5px] border-gray-400 h-6"></div>
        <label class="uppercase block mb-1">Carrier</label>
      </div>

      <!-- Driver and Date Line -->
      <div class="flex gap-12">
        <div class="flex-[3]">
          <div class="border-b-[0.5px] border-gray-400 h-6"></div>
          <label class="uppercase mt-1 block">Driver Signature</label>
        </div>
        <div class="flex-1">
          <div class="border-b-[0.5px] border-gray-400 h-6"></div>
          <label class="uppercase mt-1 block">Date</label>
        </div>
      </div>
    </div>
  </div>
</template>
