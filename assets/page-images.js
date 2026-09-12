/* Su-Sa-Ye-Li local web-page image manager */
(function(){
  const KEY='susayeli_page_images_v1';
  let pageImageFolderHandle=null;
  const pending={};
  const config=()=>{ try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){return{};} };
  const saveConfig=(c)=>localStorage.setItem(KEY,JSON.stringify(c));
  const safeName=(name)=>String(name||'image').replace(/[^a-zA-Z0-9._-]/g,'_');
  const slots={
    logo:'logo',
    homeBg:'home-background',
    productsBg:'products-background',
    aboutBg:'about-background',
    contactBg:'contact-background',
    premium:'premium-quality-packaged-products',
    homeDivider:'home-divider'
  };
  async function pickFolder(){
    if(!window.showDirectoryPicker){
      setStatus('Chrome/Edge browser එකක් භාවිතා කරන්න.',false); return;
    }
    try{
      pageImageFolderHandle=await window.showDirectoryPicker({mode:'readwrite'});
      setStatus('✅ Folder Ready',true);
    }catch(e){ if(e && e.name!=='AbortError') setStatus('Folder select කිරීම අසාර්ථකයි.',false); }
  }
  function setStatus(msg,ok){
    const el=document.getElementById('page-image-folder-status'); if(!el)return;
    el.textContent=msg; el.style.color=ok?'#047857':'#b91c1c'; el.classList.remove('hidden');
  }
  function bindPreview(key,input){
    input.addEventListener('change',()=>{
      const f=input.files&&input.files[0]; if(!f)return;
      if(!f.type.startsWith('image/')){input.value='';return;}
      pending[key]=f;
      const img=document.getElementById('preview-'+key);
      const ph=document.getElementById('placeholder-'+key);
      if(img){img.src=URL.createObjectURL(f);img.classList.remove('hidden');}
      if(ph)ph.classList.add('hidden');
    });
  }
  async function writeImage(file,targetName){
    if(!pageImageFolderHandle) throw new Error('FOLDER_NOT_SELECTED');
    const fh=await pageImageFolderHandle.getFileHandle(targetName,{create:true});
    const wr=await fh.createWritable();
    try{await wr.write(file);}finally{await wr.close();}
    return 'assets/images/'+targetName;
  }
  async function saveAll(){
    if(!pageImageFolderHandle){setStatus('⚠️ Image folder එක මුලින් select කරන්න.',false);return;}
    const c=config();
    for(const key of Object.keys(slots)){
      if(pending[key]){
        const ext=(pending[key].name.match(/\.[a-zA-Z0-9]+$/)||['.jpg'])[0].toLowerCase();
        const target=slots[key]+ext;
        c[key]=await writeImage(pending[key],target);
      }
    }
    saveConfig(c);
    localStorage.setItem('susayeli_page_images_version', String(Date.now()));
    for(const key of Object.keys(pending))delete pending[key];
    document.querySelectorAll('.page-image-file').forEach(i=>i.value='');
    loadExistingPreviews();
    applyPageImages();
    const msg=document.getElementById('page-image-save-message');
    if(msg){msg.textContent='✅ Web page images saved successfully.';msg.classList.remove('hidden');}
  }
  function loadExistingPreviews(){
    const c=config();
    for(const key of Object.keys(slots)){
      const path=c[key];
      const img=document.getElementById('preview-'+key);
      const ph=document.getElementById('placeholder-'+key);
      if(path && img){
        img.src=path + (path.includes('?')?'&':'?') + 'v=' + encodeURIComponent(String(localStorage.getItem('susayeli_page_images_version')||'1'));
        img.classList.remove('hidden');
        if(ph) ph.classList.add('hidden');
      }
    }
  }

  function applyPageImages(){
    const c=config();
    // Logo: preserve existing header layout; only show custom logo when configured.
    if(c.logo){document.querySelectorAll('.site-logo-icon').forEach(box=>{
      box.innerHTML='<img src="'+c.logo+'" alt="Su-Sa-Ye-Li logo" style="width:100%;height:100%;object-fit:contain;border-radius:inherit">';
      box.style.background='transparent'; box.style.padding='0';
    });}
    if(c.homeBg){document.querySelectorAll('#home').forEach(el=>{el.style.backgroundImage='linear-gradient(rgba(41,24,10,.38),rgba(41,24,10,.55)),url("'+c.homeBg+'")';el.style.backgroundSize='cover';el.style.backgroundPosition='center';});}
    if(c.productsBg){document.querySelectorAll('[data-page-section="products"]').forEach(el=>{el.style.backgroundImage='linear-gradient(rgba(250,250,249,.92),rgba(250,250,249,.92)),url("'+c.productsBg+'")';el.style.backgroundSize='cover';el.style.backgroundPosition='center';});}
    if(c.aboutBg){document.querySelectorAll('[data-page-section="about"]').forEach(el=>{el.style.backgroundImage='linear-gradient(rgba(245,245,244,.88),rgba(245,245,244,.88)),url("'+c.aboutBg+'")';el.style.backgroundSize='cover';el.style.backgroundPosition='center';});}
    if(c.contactBg){document.querySelectorAll('[data-page-section="contact"]').forEach(el=>{el.style.backgroundImage='linear-gradient(rgba(250,250,249,.90),rgba(250,250,249,.90)),url("'+c.contactBg+'")';el.style.backgroundSize='cover';el.style.backgroundPosition='center';});}
    if(c.premium){document.querySelectorAll('#premium-quality-image').forEach(img=>{img.src=c.premium;});}
    if(c.homeDivider){document.querySelectorAll('#home-image-divider').forEach(img=>{img.src=c.homeDivider;img.classList.remove('hidden');img.style.display='block';img.style.zIndex='30';img.style.bottom='-1px';});}
  }

  function bindGitHubButtons(){
    document.querySelectorAll('.page-image-github-upload').forEach(btn=>{
      if(btn.dataset.bound==='1')return;
      btn.dataset.bound='1';
      btn.addEventListener('click',async()=>{
        const key=btn.dataset.key, input=document.getElementById('page-image-file-'+key);
        const file=input?.files?.[0], st=document.getElementById('github-status-'+key);
        if(!file){if(st){st.textContent='Please choose an image first.';st.classList.remove('hidden');st.classList.remove('text-emerald-700');st.classList.add('text-red-700');}return;}
        try{
          if(!window.SuSaGitHub)throw new Error('GitHub uploader not loaded.');
          if(st){st.textContent='Uploading…';st.classList.remove('hidden','text-red-700');st.classList.add('text-emerald-700');}
          const result=await window.SuSaGitHub.uploadPageImage(key,file);
          const c=config(); c[key]=result.path; saveConfig(c);
          const img=document.getElementById('preview-'+key), ph=document.getElementById('placeholder-'+key);
          if(img){img.src=result.rawUrl+'?v='+Date.now();img.classList.remove('hidden');}
          if(ph)ph.classList.add('hidden');
          localStorage.setItem('susayeli_page_images_version',String(Date.now()));
          applyPageImages();
          if(st)st.textContent='✅ Saved to GitHub: '+result.path;
        }catch(e){
          console.error(e);
          if(st){st.textContent='❌ '+e.message;st.classList.remove('hidden','text-emerald-700');st.classList.add('text-red-700');}
        }
      });
    });
  }

  function initManager(){
    const box=document.getElementById('page-image-manager'); if(!box)return;
    const defs=[
      ['logo','Logo'],['homeBg','Home page background image'],['productsBg','Product page background image'],['aboutBg','About Us background image'],['contactBg','Contact background image'],['premium','Premium Quality Packaged Products image'],['homeDivider','Home page white-line image']
    ];
    const grid=document.getElementById('page-image-grid');
    if(grid && !grid.dataset.ready){
      grid.dataset.ready='1';
      for(const [key,label] of defs){
        const item=document.createElement('div');item.className='page-image-item';
        item.innerHTML='<div class="page-image-head"><span class="page-image-label">'+label+'</span><span class="text-[10px] text-stone-500">Local image</span></div>'+
          '<input class="page-image-file" id="page-image-file-'+key+'" type="file" accept="image/*">'+
          '<div class="flex flex-wrap items-center gap-2 mt-2"><button type="button" class="github-upload-btn page-image-github-upload" data-key="'+key+'"><i class="fa-brands fa-github mr-1"></i>Upload to GitHub</button><span id="github-status-'+key+'" class="github-upload-status hidden"></span></div>'+
          '<div id="placeholder-'+key+'" class="page-image-preview page-image-placeholder">Preview appears here</div>'+ 
          '<img id="preview-'+key+'" class="page-image-preview hidden" alt="'+label+' preview">';
        grid.appendChild(item);
        bindPreview(key,item.querySelector('input'));
      }
      bindGitHubButtons();
    }
    const folderBtn=document.getElementById('select-page-image-folder');
    if(folderBtn && !folderBtn.dataset.bound){folderBtn.dataset.bound='1';folderBtn.addEventListener('click',pickFolder);}
    const saveBtn=document.getElementById('save-page-images');
    if(saveBtn && !saveBtn.dataset.bound){saveBtn.dataset.bound='1';saveBtn.addEventListener('click',()=>saveAll().catch(e=>{console.error(e);setStatus('❌ Image save failed.',false);}));}
  }
  window.applySuSaYeLiPageImages=applyPageImages;
  window.addEventListener('DOMContentLoaded',()=>{initManager();bindGitHubButtons();loadExistingPreviews();applyPageImages();});
  window.addEventListener('load',applyPageImages);
})();
