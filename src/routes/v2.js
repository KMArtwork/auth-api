'use strict';

const express = require('express');
const dataModules = require('../models');
const { users } = require('../auth/models/index');
const bearer = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');

const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

const handleCreate = async (req, res) => {
  let newRecord = await req.model.create(req.body)
  res.status(201).json(newRecord)
}

const handleGetOne = async (req, res) => {
  let singleRecord = await req.model.get(req.params.id);
  res.status(200).json(singleRecord)
}

const handleGetAll = async (req, res) => {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords)
}

const handleUpdatePart = async (req, res) => {
  res.status(200).send('Successful PATCH request to protected route')
}

const handleUpdateWhole = async (req, res) => {
  let updatedRecord = await req.model.update(req.params.id, req.body);
  res.status(200).json(updatedRecord);
}

const handleDelete = async (req, res) => {
  let deletedRecord = await req.model.delete(req.params.id);
  res.status(200).json(deletedRecord);
}

router.post('/:model', bearer, acl('create'), handleCreate )

router.get('/:model', bearer, acl('read'), handleGetAll )

router.get('/:model/:id', bearer, acl('read'), handleGetOne )

router.patch('/:model/:id', bearer, acl('update'), handleUpdatePart )

router.put('/:model/:id', bearer, acl('update'), handleUpdateWhole )

router.delete('/:model/:id', bearer, acl('delete'), handleDelete )

module.exports = router;