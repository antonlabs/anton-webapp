// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  region: 'eu-west-1',
  beUrl: 'https://dev.api.anton.finance/v1',
  cognitoAppClientId: '56n6651d1um28rb3vbimmdsu31',
  cognitoUrl: 'https://dev-anton-app.auth.eu-west-1.amazoncognito.com',
  cognitoUserPoolId: 'eu-west-1_xIpQfVtkJ',
  accountId: '682060008544',
  identityPoolId: 'eu-west-1:fd515616-95c6-41cc-bd08-10ffe6ca25b1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
