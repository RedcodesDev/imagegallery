<script setup lang="ts">
import { BNavbar, BNavbarDropdown, BNavbarItem } from "buefy";
import ImageView from "./components/ImageView.vue";
</script>

<template>
  <section>
  <b-navbar fixed-top>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <h1 class="title is-1">Redcodes Fotobox</h1>
      </b-navbar-item>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <a class="button is-light"> Neuen Code eingeben </a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
  </section>
  <ImageView></ImageView>
</template>

<style scoped>
</style>
