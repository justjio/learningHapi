const hapi = require('@hapi/hapi'),
    monk = require('monk'),
    db = monk('mongodb://127.0.0.1:27017/test')

//Function for getting a collection
function getCollection (name) {
    return db.get(name)
}

//Server and route set up
const init = async () => {
    //Create server
    const server = hapi.server({
        port: 3000,
        host: 'localhost'
    })

    //Add routes
    server.route([
        { //default route
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return 'Select a collection, e.g., /collections/messages'
            }
        },
        { 
            //Get a collection
            method: 'GET',
            path: '/collections/{collectionName}',
            handler: (request, h) => {
                return getCollection(request.params.collectionName).find()
                    .then((results) => {
                        return results
                    }).catch((e) => {
                        return e
                    })
            }
        },
        {
            //Post an object
            method: 'POST',
            path: '/collections/{collectionName}',
            handler: (request, h) => {
                return getCollection(request.params.collectionName).insert([request.payload])
                    .then((doc) => {
                        return doc
                    }).catch((e) => {
                        return e
                    })
            }
        },
        {
            //Gets one object
            method: 'GET',
            path: '/collections/{collectionName}/{id}',
            handler: (request, h) => {
                return getCollection(request.params.collectionName).findOne({_id: request.params.id})
                    .then((doc) => {
                        return doc
                }).catch((e) => {
                    return e
                })
            }
        },
        {
            //Updates an object
            method: 'PUT',
            path: '/collections/{collectionName}/{id}',
            handler: (request, h) => {
                return getCollection(request.params.collectionName).update({_id: request.params.id}, 
                    {$set: request.payload}).then((docs) => {
                        return {msg: 'success'}
                    }).catch((e) => {
                        return {msg: 'error'}
                    })
            }
        },
        {
            //Delete a document
            method: 'DELETE',
            path: '/collections/{collectionName}/{id}',
            handler: (request, h) => {
                return getCollection(request.params.collectionName).remove({_id: request.params.id})
                    .then((doc) => {
                        return {msg: 'success'}
                }).catch((e) => {
                    return {msg: 'error'}
                })
            }
        }
    ])

    //Start server
    await server.start()
    console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (e) => {
    console.log(e)
    process.exit(1)
})

init()