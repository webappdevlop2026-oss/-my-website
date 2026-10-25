'use strict';
(()=>{
 const roomURL='https://www.digitalagencybychandandas.in/client-demo-room.html';
 const dialog=document.getElementById('invitationShare'),canvas=document.getElementById('inviteCanvas'),ctx=canvas.getContext('2d');
 const ROOM_QR=[[1,1,1,1,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,0,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,0,1,1,0,1,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,0,0,0,0,1,0,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,1,1,0,1,0,1,1,1,1,0,0,0,1,1,0,1,0,0,1,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,1,1,0,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,1,0,0,1,1,0,1,1,0,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0],[1,0,0,0,1,0,1,1,1,1,0,0,1,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1],[1,1,1,0,0,0,0,1,1,1,1,0,1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,0,0,1,1,1,0],[1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0],[1,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,1,0],[1,1,1,0,0,1,1,0,1,1,1,0,0,1,1,0,1,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1],[0,0,1,0,1,1,0,0,0,1,1,1,0,1,1,1,1,1,1,0,0,0,1,1,0,1,0,1,0,1,0,0,0],[1,1,1,1,0,1,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0],[0,0,1,0,0,1,0,1,0,0,1,1,1,0,1,1,1,1,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0],[0,1,0,1,0,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,1,1,1,1,1,0,1,0,1,0,0,1,0],[1,0,0,0,0,0,0,1,0,1,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,0],[0,0,1,1,1,1,1,0,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,1,1,1,1,1,0,1,0,1,0],[1,1,1,0,1,0,0,0,0,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,0,0,0,0,0],[1,1,0,0,1,0,1,0,1,1,0,0,0,1,0,1,0,1,0,0,1,1,0,0,1,1,1,0,1,1,0,0,1],[1,0,1,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,0,1,0,0,0,1,1,1,0],[0,0,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,0,1,0],[0,0,1,0,0,1,0,1,0,0,1,1,1,0,1,0,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,0,1],[1,1,0,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,1,0,1,1,0],[1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,0,1,0],[1,0,0,0,0,0,1,0,0,1,1,0,0,1,1,0,1,1,1,0,0,1,0,0,1,0,0,0,1,0,0,0,1],[1,0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1,0,1,1,1,1,1,1,0,0,0],[1,0,1,1,1,0,1,0,0,1,0,0,0,0,0,1,0,1,1,0,0,0,0,1,0,0,1,1,1,0,1,0,0],[1,0,1,1,1,0,1,0,0,0,0,0,0,1,1,1,0,1,0,0,0,1,0,0,0,1,1,1,1,0,0,0,0],[1,0,0,0,0,0,1,0,0,0,0,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0],[1,1,1,1,1,1,1,0,1,0,0,0,1,0,0,1,0,1,0,1,1,1,1,1,1,0,0,0,0,1,0,0,1]];
 let invitation=null;
 const status=text=>document.getElementById('shareStatus').textContent=text;
 function text(value,x,y,size,colour='#09234b',align='center',weight='400') {ctx.fillStyle=colour;ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.textAlign=align;ctx.fillText(value,x,y);}
 function box(x,y,w,h){ctx.beginPath();ctx.roundRect(x,y,w,h,12);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#0753d5';ctx.lineWidth=2;ctx.stroke();}
 const template=new Image();let templateReady=false;
 template.onload=()=>{templateReady=true;if(invitation){draw();status('Your invitation card is ready to download or share.');}};
 template.onerror=()=>{if(invitation)status('Card artwork could not load. Please refresh and try again.');};
 template.src='/admin/assets/invitation-template.webp';
 function projectKind(){
  const name=(invitation.title+' '+invitation.category).toLowerCase();
  const kind=/property|real estate|hotel|resort/.test(name)?'building':/calendar|panjika/.test(name)?'calendar':/education|school|coaching|course|learning|mock test/.test(name)?'book':/restaurant|food/.test(name)?'food':/live|stream|video|youtube/.test(name)?'video':/doctor|hospital|clinic|health|pharmacy/.test(name)?'health':/commerce|shop|grocery|market|store/.test(name)?'shop':/taxi|cab|courier|parcel|rider|rental|vehicle|travel|transport/.test(name)?'travel':/game|quiz/.test(name)?'game':'code';
  return kind;
 }
 function paintProjectArtwork(kind){
  const light='#75eaff';
  function stroke(points,color=light,width=3){ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();}
  function icon(type,x,y,size){ctx.save();ctx.translate(x,y);ctx.scale(size/100,size/100);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=light;ctx.lineWidth=4;
   const rect=(x,y,w,h)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,5);ctx.stroke();};
   if(type==='building'){stroke([[12,44],[50,12],[88,44]]);rect(23,44,54,43);rect(43,62,15,25);}
   else if(type==='calendar'){rect(16,22,68,65);stroke([[16,42],[84,42]]);stroke([[32,12],[32,31]]);stroke([[68,12],[68,31]]);for(let i=0;i<3;i++)for(let j=0;j<2;j++){ctx.fillStyle=light;ctx.fillRect(29+i*18,53+j*16,7,7);}}
   else if(type==='book'){stroke([[50,29],[26,18],[12,21],[12,80],[30,78],[50,89],[70,78],[88,80],[88,21],[73,18],[50,29],[50,89]]);stroke([[24,37],[39,43]]);stroke([[62,43],[77,37]]);}
   else if(type==='food'){stroke([[23,13],[23,88]]);stroke([[12,13],[12,38],[34,38],[34,13]]);stroke([[70,13],[55,45],[70,49],[70,88]]);}
   else if(type==='video'){rect(9,27,56,49);stroke([[65,41],[90,27],[90,76],[65,62]]);}
   else if(type==='shop'){stroke([[8,17],[20,17],[29,66],[79,66],[90,30],[24,30]]);for(const x of [36,73]){ctx.beginPath();ctx.arc(x,83,5,0,Math.PI*2);ctx.stroke();}}
   else if(type==='health'){stroke([[37,13],[63,13],[63,37],[87,37],[87,63],[63,63],[63,87],[37,87],[37,63],[13,63],[13,37],[37,37],[37,13]]);}
   else if(type==='travel'){stroke([[12,67],[12,44],[24,38],[35,19],[68,19],[79,38],[89,44],[89,67],[12,67]]);stroke([[25,38],[77,38]]);for(const x of [27,74]){ctx.beginPath();ctx.arc(x,73,8,0,Math.PI*2);ctx.stroke();}}
   else if(type==='game'){rect(9,26,82,51);stroke([[23,51],[43,51]]);stroke([[33,41],[33,61]]);ctx.fillStyle=light;ctx.beginPath();ctx.arc(68,44,4,0,7);ctx.arc(78,57,4,0,7);ctx.fill();}
   else{stroke([[31,25],[10,50],[31,75]]);stroke([[69,25],[90,50],[69,75]]);stroke([[58,16],[42,84]]);}
   ctx.restore();
  }
  ctx.save();ctx.shadowColor='#00b7ff';ctx.shadowBlur=22;
  const glow=ctx.createRadialGradient(205,735,25,205,735,135);glow.addColorStop(0,'#125c9c');glow.addColorStop(1,'#031c4380');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(205,735,125,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#5cdaff';ctx.lineWidth=2;ctx.stroke();icon(kind,105,635,200);ctx.restore();
 }
 const genericTemplate=new Image();let genericReady=false;
 genericTemplate.onload=()=>{genericReady=true;if(invitation)draw();};
 genericTemplate.onerror=()=>{if(invitation)status('Project artwork could not load. Please refresh and try again.');};
 genericTemplate.src='/admin/assets/invitation-generic.webp';
 function draw(){
  ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,1536,1024);
  const kind=projectKind(),artReady=kind==='building'?templateReady:genericReady;
  document.getElementById('shareInvite').disabled=!artReady;
  document.getElementById('downloadInvite').disabled=!artReady;
  if(!artReady){ctx.fillStyle='#06172e';ctx.fillRect(0,0,1536,1024);text('Preparing your invitation…',768,512,32,'#fff');return;}
  ctx.drawImage(kind==='building'?template:genericTemplate,0,0,1536,1024);
  if(kind!=='building')paintProjectArtwork(kind);
  function fit(value,x,y,size,width,metal=false,font='Arial'){
   ctx.font=`700 ${size}px ${font}`;while(ctx.measureText(value).width>width&&size>10){size--;ctx.font=`700 ${size}px ${font}`;}
   ctx.textAlign='left';const g=ctx.createLinearGradient(0,y-size,0,y+5);g.addColorStop(0,'#fff');g.addColorStop(.55,'#f4f8ff');g.addColorStop(1,'#a5b7d4');ctx.fillStyle=metal?g:'#f6f8ff';ctx.shadowColor='#0008';ctx.shadowBlur=4;ctx.fillText(value,x,y);ctx.shadowBlur=0;
  }
  fit(invitation.title,625,365,42,650);
  fit(invitation.id,632,570,82,285,true);
  // Long generated codes wrap inside the same artwork panel for readability.
  const code=invitation.code;
  if(code.length>16){const rows=code.match(/.{1,16}/g)||[];rows.forEach((row,i)=>fit(row,1148,521+i*20,18,270,false,'monospace'));}
  else fit(code,1148,575,86,270,true,'monospace');
  const q=ROOM_QR,n=q.length,cell=2,side=(n+8)*cell,qx=1357,qy=743;
  ctx.fillStyle='#fff';ctx.fillRect(qx,qy,side,side);ctx.fillStyle='#03142c';q.forEach((row,y)=>row.forEach((v,x)=>{if(v)ctx.fillRect(qx+(x+4)*cell,qy+(y+4)*cell,cell,cell);}));
 }
 const blob=()=>new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Could not create card. Please try again.')),'image/png'));
 async function download(){if(!invitation)return;const b=await blob(),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=`Client-Invitation-${invitation.id}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
 window.clearInvitation=()=>{invitation=null;document.getElementById('clientMessage').value='';ctx.clearRect(0,0,1536,1024);if(dialog.open)dialog.close();};
 window.showInvitation=({id,title,code,ready,theme,category})=>{
  invitation={id:String(id),code:code.toUpperCase().replace(/[\s-]/g,''),title,theme,category:category||''};draw();
  document.getElementById('clientMessage').value=`Hello!\n\n${ready?'Your '+title+' project demo is ready to preview.':'Here is your invitation for '+title+'. Your preview will open once the demo is added and access is enabled.'}\n\nOpen: ${roomURL}\nProject ID: ${id}\nInvite Code: ${invitation.code}\n\nSelect your project, enter the invite code and tap “Unlock & Open Demo”. Please share your feedback after reviewing it.\n\nDigital Agency by Chandan Das\nWhatsApp: +91 7549459770`;
  document.getElementById('shareNotice').textContent=ready?'Invite code saved. The card is ready. New website updates may take a little time to publish.':'Invite code saved, but the demo is not linked yet or the project is hidden. You can share this card now; the preview will open after the demo is linked and the project is visible.';
  status('Download or share now. The invite code is kept only while this card is open; it is not stored in this browser.');dialog.showModal();
 };
 document.getElementById('closeShare').onclick=window.clearInvitation;
 dialog.addEventListener('cancel',e=>{e.preventDefault();window.clearInvitation();});
 document.getElementById('downloadInvite').onclick=async()=>{try{await download();status('Card downloaded. Attach this image in your client’s WhatsApp chat.');}catch(e){status(e.message);}};
 document.getElementById('copyInviteMessage').onclick=async()=>{try{await navigator.clipboard.writeText(document.getElementById('clientMessage').value);status('Client message copied.');}catch{status('Select the message below and copy it manually.');}};
 document.getElementById('whatsappInvite').onclick=()=>{window.open('https://wa.me/?text='+encodeURIComponent(document.getElementById('clientMessage').value),'_blank','noopener,noreferrer');status('Choose the client in WhatsApp. Attach the downloaded card before sending.');};
 document.getElementById('shareInvite').onclick=async()=>{
  if(!invitation)return;
  const message=document.getElementById('clientMessage').value;
  // Start clipboard access directly from the click, before opening another app.
  const copied=navigator.clipboard?.writeText? navigator.clipboard.writeText(message).then(()=>true,()=>false):Promise.resolve(false);
  const button=document.getElementById('shareInvite');button.disabled=true;
  try{
   const file=new File([await blob()],`Client-Invitation-${invitation.id}.png`,{type:'image/png'});
   const payload={files:[file],text:message,title:'Client Demo Room invitation'};
   if(navigator.canShare?.(payload)){
    status('Sharing card, message and room link. If WhatsApp leaves the caption empty, paste the automatically copied message before sending.');
    await navigator.share(payload);
    status(await copied?'Message and room link copied automatically. If WhatsApp omitted the caption, paste it before sending.':'Share sheet closed. Automatic copy was blocked by this browser; use Copy message if the caption is missing.');
   }else{
    await download();
    status(await copied?'Card downloaded; message and room link copied automatically. Open WhatsApp, attach the card and paste into its caption.':'Card downloaded. This browser cannot share files or copy automatically. Use WhatsApp message, then attach the card.');
   }
  }catch(e){status(e.name==='AbortError'?'Sharing cancelled. Nothing was sent by this page.':'Sharing unavailable. Use Download card and WhatsApp message.');}
  finally{button.disabled=false;}
 };
})();
