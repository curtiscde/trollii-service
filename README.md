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
```

## End Points

### GET /api/user

#### Error Codes

 - 1: User not found
 - 99: Unknown error


### POST /api/user

#### Error Codes

 - 1: Missing fields
 - 99: Unknown error