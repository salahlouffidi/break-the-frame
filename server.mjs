import http from 'node:http';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});
const {default:app}=await import('./dist/server/index.js');
const port=Number(process.env.PORT||3000);
http.createServer(async(req,res)=>{try{const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>1700000){res.writeHead(413);res.end('Request too large');return}chunks.push(chunk)}const response=await app.fetch(new Request('http://'+req.headers.host+req.url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)}),process.env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()))}catch{res.writeHead(500);res.end('Local server error')}}).listen(port,'127.0.0.1',()=>console.log('BREAK THE FRAME ready at http://localhost:'+port));
