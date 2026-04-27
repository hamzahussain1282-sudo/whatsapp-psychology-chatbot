<template>
  <div class="flex flex-col items-center gap-4 mt-10">
    <h1 class="text-2xl font-semibold">🧠 RAG Chatbot</h1>

    <!-- Input box for user's question -->
    <input
      type="text"
      v-model="query"
      placeholder="Ask something about your PDF..."
      class="border px-4 py-2 rounded w-96"
    />

    <!-- Button to send query -->
    <button
      @click="askQuestion"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Ask
    </button>

    <!-- Display answer -->
    <div v-if="answer" class="mt-6 bg-gray-100 p-4 rounded w-3/4">
      <h2 class="text-lg font-bold">Answer:</h2>
      <p class="mt-2 text-gray-800">{{ answer }}</p>
    </div>

    <!-- Display retrieved context -->
    <div v-if="context" class="mt-4 bg-gray-50 p-4 rounded w-3/4">
      <h3 class="font-semibold">Context Used:</h3>
      <pre class="text-sm text-gray-600 whitespace-pre-wrap">{{ context }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const query = ref("");
const answer = ref("");
const context = ref("");

const askQuestion = async () => {
  if (!query.value.trim()) {
    alert("Please enter a question!");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/ask", {
      question: query.value,
    });

    answer.value = response.data.answer;
    context.value = response.data.context;

    console.log("✅ Response:", response.data);
  } catch (err) {
    console.error("❌ Error:", err);
    alert("Something went wrong while fetching the answer.");
  }
};
</script>

<style>
body {
  font-family: "Inter", sans-serif;
  background-color: #f9fafb;
}
</style>
