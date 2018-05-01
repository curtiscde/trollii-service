# Trollii Service

## Configuration

```
process.env.googleAuthClientID
process.env.googleAuthClientSecret
process.env.googleAuthCallbackURL

process.env.dbconnection

process.env.sparkpostAPI
process.env.noreplyemail

process.env.webAppUrl

process.env.auth0Domain
process.env.auth0Token
process.env.auth0Audience
process.env.auth0ClientId
process.env.auth0ClientSecret
```

## End Points

### GET /api/user

#### Error Codes

 - 99: Unknown error


### POST /api/user

#### Error Codes

 - 1: Missing fields
 - 99: Unknown error