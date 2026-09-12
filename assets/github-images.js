/* Su-Sa-Ye-Li GitHub image uploader
   Client-side helper for GitHub Pages/static hosting.
   The token is kept only in sessionStorage and is never written to source files.
*/
(function(){
  const CFG_KEY='susayeli_github_image_config_v1';
  const TOKEN_KEY='susayeli_github_pat_session_v1';
  const getCfg=()=>{try{return JSON.parse(localStorage.getItem(CFG_KEY)||'{}')||{};}catch(e){return{};}};
  const setCfg=c=>localStorage.setItem(CFG_KEY,JSON.stringify(c||{}));
  const getToken=()=>sessionStorage.getItem(TOKEN_KEY)||'';
  const setToken=t=>t?sessionStorage.setItem(TOKEN_KEY,t):sessionStorage.removeItem(TOKEN_KEY);

  function $(id){return document.getElementById(id);}
  function setStatus(msg, ok){
    const el=$('github-image-status');
    if(!el)return;
    el.textContent=msg;
    el.classList.remove('hidden');
    el.classList.toggle('text-emerald-700',!!ok);
    el.classList.toggle('text-red-700',!ok);
  }
  function normalizeBasePath(v){return String(v||'assets/images').trim().replace(/^\/+|\/+$/g,'')||'assets/images';}
  function safeName(name){return String(name||'image').replace(/[^a-zA-Z0-9._-]/g,'_');}
  function b64FromFile(file){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onerror=()=>reject(new Error('Could not read image file.'));
      reader.onload=()=>resolve(String(reader.result).split(',')[1]||'');
      reader.readAsDataURL(file);
    });
  }
  function repoRawUrl(path){
    const c=getCfg();
    if(!c.owner||!c.repo) return path;
    return `https://raw.githubusercontent.com/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/${encodeURIComponent(c.branch||'main')}/${path.split('/').map(encodeURIComponent).join('/')}`;
  }
  async function api(path, options={}){
    const token=getToken();
    if(!token) throw new Error('GITHUB_TOKEN_MISSING');
    const res=await fetch('https://api.github.com'+path,{...options,headers:{
      'Accept':'application/vnd.github+json',
      'Authorization':'Bearer '+token,
      'X-GitHub-Api-Version':'2022-11-28',
      ...(options.headers||{})
    }});
    let data={}; try{data=await res.json();}catch(e){}
    if(!res.ok){
      const msg=data?.message||`GitHub API error ${res.status}`;
      throw new Error(msg);
    }
    return data;
  }

  async function testConnection(){
    const c=getCfg();
    if(!c.owner||!c.repo||!c.branch||!getToken()) throw new Error('Fill GitHub owner, repository, branch and token first.');
    await api(`/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}`);
    setStatus('✅ GitHub connection successful.',true);
  }

  async function getFileSha(path){
    const c=getCfg();
    try{
      const data=await api(`/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(c.branch)}`);
      return data && data.sha ? data.sha : null;
    }catch(e){
      if(/Not Found/i.test(e.message)||/404/.test(e.message)) return null;
      throw e;
    }
  }

  async function upload(file, relativePath, commitMessage){
    const c=getCfg();
    if(!c.owner||!c.repo||!c.branch) throw new Error('Configure GitHub settings first.');
    if(!getToken()) throw new Error('Enter the GitHub token first.');
    if(!file || !file.type.startsWith('image/')) throw new Error('Please select an image file.');
    const path=relativePath.replace(/^\/+/,'').replace(/\\/g,'/');
    const content=await b64FromFile(file);
    const sha=await getFileSha(path);
    const body={
      message:commitMessage||`Update ${path}`,
      content,
      branch:c.branch
    };
    if(sha) body.sha=sha;
    await api(`/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`,{
      method:'PUT',
      body:JSON.stringify(body)
    });
    return {path, rawUrl:repoRawUrl(path), sha};
  }

  function saveSettingsFromUi(){
    const owner=($('gh-owner')?.value||'').trim();
    const repo=($('gh-repo')?.value||'').trim();
    const branch=($('gh-branch')?.value||'main').trim()||'main';
    const imagePath=normalizeBasePath($('gh-image-path')?.value);
    const token=($('gh-token')?.value||'').trim();
    setCfg({owner,repo,branch,imagePath});
    if(token) setToken(token);
    setStatus('✅ GitHub settings saved for this browser session.',true);
  }

  function loadUi(){
    const c=getCfg();
    if($('gh-owner'))$('gh-owner').value=c.owner||'';
    if($('gh-repo'))$('gh-repo').value=c.repo||'';
    if($('gh-branch'))$('gh-branch').value=c.branch||'main';
    if($('gh-image-path'))$('gh-image-path').value=c.imagePath||'assets/images';
  }

  function initConfigBox(){
    const box=$('github-image-config'); if(!box)return;
    loadUi();
    const save=$('save-github-settings');
    if(save && !save.dataset.bound){
      save.dataset.bound='1';
      save.addEventListener('click',saveSettingsFromUi);
    }
    const test=$('test-github-connection');
    if(test && !test.dataset.bound){
      test.dataset.bound='1';
      test.addEventListener('click',async()=>{
        try{saveSettingsFromUi();await testConnection();}
        catch(e){console.error(e);setStatus('❌ '+e.message,false);}
      });
    }
    const clear=$('clear-github-token');
    if(clear && !clear.dataset.bound){
      clear.dataset.bound='1';
      clear.addEventListener('click',()=>{setToken('');if($('gh-token'))$('gh-token').value='';setStatus('GitHub token cleared from this browser session.',true);});
    }
  }

  async function uploadProductImage(){
    const input=$('new-image-file');
    const file=input?.files?.[0];
    if(!file){setStatus('Please select the product image first.',false);return;}
    try{
      saveSettingsFromUi();
      const c=getCfg();
      const filename=safeName(file.name);
      const path=normalizeBasePath(c.imagePath)+'/'+filename;
      const result=await upload(file,path,`Add/update product image: ${filename}`);
      const field=$('new-img'); if(field) field.value=result.path;
      const preview=$('new-image-preview'); if(preview){preview.src=result.rawUrl+'?v='+Date.now();preview.classList.remove('hidden');}
      const st=$('product-github-upload-status'); if(st){st.textContent='✅ Uploaded to GitHub: '+result.path;st.classList.remove('hidden');}
    }catch(e){
      const st=$('product-github-upload-status'); if(st){st.textContent='❌ '+e.message;st.classList.remove('hidden');}
      console.error(e);
    }
  }

  async function uploadPageImage(key,file){
    if(!file) throw new Error('Please choose an image first.');
    saveSettingsFromUi();
    const c=getCfg();
    const slotName=({
      logo:'logo',homeBg:'home-background',productsBg:'products-background',
      aboutBg:'about-background',contactBg:'contact-background',
      premium:'premium-quality-packaged-products',homeDivider:'home-divider'
    })[key]||safeName(key);
    const ext=(file.name.match(/\.[a-zA-Z0-9]+$/)||['.jpg'])[0].toLowerCase();
    const path=normalizeBasePath(c.imagePath)+'/'+slotName+ext;
    const result=await upload(file,path,`Update web page image: ${slotName}`);
    return result;
  }

  window.SuSaGitHub={
    getConfig:getCfg,
    isConfigured:()=>{const c=getCfg();return !!(c.owner&&c.repo&&c.branch&&getToken());},
    saveSettings:saveSettingsFromUi,
    testConnection,
    upload,
    uploadProductImage,
    uploadPageImage,
    rawUrl:repoRawUrl
  };

  window.addEventListener('DOMContentLoaded',initConfigBox);
})();
