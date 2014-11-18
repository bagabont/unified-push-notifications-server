# Unified Push Notifications Service (V1)

![Alt Architecture](/docs/platform/architecture.png)

Requirements:

`In progress ...`

## Client Integration

### Registration

**Request:**
```httph
POST /api/v1/subscribers/:id?platform={platform}&service={service_name}&token={push_token}
```

**Response:**
```httph
Status: 201 Created || 204 No Content
```

### Retrieving Payload

To retrieve a push event payload you should send the ID of the event as a parameter.

**Request:**
```httph
GET /api/v1/events/:id/payload
```

**Response:**
```httph
Status: 200 OK
```
```json
{
    "object": "payload",
    "type": "image",
    "payload": {
        "source": "http://lorempixel.com",
        "watermark": "UNIFIED PUSH DELIVERY",
        "category": "animals"
    }
}
```

## Server Integration

### Protocol Description

#### Headers

##### Type
Defines the type of the notification payload. Allows different resources to be opened via push notifications.

##### Text
Short text notification message.

#### Payload
Customer defined protocol, which is directly dependent of the `"type"` header. Contains additional resources that can be retrieved by the client applications.

#### Target
Use JSON format for target request param. You can target by following params:

- services
- platforms (Valid: ["windows", "ios", "android"])
- id
- locale
- country
- version

Example:
Target all iOS devices from Singapore with application version (less than or equal to 2) or (more than or equal to 4, but less than 5)

```json
{
    "services": ["test", "test123"],
    "platforms": "ios",
    "country": "sg",
    "version": ["<= 2","~> 4"]
}
```

### Send Notification

#### Create and send push notification
**Request:**
```httph
POST /api/v1/events
Content-Type: application/json
```
```json
{
    "headers": {
	    "type": "image",
	    "text": "Cool animal pictures!"
    },
    "payload": {
	    "category": "animals",
    	"watermark": "UNIFIED ANIMAL DELIVERY",
	    "source": "http://lorempixel.com"
    },
    "target": {
	    "services": ["test"],
	    "platforms": ["ios", "android", "windows"]
    }
}
```

**Response:**
```httph
Status: 200 OK
```
```json
{
    "object": "event",
    "id": "546b46a3277d5802000d09f0"
}
```

#### Resend push notification
**Request:**
```httph
POST /api/v1/events/:id
```

**Response:**
```httph
Status: 200 OK
```
```json
{
    "object": "event",
    "id": "546b46a3277d5802000d09f0"
}
```