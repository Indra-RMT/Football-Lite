import requestPermission from './push-notification.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load',() => {
    navigator.serviceWorker.register('service-worker.js').then(function(reg) {
      if(reg.installing) {
        console.log('Service worker installing');
        // window.location.reload(); // reload again to activate SW & push notif
      }else if(reg.waiting) {
        console.log('Service worker installed');
      }else if(reg.active) {
        console.log('Service worker active');
        requestPermission();
      }
    });
  });
} else {
  console.log('SW: ServiceWorker Is Not Yet Supported By This Browser.')
}

export default {};