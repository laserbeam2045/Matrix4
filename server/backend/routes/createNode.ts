import { db } from '../db/index'

import express from 'express'
const router = express.Router()

// データ作成
const createNode = router.post('/api/sets/create/node', (req, res) => {
  if (!req.body) return

  const sql = `
    CALL get_space(?, 0, @L, @R);

    INSERT INTO
      sets (name, lft, rgt)
    VALUES
      (?, @L, @R);
  `
  const { id, name } = req.body
  const values = [id, name]

  db.query({ sql, values }, (error, results) => {
    if (error) {
      console.log('error', error)
      throw error
    }

    res.status(200).json(results)
  })
})

export default createNode
