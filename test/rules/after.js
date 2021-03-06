"use strict";
var should = require('should');
var moment = require('moment-timezone');
var V4Validator = require('../../src/factory')();

describe('after', function() {


    it('should not pass if a date parameter is not specified', function (done) {

        var now = moment();
        var data = {
            field_1: now.clone().add(1, 'days').toISOString()
        };
        var rules = {
            field_1: 'after'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });


    });


    it('should pass when the field under validation is a value after a given date. The dates will be passed into moment.js', function (done) {

        var now = moment();

        var second_day = now.clone().add(2, 'days');

        var data = {
            field_1: now.clone().add(1, 'days').toISOString(),
            field_2: second_day.toISOString()
        };
        var rules = {
            field_1: 'after:'+now.toISOString(),
            field_2: {
                rule: 'after',
                args: [now.toISOString(), true]
            }
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            data.field_2.toISOString().should.equal(second_day.toISOString());

            done();
        });

    });

    it('should not pass if the field under validation is not a value after a given date. The dates will be passed into moment.js', function (done) {

        var now = moment();

        var data = {
            field_1: now.clone().add(1, 'days').toISOString(),
            field_2: now.clone().subtract(1, 'days').toISOString()
        };
        var rules = {
            field_1: 'after:'+now.toISOString(),
            field_2: 'after:'+now.toISOString()
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_2');
            err.meta.should.not.have.property('field_1');
            done();
        });


    });
});

