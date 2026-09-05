const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  })
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const modal = document.getElementById('demoModal');
const openBtn = document.getElementById('playDemo');
const closeBtn = document.getElementById('closeModal');
openBtn.addEventListener('click',()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false')});
closeBtn.addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')});
modal.addEventListener('click',(e)=>{if(e.target===modal) closeBtn.click()});
document.addEventListener('keydown',(e)=>{if(e.key==='Escape') closeBtn.click()});
