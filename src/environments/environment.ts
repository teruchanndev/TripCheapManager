// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: 'https://tripcheap-2f380.web.app/api',
  //apiURL: 'http://localhost:5000/api',
  firebaseConfig: {
      apiKey: 'AIzaSyCRuIhPpUBprXRGjIeAUDtenTQybLzrSlQ',
      authDomain: 'tripcheap-2f380.firebaseapp.com',
      projectId: 'tripcheap-2f380',
      storageBucket: 'tripcheap-2f380.appspot.com',
      messagingSenderId: '1065925393783',
      appId: '1:1065925393783:web:16cab53808805f86d1f572',
      measurementId: 'G-DZCP9SE5GQ'
    }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
