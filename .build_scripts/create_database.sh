#!/bin/sh
psql -c 'create database map_yemen_test;' -U postgres
node_modules/.bin/knex migrate:latest --env test
node_modules/.bin/knex seed:run --env test 
