/*
村人A,B,Cが悪魔憑きの疑いで幽閉されている。
そのうちの一人だけが悪魔憑きである。
7日間、聖水が届けられ、最終日には十字架が届く。
聖水を誰か一人に使用することで、悪魔憑きかどうかを調べることができる。
ただし、悪魔は0時の時点で必ず他の誰かに憑依する。
またこのとき、悪魔は次に聖水の使用対象となる村人を必ず察知し、
その対象ではない村人に憑依する。
聖水の使用対象者が現在の憑依体である場合は、50％の確率で他者を選択する。
*/

const DATE_LIMIT = 7

const main = () => {
  let max = 0

  for (let n = 0; n < 3 ** DATE_LIMIT; n++) {
    const three = ('0000000000' + (n).toString(3)).slice(-DATE_LIMIT)
    const targets = three.split('').map((n) => {
      switch (n) {
      case '0': return 'A'
      case '1': return 'B'
      case '2': return 'C'
      }
    })

    const [probability, result] = simulate(targets)
    if (max <= probability) {
      max = probability
      console.table({ result: { targets: targets.join(), probability } })
      console.table(result)
    }
  }
}

const simulate = (targets) => {

  const masters = (['A', 'B', 'C'])
    .map((devil) => {
      if (devil === targets[0]) return null

      return makeDevil({
        date: 1,
        devil,
        slaves: [],
        probability: 2,
      })
    })
    .filter((item) => item)

  const prisonersQueue = [masters[0], masters[1]]
  const result = {
    A: [],
    B: [],
    C: [],
  }

  while (prisonersQueue.length) {
    const prisoner = prisonersQueue.shift()

    const { date, devil, probability } = prisoner

    const nextTarget = targets[date]

    const nextDevilTargets = (['A', 'B', 'C']).filter((nextDevilTarget) => {
      if (nextDevilTarget === devil) return false
      if (nextDevilTarget === nextTarget) return false
      return true
    })

    if (nextDevilTargets.length === 0) continue

    const nextProbability = probability * nextDevilTargets.length

    nextDevilTargets.forEach((devilTarget) => {
      const devil = makeDevil({
        date: date + 1,
        devil: devilTarget,
        slaves: [],
        probability: nextProbability,
      })

      if (devil.date >= DATE_LIMIT) {
        result[devil.devil].push(devil.probability)
        return
      }

      prisoner.slaves.push(devil)
      prisonersQueue.push(devil)
    })
  }

  const max = Math.max(
    Math.max.apply(null, result.A),
    Math.max.apply(null, result.B),
    Math.max.apply(null, result.C)
  )

  const result2 = {
    A: { numerator: result['A'].reduce((prev, curr) => curr ? prev + max / curr : prev + 1, 0), denominator: max },
    B: { numerator: result['B'].reduce((prev, curr) => curr ? prev + max / curr : prev + 1, 0), denominator: max },
    C: { numerator: result['C'].reduce((prev, curr) => curr ? prev + max / curr : prev + 1, 0), denominator: max },
  }

  const result3 = {
    A: result2.A.numerator / result2.A.denominator,
    B: result2.B.numerator / result2.B.denominator,
    C: result2.C.numerator / result2.C.denominator,
  }

  const max2 = Math.max(result3.A, result3.B, result3.C)

  let count = 0
  if (result2.A.numerator !== 0) count++
  if (result2.B.numerator !== 0) count++
  if (result2.C.numerator !== 0) count++

  if (count === 1) {
    console.table(result2)
  }

  return [max2, result2]
}

const makeDevil = ({ date, devil, slaves, probability }) => {
  return {
    date,
    devil,
    slaves,
    probability,
  }
}

main()
