'use strict';
const menu=document.querySelector('.menu');
const nav=document.querySelector('#navigation');
menu.hidden=false;
document.documentElement.classList.add('js');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu();});
matchMedia('(min-width: 901px)').addEventListener('change',closeMenu);
const form=document.querySelector('#diagnostic-form');
if(form)form.addEventListener('submit',e=>{
 e.preventDefault();
 const name=form.elements.name.value.trim();
 const problem=form.elements.problem.value.trim();
 if(!name||!problem){(name?form.elements.problem:form.elements.name).focus();return;}
 const company=form.elements.company.value.trim();
 const message=`Hola CYSI, quiero solicitar el diagnóstico inicial gratuito.\n\nNombre: ${name}${company?'\nEmpresa: '+company:''}\nMe gustaría mejorar: ${problem}\n\n¿Podemos coordinar una reunión?`;
 window.location.assign('https://wa.me/56954393441?text='+encodeURIComponent(message));
});
