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
 function draw(){
  ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,1536,1024);
  document.getElementById('shareInvite').disabled=!templateReady;
  document.getElementById('downloadInvite').disabled=!templateReady;
  if(!templateReady){ctx.fillStyle='#06172e';ctx.fillRect(0,0,1536,1024);text('Preparing your invitation…',768,512,32,'#fff');return;}
  ctx.drawImage(template,0,0,1536,1024);
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
  document.getElementById('clientMessage').value=`Hello!\n\nYour ${title} project demo is ready to preview.\n\nOpen: ${roomURL}\nProject ID: ${id}\nInvite Code: ${invitation.code}\n\nSelect your project, enter the invite code and tap “Unlock & Open Demo”. Please share your feedback after reviewing it.\n\nDigital Agency by Chandan Das\nWhatsApp: +91 7549459770`;
  document.getElementById('shareNotice').textContent=ready?'Invite code saved. The card is ready. New website updates may take a little time to publish.':'Invite code saved, but this project is hidden or Coming Soon. Make it visible and available before inviting a client.';
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
