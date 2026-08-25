/* CLIENTA QA pass 9: persistent project editor, autosave and fast settings navigation. */
(function clientaProjectEditor(){
  const builder=document.getElementById('builder');
  const editor=builder?.querySelector('.editor');
  if(!builder||!editor)return;

  let editing=false;
  let saving=false;
  let saveTimer=0;
  let editBar=null;
  let saveState=null;

  const labels={1:'Бизнес',2:'Дизайн',3:'Функции',4:'Контент',5:'Каналы',6:'Проверка'};

  function ensureStyle(){
    if(document.getElementById('clienta-project-editor-style'))return;
    const style=document.createElement('style');
    style.id='clienta-project-editor-style';
    style.textContent=`
      #builder.editingProject .top{padding-bottom:7px}
      .projectEditBar{display:none;flex:none;border:1px solid #d8d2c8;background:#fbf9f5;border-radius:20px;padding:10px;margin-bottom:8px;gap:10px;align-items:center}
      #builder.editingProject .projectEditBar{display:flex}
      .projectEditIdentity{min-width:0;flex:1}.projectEditIdentity small{display:block;color:#888;font-size:9px;letter-spacing:.12em;text-transform:uppercase;font-weight:900}.projectEditIdentity b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:3px;font-size:14px}
      .projectEditSave{border:0;border-radius:999px;background:#111;color:#fff;min-height:42px;padding:0 15px;font-weight:900;white-space:nowrap}.projectEditSave:active{transform:scale(.98)}
      .projectSaveState{font-size:10px;color:#777;white-space:nowrap}.projectSaveState.saving{color:#8b6714}.projectSaveState.saved{color:#24713a}
      .projectEditTabs{display:none;flex:none;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px 0 10px}.projectEditTabs::-webkit-scrollbar{display:none}#builder.editingProject .projectEditTabs{display:flex}
      .projectEditTab{border:1px solid #d6d0c7;background:#fbf9f5;color:#555;border-radius:999px;min-height:40px;padding:0 13px;font-weight:850;font-size:11px;white-space:nowrap}.projectEditTab.on{background:#111;color:#fff;border-color:#111}
      #builder.editingProject .progress{font-weight:900;color:#555}
      #builder.editingProject .theme{min-height:142px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);transition:transform .16s ease,box-shadow .16s ease}
      #builder.editingProject .theme.on{outline:3px solid #111;outline-offset:3px;transform:translateY(-2px)}
      #builder.editingProject .theme.on:after{content:'✓';position:absolute;right:12px;top:12px;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#111;color:#fff;font:900 13px Arial,sans-serif}
      #builder.editingProject .fontChoice.on,#builder.editingProject .pack.on{outline:3px solid #111;outline-offset:2px}
      #builder.editingProject .head p{max-width:720px}
      @media(max-width:700px){
        .projectEditBar{border-radius:16px;padding:9px}.projectEditIdentity b{font-size:13px}.projectEditSave{min-height:40px;padding:0 12px;font-size:12px}.projectSaveState{display:none}
        .projectEditTabs{margin-left:-2px;margin-right:-2px;padding-bottom:8px}.projectEditTab{min-height:38px;padding:0 12px}
        #builder.editingProject .body{padding-bottom:120px}
        #builder.editingProject .themes{grid-template-columns:1fr 1fr}
      }
      @media(max-width:430px){
        .projectEditBar{gap:7px}.projectEditIdentity small{font-size:8px}.projectEditSave{padding:0 10px}
        #builder.editingProject .head{margin-top:18px}.projectEditTab{font-size:10px}
        #builder.editingProject .theme{min-height:118px}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureEditorChrome(){
    if(editBar)return;
    ensureStyle();
    editBar=document.createElement('div');
    editBar.className='projectEditBar';
    editBar.innerHTML=`<div class="projectEditIdentity"><small>РЕДАКТОР ПРОЕКТА</small><b id="projectEditName">Проект</b></div><span id="projectSaveState" class="projectSaveState saved">Сохранено</span><button id="projectEditSave" class="projectEditSave" type="button">Сохранить</button>`;
    const tabs=document.createElement('nav');
    tabs.className='projectEditTabs';
    tabs.setAttribute('aria-label','Разделы проекта');
    tabs.innerHTML=Object.entries(labels).map(([n,l])=>`<button class="projectEditTab" type="button" data-edit-step="${n}">${l}</button>`).join('');
    const top=editor.querySelector('.top');
    top.insertAdjacentElement('afterend',editBar);
    editBar.insertAdjacentElement('afterend',tabs);
    saveState=editBar.querySelector('#projectSaveState');
    editBar.querySelector('#projectEditSave').addEventListener('click',()=>saveAndReturn());
    tabs.addEventListener('click',e=>{
      const b=e.target.closest('[data-edit-step]');if(!b)return;
      go(Number(b.dataset.editStep));
    });
  }

  function markStatus(text,kind=''){
    if(!saveState)return;
    saveState.textContent=text;
    saveState.className='projectSaveState '+kind;
  }

  function syncChrome(){
    if(!editing)return;
    ensureEditorChrome();
    const name=document.getElementById('businessName')?.value?.trim()||current?.name||'Проект';
    const n=document.getElementById('projectEditName');if(n)n.textContent=name;
    document.querySelectorAll('[data-edit-step]').forEach(b=>b.classList.toggle('on',Number(b.dataset.editStep)===st.step));
    const progress=document.getElementById('progress');
    if(progress)progress.textContent=`РЕДАКТОР · ${labels[st.step]?.toUpperCase()||'НАСТРОЙКИ'}`;
    const nextBtn=document.getElementById('next');
    if(nextBtn&&st.step===6)nextBtn.textContent='Сохранить изменения ✓';
  }

  function persistEdit(showToast=false){
    if(!editing||!current)return;
    try{
      const p=snapshot();
      const a=load();
      const i=a.findIndex(x=>String(x.id)===String(p.id));
      if(i>=0)a[i]=p;else a.unshift(p);
      save(a);
      current=p;
      markStatus('Сохранено','saved');
      if(showToast)toast('Изменения сохранены ✓');
    }catch(err){
      markStatus('Не сохранено','');
      console.warn('CLIENTA editor autosave failed',err);
    }
  }

  function queueSave(){
    if(!editing||saving)return;
    clearTimeout(saveTimer);
    markStatus('Сохраняем…','saving');
    saveTimer=setTimeout(()=>persistEdit(false),500);
  }

  function leaveEdit(openCabinet=true){
    clearTimeout(saveTimer);
    persistEdit(false);
    editing=false;
    saving=false;
    builder.classList.remove('editingProject');
    _closeBuilder();
    renderProjects();
    if(openCabinet&&current)openOwner();
  }

  function saveAndReturn(){
    if(!editing)return;
    saving=true;
    persistEdit(true);
    editing=false;
    builder.classList.remove('editingProject');
    _closeBuilder();
    renderProjects();
    if(current)openOwner();
    saving=false;
  }

  const _startBuilder=startBuilder;
  startBuilder=function(p=null){
    _startBuilder(p);
    editing=!!p;
    builder.classList.toggle('editingProject',editing);
    if(editing){
      ensureEditorChrome();
      go(2);
      markStatus('Сохранено','saved');
      syncChrome();
    }
  };
  window.startBuilder=startBuilder;

  const _go=go;
  go=function(n){
    _go(n);
    if(editing)syncChrome();
  };
  window.go=go;

  const _closeBuilder=closeBuilder;
  closeBuilder=function(){
    if(editing&&!saving)return leaveEdit(true);
    _closeBuilder();
  };
  window.closeBuilder=closeBuilder;

  const _createProject=createProject;
  createProject=function(){
    if(!editing)return _createProject();
    return saveAndReturn();
  };
  window.createProject=createProject;

  builder.addEventListener('input',e=>{
    if(!editing)return;
    if(e.target.matches('input,textarea,select'))queueSave();
    if(e.target.id==='businessName')syncChrome();
  });
  builder.addEventListener('change',e=>{
    if(editing&&e.target.matches('input,textarea,select'))queueSave();
  });
  builder.addEventListener('click',e=>{
    if(!editing)return;
    if(e.target.closest('[data-theme],[data-font],[data-pack],[data-mi],[data-channel],[data-niche],.biz,.chip'))setTimeout(queueSave,30);
  });

  ensureEditorChrome();

  const oldQa=window.qa;
  window.qa=function(){
    const r=oldQa(),errors=[...r.errors];
    if(!document.querySelector('.projectEditTabs'))errors.push('project-editor-tabs');
    if(!document.getElementById('projectEditSave'))errors.push('project-editor-save');
    window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25p',projectEditor:true,editorAutosave:true};
    return window.CLIENTA_QA;
  };
})();
