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
    const nav = document.getElementById('workshop-nav');
    const parts = document.getElementById('part-navigation');
    const dialog = document.getElementById('image-dialog');
    const dialogImage = document.getElementById('dialog-image');
    const previous = document.getElementById('previous-button');
    const next = document.getElementById('next-button');
    let current = 1;
    const navKey = number => number >= 7 && number <= 8 ? 7 : number >= 13 && number <= 19 ? 13 : number >= 20 && number <= 32 ? 20 : number >= 33 && number <= 43 ? 33 : number;
    const partGroup = number => [[7,8], [13,19], [20,32], [33,43]].find(([first,last]) => number >= first && number <= last);
    function render(focus = false) {
      const parameter = new URLSearchParams(location.search).get('slide');
      const requested = parameter && /^\d+$/.test(parameter) ? Number(parameter) : 1;
      current = requested >= 1 && requested <= 45 ? requested : 1;
      articles.forEach(article => { article.hidden = Number(article.dataset.slide) !== current; });
      const article = articles[current-1];
      document.body.dataset.theme = article.dataset.theme;
      document.querySelector('.workshop-footer').classList.toggle('oj-color-invert', article.dataset.theme === 'dark');
      document.title = article.querySelector('h1').textContent.trim() + ' | Oracle AI Adoption Workshop';
      nav.selection = 'nav-' + navKey(current);
      previous.disabled = current === 1;
      next.disabled = current === 45;
      document.getElementById('page-label').textContent = String(current).padStart(2,'0') + ' / 45';
      const group = partGroup(current);
      parts.replaceChildren();
      parts.hidden = !group;
      if (group) {
        const label = document.createElement('span'); label.className='part-label'; label.textContent='Pages'; parts.append(label);
        for (let number = group[0]; number <= group[1]; number++) {
          const link = document.createElement('a'); link.className='part-link'; link.href='?slide='+number; link.dataset.slideLink=number;
          link.textContent=String(number).padStart(2,'0'); link.setAttribute('aria-label','Page '+number);
          if(number===current) link.setAttribute('aria-current','page'); parts.append(link);
        }
      }
      document.querySelectorAll('[data-slide-link]').forEach(link => {
        if(Number(link.dataset.slideLink)===current)link.setAttribute('aria-current','page');
        else if(!link.classList.contains('part-link'))link.removeAttribute('aria-current');
      });
      if (matchMedia('(max-width: 980px)').matches) document.body.classList.remove('nav-open');
      if (focus) { window.scrollTo(0,0); document.getElementById('main-content').focus({preventScroll:true}); }
    }
    function go(number) {
      const url=new URL(location.href);url.searchParams.set('slide',number);url.hash='';
      history.pushState({},'',url);render(true);
    }
    function openImage(src, title) {
      dialogImage.src=src;dialogImage.alt=title;document.getElementById('image-dialog-title').textContent=title;dialog.showModal();
    }
    document.addEventListener('click', event => {
      const link=event.target.closest('[data-slide-link]');
      if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {event.preventDefault();go(Number(link.dataset.slideLink));}
      const image=event.target.closest('[data-image]');
      if(image)openImage(image.dataset.image,articles[current-1].querySelector('h1').textContent.trim());
    });
    document.getElementById('close-image').addEventListener('ojAction', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    previous.addEventListener('ojAction', () => current > 1 && go(current-1));
    next.addEventListener('ojAction', () => current < 45 && go(current+1));
    document.getElementById('menu-button').addEventListener('ojAction', () => {
      document.body.classList.toggle(matchMedia('(max-width: 980px)').matches ? 'nav-open' : 'sidebar-hidden');
    });
    document.querySelector('.nav-scrim').addEventListener('click', () => document.body.classList.remove('nav-open'));
    window.addEventListener('popstate', () => render(true));
    document.addEventListener('keydown', event => {
      if(event.key==='Escape')document.body.classList.remove('nav-open');
      if(event.target.closest('input,textarea,select,button,a,[role="tree"],[role="tablist"],oj-dialog') || dialog.open)return;
      if(event.key==='ArrowRight' && current<45){event.preventDefault();go(current+1);}
      if(event.key==='ArrowLeft' && current>1){event.preventDefault();go(current-1);}
    });
    nav.expanded = new KeySet.KeySetImpl(['nav-3','nav-5','nav-12','nav-44']);
    ko.applyBindings({},document.body);
    await Context.getContext(document.body).getBusyContext().whenReady();
    render();
    document.body.classList.add('components-ready');
    resolve({go,render});
  }).catch(reject);
}, reject));
window.workshopReady.catch(error => { console.error('Workshop initialization failed',error); });
