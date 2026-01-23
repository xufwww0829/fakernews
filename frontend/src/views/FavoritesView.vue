<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { api } from "@/api";
import { useAuth } from "@/auth";
import StoryItem from "../components/StoryItem.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";

const route = useRoute();
const auth = useAuth();
const favorites = ref([]);
const loading = ref(false);
const error = ref(null);

const userId = computed(() => route.params.id || auth.user.value);

const loadFavorites = async () => {
  if (!userId.value) return;

  loading.value = true;
  error.value = null;

  try {
    favorites.value = await api.getUserFavorites(userId.value);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to load favorites.";
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(loadFavorites);
</script>

<template>
  <div class="favorites-view">
    <LoadingSpinner v-if="loading">Loading favorites...</LoadingSpinner>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadFavorites" class="retry-btn">Retry</button>
    </div>

    <div v-else-if="favorites.length === 0" class="empty">
      <p>No favorites yet.</p>
      <p class="hint">Click the heart icon on a story to add it to your favorites.</p>
    </div>

    <div v-else class="favorites-list">
      <StoryItem
        v-for="(story, index) in favorites"
        :key="story.id"
        :story="story"
        :rank="index + 1"
      />
    </div>
  </div>
</template>

<style scoped>
.favorites-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error,
.empty {
  padding: 48px 24px;
  text-align: center;
  background: var(--bg-primary);
  border-radius: 12px;
  color: var(--text-secondary);
}

.error p,
.empty p {
  margin-bottom: 12px;
}

.hint {
  font-size: 14px;
  color: var(--text-tertiary);
}

.retry-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: var(--transition-fast);
  border: 1px solid var(--border);
  background-color: var(--accent);
  border-color: var(--accent);
  color: white;
}

.retry-btn:hover {
  background-color: var(--accent-hover);
  border-color: var(--accent-hover);
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
