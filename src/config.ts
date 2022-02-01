const fs = require("fs")
const os = require("os")

export const Config = {
  path: (): string => {
    return `${os.homedir()}/.config/artsy`
  },
  readOpenConfig: (): any => {
    try {
      return JSON.parse(
        fs.readFileSync(`${os.homedir()}/.config/artsy-open.json`)
      )
    } catch {
      return {}
    }
  },
  gravityId: (): string => {
    return process.env.CLIENT_ID as string
  },
  gravitySecret: (): string => {
    return process.env.CLIENT_SECRET as string
  },
  readToken: (): string => {
    const data = fs.readFileSync(Config.path(), { encoding: "utf-8" })
    const options = JSON.parse(data)
    return options.accessToken
  },
  writeToken: (token: string): void => {
    const options = { accessToken: token }
    const data = JSON.stringify(options)
    fs.writeFileSync(Config.path(), data)
  },
}
