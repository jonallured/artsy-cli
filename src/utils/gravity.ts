import fetch from "node-fetch"
import { Config } from "../config"

class Gravity {
  static BASE_URL = `https://api.artsy.net/`
  static REDIRECT_PORT = 27879

  static url(endpoint: string) {
    return `${Gravity.BASE_URL}${endpoint}`
  }

  static urls = {
    current_user: Gravity.url("api/current_user"),
    auth: Gravity.url("oauth2/authorize"),
    access_token: Gravity.url("oauth2/access_token"),
    access_tokens: Gravity.url("api/tokens/access_token"),
    user_details: Gravity.url("api/current_user"),
    // tslint:disable-next-line:no-http-string
    callback: `http://127.0.0.1:${Gravity.REDIRECT_PORT}`,
  }

  static async getAccessToken(code: string) {
    const accessTokenUrl = Gravity.urls.access_token
    const params = new URLSearchParams()

    const clientId = process.env.CLIENT_ID as string
    const clientSecret = process.env.CLIENT_SECRET as string

    params.append("client_id", clientId)
    params.append("client_secret", clientSecret)
    params.append("code", code)
    params.append("grant_type", "authorization_code")
    params.append("scope", "offline_access")

    const response = await fetch(accessTokenUrl, {
      body: params,
      method: "POST",
    })

    if (!response.ok) throw `${response.status} ${response.statusText}`

    const data = await response.json()

    return data
  }

  async get(endpoint: string) {
    const token: string = Config.readToken()

    const gravityUrl: string = Gravity.url(`api/v1/${endpoint}`)
    const headers = { "X-Access-Token": token }
    const response = await fetch(gravityUrl, { headers })

    return response
  }
}

export default Gravity

export interface Credentials {
  email: string
  password: string
}

interface AccessTokenRequest extends Credentials {
  grant_type: string
  client_id: string
  client_secret: string
}

interface AccessTokenResponse {
  access_token: string
  expires_in: string
}
