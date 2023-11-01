<style>
body {
  color: #fda501;
  background-color: #2b2b2b;
}
</style>

# Project Solution

## System Component Diagram
```puml
!include diagrams/system.puml
```

## Entity Diagram
```puml
!include diagrams/entity.puml
```

## API
### `POST /api/access`
```puml
!include diagrams/api/access.puml
```

### `CRUD /api/users`
### `CRUD /api/media`
### `CRUD /api/locations`

### `PUT /api/users/:user_id/location/:location_id`
### `DELETE /api/users/:user_id/location/:location_id`
