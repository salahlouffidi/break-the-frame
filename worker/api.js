const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function processPhoto(request,env){
 if(request.method!=='POST')return json({error:'POST required'},405);
 if(env.DEMO_ALLOW_PAID_AI!=='true')return json({error:'Paid AI preparation is disabled on this public review build. Run locally with your own Meta key to test it.'},503);
 if(!env.MODEL_API_KEY)return json({error:'Meta API key is not configured.'},503);
 const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Origin not permitted'},403);
 if(Number(request.headers.get('Content-Length')||0)>1700000)return json({error:'Image too large. Maximum 1 MB.'},413);
 let body;try{const raw=await request.text();if(raw.length>1700000)return json({error:'Image too large'},413);body=JSON.parse(raw)}catch{return json({error:'Invalid request'},400)}
 if(!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(body.image||''))return json({error:'A PNG, JPEG or WebP image is required.'},400);
 try{
 const r=await fetch('https://api.meta.ai/v1/images/edits',{method:'POST',headers:{Authorization:`Bearer ${env.MODEL_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:'muse-image-1.0',images:[{image_url:body.image}],n:1,prompt:'Extract the single main person in this photograph. Preserve the exact face, identity, hair, glasses, clothing, pose and visible body; do not invent missing body parts. Remove all scenery and replace the background with perfectly uniform pure bright green RGB 0,255,0. No shadows on the green, no lettering, no frame, no ground, no hologram effects. Keep the entire original visible person with a little green margin. Lightly improve image clarity without changing appearance. This is a chroma-key asset for a spatial photo post.'}),signal:AbortSignal.timeout(110000)});
 if(!r.ok){await r.body?.cancel();return json({error:r.status===401?'Meta rejected this API key. Replace it with an active Meta Model API key.':r.status===402?'Meta API credits are required.':r.status===429?'Meta rate limit reached. Please try later.':`Meta image API returned HTTP ${r.status}. The original photo is unchanged.`},502)}
 const result=await r.json();const item=result.data?.[0];if(item?.b64_json)return json({image:'data:image/png;base64,'+item.b64_json,model:'muse-image-1.0'});
 if(item?.url){const u=new URL(item.url);if(u.protocol!=='https:')return json({error:'Unexpected image URL'},502);const image=await fetch(u,{redirect:'error',signal:AbortSignal.timeout(20000)});if(!image.ok)return json({error:'Could not retrieve edited image'},502);const bytes=new Uint8Array(await image.arrayBuffer());if(bytes.length>12000000)return json({error:'Edited image too large'},502);let base64='';for(let i=0;i<bytes.length;i+=16384)base64+=String.fromCharCode(...bytes.subarray(i,i+16384));return json({image:`data:${image.headers.get('content-type')?.split(';')[0]||'image/png'};base64,${btoa(base64)}`,model:'muse-image-1.0'})}
 return json({error:'Meta returned no image. Original retained.'},502)
 }catch{return json({error:'Meta could not complete the edit within the time limit. Original retained.'},502)}
}
