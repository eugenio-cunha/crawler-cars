import * as http from 'http';
import * as https from 'https';

export default function({ host, port, path, method = 'GET' }:
  { host: string; port: string; path: string; method?: string; },
  callback: (err: any, res?: { code: number | undefined, data: object }) => void) {
  let data: string = '';
  const protocol: any = port === '443' ? https : http;
  const request = protocol.request({
    headers: { 'Content-Type': 'application/json' },
    host,
    method,
    path,
    port
  }, (res: http.IncomingMessage) => {
    res.setEncoding('utf8');
    res.on('data', (chunk: string): void => { data += chunk; });
    res.on('end', (): void => { callback(null, { code: res.statusCode, data: JSON.parse(data) }); });
  });

  request.on('error', (err: object): void => callback(err));
  request.end();
}