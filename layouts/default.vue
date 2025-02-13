<template>
    <div class="app">
        <NuxtPage keepalive/>  <!-- keepalive ->>> bileşenleri bellekte tutarak bileşenlerin tekrar oluşturulmasını önleyen bir sarmalayıcı bileşendir  
        Özellikle dinamik bileşenlerde ve sayfa yönlendirmelerinde performans optimizasyonu sağlamak için kullanılır.
        ayfa yönlendirmeleri sırasında bileşenlerin bellekte tutulmasını sağlar, böylece sayfalar arasında geçiş yaparken önceki sayfanın durumunu koruyabilirsiniz
        .bileşen yeniden oluşturulmaz, sadece saklanan versiyonu geri yüklenir.
        Kullanıcı bir sayfaya girip geri döndüğünde, form verileri kaybolmaz.
        created veya mounted yerine activated ve deactivated lifecycle hook'ları çalışır.-->
    </div>
</template>

<script setup lang="ts">

</script>

