# Example requests

## Login (curl)
curl -X POST "https://api.example.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"hunter2"}'

## Get user (fetch)
fetch('https://api.example.com/users/u_123', {
  headers: { 'Authorization': 'Bearer <token>' }
}).then(r => r.json()).then(console.log)

## Create item (curl)
curl -X POST "https://api.example.com/items" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Item","price":9.99}'

## Delete item (curl)
curl -X DELETE "https://api.example.com/items/i_123" \
  -H "Authorization: Bearer <token>"
