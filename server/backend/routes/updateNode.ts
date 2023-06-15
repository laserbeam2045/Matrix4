import { db } from '../db/index'

import express from 'express'
const router = express.Router()

// データ更新
const updateNode = router.post('/api/sets/update/node', (req, res) => {
  if (!req.body) return

  const sql = 'UPDATE sets SET name = ? WHERE id = ?'
  const { name, id } = req.body
  const values = [name, id]

  db.query({ sql, values }, (error, results) => {
    if (error) {
      console.log('error', error)
      throw error
    }

    res.status(200).json(results)
  })
})

export default updateNode
