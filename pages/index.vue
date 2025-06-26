<template>
  <div class="font-sans bg-gray-900 text-white">
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-4">
      <div class="w-full max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/20 border border-purple-500/20">
        <div class="p-8 md:p-12 text-center space-y-8">
          
          <div class="space-y-2">
            <h1 class="font-display text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Graph Inspector
            </h1>
            <p class="text-lg text-gray-400">
              Peek behind the curtain. Instantly analyze any URL's Open Graph tags.
            </p>
          </div>

          <div class="space-y-6">
            <div class="relative flex items-center">
              <svg class="absolute left-5 h-6 w-6 text-gray-500 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              <input
                v-model="url"
                type="text"
                placeholder="https://example.com"
                class="w-full pl-14 pr-14 py-4 text-lg bg-gray-900/50 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                @keyup.enter="fetchOGTags"
                @focus="selectAll"
              />
              <button v-if="url" @click="clearUrl" class="absolute right-5 h-6 w-6 text-gray-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <button
              @click="fetchOGTags"
              class="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg rounded-xl py-4 px-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 active:scale-95"
            >
              Analyze URL
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400 mx-auto"></div>
      </div>

      <div v-if="error" class="w-full max-w-2xl mx-auto mt-8 bg-red-900/50 border border-red-500/50 rounded-lg p-4">
        <p class="text-red-300 text-center">{{ error }}</p>
      </div>

      <div v-if="ogData" class="w-full max-w-6xl mx-auto mt-12 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          <div class="md:col-span-2 space-y-8">
            <div v-if="ogData.ogImage" class="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-500/10 p-6 min-h-96">
              <h3 class="font-display text-2xl font-bold text-gray-200 mb-4">Images</h3>
              <div class="grid grid-cols-1">
                <img
                  v-for="(image, index) in ogData.ogImage"
                  :key="index"
                  :src="image.url"
                  :alt="image.alt || 'Open Graph Image'"
                  class="rounded-lg shadow-md hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300"
                />
              </div>
            </div>

            <div v-if="ogData.ogVideo" class="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-500/10 p-6">
              <h3 class="font-display text-2xl font-bold text-gray-200 mb-4">Videos</h3>
              <div class="space-y-4">
                <video
                  v-for="(video, index) in ogData.ogVideo"
                  :key="index"
                  :src="video.url"
                  controls
                  class="rounded-lg shadow-md w-full"
                />
              </div>
            </div>
          </div>

          <div class="md:col-span-3 bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-500/10 p-6">
            <h3 class="font-display text-2xl font-bold text-gray-200 mb-4">All Tags</h3>
            <div class="overflow-x-auto pr-2">
              <table class="w-full text-left">
                <tbody>
                  <tr v-for="(value, key) in ogData" :key="key" class="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td class="font-medium text-purple-300 pr-4 py-3 align-top">{{ key }}</td>
                    <td class="text-gray-300 py-3 break-all">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const url = ref('https://www.nfhsnetwork.com/clips/ucl85375857771750951576021');
const loading = ref(false);
const error = ref('');
const ogData = ref(null);

const fetchOGTags = async () => {
  if (!url.value) {
    error.value = 'Please enter a URL.';
    return;
  }

  loading.value = true;
  error.value = '';
  ogData.value = null;

  try {
    const response = await $fetch('/api/og', { params: { url: url.value } });

    if (response.error) {
      throw new Error(response.error);
    }

    ogData.value = response;
  } catch (err) {
    error.value = `Failed to fetch tags: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const selectAll = (event) => {
  event.target.select();
};

const clearUrl = () => {
  url.value = '';
};
</script>

<style>
  body {
    font-family: 'Inter', sans-serif;
  }
</style>
