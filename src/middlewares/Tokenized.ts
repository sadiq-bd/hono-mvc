import { Context } from "hono";
import database from "../database/factory";
import utils from "../core/utils";
import { createMiddleware } from "hono/factory";
import { eq } from "drizzle-orm";
import { authTokens } from "../database/schema";

export default createMiddleware(async (c: Context, next) => {

	const [scheme, token] = c.req.header('Authorization')?.split(' ') ?? [];

	if (
		scheme?.toLowerCase() == 'bearer'
		&& token?.length > 8
	) {
		const db = database();

		const [_token] = await db
			.select()
			.from(authTokens)
			.where(eq(authTokens.token, token))
			.limit(1);

		if (
			_token &&
			new Date(_token.expiration) > new Date() &&
			_token.ip_address === utils.getIpAddress() &&
			_token.user_agent === c.req.header('User-Agent')
		) {
			return await next();
		}
	}

	return utils.jsonError('Forbidden', {}, 403);

});

