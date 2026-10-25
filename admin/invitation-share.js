'use strict';
(()=>{
 const roomURL='https://www.digitalagencybychandandas.in/client-demo-room.html';
 const dialog=document.getElementById('invitationShare'),canvas=document.getElementById('inviteCanvas'),ctx=canvas.getContext('2d');
 const ROOM_QR=[[1,1,1,1,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,0,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,0,1,1,0,1,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,0,0,0,0,1,0,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,1,1,0,1,0,1,1,1,1,0,0,0,1,1,0,1,0,0,1,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,1,1,0,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,1,0,0,1,1,0,1,1,0,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0],[1,0,0,0,1,0,1,1,1,1,0,0,1,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1],[1,1,1,0,0,0,0,1,1,1,1,0,1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,0,0,1,1,1,0],[1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0],[1,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,1,0],[1,1,1,0,0,1,1,0,1,1,1,0,0,1,1,0,1,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,1],[0,0,1,0,1,1,0,0,0,1,1,1,0,1,1,1,1,1,1,0,0,0,1,1,0,1,0,1,0,1,0,0,0],[1,1,1,1,0,1,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0],[0,0,1,0,0,1,0,1,0,0,1,1,1,0,1,1,1,1,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0],[0,1,0,1,0,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,1,1,1,1,1,0,1,0,1,0,0,1,0],[1,0,0,0,0,0,0,1,0,1,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,0],[0,0,1,1,1,1,1,0,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,1,1,1,1,1,0,1,0,1,0],[1,1,1,0,1,0,0,0,0,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,0,0,0,0,0],[1,1,0,0,1,0,1,0,1,1,0,0,0,1,0,1,0,1,0,0,1,1,0,0,1,1,1,0,1,1,0,0,1],[1,0,1,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,0,1,0,0,0,1,1,1,0],[0,0,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,0,1,0],[0,0,1,0,0,1,0,1,0,0,1,1,1,0,1,0,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,0,1],[1,1,0,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,1,0,1,1,0],[1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,0,1,0],[1,0,0,0,0,0,1,0,0,1,1,0,0,1,1,0,1,1,1,0,0,1,0,0,1,0,0,0,1,0,0,0,1],[1,0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1,0,1,1,1,1,1,1,0,0,0],[1,0,1,1,1,0,1,0,0,1,0,0,0,0,0,1,0,1,1,0,0,0,0,1,0,0,1,1,1,0,1,0,0],[1,0,1,1,1,0,1,0,0,0,0,0,0,1,1,1,0,1,0,0,0,1,0,0,0,1,1,1,1,0,0,0,0],[1,0,0,0,0,0,1,0,0,0,0,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0],[1,1,1,1,1,1,1,0,1,0,0,0,1,0,0,1,0,1,0,1,1,1,1,1,1,0,0,0,0,1,0,0,1]];
 let invitation=null;
 const status=text=>document.getElementById('shareStatus').textContent=text;
 function text(value,x,y,size,colour='#09234b',align='center',weight='400') {ctx.fillStyle=colour;ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.textAlign=align;ctx.fillText(value,x,y);}
 function box(x,y,w,h){ctx.beginPath();ctx.roundRect(x,y,w,h,12);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#0753d5';ctx.lineWidth=2;ctx.stroke();}
 function draw(){
  const palette={blue:['#08d8ff','#0872ff'],rose:['#ff9abb','#d73575'],green:['#6dffc7','#079778'],violet:['#cfb0ff','#7644df'],gold:['#ffe5a0','#c69223'],orange:['#ffd099','#e77620'],pink:['#ffb4f0','#c335a7']};
  const [light,accent]=palette[invitation.theme]||palette.blue;
  const name=(invitation.title+' '+invitation.category).toLowerCase();
  const kind=/property|real estate|hotel|resort/.test(name)?'building':/calendar|panjika/.test(name)?'calendar':/education|school|coaching|course|learning|mock test/.test(name)?'book':/restaurant|food/.test(name)?'food':/live|stream|video|youtube/.test(name)?'video':/commerce|shop|grocery|market|store/.test(name)?'shop':/doctor|hospital|clinic|health|pharmacy/.test(name)?'health':/taxi|cab|courier|parcel|rider|rental|vehicle|travel|transport/.test(name)?'travel':/game|quiz/.test(name)?'game':'code';
  ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,1500,1000);
  const bg=ctx.createLinearGradient(0,0,1500,1000);bg.addColorStop(0,'#04102b');bg.addColorStop(.5,'#020a1b');bg.addColorStop(1,'#092958');ctx.fillStyle=bg;ctx.fillRect(0,0,1500,1000);
  ctx.save();ctx.globalAlpha=.18;ctx.strokeStyle=accent;for(let i=-800;i<1700;i+=28){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+950,1000);ctx.stroke();}ctx.restore();
  function panel(x,y,w,h,fill='#061a36',glow=false,r=20){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,r);const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,fill);g.addColorStop(.55,'#031027');g.addColorStop(1,'#0a2b52');ctx.fillStyle=g;ctx.fill();const border=ctx.createLinearGradient(x,y,x+w,y+h);border.addColorStop(0,'#f1f6ff');border.addColorStop(.25,'#718ab1');border.addColorStop(.65,light);border.addColorStop(1,accent);ctx.strokeStyle=border;ctx.lineWidth=2;if(glow){ctx.shadowColor=accent;ctx.shadowBlur=22;}ctx.stroke();ctx.restore();ctx.save();ctx.globalAlpha=.4;ctx.strokeStyle=light;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+14,y+31);ctx.lineTo(x+14,y+16);ctx.lineTo(x+31,y+16);ctx.moveTo(x+w-31,y+h-14);ctx.lineTo(x+w-14,y+h-14);ctx.lineTo(x+w-14,y+h-31);ctx.stroke();ctx.restore();}
  function fit(value,x,y,size,width,color='#f4f8ff',font='Arial',align='left'){ctx.font=`700 ${size}px ${font}`;while(ctx.measureText(value).width>width&&size>10){size--;ctx.font=`700 ${size}px ${font}`;}ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(value,x,y);}
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
  panel(25,28,1450,944,'#06142d',false,36);panel(43,46,355,907,'#092349',false,30);
  ctx.save();ctx.globalAlpha=.13;ctx.strokeStyle=light;for(let i=62;i<380;i+=18){ctx.beginPath();ctx.moveTo(i,65);ctx.lineTo(i,911);ctx.stroke();}ctx.restore();
  panel(114,83,205,174,'#123d70',true,28);fit('CD',216,205,94,170,'#fff','Arial','center');
  fit('DIGITAL AGENCY',72,309,31,300);text('by Chandan Das',72,344,24,'#bed5f2','left');stroke([[72,369],[368,369]],light,1);
  text('Ideas.',72,427,48,'#f5f9ff','left','700');text('Code.',72,480,48,'#f5f9ff','left','700');text('Possibilities.',72,533,42,light,'left','700');
  if(kind==='building'){
   for(let i=0;i<3;i++){const x=72+i*91,y=628-i*24,h=220+i*24;const g=ctx.createLinearGradient(x,y,x+85,y+h);g.addColorStop(0,'#235e8d');g.addColorStop(1,'#071527');ctx.fillStyle=g;ctx.fillRect(x,y,85,h);stroke([[x,y+h],[x,y],[x+85,y-22],[x+85,y+h]],light,1);for(let c=0;c<4;c++)for(let r=0;r<8;r++){ctx.fillStyle=(c+r+i)%5===0?'#ffe3a9':accent;ctx.globalAlpha=.6;ctx.fillRect(x+9+c*18,y+17+r*24,10,14);ctx.globalAlpha=1;}}
   stroke([[62,860],[359,860]],light,2);
  }else{panel(91,586,260,260,'#0b3159',true,30);icon(kind,128,623,185);}
  for(let i=0;i<3;i++){stroke([[44,565+i*23],[62,583+i*23],[82,583+i*23]],light,1);ctx.beginPath();ctx.arc(82,583+i*23,3,0,7);ctx.fillStyle=light;ctx.fill();}
  text('EXCLUSIVE',74,905,13,'#bdd8fa','left','700');text('PROJECT ACCESS',74,928,13,'#bdd8fa','left','700');
  text('CLIENT INVITATION  /  DIGITAL ACCESS PASS',444,93,13,'#d7e8ff','left');stroke([[444,106],[1168,106]],light,1);
  fit('CLIENT DEMO',444,191,71,560);fit('ROOM',1004,191,71,225,light);text('Your next idea, ready to explore.',444,233,28,'#c1d8f5','left');
  // Decorative access seal, not a certification badge.
  ctx.save();ctx.shadowColor=accent;ctx.shadowBlur=20;for(const [r,col]of [[86,light],[78,'#fff'],[71,accent]]){ctx.beginPath();ctx.arc(1351,158,r,0,Math.PI*2);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();}ctx.restore();text('EXCLUSIVE',1351,139,14,'#fff','center','700');text('CLIENT',1351,163,16,'#fff','center','700');text('ACCESS',1351,187,14,light,'center','700');
  panel(440,275,1000,108,'#102f55');icon(kind,465,288,75);fit(invitation.title,560,339,39,850);
  panel(440,405,472,162,'#0a2446');text('PROJECT ID',466,446,16,'#d2e3fa','left');fit(invitation.id,466,531,72,421);
  panel(934,405,506,162,'#124d94',true);text('INVITE CODE',960,446,16,light,'left');fit(invitation.code,960,531,72,452,'#fff','monospace');
  panel(440,591,1000,80,'#0a2042');const steps=['Open the room','Find your project','Enter your code'];steps.forEach((label,i)=>{const x=475+i*330;ctx.beginPath();ctx.arc(x,631,23,0,7);ctx.strokeStyle=light;ctx.lineWidth=2;ctx.stroke();text('0'+(i+1),x,639,19,'#fff','center','700');text(label,x+38,639,21,'#e1edff','left');});
  panel(440,694,1000,134,'#092951');text('DEMO ROOM LINK',465,725,11,light,'left','700');fit('www.digitalagencybychandandas.in',465,765,30,805);text('/client-demo-room.html',465,800,28,light,'left','700');
  // Real, locally generated QR for the room URL, with four-module quiet zone.
  const q=ROOM_QR,n=q.length,cell=2,side=(n+8)*cell,qx=1430-side,qy=704;ctx.fillStyle='#fff';ctx.fillRect(qx,qy,side,side);ctx.fillStyle='#04142c';q.forEach((row,y)=>row.forEach((v,x)=>{if(v)ctx.fillRect(qx+(x+4)*cell,qy+(y+4)*cell,cell,cell);}));
  text('WhatsApp  +91 7549459770',444,895,26,'#e5efff','left','700');panel(1100,853,340,61,'#124e9d',true,16);text('INVITATION ONLY',1270,893,24,'#fff','center','700');
 }
 const blob=()=>new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Could not create card. Please try again.')),'image/png'));
 async function download(){if(!invitation)return;const b=await blob(),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=`Client-Invitation-${invitation.id}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
 window.clearInvitation=()=>{invitation=null;document.getElementById('clientMessage').value='';ctx.clearRect(0,0,1500,1000);if(dialog.open)dialog.close();};
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
