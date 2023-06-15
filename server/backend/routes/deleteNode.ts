import { db } from '../db/index'

import express from 'express'
const router = express.Router()

// データ削除(対象のレコードのみ)
const deleteNode = router.post('/api/sets/delete/node', (req, res) => {
  if (!req.body) return

  const sql = 'DELETE FROM sets WHERE id = ?;'
  const { id } = req.body
  const values = [id]

  db.query({ sql, values }, (error, results) => {
    if (error) {
      console.log('error', error)
      throw error
    }

    res.status(200).json(results)
  })
})

export default deleteNode
