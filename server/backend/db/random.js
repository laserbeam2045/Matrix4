const crypto = require('crypto')
const N = 16
const createID = () => crypto.randomBytes(N).toString('base64').substring(0, N)

// axios を require してインスタンスを生成する
const axiosBase = require('axios');
const axios = axiosBase.create({
  baseURL: 'https://have-a-go.moo.jp', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'  
});

axios.get('/tree/sets/select/nodes.php')
  .then(async (response) => {
    for (let i = 0, len = response.data.length; i < len; i++) {
      const { id } = response.data[i]
      const tmpid = await createID()
      // const params = new URLSearchParams();
      // params.append('id', id)
      // params.append('tmpid', tmpid)
      await axios.get('/tree/sets/update/tmpid.php', {
        params: {
          id,
          tmpid
        }
      })
        .then(() => console.log(id + ' ' + tmpid))
        .catch((e) => console.log(e))
    }
  })
