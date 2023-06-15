import { db } from '../db/index'

import express from 'express'
const router = express.Router()

// データ取得(部分木)
const selectTree = router.get('/api/sets/tree', (req, res) => {
  if (!req.query) return

  const sql = `
    SELECT
      id,
      name,
      parent
    FROM
      view_children
    WHERE
      lft BETWEEN
        (SELECT lft FROM sets WHERE id = ?) AND
        (SELECT rgt FROM sets WHERE id = ?)
  `
  const { id } = req.query
  const values = [id, id]

  db.query({ sql, values }, (error, results) => {
    if (error) {
      console.log('error', error)
      throw error
    }

    res.status(200).json(results)
  })
})

export default selectTree
