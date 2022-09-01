import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/stores/counter';

export default function useCount() {
  const { counter, doubleCount } = storeToRefs(useCounterStore());
  const { increment } = useCounterStore();
  const contando = ref(false);
  const interval = ref(null);

  const labelContando = computed(() => {
    return contando.value ? 'Parar' : 'Contar';
  });

  function mudarContando() {
    contando.value = !contando.value;
    if (!contando.value) {
      clearInterval(interval.value);
    } else {
      interval.value = setInterval(() => {
        increment();
      }, 1000);
    }
  }

  return {
    counter,
    doubleCount,
    labelContando,
    contando,
    interval,
    increment,
    mudarContando,
  };
}
