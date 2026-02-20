import { Context } from "hono";
import database from "../database/factory";
import utils from "../utils";
import { eq } from "drizzle-orm";
import Apps from "../models/Apps";
import AuthTokens from "../models/AuthTokens";

const token_expiration_days = 30;

export default class {

  static async createToken(c: Context) {
    let reqBody = {};
    try { reqBody = await c.req.json(); } catch (e) { }

    const appKey = (reqBody as any)['X-App-Key'] || c.req.header('X-App-Key');
    const appSecret = (reqBody as any)['X-App-Secret'] || c.req.header('X-App-Secret');

    const db = database();
    const appsRows = await db
      .select()
      .from(Apps)
      .where(eq(Apps.key, appKey))
      .limit(1);

    const app = appsRows[0];
    if (!app) return utils.jsonError('Invalid app key');

    if (app.secret && app.secret !== appSecret) {
      return utils.jsonError('Secret mismatch');
    }

    const app_id = app.id;
    const token = crypto.randomUUID();
    const refreshToken = crypto.randomUUID();
    const ip = utils.getIpAddress();
    const uag = c.req.header('User-Agent');
    const expiration = new Date(Date.now() + 86400 * 1000 * token_expiration_days).toISOString();

    await db.insert(AuthTokens).values({
      app_id,
      token,
      refresh_token: refreshToken,
      ip_address: ip,
      user_agent: uag,
      expiration
    } as typeof AuthTokens.$inferInsert);

    return utils.jsonSuccess('Token created', {
      data: { token, refresh_token: refreshToken, expiration }
    });
  }

  static async refreshToken(c: Context) {
    let reqBody = {};
    try { reqBody = await c.req.json(); } catch (e) { return utils.jsonError('Bad json', {}, 400); }

    const refreshToken = (reqBody as any)['refresh_token'];
    if (!refreshToken) return utils.jsonError('Missing refresh_token');

    const db = database();
    const rows = await db
      .select()
      .from(AuthTokens)
      .where(eq(AuthTokens.refresh_token, refreshToken))
      .limit(1);

    const oldToken = rows[0];
    if (!oldToken) return utils.jsonError('Invalid refresh_token');

    const newToken = crypto.randomUUID();
    const newRefreshToken = crypto.randomUUID();
    const expiration = new Date(Date.now() + 86400 * 1000 * token_expiration_days).toISOString();

    await db
      .update(AuthTokens)
      .set({ token: newToken, refresh_token: newRefreshToken, expiration })
      .where(eq(AuthTokens.id, oldToken.id));

    return utils.jsonSuccess('Token refreshed', {
      data: { token: newToken, refresh_token: newRefreshToken, expiration }
    });
  }

  static async removeToken(c: Context) {
    let reqBody = {};
    try { reqBody = await c.req.json(); } catch (e) { return utils.jsonError('Bad json', {}, 400); }

    const token = (reqBody as any)['token'];
    if (!token) return utils.jsonError('Missing token');

    const db = database();
    const rows = await db
      .select()
      .from(AuthTokens)
      .where(eq(AuthTokens.token, token))
      .limit(1);

    const tokenData = rows[0];
    if (!tokenData) return utils.jsonError('Invalid token');

    await db
      .delete(AuthTokens)
      .where(eq(AuthTokens.token, tokenData.token));

    return utils.jsonSuccess('Token removed');
  }

};

