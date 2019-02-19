# Google Javascript Client service template for Angular 7+
This repo contains a basic template for a Gapi Auth service for Angular 7+.
The template contains functions for gapi client loading and initialization, sign in state, and basic functions for getting users and auth tokens. 



<h2> Prerequisites </h2>

- Google Platform Library
- Gapi and gapi.auth2 types

<h2> Usage </h2>

<h3> Add Google Platform Library to your project</h3>

Add the Google Platform Library to index.html:

    <script src="https://apis.google.com/js/platform.js"></script>

<h3> Add Gapi types </h3>

npm install (or yarn add) gapi and gapi.auth2 types 

    npm install --save @types/gapi
    npm install --save @types/gapi.auth2

Update tsconfig.json to include gapi and gapi.auth2 types:

    {
      "compileOnSave": false,
      "compilerOptions": {
        "types": ["gapi", "gapi.auth2"]
      }
    }
    
    
**NOTE if you are using yarn**: You might still have to declare the gapi object inside the service:

    declare const gapi: any;

<h3> Create the service </h3>

Copy and update the template code into your project or generate a new service:


    ng g s services/gapi
