/* Oracle JET Redwood components and the original presentation content are local. */
require.config({
  baseUrl: new URL('.', document.currentScript.src).href,
  paths: {
    ojs: 'vendor/jet/min', ojL10n: 'vendor/jet/ojL10n', ojtranslations: 'vendor/jet/resources',
    '@oracle/oraclejet-preact': 'vendor/jet-preact', 'jqueryui-amd': 'vendor/jquery-ui',
    'preact/hooks': 'vendor/preact/hooks', 'preact/compat': 'vendor/preact/compat',
    'preact/jsx-runtime': 'vendor/preact/jsx-runtime', preact: 'vendor/preact/preact',
    jquery: 'vendor/jquery', knockout: 'vendor/knockout', text: 'vendor/text', css: 'vendor/css',
    signals: 'vendor/signals', hammerjs: 'vendor/hammer', ojdnd: 'vendor/dnd'
  },
  config: { ojL10n: { merge: {} } }
});
window.workshopReady = new Promise((resolve, reject) => require([
  'ojs/ojbootstrap', 'ojs/ojcontext', 'knockout', 'ojs/ojkeyset', 'ojs/ojknockout',
  'ojs/ojbutton', 'ojs/ojnavigationlist'
], function (Bootstrap, Context, ko, KeySet) {
  Bootstrap.whenDocumentReady().then(async () => {
    const articles = [...document.querySelectorAll('[data-slide]')];
    const pagePosition = number => articles.findIndex(article => Number(article.dataset.slide) === number) + 1;
    articles.forEach((article, index) => {
      article.querySelector('.page-position').textContent = String(index + 1).padStart(2, '0') + ' / ' + articles.length;
    });
    const nav = document.getElementById('workshop-nav');
    const parts = document.getElementById('part-navigation');
    const dialog = document.getElementById('image-dialog');
    const demoDialog = document.getElementById('demo-dialog');
    const dialogImage = document.getElementById('dialog-image');
    const previous = document.getElementById('previous-button');
    const next = document.getElementById('next-button');
    let current = 1;
    const navKey = number => number >= 46 && number <= 49 ? 46 : number >= 7 && number <= 8 ? 7 : number >= 13 && number <= 19 ? 13 : number >= 20 && number <= 32 ? 20 : number >= 33 && number <= 43 ? 33 : number;
    const partGroup = number => [[7,8], [46,49], [13,19], [20,32], [33,43]].find(([first,last]) => number >= first && number <= last);
    function render(focus = false) {
      const parameter = new URLSearchParams(location.search).get('slide');
      const requested = parameter && /^\d+$/.test(parameter) ? Number(parameter) : 1;
      current = pagePosition(requested) || 1;
      articles.forEach((article, index) => { article.hidden = index !== current - 1; });
      const article = articles[current-1];
      document.body.dataset.theme = article.dataset.theme;
      document.querySelector('.workshop-footer').classList.toggle('oj-color-invert', article.dataset.theme === 'dark');
      document.title = article.querySelector('h1').textContent.trim() + ' | Oracle AI Adoption Workshop';
      const slideNumber = Number(article.dataset.slide);
      nav.selection = 'nav-' + navKey(slideNumber);
      previous.disabled = current === 1;
      next.disabled = current === articles.length;
      document.getElementById('page-label').textContent = String(current).padStart(2,'0') + ' / ' + articles.length;
      const group = partGroup(slideNumber);
      parts.replaceChildren();
      parts.hidden = !group;
      if (group) {
        const label = document.createElement('span'); label.className='part-label'; label.textContent='Pages'; parts.append(label);
        for (let number = group[0]; number <= group[1]; number++) {
          const link = document.createElement('a'); link.className='part-link'; link.href='?slide='+number; link.dataset.slideLink=number;
          link.textContent=String(pagePosition(number)).padStart(2,'0'); link.setAttribute('aria-label','Page '+pagePosition(number));
          if(number===slideNumber) link.setAttribute('aria-current','page'); parts.append(link);
        }
      }
      document.querySelectorAll('[data-slide-link]').forEach(link => {
        if(Number(link.dataset.slideLink)===slideNumber)link.setAttribute('aria-current','page');
        else if(!link.classList.contains('part-link'))link.removeAttribute('aria-current');
      });
      if (matchMedia('(max-width: 980px)').matches) document.body.classList.remove('nav-open');
      if (focus) { window.scrollTo(0,0); document.getElementById('main-content').focus({preventScroll:true}); }
    }
    function go(number) {
      const url=new URL(location.href);url.searchParams.set('slide',articles[number-1].dataset.slide);url.hash='';
      history.pushState({},'',url);render(true);
    }
    function openImage(src, title) {
      dialogImage.src=src;dialogImage.alt=title;document.getElementById('image-dialog-title').textContent=title;dialog.showModal();
    }
    document.addEventListener('click', event => {
      const link=event.target.closest('[data-slide-link]');
      if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {event.preventDefault();go(pagePosition(Number(link.dataset.slideLink)));}
      const image=event.target.closest('[data-image]');
      if(image)openImage(image.dataset.image,articles[current-1].querySelector('h1').textContent.trim());
    });
    document.getElementById('close-image').addEventListener('ojAction', () => dialog.close());
    const copyStatus = document.getElementById('demo-copy-status');
    const demoTabs = [...demoDialog.querySelectorAll('[role="tab"]')];
    function selectDemoTab(selected) {
      demoTabs.forEach(tab => {
        const active = tab === selected;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
      });
      document.getElementById('demo-dialog-title').textContent = selected.getAttribute('aria-label');
      copyStatus.textContent = '';
    }
    demoTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectDemoTab(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = demoTabs[(index + 1) % demoTabs.length];
        else if (event.key === 'ArrowLeft') next = demoTabs[(index + demoTabs.length - 1) % demoTabs.length];
        else if (event.key === 'Home') next = demoTabs[0];
        else if (event.key === 'End') next = demoTabs[demoTabs.length - 1];
        if (!next) return;
        event.preventDefault();
        selectDemoTab(next);
        next.focus();
      });
    });
    document.getElementById('demo-environment-button').addEventListener('ojAction', () => {
      copyStatus.textContent = '';
      demoDialog.showModal();
    });
    demoDialog.querySelectorAll('[data-copy-target]').forEach(button => button.addEventListener('ojAction', async () => {
      try {
        await navigator.clipboard.writeText(document.getElementById(button.dataset.copyTarget).textContent);
        copyStatus.textContent = button.dataset.copyLabel + ' copied.';
      } catch {
        copyStatus.textContent = 'Could not copy. Select the text to copy it.';
      }
    }));
    demoDialog.querySelectorAll('[data-close-demo]').forEach(button => button.addEventListener('ojAction', () => demoDialog.close()));
    [dialog, demoDialog].forEach(popup => popup.addEventListener('click', event => {
      if (event.target !== popup) return;
      const bounds = popup.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) popup.close();
    }));
    previous.addEventListener('ojAction', () => current > 1 && go(current-1));
    next.addEventListener('ojAction', () => current < articles.length && go(current+1));
    document.getElementById('menu-button').addEventListener('ojAction', () => {
      document.body.classList.toggle(matchMedia('(max-width: 980px)').matches ? 'nav-open' : 'sidebar-hidden');
    });
    document.querySelector('.nav-scrim').addEventListener('click', () => document.body.classList.remove('nav-open'));
    window.addEventListener('popstate', () => render(true));
    document.addEventListener('keydown', event => {
      if(event.key==='Escape')document.body.classList.remove('nav-open');
      if(event.target.closest('input,textarea,select,button,a,[role="tree"],[role="tablist"],oj-dialog') || document.querySelector('dialog[open]'))return;
      if(event.key==='ArrowRight' && current<articles.length){event.preventDefault();go(current+1);}
      if(event.key==='ArrowLeft' && current>1){event.preventDefault();go(current-1);}
    });
    nav.expanded = new KeySet.KeySetImpl(['nav-3','nav-5','nav-12','nav-create-agentic-apps','nav-44']);
    ko.applyBindings({},document.body);
    await Context.getContext(document.body).getBusyContext().whenReady();
    render();
    document.body.classList.add('components-ready');
    resolve({go,render});
  }).catch(reject);
}, reject));
window.workshopReady.catch(error => { console.error('Workshop initialization failed',error); });
