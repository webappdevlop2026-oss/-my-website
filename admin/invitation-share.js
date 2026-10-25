'use strict';
(()=>{
 const roomURL='https://www.digitalagencybychandandas.in/client-demo-room.html';
 const dialog=document.getElementById('invitationShare'),canvas=document.getElementById('inviteCanvas'),ctx=canvas.getContext('2d');
 let invitation=null;
 const status=text=>document.getElementById('shareStatus').textContent=text;
 function text(value,x,y,size,colour='#09234b',align='center',weight='400') {ctx.fillStyle=colour;ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.textAlign=align;ctx.fillText(value,x,y);}
 function box(x,y,w,h){ctx.beginPath();ctx.roundRect(x,y,w,h,12);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#0753d5';ctx.lineWidth=2;ctx.stroke();}
 function draw(){
  ctx.clearRect(0,0,1050,600);ctx.fillStyle='#fff';ctx.fillRect(0,0,1050,600);
  const gradient=ctx.createLinearGradient(930,0,1050,600);gradient.addColorStop(0,'#0764df');gradient.addColorStop(1,'#062c65');ctx.fillStyle=gradient;ctx.beginPath();ctx.moveTo(975,0);ctx.bezierCurveTo(1010,190,1090,280,925,600);ctx.lineTo(1050,600);ctx.lineTo(1050,0);ctx.fill();
  ctx.strokeStyle='#b6d8ff';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(0,30+i*18);ctx.lineTo(60+i*16,30+i*18);ctx.lineTo(95+i*16,65+i*18);ctx.stroke();ctx.beginPath();ctx.arc(95+i*16,65+i*18,4,0,Math.PI*2);ctx.stroke();}
  text('D I G I T A L  A G E N C Y',515,47,22,'#09234b','center','700');text('by Chandan Das',515,75,20);
  text('CLIENT DEMO ROOM',510,173,66,'#0648b7','center','800');text('Your exclusive project preview',510,216,27);
  text('PROJECT ID',115,300,20,'#09234b','left','700');box(280,266,610,55);text(invitation.id,585,302,28,'#073777','center','700');
  text('INVITE CODE',115,377,20,'#09234b','left','700');box(280,343,610,55);let codeSize=28;ctx.font=`700 ${codeSize}px Arial`;while(ctx.measureText(invitation.code).width>570&&codeSize>10){codeSize--;ctx.font=`700 ${codeSize}px Arial`;}text(invitation.code,585,379,codeSize,'#073777','center','700');
  text('Open the link  •  Find your project  •  Enter your code',510,444,23);
  text('www.digitalagencybychandandas.in',510,492,26,'#0753d5','center','700');text('/client-demo-room.html',510,525,25,'#0753d5','center','700');
  text('WhatsApp: +91 7549459770',310,573,20,'#09234b','center','600');ctx.fillStyle='#0753d5';ctx.beginPath();ctx.roundRect(650,548,240,35,18);ctx.fill();text('INVITATION ONLY',770,572,18,'#fff','center','700');
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
