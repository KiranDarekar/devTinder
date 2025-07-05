
# auth router
post /auth/signup
post /auth/login
post /auth/logout

# profile router
GET /profile/view
patch /profile/edit
patch /profile/password

# connection router status: ignore. intrested, accpeted, rejected
post /request/send/:status/:userId
post /request/send/:status/:requestId

# user connection router
post /user/connections
GET /user/requests/ received
GET /user/feed

POST VS GET
