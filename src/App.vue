<template>
  <main>
    <div class="l-container">
      <div class="l-visual">
        <img :class="{ 'stop': true, 'run': isRun }" src="@/assets/capybara-dash.gif" alt="">
        <img :class="{ 'hide': true, 'show': isShow }" src="@/assets/capybara-dash.gif" alt="">
      </div>
      <div class="p-speech">
        <p class="c-text">{{ recordedText }}</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

let recognition: any = null
let recordedText = ref('')
let isRun = ref(false)
let isShow = ref(false)

onMounted(async () => {
  const { webkitSpeechRecognition } = window as any
  const rec = new webkitSpeechRecognition()

  rec.lang = 'ja'
  rec.interimResults = true
  rec.continuous = true
  rec.onresult = recognize // Removed 'await' here

  rec.onerror = rec.onend = () => {
    // Error or end detected. Restart recognition
    recognition.start()
  };

  recognition = rec
  // Start the recognition after it's defined
  recognition.start()
})

const recognize = (e: SpeechRecognitionEvent) => { // Removed 'async' here
  let finalTranscript = '';
  let interimTranscript = '';

  for (let i = e.resultIndex; i < e.results.length; i++) {
    const transcript = e.results[i][0].transcript;
    if (e.results[i].isFinal) {
      finalTranscript += transcript;
    } else {
      interimTranscript += transcript;
      if (transcript.indexOf('走れ') !== -1) {
        isRun.value = true

        setTimeout(function () {isRun.value = false}, 3000)
      } else {
        if (transcript.match(/おはようございます|こんにちは|こんばんは/g) !== -1) {
          isShow.value = true

          setTimeout(function () {isShow.value = false}, 2000)
        }
      }
    }
  }

  recordedText.value = finalTranscript + '\n' + interimTranscript;
}
</script>

<style lang="scss" scoped>
.l-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #0f0;
  overflow: hidden;
}

.l-visual {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.stop {
  position: absolute;
  bottom: 10px;
  left: 100%;
}

.hide {
  position: absolute;
  bottom: 10px;
  left: 10px;
  opacity: 0;
}

.show {
  opacity: 1;
  bottom: 20px;
  left: 30px;
  transition: opacity .1s ease-in-out, bottom .2s ease-in-out, left .2s ease-in-out;
}

.run {
  left: -100%;
  transition: left 3s ease-in-out;
}
</style>
