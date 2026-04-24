import { getLevel } from '../lib/german-data/index'
const lvl = getLevel(process.argv[2] || 'a1')
process.stdout.write(JSON.stringify(lvl))
