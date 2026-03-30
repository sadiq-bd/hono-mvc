import { getContext as ctx } from "hono/context-storage";
import { getConnInfo } from 'hono/cloudflare-workers'
import { decodeBase64, encodeBase64 } from "hono/utils/encode";
import { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * Core Utilities
 * 
 * Provides common helpers for standardizing API responses
 * and fetching context-dependent info like the remote IP.
 * Requires the \`contextStorage\` Hono middleware to be mounted.
 */
export default {
    /** Generate a standard JSON success response */
    jsonSuccess: (msg: string, extra: {} = {}, respCode: ContentfulStatusCode = 200, headers: {} = {}) => ctx().json({status:'success',message:msg, ...extra}, respCode, headers),
    
    /** Generate a standard JSON error response */
    jsonError: (msg: string, extra: {} = {}, respCode: ContentfulStatusCode = 200, headers: {} = {}) => ctx().json({status:'error',message:msg, ...extra}, respCode, headers),
    
    /** Fetch the remote user's IP Address using Cloudflare bindings */
    getIpAddress: () => getConnInfo(ctx()).remote.address,
    
    /** Base64 encode a string */
    base64encode: (str: string) => encodeBase64(new TextEncoder().encode(str).buffer),
    
    /** Base64 decode a string */
    base64decode: (str: string) => new TextDecoder().decode(decodeBase64(str))
};
