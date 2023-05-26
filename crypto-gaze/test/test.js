const cds = require('@sap/cds/lib')
const chai = require('chai');
const request = require('supertest');
const express = require('express');
const app = express();
describe('GET /', function () {
   it('should return 200 OK and render home view', async function (done) {
    const { data } = await GET ('/crypto/Crypto', { })
/*       await request(app)
          .get('/')
          .expect(200)
          .end(function (err, res) {
              if (err) return done(err);
              done();
          }); */
  }); 
}); 
