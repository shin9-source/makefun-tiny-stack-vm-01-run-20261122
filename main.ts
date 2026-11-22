import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const C='\x00\x01\x02\x03\x04\x05\x06\x07\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e !"01234@APQRS';
const IM='0140000000000000000000000022220000000',PO='0001122322222221222122222201100121101',PU='0110223311111111111111111100000100010';
const B=[(a,b)=>(a+b)|0,(a,b)=>(a-b)|0,Math.imul,(a,b)=>a===-2147483648&&b===-1?a:(a/b)|0,(a,b)=>(a%b)|0,(a,b)=>Math.floor((a>>>0)/(b>>>0))|0,(a,b)=>((a>>>0)%(b>>>0))|0,,(a,b)=>a&b,(a,b)=>a|b,(a,b)=>a^b,,(a,b)=>a<<(b&31),(a,b)=>a>>(b&31),(a,b)=>(a>>>(b&31))|0,,(a,b)=>a===b?1:0,(a,b)=>a<b?1:0,(a,b)=>(a>>>0)<(b>>>0)?1:0];
function run(p,q){
 const n=p.length,D=new Int32Array(256);let s=0;
 const K=new Int32Array(64);let c=0;
 const M=new Int32Array(256),o=new Uint8Array(65536);let l=0,i=0,pc=0,t=0;
 const e=x=>({out:o.slice(0,l),code:x});
 for(;;){
  if(t===1e6)return e(10);
  if(pc<0||pc>=n)return e(9);
  const op=p[pc],k=C.indexOf(String.fromCharCode(op));
  if(k<0)return e(5);
  const m=+IM[k];
  if(pc+m>=n)return e(9);
  t++;
  const x=pc+1+m,po=+PO[k],pu=+PU[k];
  if(s<po)return e(2);
  if(s-po+pu>256)return e(3);
  pc=x;
  switch(op){
   case 0:return e(0);
   case 1:D[s++]=(p[x-1]<<24)>>24;break;
   case 2:D[s++]=p[x-4]|p[x-3]<<8|p[x-2]<<16|p[x-1]<<24;break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:{const v=D[s-1];D[s-1]=D[s-2];D[s-2]=v;break;}
   case 6:D[s]=D[s-2];s++;break;
   case 7:{const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;break;}
   case 23:D[s-1]=-D[s-1]|0;break;
   case 27:D[s-1]=~D[s-1];break;
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
    const b=D[s-1],a=D[s-2];
    if(!b&&op>18&&op<23)return e(4);
    s-=2;D[s++]=B[op-16](a,b);break;
   }
   case 48:case 49:case 50:{
    const r=((p[x-2]|p[x-1]<<8)<<16)>>16;let y=1;
    if(op!==48){const v=D[--s];y=op===49?v===0:v!==0;}
    if(y)pc=x+r;break;
   }
   case 51:
    if(c===64)return e(7);
    K[c++]=x;pc=p[x-2]|p[x-1]<<8;break;
   case 52:
    if(!c)return e(8);
    pc=K[--c];break;
   case 64:{
    const a=D[s-1];
    if(a<0||a>=256)return e(6);
    D[s-1]=M[a];break;
   }
   case 65:{
    const a=D[s-1],v=D[s-2];
    if(a<0||a>=256)return e(6);
    s-=2;M[a]=v;break;
   }
   case 80:{
    const g=String(D[s-1]);
    if(l+g.length>65536)return e(11);
    s--;
    for(let j=0;j<g.length;j++)o[l++]=g.charCodeAt(j);
    break;
   }
   case 81:
    if(l+1>65536)return e(11);
    o[l++]=D[--s]&255;break;
   case 82:D[s++]=i<q.length?q[i++]:-1;break;
   case 83:return e(D[--s]&255);
  }
 }
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
const r=f=>{try{return new Uint8Array(readFileSync(f))}catch{return new Uint8Array(0)}};
for(const id of readdirSync(I).sort()){
 const v=run(r(join(I,id,'program.bin')),r(join(I,id,'input.bin')));
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),v.out);
 writeFileSync(join(O,id,'exit.txt'),`${v.code}\n`);
}
