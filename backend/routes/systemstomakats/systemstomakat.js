const express = require('express');
const router = express.Router()

const { create, find, update, remove, findById, findByMakatId} = require('../../controllers/systemstomakats/systemstomakat');

// find spec 
router.get('/systemstomakat/:id', findById)
router.get('/systemstomakatByMakatId/:makatId', findByMakatId)
router.get('/systemstomakat', find)
//add 
router.post('/systemstomakat',create); /**/ 
//update 
router.put('/systemstomakat/:id', update)
//delete 
router.delete('/systemstomakat/:id', remove )

module.exports = router;