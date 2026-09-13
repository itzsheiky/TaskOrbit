export function mountStarfield(canvas, intensity = 'normal', reducedMotion = false) {
  const ctx = canvas.getContext('2d'); let stars = [], frame;
  const resize = () => { const ratio = Math.min(devicePixelRatio || 1, 2); canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; ctx.setTransform(ratio, 0, 0, ratio, 0, 0); const count = intensity === 'minimal' ? 35 : intensity === 'high' ? 110 : 70; stars = Array.from({ length: count }, () => ({ x: Math.random()*innerWidth, y: Math.random()*innerHeight, r: Math.random()*1.3+.2, a: Math.random()*.6+.2, v: Math.random()*.08+.02 })); };
  const draw = () => { ctx.clearRect(0,0,innerWidth,innerHeight); for (const s of stars) { ctx.beginPath(); ctx.fillStyle=`rgba(225,216,255,${s.a})`; ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); if(!reducedMotion){s.y+=s.v;if(s.y>innerHeight)s.y=0;} } if(!reducedMotion)frame=requestAnimationFrame(draw); };
  resize(); draw(); addEventListener('resize', resize); return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); };
}
