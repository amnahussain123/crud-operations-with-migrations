const User = require("../models").User
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
module.exports = {
    // create account
    signUp: (req, res) => {
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        }).then((user) => {
            console.log(user);
            return res.status(201).json({
                "message": "User created successfully",
                user
            }).catch(err => {
                return res.status(400).json({ err })
            })
        })
    },
    signIn: (req, res) => {
        console.log(req.body)
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then((user) => {
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }
                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );
                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                }
                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                res.status(200).send({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    accessToken: token
                });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            })
    },
    updateSignUp: (req, res) => {
        let { name, email, password } = req.body
        let id = req.params.id

        User.findOne({
            where: { id: id }
        }).then(user => {
            if (user) {
                user.update({ name, email, password })
                    .then((updateUser) => {
                        return res.status(202).json({
                            "message": "User updated successfully",
                            updateUser
                        })
                    })
            } else {
                return res.status(206).json({
                    "message": "User not found"
                })
            }
        }).catch(error => {
            return res.status(400).json({
                "error": error
            })
        })
    },
   // get all users
   getAllUsers: (req, res) => {
        User.findAll({
            attributes: ['id', 'name', 'password', 'email'],
            limit: 5,
            order: [['id', 'DESC']]
        }).then(users => {
            return res.status(200).json({
                users
            })
        }).catch(err => {
            return res.status(400).json({ err })
        })
    },
    // get single user by id
    getSingleUser: (req, res) => {
        let id = req.params.id
         User.findByPk(id)
            .then((user) => {
                return res.status(200).json({ user })
            }).catch(err => {
                return res.status(400).json({ err })
            })
    },
    // delete user by id
    deleteSingleUser: (req, res) => {
        let id = req.params.id
        User.destroy({
            where: { id: id }
        }).then(() => {
            return res.status(200).json({
                "message": "User Deleted successfully"
            })
        }).catch(err => {
            return res.status(400).json({ error })
        })
    },
    // delete all users
     deleteAllUsers: (req, res) => {
        User.destroy({
            truncate: true
        }).then(() => {
            return res.status(200).json({
                success: true,
                "message": "All Users deleted"
            })
        }).catch(err => {
            return res.status(400).json({
                err
            })
        })
    },
}