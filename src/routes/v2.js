'use strict';

const express = require('express');
const dataModules = require('../models');
const { users } = require('../auth/models/index');
const bearer = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');

const router = express.Router();

const handleCreate = async (req, res) => {
  res.status(201).send('Successful POST request to protected route')
}

const handleGetOne = async (req, res) => {
  res.status(200).send('Successful GET (one) request to protected route')
}

const handleGetAll = async (req, res) => {
  res.status(200).send('Successful GET (all) request to protected route')
}

const handleUpdatePart = async (req, res) => {
  res.status(200).send('Successful PATCH request to protected route')
}

const handleUpdateWhole = async (req, res) => {
  res.status(200).send('Successful PUT request to protected route')
}

const handleDelete = async (req, res) => {
  res.status(200).send('Successful DELETE request to protected route')
}

router.post('/', bearer, acl('create'), handleCreate )

router.get('/', bearer, acl('read'), handleGetAll )

router.get('/:id', bearer, acl('read'), handleGetOne )

router.patch('/:id', bearer, acl('update'), handleUpdatePart )

router.put('/:id', bearer, acl('update'), handleUpdateWhole )

router.delete('/:id', bearer, acl('delete'), handleDelete )

module.exports = router;