const express = require('express');
const db = require('../db/index');

const router = express.Router();

router
	.route('/')
	.get(async (req, res, next) => {
		try {
			const categoryResults = await db.query('SELECT id, name FROM category');
			const postResults = await db.query('SELECT * FROM post');
			const commentResults = await db.query('SELECT * FROM comment');
			const userResults = await db.query(
				'SELECT id, first_name, last_name FROM users'
			);
			res.status(200).json({
				status: 'success',
				results: {
					category: categoryResults.rows.length,
					post: postResults.rows.length,
					comment: commentResults.rows.length,
					user: userResults.rows.length,
				},
				data: {
					category: categoryResults.rows,
					post: postResults.rows,
					comment: commentResults.rows,
					user: userResults.rows,
				},
			});
		} catch (error) {
			return next(error);
		}
	})
	.post(async (req, res, next) => {
		if (req.body.title) {
			try {
				const { title, content, user_id, category_id } = req.body;
				const results = await db.query(
					'INSERT INTO post ( title, message, user_id, category_id ) VALUES ($1, $2, $3, $4) RETURNING *',
					[title, content, user_id, category_id]
				);
				res.status(201).json({
					status: 'success',
					data: {
						threads: results.rows[0],
					},
				});
			} catch (error) {
				return next(error);
			}
		} else if (req.body.comment) {
			try {
				const { comment, user_id, post_id } = req.body;
				const results = await db.query(
					'INSERT INTO comment (message, user_id, post_id ) VALUES ($1, $2, $3) RETURNING *',
					[comment, user_id, post_id]
				);
				res.status(201).json({
					status: 'success',
					data: {
						comments: results.rows[0],
					},
				});
			} catch (error) {
				return next(error);
			}
		}
	});

module.exports = router;
