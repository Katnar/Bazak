const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById} = require('../../controllers/systems/system');

// find spec 
router.get('/system/:id', findById)
router.get('/system', find)
//add 
router.post('/system',create); /**/ 
//update 
router.put('/system/:id', update)
//delete 
router.delete('/system/:id', remove )

module.exports = router;