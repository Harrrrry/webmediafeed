db.auth('admin', 'password123')

db = db.getSiblingDB('webmediafeed')

db.createUser({
  user: 'webmediafeed_user',
  pwd: 'webmediafeed_password',
  roles: [
    {
      role: 'readWrite',
      db: 'webmediafeed'
    }
  ]
})

// Create some initial collections
db.createCollection('users')
db.createCollection('media')
db.createCollection('comments')
