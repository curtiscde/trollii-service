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

### User

```
/api/user/profile
```

#### Error Codes

 - 1: Not authorised
 - 2: User not found
 - 99: Unknown error