import * as angularHttp from "@angular/common/http";
import {HttpRequest} from "@aws-sdk/protocol-http";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {QueryParameterBag} from "@aws-sdk/types";

export class HttpRequestConverter {

  httpParamsToQueryBags(params: HttpParams): QueryParameterBag {
    const result = {};
    for(const key of params.keys()) {
      result[key] = params.get(key);
    }
    return result;
  }

  queryParamsBagToHttpParams(dict: QueryParameterBag): HttpParams {
    let params = new HttpParams();
    for(const key of Object.keys(dict)) {
      params = params.set(key, dict[key] as any);
    }
    return params;
  }

  httpHeadersToDict(params: HttpHeaders): any {
    const result = {};
    for(const key of params.keys()) {
      result[key] = params.get(key);
    }
    return result;
  }

  dictToHttpHeaders(dict: any): HttpHeaders {
    let params = new HttpHeaders();
    for(const key of Object.keys(dict)) {
      params = params.set(key, dict[key]);
    }
    return params;
  }

  toAngularHttpRequest(awsRequest: HttpRequest): angularHttp.HttpRequest<any> {
    if(awsRequest.method === 'PUT' || awsRequest.method === 'POST' || awsRequest.method === 'PATCH') {
      return new angularHttp.HttpRequest(
        awsRequest.method as any,
        awsRequest.protocol + '://' + awsRequest.hostname + '/' + awsRequest.path,
        awsRequest.body,
        {
          headers: this.dictToHttpHeaders(awsRequest.headers),
          params: this.queryParamsBagToHttpParams(awsRequest.query)
        }
      )
    }
    return new angularHttp.HttpRequest(
      awsRequest.method as any,
      awsRequest.protocol + '://' + awsRequest.hostname + '/' + awsRequest.path, {
        headers: this.dictToHttpHeaders(awsRequest.headers),
        params: this.queryParamsBagToHttpParams(awsRequest.query)
      }
    )
  }

  toAwsHttpRequest(angularHttpRequest: angularHttp.HttpRequest<any>): HttpRequest {
    const $this = this;
    return {
      clone(): HttpRequest {
        return $this.toAwsHttpRequest(angularHttpRequest);
      },
      protocol: 'https',
      hostname: angularHttpRequest.url.split('https://')[1].split('/')[0],
      path: angularHttpRequest.url.split('https://')[1].split('/')[1],
      method: angularHttpRequest.method,
      body: angularHttpRequest.body,
      query: this.httpParamsToQueryBags(angularHttpRequest.params),
      headers: this.httpHeadersToDict(angularHttpRequest.headers)
    }
  }


}
