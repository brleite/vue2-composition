<script setup>
import useCount from '@/composables/count';
defineProps({
  msg: {
    type: String,
    required: true,
  },
});

const { mudarContando, labelContando, counter, doubleCount } = useCount();
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a target="_blank" href="https://vitejs.dev/">Vite</a> +
      <a target="_blank" href="https://v2.vuejs.org/">Vue 2</a>.
    </h3>
    <h6>{{ counter }}</h6>
    <h6>{{ doubleCount }}</h6>
    <button @click="mudarContando">{{ labelContando }}</button>
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
</style>
