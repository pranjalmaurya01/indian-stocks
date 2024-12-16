export function registerServiceWorker() {
  if (!navigator.serviceWorker) return;
  return navigator.serviceWorker
    .register('firebase-messaging-sw.js', { scope: '/' })
    .then(
      function (reg) {
        let serviceWorker;
        if (reg.installing) {
          serviceWorker = reg.installing;
          // console.log('Service worker installing');
        } else if (reg.waiting) {
          serviceWorker = reg.waiting;
          // console.log('Service worker installed & waiting');
        } else if (reg.active) {
          serviceWorker = reg.active;
          // console.log('Service worker active');
        }

        if (serviceWorker) {
          serviceWorker.addEventListener('statechange', function (e: any) {
            console.log('sw statechange : ', e.target.state);
          });
        }
      },
      function (err) {
        console.error(
          'unsuccessful registration with ',
          'firebase-messaging-sw.js',
          err
        );
      }
    )
    .catch((e) => {
      console.log(e);
    });
}
