import { type Context, type MiddlewareHandler, type Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import * as jose from 'jose'

export const jwtVerifyMiddleware = () : MiddlewareHandler =>{
  return async function jwt(ctx: Context, next) {
    const jwt = ctx.req.header('Authorization')?.split('Bearer ')[1]
    if (!jwt) {
      throw new HTTPException(401, {
        res: unauthorizedResponse({
          ctx,
          error: 'invalid_request',
          errDescription: 'no authorization included in request',
        }),
      })
    }
    const JWKS = jose.createRemoteJWKSet(new URL('https://ideashare.jp.auth0.com/.well-known/jwks.json'))

    let msg
    let payload
    try {
      const result = await jose.jwtVerify(jwt, JWKS)
      payload = result.payload
    } catch (err) {
      msg = `${err}`
    }
    if (!payload?.sub) {
      throw new HTTPException(401, {
        res: unauthorizedResponse({
          ctx,
          error: 'invalid_token',
          statusText: msg,
          errDescription: 'token verification failure',
        }),
      })
    }
    ctx.set('userId', payload.sub)
    await next()
  }
}

function unauthorizedResponse(opts: {
  ctx: Context
  error: string
  errDescription: string
  statusText?: string
}) {
  return new Response('Unauthorized', {
    status: 401,
    statusText: opts.statusText,
    headers: {
      'WWW-Authenticate': `Bearer realm="${opts.ctx.req.url}",error="${opts.error}",error_description="${opts.errDescription}"`,
    },
  })
}