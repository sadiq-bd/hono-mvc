import { Context } from "hono";
import database from "../database/factory";
import utils from "../core/utils";
import { createMiddleware } from "hono/factory";
import { eq } from "drizzle-orm";
import { basicAuthCredentials } from "../database/schema";

export default createMiddleware(async (c: Context, next) => {

	const [scheme, encoded] = c.req.header('Authorization')?.split(' ') ?? [];

	if (
		scheme?.toLowerCase() == 'basic'
		&& encoded?.length > 10
	) {
		const [user, pass] = utils.base64decode(encoded).split(':');

		const db = database();
		const [cred] = await db
			.select()
			.from(basicAuthCredentials)
			.where(eq(basicAuthCredentials.user, user))
			.limit(1);

		if (cred && cred.password === pass) {
			return await next();
		}
	}

	return utils.jsonError('Unauthorized', {}, 401, {
		'WWW-Authenticate': 'Basic'
	});

});

