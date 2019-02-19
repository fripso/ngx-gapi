import { Injectable, NgZone } from '@angular/core';
import { credentials } from '/secrets/credentials.js'; // replace with credentials file 
import { Subject } from 'rxjs';
declare const gapi: any; // typescript bug fix

@Injectable({
    providedIn: 'root'
})
export class GapiService {

    /**
     * Current login status, for usage in templates.
     * Values are being set by the service
    */
    status$ = new Subject<boolean>();


    constructor(
        private zone: NgZone   
    ) { }

    /**
     * Load the gapi client
     * @returns Promise
     */
    private loadClient(): Promise<any> {
        if (!gapi.auth2) {
            return new Promise((resolve, reject) => {
                this.zone.run(() => {
                    gapi.load('auth2', {
                        callback: resolve,
                        onerror: reject,
                        timeout: 1000,
                        ontimeout: reject
                    });
                });
            });
        }
    }

    /**
    * Intialize the gapi client with client_id and optional parameters.
    * @returns Promise
    */
    private initClient(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.auth2.init({
                    client_id: credentials.clientId
                    // api key ..
                    // scopes ..
                }).then(resolve, reject);
            });
        });
    }



    /**
    * Try to get sign in status, otherwise load and initialize the gapi client, then return status
    * @returns Promise
    */
    getStatus(): Promise<boolean> {
        if (gapi.auth2) {
            const status = gapi.auth2.getAuthInstance().isSignedIn.get();
            return new Promise((resolve, reject) => {
                resolve(status);
                reject(false);
            });
        } else {
            return this.loadClient().then(() => this.initClient().then(() => {
                const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn;
                const status = isSignedIn.get();
                this.status$.next(status);
                isSignedIn.listen(change => this.zone.run(() => this.status$.next(change)));
                return status;
            }));
        }
    }

    /**
     * If logged in, get the current user
     * @returns Google Basic Profile
     */
    getUser(): any {
        if (this.getStatus()) {
            return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
        }
    }

    /**
    * Get the id_token object
    * @returns Google Auth Reponse
    */
    getToken(): object {
        if (this.getStatus()) {
            return gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();
        }
    }

    /**
    * Function to render a custom Google sign-in button
    * You can only call this function after the client has initialized
    */
    renderButton(): void {
        gapi.signin2.render('g-signin-custom',
            {
                'scope': 'profile email',
                'width': 240,
                'height': 40,
                'longtitle': true,
                'theme': 'light',
                'onsuccess': () => this.handleOnSuccess(),
                'onfailure': () => { }
            });
    }

    /**
    * Gapi sign in button onsuccess handler
    */
    private handleOnSuccess(): void {
        this.zone.run(() => {
            // Add you onsuccess logic
        });
    }


    /**
    * Sign in handler for custom login buttons
    * @returns Promise
    */
    handleSignInClick(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                return gapi.auth2.getAuthInstance().signIn();
            }).then(resolve, reject);
        });
    }

    /**
    * Sign out handler for logout buttons
    * @returns Promise
    */
    handleSignOutClick(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                return gapi.auth2.getAuthInstance().signOut();
            }).then(resolve, reject);
        });
    }
}
