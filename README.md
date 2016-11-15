# api

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

Authorization is acheived via providing your token in a request header:

    Authorization=[TOKEN]
