import { createApp } from 'vue'
import Room from './Room.vue'
import './registerServiceWorker'
import { io } from 'socket.io-client'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore

createApp(Room)
  .provide('socket', io('ws://localhost:3000', { transports: ['websocket'] }))
  .mount('#app')
