const User = require('../models/users');
const jwt = require('jsonwebtoken'); // import the jwt library
const bcrypt = require('bcrypt'); // import bcrypt

const SALT_ROUNDS = 6; // tell bcrypt how many times to randomize the generation of salt. usually 6 is enough

module.exports = {
	create,
	login,
	update,
	index,
	delete: profileDelete,
	show,
};

async function create(req, res) {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
		const user = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
		});
		// NOTE: here we are storing a plaintext password. VERY VERY DANGEROUS. We will replace this in a second:
		console.log(req.body);

		// creating a jwt:
		// the first parameter specifies what we want to put into the token (in this case, our user document)
		// the second parameter is a "secret" code. This lets our server verify if an incoming jwt is legit or not.
		const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: '24h' });

		res.status(200).json(token); // send it to the frontend
	} catch (err) {
		res.status(400).json(err);
	}
}

async function login(req, res) {
	try {
		const user = await User.findOne({ email: req.body.email });
		// check password. if it's bad throw an error.
		if (!(await bcrypt.compare(req.body.password, user.password)))
			throw new Error();
		// if we got to this line, password is ok. give user a new token.
		const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: '24h' });
		res.status(200).json(token);
	} catch {
		res.status(400).json('Bad Credentials');
	}
}

async function update(req, res) {
	console.log(req.body.object_id_reference);
	const updatedUser = await User.findById(req.body.object_id_reference);
	updatedUser.bio = req.body.bio;
	updatedUser.location = req.body.location;
	updatedUser.skills = req.body.skills;
	await updatedUser.save(function (err) {
		if (err) return res.status(400).json(err);
		res.status(200).json('Ok');
	});
}

async function index(req, res) {
	try {
		let profiles = await User.find({});
		res.status(200).json(profiles);
	} catch (err) {
		res.status(400).json(err);
	}
}

async function profileDelete(req, res) {
	await User.findByIdAndDelete(req.body.id, function (err) {
		if (err) return res.status(400).json(err);
		res.status(200).json('deleted');
	});
}
async function show(req, res) {
	try {
		const profile = await User.findById(req.params.id);
		console.log(profile);
		res.status(200).json(profile);
	} catch (err) {
		res.status(400).json(err);
	}
}
