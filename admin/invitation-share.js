'use strict';
(()=>{
 const roomURL='https://www.digitalagencybychandandas.in/client-demo-room.html';
 const dialog=document.getElementById('invitationShare'),canvas=document.getElementById('inviteCanvas'),ctx=canvas.getContext('2d');
 let invitation=null;
 const status=text=>document.getElementById('shareStatus').textContent=text;
 function text(value,x,y,size,colour='#09234b',align='center',weight='400') {ctx.fillStyle=colour;ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.textAlign=align;ctx.fillText(value,x,y);}
 function box(x,y,w,h){ctx.beginPath();ctx.roundRect(x,y,w,h,12);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#0753d5';ctx.lineWidth=2;ctx.stroke();}
 function draw(){
  ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,1050,600);
  ctx.fillStyle='#f7faff';ctx.fillRect(0,0,1050,600);
  const bg=ctx.createLinearGradient(0,0,340,600);bg.addColorStop(0,'#071a39');bg.addColorStop(1,'#1257bd');ctx.fillStyle=bg;ctx.fillRect(0,0,310,600);
  ctx.strokeStyle='#ffffff0d';ctx.lineWidth=1;for(let x=10;x<310;x+=25){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,600);ctx.stroke();}for(let y=0;y<600;y+=25){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(310,y);ctx.stroke();}
  ctx.strokeStyle='#43a6ff80';ctx.lineWidth=1.5;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(0,370+i*29);ctx.lineTo(45+i*22,370+i*29);ctx.lineTo(105+i*22,430+i*29);ctx.lineTo(260,430+i*29);ctx.stroke();ctx.beginPath();ctx.arc(260,430+i*29,3,0,Math.PI*2);ctx.fillStyle='#74c8ff';ctx.fill();}
  ctx.fillStyle='#ffffff12';ctx.strokeStyle='#79baff66';ctx.beginPath();ctx.roundRect(38,40,64,64,15);ctx.fill();ctx.stroke();text('CD',70,83,25,'#fff','center','700');
  text('DIGITAL AGENCY',38,147,22,'#fff','left','700');text('by Chandan Das',38,174,16,'#aacdf9','left');
  text('Ideas.',38,246,32,'#fff','left','700');text('Code.',38,287,32,'#fff','left','700');text('Possibilities.',38,328,32,'#7ac9ff','left','700');
  text('EXCLUSIVE PROJECT ACCESS',38,558,10,'#bed9fc','left','700');
  text('CLIENT INVITATION  /  DIGITAL ACCESS PASS',350,55,11,'#52759f','left','700');
  text('Client Demo Room',350,111,41,'#0b2448','left','700');text('Your next idea, ready to explore.',350,143,17,'#6b819e','left');
  ctx.strokeStyle='#dce7f4';ctx.beginPath();ctx.moveTo(350,166);ctx.lineTo(1010,166);ctx.stroke();
  let titleSize=17;ctx.font=`700 ${titleSize}px Arial`;while(ctx.measureText(invitation.title).width>650&&titleSize>10){titleSize--;ctx.font=`700 ${titleSize}px Arial`;}text(invitation.title,350,198,titleSize,'#32567e','left','700');
  function panel(y,label,value,accent=false){ctx.fillStyle=accent?'#e9f2ff':'#fff';ctx.strokeStyle=accent?'#99bff3':'#d9e4f1';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(350,y,660,86,12);ctx.fill();ctx.stroke();ctx.fillStyle=accent?'#1262d8':'#96b6df';ctx.fillRect(350,y+18,3,50);text(label,373,y+27,10,'#587798','left','700');let size=accent?30:28;ctx.font=`700 ${size}px monospace`;while(ctx.measureText(value).width>610&&size>10){size--;ctx.font=`700 ${size}px monospace`;}ctx.font=`700 ${size}px monospace`;ctx.fillStyle=accent?'#0b55c4':'#173e6e';ctx.textAlign='left';ctx.fillText(value,373,y+63);}
  panel(217,'PROJECT ID',invitation.id);panel(316,'INVITE CODE',invitation.code,true);
  text('01  Open the room     02  Find your project     03  Enter your code',350,433,12,'#5c7697','left');
  text('www.digitalagencybychandandas.in',350,477,22,'#154c99','left','700');text('/client-demo-room.html',350,505,20,'#154c99','left','700');
  ctx.strokeStyle='#dce7f4';ctx.beginPath();ctx.moveTo(350,530);ctx.lineTo(1010,530);ctx.stroke();text('WhatsApp  +91 7549459770',350,564,15,'#345579','left','600');ctx.fillStyle='#125ed2';ctx.beginPath();ctx.roundRect(850,544,160,31,6);ctx.fill();text('INVITATION ONLY',930,564,11,'#fff','center','700');
 }
 const blob=()=>new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Could not create card. Please try again.')),'image/png'));
 async function download(){if(!invitation)return;const b=await blob(),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=`Client-Invitation-${invitation.id}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
 window.clearInvitation=()=>{invitation=null;document.getElementById('clientMessage').value='';ctx.clearRect(0,0,1050,600);if(dialog.open)dialog.close();};
 window.showInvitation=({id,title,code,ready})=>{
  invitation={id:String(id),code:code.toUpperCase().replace(/[\s-]/g,''),title};draw();
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
