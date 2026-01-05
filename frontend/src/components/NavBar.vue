<script setup>
import { RouterLink, useRoute } from "vue-router";
import { computed } from "vue";
import logoUrl from "../assets/logo.svg";

const route = useRoute();
const currentPath = computed(() => route.path);

const navItems = [
  { name: "Top", path: "/top" },
  { name: "New", path: "/new" },
  { name: "Best", path: "/best" },
  { name: "Ask", path: "/ask" },
  { name: "Show", path: "/show" },
];
</script>

<template>
  <header class="navbar">
    <div class="container">
      <div class="nav-content">
        <RouterLink to="/" class="logo">
          <img :src="logoUrl" alt="Faker News" class="logo-icon" />
          <span class="logo-text">Faker News</span>
        </RouterLink>

        <nav class="nav-links">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="{ active: currentPath.startsWith(item.path) }"
            class="nav-link"
          >
            {{ item.name }}
          </RouterLink>
        </nav>

        <div class="nav-actions">
          <RouterLink to="/submit" class="nav-btn submit">Submit</RouterLink>
          <RouterLink to="/login" class="nav-btn login">Login</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px var(--shadow);
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 20px;
  color: var(--text-primary);
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: var(--accent);
}

.nav-links {
  display: flex;
  gap: 16px;
  flex: 1;
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: var(--transition-fast);
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.nav-link.active {
  color: var(--accent);
  background: var(--bg-hover);
}

.nav-actions {
  display: flex;
  gap: 12px;
}

.nav-btn {
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 500;
  transition: var(--transition-fast);
  text-align: center;
}

.nav-btn.login {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-btn.login:hover {
  background-color: var(--bg-hover);
}

.nav-btn.submit {
  background-color: var(--accent);
  color: white;
}

.nav-btn.submit:hover {
  background-color: var(--accent-hover);
}

@media (max-width: 768px) {
  .nav-content {
    gap: 16px;
  }

  .nav-links {
    gap: 4px;
  }

  .logo-text {
    display: none;
  }
}

@media (max-width: 500px) {
  .nav-link {
    padding: 6px 8px;
    font-size: 14px;
  }
  .nav-btn {
    padding: 6px 12px;
    font-size: 14px;
  }
}
</style>
