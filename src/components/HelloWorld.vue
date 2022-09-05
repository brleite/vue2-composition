<script setup>
import useCount from '@/composables/count';
import { ref, onMounted, computed } from 'vue';
defineProps({
  msg: {
    type: String,
    required: true,
  },
});

const consoleOutput = ref();
function log(msg) {
  if (consoleOutput.value) {
    consoleOutput.value.innerText = `${consoleOutput.value.innerText}\n${msg}`;
  }
  console.log(msg);
}

const { mudarContando, labelContando, counter, doubleCount } = useCount();
const position = ref(null);
const positionStr = computed(() => {
  /* log('computed'); */
  /* log(position.value); */
  // log(JSON.stringify(position.value.coords));

  return JSON.stringify(position.value);
});
const navigatorGeolocation = ref(false);

function getLocation() {
  log('getLocation');
  if (navigator.geolocation) {
    navigatorGeolocation.value = true;
    log('navigator.geolocation');
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    log('geolocation não encontrado');
  }
}

function showPosition(pos) {
  log('showPosition');
  /* log(pos); */
  position.value = pos;
}

const torchSupported = ref(false);
const torch = ref(false);
const track = ref(null);
const labelFlash = computed(() => {
  if (torchSupported.value) {
    if (torch.value) return 'Desligar flash';
    else return 'Ligar flash';
  } else {
    return 'Flash desabilitado';
  }
});

const flashInterval = ref(null);
const flashIntervalFlag = ref(false);
const flashFlag = ref(false);

function flashIntervalClick() {
  flashIntervalFlag.value = !flashIntervalFlag.value;
  if (!flashIntervalFlag.value) {
    clearInterval(flashInterval.value);
    if (torch.value) {
      flash();
    }
  } else {
    flashInterval.value = setInterval(() => {
      flash();
    }, 200);
  }
}

function flashClick() {
  flashFlag.value = !flashFlag.value;
  flash();
}

function flash() {
  try {
    track.value.applyConstraints({
      advanced: [
        {
          torch: (torch.value = !torch.value),
        },
      ],
    });
  } catch (err) {
    log(err);
  }
}

function configuraFlash() {
  //Test browser support
  const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;

  if (SUPPORTS_MEDIA_DEVICES) {
    log('mediaDevices');
    //Get the environment camera (usually the second one)
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        log('enumerateDevices');
        const cameras = devices.filter(
          (device) => device.kind === 'videoinput'
        );

        if (cameras.length === 0) {
          log('No camera found on this device.');
        }
        const camera = cameras[cameras.length - 1];

        // Create stream and get video track
        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: camera.deviceId,
              facingMode: [/* 'user',  */ 'environment'],
              /* height: { ideal: 1080 },
              width: { ideal: 1920 }, */
            },
          })
          .then((stream) => {
            log('stream');
            track.value = stream.getVideoTracks()[0];
            log('track');

            //Create image capture object and get camera capabilities
            const imageCapture = new ImageCapture(track.value);
            imageCapture
              .getPhotoCapabilities()
              .then((capabilities) => {
                log('capabilities');
                torchSupported.value =
                  !!capabilities.torch ||
                  ('fillLightMode' in capabilities &&
                    capabilities.fillLightMode.length != 0 &&
                    capabilities.fillLightMode != 'none');

                if (torchSupported.value) {
                  log('torch supported');
                } else {
                  log('No torch found');
                }
              })
              .catch(log);
          })
          .catch(log);
      })
      .catch(log);

    //The light will be on as long the track exists
  }
}

onMounted(() => {
  log('onMounted');
  getLocation();
  configuraFlash();
});
</script>

<template>
  <div class="greetings">
    <!-- <h1 class="green">{{ msg }}</h1> -->
    <!-- <h3>
      You’ve successfully created a project with
      <a target="_blank" href="https://vitejs.dev/">Vite</a> +
      <a target="_blank" href="https://v2.vuejs.org/">Vue 2</a>.
    </h3> -->
    <h4>{{ `Contador: ${counter}` }}</h4>
    <h4>{{ `Dobro do contador: ${doubleCount}` }}</h4>
    <h4>{{ `Navigator Geolocation: ${navigatorGeolocation}` }}</h4>
    <h4>{{ `Latitude: ${position?.coords?.latitude}` }}</h4>
    <h4>{{ `Longitude: ${position?.coords?.longitude}` }}</h4>
    <h4>{{ `Acurácia: ${position?.coords?.accuracy}` }}</h4>
    <h4>{{ `Objeto position: ${position}` }}</h4>
    <h4>{{ `Objeto position str: ${positionStr}` }}</h4>
    <h4>{{ `Flash suportado: ${torchSupported}` }}</h4>
    <button @click="mudarContando">{{ labelContando }}</button>
    <button
      @click="flashClick"
      :disabled="!torchSupported || flashIntervalFlag"
    >
      {{ labelFlash }}
    </button>
    <button
      @click="flashIntervalClick"
      :disabled="!torchSupported || flashFlag"
    >
      Flash com intervalo
    </button>
    <div ref="consoleOutput" class="console"></div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    display: block;
    text-align: left;
  }
}

.console {
  margin-top: 16px;
  height: 150px;
  overflow: auto;
}
</style>
