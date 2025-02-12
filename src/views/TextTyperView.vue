<script setup lang="ts">
  import { ref } from 'vue'

  // Dynamic values
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

</script>

<template>
  <main>
    <div>
      <h1>
        Bluetooth Text Typer
      </h1>
      <button @click="ConnectDevice" >Connect</button>

      <button>Disconnect</button>
    </div>
    
    <div class="TextTyperWrapper">
      <textarea 
        id="valueField" 
        class="TextTyperArea green"
        placeholder="Paste or type here" 
        style="width: 500px;height: 400px;"></textarea>

      <div class="TextTyperActions">
        <button>Send</button>
        <button>Backspace</button>
        <button>Paste</button>
      </div>

    </div>

  </main>
</template>

<style scoped>

  .TextTyperWrapper {
    width: fit-content;
  }

  .TextTyperArea {
    background: transparent;
    border-radius: .3em;
  }

  .TextTyperActions {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  button {
    color: var(--color-text);
    background: black;
    border: 1px solid var(--color-text);
    border-radius: .3em;
    padding: .5em;
    margin: .5em;
  }

  button:hover {
    text-decoration: none;
    color: hsla(160, 100%, 37%, 1);
    background: hsla(160, 100%, 10%, 1);
    border: 1px solid hsla(160, 100%, 37%, 1);
    transition: 0.4s;
    cursor: pointer;
  }


</style>
