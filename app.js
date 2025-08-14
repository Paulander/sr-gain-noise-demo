
function phi(z){ return 0.5*(1+erf(z/Math.SQRT2)); }
function erf(x){
  const sign = Math.sign(x);
  x = Math.abs(x);
  const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
  const t = 1/(1+p*x);
  const y = 1-((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return sign*y;
}

function balAcc(g, theta, s, sigmaInt, alpha, sigmaExt){
  const sigma = Math.sqrt(sigmaInt*sigmaInt + (alpha*sigmaExt)*(alpha*sigmaExt));
  if (sigma === 0){
    const H = (g*s > theta) ? 1 : 0;
    const F = (theta < 0) ? 1 : 0;
    return 0.5*(H + (1-F));
  } else {
    const H = 1 - phi((theta - g*s)/(g*sigma));
    const F = 1 - phi(theta/(g*sigma));
    return 0.5*(H + (1-F));
  }
}

const ids = ["s","theta","sigmaInt","alpha","sigmaMax","g1","g2","showTwo","showVals"];
const el = Object.fromEntries(ids.map(id=>[id, document.getElementById(id)]));

const canvas = document.getElementById("plot");
const ctx = canvas.getContext("2d");
const peakAEl = document.getElementById("peakA");
const peakBEl = document.getElementById("peakB");

const valSpans = {
  s: document.getElementById("sVal"),
  theta: document.getElementById("thetaVal"),
  sigmaInt: document.getElementById("sigmaIntVal"),
  alpha: document.getElementById("alphaVal"),
  sigmaMax: document.getElementById("sigmaMaxVal"),
  g1: document.getElementById("g1Val"),
  g2: document.getElementById("g2Val"),
};

function fmt(id, v){
  const map = { s:2, theta:2, sigmaInt:3, alpha:2, sigmaMax:2, g1:2, g2:2 };
  const d = map[id] ?? 2;
  return Number(v).toFixed(d);
}

function updateValDisplays(){
  for (const k of ["s","theta","sigmaInt","alpha","sigmaMax","g1","g2"]){
    if (valSpans[k]) valSpans[k].textContent = fmt(k, el[k].value);
  }
  const show = el.showVals.checked;
  for (const k in valSpans){
    valSpans[k].style.visibility = show ? "visible" : "hidden";
  }
}

function getParams(){
  return {
    s: parseFloat(el.s.value),
    theta: parseFloat(el.theta.value),
    sigmaInt: parseFloat(el.sigmaInt.value),
    alpha: parseFloat(el.alpha.value),
    sigmaMax: parseFloat(el.sigmaMax.value),
    g1: parseFloat(el.g1.value),
    g2: parseFloat(el.g2.value),
    showTwo: el.showTwo.checked
  };
}

ids.forEach(id=>{
  (id==="showTwo" || id==="showVals" ? el[id] : el[id]).addEventListener("input", ()=>{
    if (id!=="showTwo") updateValDisplays();
    draw();
  });
});

document.getElementById("reset").addEventListener("click", ()=>{
  el.s.value = 0.20;
  el.theta.value = 0.50;
  el.sigmaInt.value = 0.05;
  el.alpha.value = 1.00;
  el.sigmaMax.value = 1.20;
  el.g1.value = 1.00;
  el.g2.value = 2.00;
  el.showTwo.checked = true;
  el.showVals.checked = true;
  updateValDisplays();
  draw();
});

document.getElementById("export").addEventListener("click", ()=>{
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "sr_gain_demo.png";
  a.click();
});

let xmin=0, xmax=1.2, ymin=0.4, ymax=1.0, plotArea=null;

function drawAxes(xmin_, xmax_, ymin_, ymax_){
  xmin=xmin_; xmax=xmax_; ymin=ymin_; ymax=ymax_;
  const padding = {l:60, r:20, t:16, b:44};
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = "#0f1319";
  ctx.fillRect(0,0,w,h);
  const xl = padding.l, xr = w - padding.r, yt = padding.t, yb = h - padding.b;
  ctx.strokeStyle = "#1a1e26";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i=0;i<=10;i++){
    const x = xl + (xr-xl)*i/10;
    ctx.moveTo(x, yt); ctx.lineTo(x, yb);
  }
  for (let j=0;j<=10;j++){
    const y = yb - (yb-yt)*j/10;
    ctx.moveTo(xl, y); ctx.lineTo(xr, y);
  }
  ctx.stroke();
  ctx.strokeStyle = "#2b3545";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(xl, yt); ctx.lineTo(xl, yb); ctx.lineTo(xr, yb);
  ctx.stroke();
  ctx.fillStyle = "#9aa1ac";
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  for (let i=0;i<=10;i++){
    const x = xl + (xr-xl)*i/10;
    const xv = xmin + (xmax-xmin)*i/10;
    ctx.fillText(xv.toFixed(2), x, h-20);
  }
  ctx.textAlign = "right";
  for (let j=0;j<=10;j++){
    const y = yb - (yb-yt)*j/10;
    const yv = ymin + (ymax-ymin)*j/10;
    ctx.fillText(yv.toFixed(2), 52, y+4);
  }
  ctx.fillStyle = "#e6e7ea";
  ctx.textAlign = "center";
  ctx.fillText("external noise σ_ext", (xl+xr)/2, h-6);
  ctx.save();
  ctx.translate(16, (yt+yb)/2);
  ctx.rotate(-Math.PI/2);
  ctx.fillText("balanced accuracy", 0, 0);
  ctx.restore();
  plotArea = {xl,xr,yt,yb};
}

function plotCurve(xs, ys, color){
  const {xl,xr,yt,yb} = plotArea;
  ctx.strokeStyle = color; ctx.lineWidth = 2.25;
  ctx.beginPath();
  for (let i=0;i<xs.length;i++){
    const x = xl + (xr-xl)*(xs[i]-xmin)/(xmax-xmin);
    const y = yb - (yb-yt)*(ys[i]-ymin)/(ymax-ymin);
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
}

function drawPeak(xv, yv, color){
  const {xl,xr,yt,yb} = plotArea;
  const x = xl + (xr-xl)*(xv-xmin)/(xmax-xmin);
  const y = yb - (yb-yt)*(yv-ymin)/(ymax-ymin);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x,y,4.5,0,2*Math.PI);
  ctx.fill();
  ctx.setLineDash([4,4]);
  ctx.strokeStyle = "#2b3545"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x, yb); ctx.stroke();
  ctx.setLineDash([]);
}

function draw(){
  const p = getParams();
  drawAxes(0, p.sigmaMax, 0.4, 1.0);
  const N = 301;
  const xs = Array.from({length:N}, (_,i)=> 0 + (p.sigmaMax-0)*i/(N-1));
  const ysA = xs.map(x => balAcc(p.g1, p.theta, p.s, p.sigmaInt, p.alpha, x));
  const colorA = getComputedStyle(document.documentElement).getPropertyValue('--a').trim();
  plotCurve(xs, ysA, colorA);
  let iA = 0; for (let i=1;i<ysA.length;i++) if (ysA[i]>ysA[iA]) iA=i;
  const peakAx = xs[iA], peakAy = ysA[iA];
  drawPeak(peakAx, peakAy, colorA);
  peakAEl.textContent = `σ_ext ≈ ${peakAx.toFixed(3)}, acc ≈ ${peakAy.toFixed(3)}`;
  if (p.showTwo){
    const ysB = xs.map(x => balAcc(p.g2, p.theta, p.s, p.sigmaInt, p.alpha, x));
    const colorB = getComputedStyle(document.documentElement).getPropertyValue('--b').trim();
    plotCurve(xs, ysB, colorB);
    let iB = 0; for (let i=1;i<ysB.length;i++) if (ysB[i]>ysB[iB]) iB=i;
    const peakBx = xs[iB], peakBy = ysB[iB];
    drawPeak(peakBx, peakBy, colorB);
    peakBEl.textContent = `σ_ext ≈ ${peakBx.toFixed(3)}, acc ≈ ${peakBy.toFixed(3)}`;
  } else {
    peakBEl.textContent = "—";
  }
}

updateValDisplays();
draw();
