// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'dev',
  region: 'eu-west-1',
  recaptchaV3SiteKey: "6Ldd2RQeAAAAABidUe7PPYzpYUnwIa599ZatjTf_",
  binanceEndpoint: 'https://api.binance.com',
  beUrl: 'https://dev.api.anton.finance/v1',
  cognitoAppClientId: '6s72d0thtqpqn37kqojt0qgfo0',
  cognitoUrl: 'https://auth.dev.anton.finance',
  cognitoUserPoolId: 'eu-west-1_ASIKOhv3U',
  accountId: '682060008544',
  identityPoolId: 'eu-west-1:212cf53c-5356-4d01-8480-8df9ef4d624f',
  userTable: 'registry',
  transactionsTable: 'transactions',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
