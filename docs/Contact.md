# Contact API

## Create Contact

Endpoint: POST /api/contacts

Headers:
- Authorization: token

Request Body:

```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "0898788987878"
}
```

Response Body:

```json
{
    "data": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "0898788987878"
    }
}
```

## Get Contact

Endpoint: GET /api/contacts/:contactId

Headers:
- Authorization: token

Response Body:

```json
{
    "data": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "0898788987878"
    }
}
```

## Update Contact

Endpoint: PUT /api/contacts/:contactId

Headers:
- Authorization: token

Request Body:

```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "0898788987878"
}
```

Response Body:

```json
{
    "data": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "0898788987878"
    }
}
```

## Remove Contact

Endpoint: DELETE /api/contacts/:contactId

Headers:
- Authorization: token

Response Body:

```json
{
    "data": true
}
```