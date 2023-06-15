import mysql, { Query } from 'mysql'

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'NestedIntervalsModel',
  multipleStatements: true,
})

connection.connect((err) => {
  if (err) {
    return console.log('error connecting: ' + err.stack)
  }
  console.log('db connection success')
})

export const db = {
  query: (
    options: string | mysql.QueryOptions,
    callback?: mysql.queryCallback | undefined
  ): Query => {
    return connection.query(options, callback)
  },
}
