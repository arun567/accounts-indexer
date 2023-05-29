import { get } from 'request-promise'
import { APIError, ErrorTypes } from "../errors";

export async function callGetAPI(lcdBaseUrl: string, url: string, qs: any) {
      const protocol = require(lcdBaseUrl.startsWith('https') ? 'https' : 'http')
      const agent = new protocol.Agent({
        rejectUnauthorized: false,
        keepAlive: true
      });
      const options = {
        method: 'GET',
        rejectUnauthorized: false,
        headers: {
          Connection: 'keep-alive',
          'Content-Type': 'application/json',
        },
        qs: qs,
        json: true,
        agent
      };
  
      const NOT_FOUND_REGEX = /(?:not found|no del|not ex|failed to find|unknown prop|empty bytes|No price reg)/i;
  
      const resp = await get(`${lcdBaseUrl}${url}`, options).catch((err: any) => {
        if (err.statusCode === 404 || (err?.message && NOT_FOUND_REGEX.test(err.message))) {
          return undefined;
        }

        if (err.message === "Error: read ECONNRESET") {
          return undefined;
        }

        if (err.message === "Error: socket hang up") {
          return undefined;
        }
  
        if (err.statusCode === 400) {
          throw new APIError(ErrorTypes.INVALID_REQUEST_ERROR, undefined, url, err);
        }
  
        throw new APIError(ErrorTypes.LCD_ERROR, err.statusCode, `${url} ${err.message} ${JSON.stringify(qs)}`, err);
      });
      return resp;
}
