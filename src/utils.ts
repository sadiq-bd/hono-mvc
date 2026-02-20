import { getContext as ctx } from "hono/context-storage";
import { getConnInfo } from 'hono/cloudflare-workers'
import { decodeBase64, encodeBase64 } from "hono/utils/encode";
import { ContentfulStatusCode } from "hono/utils/http-status";

export default {
    jsonSuccess: (msg: string, extra: {} = {}, respCode: ContentfulStatusCode = 200, headers: {} = {}) => ctx().json({status:'success',message:msg, ...extra}, respCode, headers),
    jsonError: (msg: string, extra: {} = {}, respCode: ContentfulStatusCode = 200, headers: {} = {}) => ctx().json({status:'error',message:msg, ...extra}, respCode, headers),
    getIpAddress: () => getConnInfo(ctx()).remote.address,
    base64encode: (str: string) => encodeBase64(new TextEncoder().encode(str).buffer),
    base64decode: (str: string) => new TextDecoder().decode(decodeBase64(str))
};
