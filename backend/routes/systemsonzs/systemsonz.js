const express = require("express");
const router = express.Router();

const { create, find, update, remove, findById, findByCarNumber,systemonz_mashbit,findByMkabaz} = require('../../controllers/systemsonzs/systemsonz');

// find spec 
router.get('/systemsonz/:id', findById)
router.get('/systemonz_mashbit', systemonz_mashbit)
router.get('/systemsonzbycarnumber/:carnumber', findByCarNumber)
router.get('/systemsonzbymakats', findByMkabaz)
router.get('/systemsonz', find)
//add 
router.post('/systemsonz',create); /**/ 
//update 
router.put('/systemsonz/:id', update)
//delete 
router.delete('/systemsonz/:id', remove )

router.get("/systemsonz", find);
//add
router.post("/systemsonz", create); /**/
//update
router.put("/systemsonz/:id", update);
//delete
router.delete("/systemsonz/:id", remove);

module.exports = router;
