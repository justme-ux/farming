// app.js — static demo wiring for AgroConnect
document.addEventListener('DOMContentLoaded', function(){
  // Helpers
  const getUser = ()=>{ try{return JSON.parse(localStorage.getItem('agro_user'));}catch(e){return null} };
  const setUser = u=>localStorage.setItem('agro_user', JSON.stringify(u));
  const logout = ()=>{ localStorage.removeItem('agro_user'); window.location = 'login.html'; };
  const getCart = ()=> JSON.parse(localStorage.getItem('agro_cart')||'[]');
  const saveCart = c=> localStorage.setItem('agro_cart', JSON.stringify(c));
  const addToCart = item=>{ const c=getCart(); c.push(item); saveCart(c); updateCartCount(); };
  const updateCartCount = ()=>{
    const el = document.getElementById('cartCount'); if(!el) return; el.textContent = getCart().length;
  };

  // --- Login page behavior ---
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignup = document.getElementById('showSignup');
  if(showSignup){ showSignup.addEventListener('click', ()=>{ signupForm.classList.toggle('hidden'); }); }

  if(loginForm){
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = (loginForm.querySelector('input[name="email"]').value || '').trim();
      const name = email.split('@')[0] || 'Farmer';
      setUser({name: name.charAt(0).toUpperCase()+name.slice(1), email});
      window.location = 'project.html';
    });
  }

  if(signupForm){
    signupForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = (signupForm.querySelector('input[name="name"]').value || 'Farmer').trim();
      const email = (signupForm.querySelector('input[name="email"]').value || '').trim();
      setUser({name, email});
      window.location = 'project.html';
    });
  }

  // --- Project page behavior ---
  const user = getUser();
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) logoutBtn.addEventListener('click', logout);

  if(document.body.contains(document.querySelector('.container'))){
    // If user is not logged in, redirect to login
    if(!user){ window.location = 'login.html'; return; }
    // Show user name
    const nameEl = document.getElementById('userName'); if(nameEl) nameEl.textContent = user.name;
    updateCartCount();

    // Wire add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        const item = { id: btn.dataset.id || Date.now(), title: btn.dataset.title || 'Item', price: btn.dataset.price || '0' };
        addToCart(item);
        btn.textContent = 'Added';
        btn.disabled = true;
      });
    });

    // Loan application form
    const loanForm = document.getElementById('loanForm');
    if(loanForm){
      loanForm.addEventListener('submit', function(e){
        e.preventDefault();
        const amount = loanForm.querySelector('input[name="amount"]').value;
        const purpose = loanForm.querySelector('input[name="purpose"]').value;
        const apps = JSON.parse(localStorage.getItem('agro_loans')||'[]');
        apps.push({id: Date.now(), user: user.name, amount, purpose, date: new Date().toISOString()});
        localStorage.setItem('agro_loans', JSON.stringify(apps));
        alert('Loan application submitted — our team will contact you.');
        loanForm.reset();
      });
    }
  }
});
