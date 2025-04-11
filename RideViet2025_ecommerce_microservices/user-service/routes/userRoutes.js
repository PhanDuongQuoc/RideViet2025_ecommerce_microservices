const express = require('express');
const { getAllUsers, createUser,updateUser, deleteUser, searchUsers } = require('../controllers/userController');

const router = express.Router();
router.get('/', getAllUsers);

router.post('/', createUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

router.get('/search', searchUsers);



module.exports = router;
