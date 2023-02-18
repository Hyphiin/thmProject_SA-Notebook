import { boot } from 'quasar/wrappers'
import {Vue} from 'vue'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files



const socket = new VueSocketIO({
  debug: true,
  connection: 'http://localhost:4000/',
})



export {socket};