import { createRouter, createWebHistory } from 'vue-router'
import DicomViewport from '@/viewer/DicomViewport.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/viewer',
      name: 'viewer',
      component: DicomViewport,
    },
  ],
})

export default router
