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
    if (bluetoothDevice.value) bluetoothDevice.value.gatt.disconnect();
  }

  const SendContent = async () => {
    console.log(contentString.value);
    if (!characteristic.value) return;

    const valueToSend = contentString.value;
    console.log('Sending: ' + valueToSend);
    characteristic.writeValue(textEncoder.encode(valueToSend));
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




<style scoped>

  .TextTyperWrapper {
    width: fit-content;
  }

  .TextTyperArea {
    padding: .5em;
    background: #1f1f1f;
    border-radius: .3em;
    color: var(--color-text);

  }
  .TextTyperArea:focus {
    outline: none !important;
    border:1px solid var(--color-theme-bright);
  }


  .TextTyperActions {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  button {
    color: var(--color-text);
    background: #1f1f1f;
    border: 1px solid var(--color-text);
    border-radius: .3em;
    padding: .5em;
    margin: .5em;

    transition: background-color .2s, color .2s, transform .2s linear; 

  }

  button:hover {
    text-decoration: none;
    color: var(--color-theme-bright);
    background: var(--color-theme-dark);
    border: 1px solid var(--color-theme-bright);
    transition: 0.4s;
    cursor: pointer;
    transform: scale(1.1);
  }


</style>
