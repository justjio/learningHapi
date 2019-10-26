//Import dependencies
var hapi = require('@hapi/hapi'),
    monk = require('monk'),
    server = hapi.createServer('localhost', 3000), //Hapi Server object
    db = monk('mongodb://127.0.0.1:27017/test'),
    id = monk.id

//Getting collection name by default
var loadCollection = (name, callback) => {
    callback(db.get(name))
}

//Setting up routes
//Routes are all defined in an array. Use method, path and handler to work round the setup
server.route([
    {
        method: 'GET',
        path: '/',
        handler: function(req, reply) {
            reply('Select a collection, e.g., /collections/messages')
        }
    },
    {
        method: 'GET',
        path: '/collections/{collectionName}',
        handler: function(req, reply) {
            loadCollection(req.params.collectionName, (collection) => {
                collection.find({}, {
                    limit: 10,
                    sort: [['_id', -1]]
                }, (e, results) => {
                    if (e) return reply(e)
                    reply(results)
                })
            })
        }
    },
    {
        method: 'POST',
        path: '/collections/{collectionName}',
        handler: function(req, reply) {
            loadCollection(req.params.collectionName, (collection) => {
                collection.insert(req.payload, {}, (e, results) => {
                    if (e) return reply(e)
                    reply(results)
                })
            })
        }
    },
    {
        method: 'GET',
        path: 'collections/{collectionName}/{id}',
        handler: function(req, reply) {
            loadCollection(req.params.collectionName, (collection) => {
                collection.findOne({_id: id(req.params.id)},
                (e, result) => {
                    if (e) return reply(e)
                    reply(result)
                })
            })
        }
    },
    {
        method: 'PUT',
        path: '/collections/{collectionName}/{od}',
        handler: function(req, reply) {
            loadCollection(req.params.collectionName), (collection) => {
                collection.update({_id: id(req.params.id)},
                {$set: req.payload},
                {safe: true, multi: false},
                (e, result) => {
                    if (e) return reply(e)
                    reply((result === 1) ? {msg: 'success'} : {msg: 'error'})
                }
                )
            }
        }
    },
    {
        method: 'DELETE',
        path: '/collections/{collectionName}/{id}',
        handler: function(req, reply) {
            loadCollection(req.params.collectionName, (collection) => {
                collection.remove({_id: id(req.params.id)}, (e, result) => {
                    if (e) return reply(e)
                    reply((result === 1) ? {msg: 'success'} : {msg: 'error'})
                })
            })
        }
    }
])

//Optional logging configuration
var options = {
    subscribers: {
        'console': ['ops', 'request', 'log', 'error']
    }
};

server.pack.require('good', options, (err) => {
    if (!err) console.info('Plugin loaded successfully')
    return
})

//Start Hapi server
server.start()