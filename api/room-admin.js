'use strict';
const {fail,project,encryptInvite,equal,sign,valid}=require('../lib/admin-core');
const failures=new Map();
const repo='webappdevlop2026-oss/-my-website';
async function gh(path,method='GET',body){const r=await fetch('https://api.github.com/repos/'+repo+path,{method,headers:{Authorization:'Bearer '+process.env.ROOM_GITHUB_TOKEN,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(12000)});if(!r.ok)fail(r.status===422?'The website changed while saving. Reload the projects and try again.':'Repository access failed. Check the server GitHub token and repository permission.',r.status===422?409:502);return r.json();}
async function read(){const head=await gh('/git/ref/heads/main');const sha=head.object.sha;const get=async p=>{const f=await gh('/contents/'+p+'?ref='+sha);return JSON.parse(Buffer.from(f.content,'base64').toString());};const [projects,invites]=await Promise.all([get('demo-room/projects.json'),get('demo-room/invitations.json')]);return {sha,projects,invites};}
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 const password=process.env.ROOM_ADMIN_PASSWORD,secret=process.env.ROOM_SESSION_SECRET;
 const configured=!!(password?.length>=12&&secret?.length>=32&&process.env.ROOM_GITHUB_TOKEN);
 const cookie=String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('room_admin='))?.slice(11)||'';
 const authenticated=configured&&valid(cookie,secret);
 try{
  if(req.method==='GET'){if(req.query?.action==='session')return res.status(200).json({configured,authenticated});if(!configured)fail('Admin setup is incomplete. Add the three server settings in Vercel.',503);if(!authenticated)fail('Please sign in.',401);const data=await read();return res.status(200).json({revision:data.sha,projects:data.projects.map(p=>({...p,hasInvite:data.invites.some(i=>i.id===p.id)}))});}
  if(req.method!=='POST'){res.setHeader('Allow','GET, POST');fail('Method not allowed.',405);}
  const origin=req.headers.origin;if(!origin||!['https://www.digitalagencybychandandas.in','https://digitalagencybychandandas.in'].includes(origin))fail('Untrusted request origin.',403);
  if(!configured)fail('Admin setup is incomplete. Add the three server settings in Vercel.',503);
  let body;try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{fail('Invalid request.');}if(!body||JSON.stringify(body).length>16000)fail('Invalid or oversized request.');
  if(body.action==='login'){
   const ip=String(req.headers['x-forwarded-for']||'unknown').split(',')[0],now=Date.now();for(const [k,v]of failures)if(v.until<now)failures.delete(k);const a=failures.get(ip)||{count:0,until:now+900000};if(a.count>=5){res.setHeader('Retry-After','900');fail('Too many sign-in attempts. Try again in 15 minutes.',429);}if(typeof body.password!=='string'||!equal(body.password,password)){a.count++;failures.set(ip,a);fail('Incorrect password.',401);}failures.delete(ip);res.setHeader('Set-Cookie','room_admin='+sign(secret)+'; HttpOnly; Secure; SameSite=Strict; Path=/api/room-admin; Max-Age=7200');return res.status(200).json({ok:true});
  }
  if(!authenticated)fail('Your session has expired. Please sign in.',401);
  if(body.action==='logout'){res.setHeader('Set-Cookie','room_admin=; HttpOnly; Secure; SameSite=Strict; Path=/api/room-admin; Max-Age=0');return res.status(200).json({ok:true});}
  if(body.action!=='save')fail('Unknown action.');
  const data=await read();if(body.revision!==data.sha)fail('The website changed. Reload projects before saving your edits.',409);
  const input=body.project;if(!input||typeof input!=='object')fail('Missing project.');const existing=input.id?data.projects.find(p=>p.id===input.id):null;if(input.id&&!existing)fail('Project not found.',404);
  const p=project(input,existing,new Set(data.projects.map(p=>p.code)));let invites=data.invites;
  if(body.invite){const invite=encryptInvite(p.id,body.invite.code,body.invite.url);invites=invites.filter(i=>i.id!==p.id).concat(invite);}
  if(body.disableInvite===true)invites=invites.filter(i=>i.id!==p.id);
  if(p.status!=='soon'&&!invites.some(i=>i.id===p.id)&&!['completed','published'].includes(p.status)&&body.disableInvite!==true&&!(existing?.inviteEnabled===false&&existing.status===p.status))fail('Add a demo URL and invite code before making this demo available.');
  p.inviteEnabled=invites.some(i=>i.id===p.id);
  const projects=existing?data.projects.map(old=>old.id===p.id?p:old):[...data.projects,p];
  const tree=await gh('/git/trees','POST',{base_tree:data.sha,tree:[{path:'demo-room/projects.json',mode:'100644',type:'blob',content:JSON.stringify(projects,null,2)+'\n'},{path:'demo-room/invitations.json',mode:'100644',type:'blob',content:JSON.stringify(invites,null,2)+'\n'}]});
  const commit=await gh('/git/commits','POST',{message:'Update demo room project '+p.code,tree:tree.sha,parents:[data.sha]});
  await gh('/git/refs/heads/main','PATCH',{sha:commit.sha,force:false});return res.status(200).json({ok:true,revision:commit.sha,projectId:p.code,message:'Saved to GitHub. The live website will update after Vercel finishes publishing.'});
 }catch(e){return res.status(e.status||500).json({error:e.status?e.message:'Unable to complete the request. Please try again.'});}
};
