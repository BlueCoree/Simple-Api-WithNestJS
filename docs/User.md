# User API

## Register User

Endpoint: POST /api/users

Request Body:

```json
{
    "username": "john",
    "password": "rahasia",
    "name": "john doe" 
}
```

Response Body (Success):

```json
{
    "data": {
        "username": "john",
        "name": "john doe"
    }
}
```

Response Body (Failed):

```json
{
    "errors": "Username already registered"
}
```

## Login user

Endpoint: POST /api/users/login

Request Body:

```json
{
    "username": "john",
    "password": "rahasia"
}
```

Response Body (Success):

```json
{
    "data": {
        "username": "john",
        "name": "john doe",
        "token": "jwt_token"
    }
}
```

Response Body (Failed):

```json
{
    "errors": "Username or password is wrong"
}
```

## Get User

Endpoint: GET /api/users/current

Headers:
- Authorization: token

Response Body (Success):

```json
{
    "data": {
        "username": "john",
        "name": "john doe"
    }
}
```

Response Body (Failed):

```json
{
    "errors": "Unauthorized"
}
```

## Update User

Endpoint: PATCH /api/users/current

Headers:
- Authorization: token

Request Body:

```json
{
    "password": "rahasia", // optional
    "name": "john doe" // optional
}
```

Response Body (Success):

```json
{
    "data": {
        "username": "john",
        "name": "john doe"
    }
}
```

## Logout user

Endpoint: DELETE /api/users/current

Headers:
- Authorization: token

Response Body (Success):

```json
{
    "data": true
}
```