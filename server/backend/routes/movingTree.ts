import { db } from '../db/index'

import express from 'express'
const router = express.Router()

// データ移動(子孫ごと)
const movingTree = router.post('/api/sets/move/tree', (req, res) => {
  if (!req.body) return

  const sql = 'CALL moveSets(?, ?, ?);'
  const { cID, pID, idx } = req.body
  const values = [cID, pID, idx]

  db.query({ sql, values }, (error, results) => {
    if (error) {
      console.log('error', error)
      throw error
    }

    res.status(200).json(results)
  })
})

export default movingTree
