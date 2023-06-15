import { db } from '../db/index'

import express from 'express'
const router = express.Router()

// データ削除(子孫ごと)
const deleteTree = router.post('/api/sets/delete/tree', (req, res) => {
  if (!req.body) return

  const sql = `
    DELETE FROM
      sets
    WHERE
      lft BETWEEN
        (SELECT lft FROM sets WHERE id = ?) AND
        (SELECT rgt FROM sets WHERE id = ?);
  `
  const { id } = req.body
  const values = [id, id]

  db.query({ sql, values }, (error, results) => {
    if (error) {
      console.log('error', error)
      throw error
    }

    res.status(200).json(results)
  })
})

export default deleteTree
