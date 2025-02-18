<script setup>
  import { ref } from 'vue'

  // Dynamic values
  const contentString = ref(""); // Reactive state for input
  const bluetoothDevice = ref(undefined)
  const server = ref(undefined)
  const service = ref(undefined)
  const characteristic = ref(undefined)

  // Static values
  const textEncoder = new TextEncoder(); // always utf-8
  const services = ['25b3e394-fdd7-4793-bc26-e99a37356de4']


  const ConnectDevice = async () => {
    try {

      bluetoothDevice.value = await navigator.bluetooth.requestDevice(
        {
          filters: [{
            services: services
          }]
        }
      )
      // Attempts to connect to remote GATT Server.
      server.value = await bluetoothDevice.value.gatt.connect();
      service.value = await server.value.getPrimaryService(services[0])
      characteristic.value = await service.value.getCharacteristic('3d956a6a-c898-4256-b1fa-6659482e9164')
    } catch(err) {
      console.error(err)
    }
  }

  const DisconnectDevice = async () => {
    if (bluetoothDevice.value) {
      bluetoothDevice.value.gatt.disconnect();
      bluetoothDevice.value = null;
    }
  }

  const SendContent = async () => {
    console.log(contentString.value);
    if (!characteristic.value) return;

    const valueToSend = contentString.value;
    console.log('Sending: ' + valueToSend);
    characteristic.value.writeValue(textEncoder.encode(valueToSend));
    console.log('Send succesfully');
  }

  const SendBackspace = async () => {
    if (!characteristic.value) return;

    console.log('Sending: Backspace')
    characteristic.value.writeValue(Uint8Array.of(0x08));
    console.log('Send succesfully')
  }

  const SendClipboard = async () => {
    if (!characteristic.value) return;

    const valueToSend = await navigator.clipboard.readText()
    if (valueToSend) {
      console.log('Sending clipboard content: ' + valueToSend)
      characteristic.value.writeValue(textEncoder.encode(valueToSend))
      console.log('Send succesfully')
    }
  }
</script>

<template>
  <main>
    <div>
      <h1>
        Bluetooth Text Typer
      </h1>
      <button v-if="!characteristic" @click="ConnectDevice" >Connect</button>
      <button v-if="characteristic" @click="DisconnectDevice">Disconnect</button>
    </div>
    
    <div class="TextTyperWrapper">
      <textarea v-model="contentString"
        id="valueField" 
        class="TextTyperArea"
        placeholder="Paste or type here" 
        style="width: 500px;height: 400px;"></textarea>

      <div class="TextTyperActions" v-if="characteristic">
        <button @click="SendContent">Send</button>
        <button @click="SendBackspace">Backspace</button>
        <button @click="SendClipboard">Paste</button>
      </div>

    </div>

  </main>
</template>
