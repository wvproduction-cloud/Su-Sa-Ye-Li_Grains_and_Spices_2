(function(){
  // Page-level Sinhala <-> English switch. This is intentionally separate from
  // the Product Name / Description typing-mode buttons in admin.html.
  const map = {
    'මුල් පිටුව':'Home',
    'නිෂ්පාදන':'Products',
    'අප ගැන':'About Us',
    'සම්බන්ධ වන්න':'Contact',
    'අලුත් Product එකක් එකතු කරන්න':'Add New Product',
    'WhatsApp හරහා විමසන්න':'Contact via WhatsApp',
    'අක්කර 50, මඩකුඹුර, කරන්දෙණිය':'Akkara 50, Madakumbura, Karandeniya',
    'අපේ ගෙදරින් ඔබේ ගෙදරට ගෙනෙන දේශීය රසය':'Bringing local taste from our home to your home',
    'කරන්දෙණිය අපේ ගෙදරින් නිෂ්පාදනය කරන උසස්ම තත්ත්වයේ දේශීය ධාන්‍ය වර්ග (කුරක්කන්, මෙනේරි) සහ පිරිසිදු කුළුබඩු (තුනපහ, මිරිස්, ගම්මිරිස්, කුරුඳු, මීපැණී) තොග සහ සිල්ලර මිලට ලංකාව පුරාම බෙදාහරින්නෙමු.':'We deliver premium local grains (kurakkan, meneri) and pure spices (thunapaha, chilli, pepper, cinnamon and honey) from our home in Karandeniya across Sri Lanka for wholesale and retail.',
    'නිෂ්පාදන නරඹන්න':'View Products',
    'Admin Panel (අලුත් එකතු කිරීම්)':'Admin Panel (New Additions)',
    '100% දේශීය සහ පිරිසිදුයි':'100% Local & Pure',
    'ප්‍රමිතියෙන් උසස් පැකට් කළ භාණ්ඩ':'Premium Quality Packaged Products',
    'තොග සහ සිල්ලර ඇණවුම් සඳහා දැන්ම ඔබේ ප්‍රියතම නිෂ්පාදනය තෝරාගන්න.':'Choose your favourite product now for wholesale and retail orders.',
    'ඉක්මන් සබැඳි':'Quick Links',
    'නිෂ්පාදන ලැයිස්තුව':'Product List',
    'අපගේ තොරතුරු':'About Us',
    'සමාජ ජාල':'Social Media',
    'පැකට් ප්‍රමාණය / ප්‍රමාණය තෝරන්න:':'Choose package size / quantity:',
    'ඇණවුම් කිරීමට (Order Now)':'Order Now',
    'වසන්න':'Close',
    'ඇණවුම් කළ යුතු වේදිකාව (Platform) තෝරන්න':'Choose an order platform',
    'ඔබට පහසුම සන්නිවේදන මාධ්‍යය ක්ලික් කරන්න. ඔබ තෝරාගත් නිෂ්පාදන විස්තරය සමඟ කෙලින්ම අප වෙත පණිවිඩයක් ලැබෙනු ඇත.':'Choose the communication method that is easiest for you. We will receive a message directly with your selected product details.',
    'WhatsApp හරහා ඇණවුම් කරන්න':'Order via WhatsApp',
    'Messenger හරහා ඇණවුම් කරන්න':'Order via Messenger',
    'SMS / දුරකථන ඇමතුම':'SMS / Phone Call',
    'ඉවත් වන්න (Cancel)':'Cancel',
    'අලුත් නිෂ්පාදනයක් එකතු කරන්න (Dynamic Add)':'Add New Product (Dynamic Add)',
    'නිෂ්පාදනයේ නම (Product Name):':'Product Name:',
    'වර්ගීකරණය (Category):':'Category:',
    'ධාන්‍ය වර්ග (Grains)':'Grains',
    'කුළුබඩු (Spices)':'Spices',
    'වෙනත් (Others)':'Others',
    'මිල (Price):':'Price:',
    'රූපයේ සබැඳිය (Image URL):':'Image URL:',
    'විස්තරය (Description):':'Description:',
    'නිෂ්පාදනය වෙබ් අඩවියට එකතු කරන්න':'Add Product to Website',
    'අපගේ නිෂ්පාදන මාලාව':'Our Product Range',
    'කුළුබඩු සහ ධාන්‍ය වර්ග':'Spices & Grains',
    'සියල්ල':'All',
    'ධාන්‍ය වර්ග':'Grains',
    'වෙනත් (මීපැණී)':'Others (Honey)',
    'අපගේ පසුබිම':'Our Story',
    'දිවයින පුරා බෙදාහැරීම':'Islandwide Delivery',
    'තොග සහ සිල්ලර වෙළඳසැල් වෙත.':'For wholesale and retail stores.',
    '100% ගුණාත්මක සහතිකය':'100% Quality Assured',
    'පිරිසිදුකම අංක එකට.':'Purity comes first.',
    'සම්බන්ධ වීමට සහ පිහිටීම':'Contact & Location',
    'ලිපිනය:':'Address:',
    'ලිපිනය':'Address',
    'දුරකථන අංකය:':'Phone:',
    'දුරකථනය':'Phone',
    'ඊමේල් ලිපිනය:':'Email:',
    'ඊමේල්':'Email',
    'විමසීමක් යවන්න':'Send an Inquiry',
    'නම':'Name',
    'දුරකථන අංකය':'Phone Number',
    'පණිවිඩය':'Message',
    'WhatsApp වෙත යවන්න':'Send to WhatsApp',
    'අපිට කතා කරන්න':'Talk to Us',
    'ඇණවුම්, තොග මිල, බෙදාහැරීම් හෝ ඕනෑම විමසීමක් සඳහා සෘජුවම සම්බන්ධ වන්න.':'Contact us directly for orders, wholesale prices, deliveries or any inquiry.',
    'ADMIN PANEL':'ADMIN PANEL',
    'නව නිෂ්පාදන එකතු කරන්න':'Add New Product',
    'මේ පැනලයෙන් product එකක් add කළාම එය මේ browser එකේ catalog එකට තාවකාලිකව save වේ.':'Products added from this panel are temporarily saved in this browser catalog.',
    'Product Name':'Product Name',
    'Category':'Category',
    'Price':'Price',
    'Image URL / Local path':'Image URL / Local path',
    '📸 Photo එක තෝරන්න:':'📸 Choose a Photo:',
    'ඔයාගේ computer එකෙන් photo එකක් තෝරන්න. Upload කළ photo එක browser එකේ save වේ.':'Choose a photo from your computer. The uploaded photo is saved in this browser.',
    'Description':'Description',
    'Product එක එකතු කරන්න':'Add Product',
    'දැනට තියෙන Products':'Current Products',
    'Edit කරන්න product එක තෝරන්න':'Choose a product to edit',
    'Typing Language':'Typing Language',
    'Logout':'Logout',
    'පිටුවට ආපසු':'Back to website',
    'Admin Login':'Admin Login',
    'Sign in to access the admin dashboard.':'Sign in to access the admin dashboard.',
    'Username':'Username',
    'Password':'Password',
    'Login':'Login',
    'Demo login:':'Demo login:',
    'Manage products, prices, images, and your catalog from one place.':'Manage products, prices, images, and your catalog from one place.'
  };

  const reverse = Object.fromEntries(Object.entries(map).map(([si,en])=>[en,si]));

  function replaceTextNode(node, dict){
    const original = node.nodeValue;
    const trimmed = original.trim();
    if(!trimmed || !dict[trimmed]) return;
    const start = original.indexOf(trimmed);
    const end = start + trimmed.length;
    node.nodeValue = original.slice(0,start) + dict[trimmed] + original.slice(end);
  }

  function swapText(root, dict){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        if(!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p=node.parentElement;
        if(p && ['SCRIPT','STYLE','NOSCRIPT'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
        // Do not touch product data or user-editable fields.
        if(p && ['INPUT','TEXTAREA','OPTION'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n=>replaceTextNode(n,dict));

    root.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{
      const v=(el.placeholder||'').trim();
      if(dict[v]) el.placeholder=dict[v];
    });
  }

  function applyPageLanguage(lang){
    const isEnglish = lang==='en';
    document.documentElement.lang = isEnglish ? 'en' : 'si';
    swapText(document.body, isEnglish ? map : reverse);
    const btn=document.getElementById('globalLangBtn');
    if(btn) btn.textContent = isEnglish ? 'සිංහල' : 'English';
    localStorage.setItem('susayeli_page_lang', isEnglish ? 'en' : 'si');
  }

  window.togglePageLanguage=function(){
    const cur=localStorage.getItem('susayeli_page_lang') || 'si';
    applyPageLanguage(cur==='si' ? 'en' : 'si');
  };

  document.addEventListener('DOMContentLoaded',()=>{
    const saved=localStorage.getItem('susayeli_page_lang') || 'si';
    const btn=document.getElementById('globalLangBtn');
    if(btn) btn.textContent = saved==='en' ? 'සිංහල' : 'English';
    if(saved==='en') applyPageLanguage('en');
  });
})();
