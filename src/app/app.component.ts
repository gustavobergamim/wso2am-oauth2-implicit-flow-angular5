import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private oauthService: OAuthService, private http: HttpClient) {
    this.http = http;
        console.log( 'Login-Url' );
        this.oauthService.issuer = 'https://localhost:9443/oauth2/token';
        this.oauthService.loginUrl = "https://localhost:9443/oauth2/authorize"; //Id-Provider?
 
        // URL of the SPA to redirect the user to after login
        this.oauthService.redirectUri = window.location.origin + "/index.html";
 
        // The SPA's id. Register SPA with this id at the auth-server
        //this.oauthService.clientId = "ukhEIAucjtWNisSF2NXwN1qfNGMa";
        this.oauthService.clientId = "Ic4ty76dT7ldUVykd9Q1lxEGxEca";
 
        // set the scope for the permissions the client should request
        this.oauthService.scope = "openid";
 
        // set to true, to receive also an id_token via OpenId Connect (OIDC) in addition to the
        // OAuth2-based access_token
        this.oauthService.oidc = true;
 
        // Use setStorage to use sessionStorage or another implementation of the TS-type Storage
        // instead of localStorage
        this.oauthService.setStorage(sessionStorage);
 
        // To also enable single-sign-out set the url for your auth-server's logout-endpoint here
        //this.oauthService.logoutUrl = "https://steyer-identity-server.azurewebsites.net/identity/connect/endsession?id_token={{id_token}}";
 
        // This method just tries to parse the token(s) within the url when
        // the auth-server redirects the user back to the web-app
        // It dosn't send the user the the login page
        this.oauthService.tryLogin({
          onTokenReceived: context => {
              console.log('onTokenReceived:', context);
              let claims = this.oauthService.getIdentityClaims();
              console.log('claims: ', claims );
          },
          onLoginError: (err) => {
              console.log('onLoginError:', err);
          }
        }).then(() => {
            if (!this.oauthService.hasValidIdToken() || !this.oauthService.hasValidAccessToken()) {
              console.log('vai chamar initImplicitFlow()');
                this.oauthService.initImplicitFlow();
            }
        });
  
  }

  public get name() {
    let claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['sub'];
  }

  public userinfo() {

    // Esse método ainda não funciona por conta do HTTP OPTIONS não aceitar domínios diferentes
    // exemplo localhost:4200 e localhost:8243
    this.http.get('https://localhost:8243/userinfo', {headers: {responseType: 'json'}} )
      .subscribe(
        data => console.log(data),
        err => console.log(err)
      );

  }

}
