const crypto = require('node:crypto');
// Read both files at the same current revision; deployment bundles can be stale.
async function readRoom() {
  const token = process.env.ROOM_GITHUB_TOKEN;
  if (!token) throw new Error('Room configuration unavailable');
  const get = async path => {
    const response = await fetch('https://api.github.com/repos/webappdevlop2026-oss/-my-website' + path, {
      headers: {Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'},
      cache: 'no-store', signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error('Room configuration unavailable');
    return response.json();
  };
  const head = await get('/git/ref/heads/main');
  const read = async path => {
    const file = await get('/contents/' + path + '?ref=' + head.object.sha);
    const data = JSON.parse(Buffer.from(file.content, 'base64').toString());
    if (!Array.isArray(data)) throw new Error('Invalid room configuration');
    return data;
  };
  const [catalog, projects] = await Promise.all([read('demo-room/projects.json'), read('demo-room/invitations.json')]);
  return {catalog, projects};
}
const attempts = new Map();
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') return res.status(405).json({error:'Use the invite form to open a project.'});
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0];
  const now = Date.now();
  for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
  const attempt = attempts.get(ip) || {count:0, until:now + 600000};
  if (attempt.count >= 20) {res.setHeader('Retry-After', '600');return res.status(429).json({error:'Too many attempts. Please try again in 10 minutes.'});}
  attempt.count++;attempts.set(ip, attempt);
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({error:'Invalid request.'}); }
  if (!body || typeof body.project !== 'string' || typeof body.code !== 'string' || body.code.length > 80) return res.status(400).json({error:'Enter your project invite code.'});
  let catalog, projects;
  try { ({catalog, projects} = await readRoom()); }
  catch { return res.status(503).json({error:'Unable to check demo access right now. Please try again shortly.'}); }
  const entry=catalog.find(p=>p.id===body.project);
  if(!entry||entry.hidden||entry.status==='soon'||entry.inviteEnabled===false)return res.status(403).json({error:'This demo is not currently available.'});
  const project = projects.find(p => p.id === body.project);
  const code = body.code.toUpperCase().replace(/[\s-]/g, '');
  if (!project || !(project.codeLength === 4 ? /^[0-9]{4}$/.test(code) : (project.codeLength ? /^[A-Z0-9_]{8,64}$/.test(code)&&code.length===project.codeLength : /^[A-F0-9]{24}$/.test(code)))) return res.status(403).json({error:'This invite code does not match this project.'});
  try {
    const key = crypto.scryptSync(code, project.salt, 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(project.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(project.tag, 'hex'));
    const payload = JSON.parse(Buffer.concat([decipher.update(Buffer.from(project.data, 'base64')), decipher.final()]).toString());
    attempts.delete(ip);
    return res.status(200).json(payload);
  } catch {return res.status(403).json({error:'This invite code does not match this project.'});}
};
