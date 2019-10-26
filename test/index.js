//Dependencies
var superagent = require('superagent')
var expect = require('expect')

//Describe and its callbacks
describe('express rest api server', () => {
    var id //This is for saving purposes
    //Testing posting a document
    it('posts object', (done) => {
        superagent.post('http://localhost:3000/collections/test')
            .send({
                name: 'J Moss',
                email: 'j_moss@gmail.com'
            })
            .end((e, res) => {
                expect(e).toBe(null)
                expect(res.body.length).toBe(1)
                expect(res.body[0]._id.length).toBe(24)
                id = res.body[0]._id
                done()
            })
    })
    //Testing getting a document
    it('retrieves an object', (done) => {
        superagent.get('http://localhost:3000/collections/test/' + id)
            .end((e, res) => {
                expect(e).toBe(null)
                expect(typeof res.body).toBe('object')
                expect(res.body._id.length).toBe(24)
                expect(res.body._id).toBe(id)
                done()
            })
    })
    //Testing getting a collection
    it('retrieves a collection', (done) => {
        superagent.get('http://localhost:3000/collections/test')
            .end((e, res) => {
                expect(e).toBe(null)
                expect(res.body.length).toBeGreaterThan(0)
                expect(res.body.map((doc) => {
                    return doc._id
                })).toContain(id)
                done()
            })
    })
    //Testing updating a document
    it('updates an object', (done) => {
        superagent.put('http://localhost:3000/collections/test/' + id)
            .send({
                name: 'Peter',
                email: 'peteru@yahoo.com'
            }).end((e, res) => {
                expect(e).toBe(null)
                expect(typeof res.body).toBe('object')
                expect(res.body.msg).toBe('success')
                done()
            })
    })
    //Testing if a document is truly updated
    it('checks an updated object', (done) => {
        superagent.get('http://localhost:3000/collections/test/' + id)
            .end((e, res) => {
                expect(e).toBe(null)
                expect(typeof res.body).toBe('object')
                expect(res.body._id.length).toBe(24)
                expect(res.body._id).toBe(id)
                expect(res.body.name).toBe('Peter')
                done()
            })
    })
    //Testing document removal
    it('removes an object', (done) => {
        superagent.del('http://localhost:3000/collections/test/' + id)
            .end((e, res) => {
                expect(e).toBe(null)
                expect(typeof res.body).toBe('object')
                expect(res.body.msg).toBe('success')
                done()
            })
    })
})