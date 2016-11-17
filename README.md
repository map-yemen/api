# Map Egypt Api 

## Reference 

### Routes

`/projects`
  - `GET`: Returns all projects. Providing a valid token with the request will return private projects. Providing a token with edit access will also return projects with draft status.
  - `POST`: Create a new project. Requires a `name` property in the payload, everything else is optional. Requires a valid token with edit access.
  
`/projects/:id`
  - `GET`: Returns the project with the provided id. Requires the proper tokens as noted above for accessing private or draft projects.
  - `PUT`: Update the project with the provided id. Requires a valid token with edit access.
  - `DELETE`: Update the project with the provided id. Requires a valid token with edit access.

`/indicators`
  - `GET`: Returns all indicators. Providing a valid token with the request will return private indicators. Providing a token with edit access will also return indicators with draft status.
  - `POST`: Create a new indicator. Requires a `name` property in the payload, everything else is optional. Requires a valid token with edit access.
  
`/indicators/:id`
  - `GET`: Returns the indicators with the provided id. Requires the proper tokens as noted above for accessing private or draft indicators.
  - `PUT`: Update the indicators with the provided id. Requires a valid token with edit access.
  - `DELETE`: Update the indicators with the provided id. Requires a valid token with edit access.

### Authorization

To access certain routes, a valid JSON Web Token must be provided in the request header:

    Authorization=[TOKEN]

## Local Development 

### Testing

**Requirements**

- Node v6
- Yarn
- Local Postgres 9.4+ running on localhost (default settings: username postgres, no password, port 5432)

**Steps**

- Clone this repo
- `yarn` to install dependencies
- `yarn test` to run the tests
