(function(){
  if(document.getElementById('userSettingsWidget')) return;
  const presets={
    warm:{accent:'#b45309',accent2:'#92400e',bg:'#f7f4ef',surface:'#ffffff',text:'#251f1a',hero:'#7c2d12'},
    forest:{accent:'#166534',accent2:'#14532d',bg:'#f2f7f3',surface:'#ffffff',text:'#153226',hero:'#315d3e'},
    dark:{accent:'#d97706',accent2:'#9a3412',bg:'#171311',surface:'#231d19',text:'#f7efe5',hero:'#211a17'},
    ivory:{accent:'#c28a27',accent2:'#8a5a12',bg:'#fbf8f1',surface:'#fffdf8',text:'#3b332b',hero:'#6e4b16'},
    cinnamon:{accent:'#a34a17',accent2:'#7c2d12',bg:'#f5eee8',surface:'#ffffff',text:'#35231b',hero:'#6f2c12'},
    sage:{accent:'#557a49',accent2:'#3f5f36',bg:'#f2f5ee',surface:'#ffffff',text:'#253124',hero:'#495c3d'},
    coffee:{accent:'#7b4b2a',accent2:'#55301b',bg:'#f5efe8',surface:'#fffaf5',text:'#2f241d',hero:'#4a2c1a'},
    terracotta:{accent:'#c25b3a',accent2:'#8f3f29',bg:'#f8f1ee',surface:'#ffffff',text:'#34211d',hero:'#7a351f'},
    ocean:{accent:'#0f766e',accent2:'#115e59',bg:'#eef6f7',surface:'#ffffff',text:'#20343a',hero:'#315963'},
    emerald:{accent:'#0f8a5f',accent2:'#0b6b49',bg:'#eef7f1',surface:'#ffffff',text:'#193126',hero:'#244e3d'}
  };
  const themeNames=[['warm','Warm Classic'],['forest','Forest Fresh'],['dark','Dark Luxury'],['ivory','Ivory Gold'],['cinnamon','Cinnamon Earth'],['sage','Sage Organic'],['coffee','Coffee Roast'],['terracotta','Terracotta Modern'],['ocean','Coastal Clean'],['emerald','Premium Emerald']];
  const widget=document.createElement('div');widget.id='userSettingsWidget';widget.className='user-settings-widget';
  widget.innerHTML='<button class="user-settings-gear" type="button" aria-label="Display settings" title="Display settings">⚙</button><div class="user-settings-panel" role="dialog" aria-label="Display settings"><h3>Display Settings</h3><div class="user-settings-label">Theme</div><div class="user-settings-grid" id="userThemeGrid"></div><div class="user-settings-label">Font size</div><div class="user-settings-size-row"><input id="userFontRange" class="user-settings-range" type="range" min="85" max="125" step="5" value="100"><span id="userFontValue" class="user-settings-size-value">100%</span></div></div>';
  document.body.appendChild(widget);
  const panel=widget.querySelector('.user-settings-panel');
  widget.querySelector('.user-settings-gear').addEventListener('click',()=>panel.classList.toggle('open'));
  document.addEventListener('click',(e)=>{if(!widget.contains(e.target)) panel.classList.remove('open');});
  const grid=widget.querySelector('#userThemeGrid');
  themeNames.forEach(([id,name])=>{const b=document.createElement('button');b.type='button';b.className='user-settings-btn';b.dataset.theme=id;b.textContent=name;b.addEventListener('click',()=>applyTheme(id,true));grid.appendChild(b);});
  const range=widget.querySelector('#userFontRange'), value=widget.querySelector('#userFontValue');
  function applyTheme(id,save){
    const p=presets[id]||presets.warm;
    const r=document.documentElement, body=document.body;
    Object.entries({'--user-accent':p.accent,'--user-accent-2':p.accent2,'--user-bg':p.bg,'--user-surface':p.surface,'--user-text':p.text,'--user-hero':p.hero}).forEach(([k,v])=>r.style.setProperty(k,v));
    r.style.setProperty('--brand',p.accent); r.style.setProperty('--bg',p.bg); r.style.setProperty('--surface',p.surface); r.style.setProperty('--text',p.text);
    r.style.setProperty('--accent',p.accent); r.style.setProperty('--hero',p.hero);
    body.classList.remove('user-theme-dark','user-theme-active'); body.classList.add('user-theme-active');
    if(id==='dark') body.classList.add('user-theme-dark');
    grid.querySelectorAll('.user-settings-btn').forEach(b=>b.classList.toggle('active',b.dataset.theme===id));
    if(save)localStorage.setItem('susayeli-user-theme',id);
  }
  function applyFont(v,save){
    const pct=Number(v)||100; document.documentElement.style.setProperty('--user-font-scale',(pct/100).toString()); value.textContent=pct+'%'; range.value=pct; if(save)localStorage.setItem('susayeli-user-font',pct);
  }
  range.addEventListener('input',()=>applyFont(range.value,true));
  applyTheme(localStorage.getItem('susayeli-user-theme')||'warm',false);
  applyFont(localStorage.getItem('susayeli-user-font')||100,false);
})();
