const SUPABASE_URL = 'https://xzwkombhtesozqobldvu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Ri_inFHaWpCyMAJHee8Zqw_YXdp3fnO';

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
const seedBooks = [
  {id:1,title:'The Moonbeam Garden',author:'Maya Rao',price:349,age:'4–6',genre:'Magic',rating:4.9,reviews:28,icon:'🌙',color:'#7767c9',description:'When a shy firefly loses her glow, a moonbeam garden helps her find a brave new kind of light.',available:true},
  {id:2,title:'Pippa and the Pocket Planet',author:'Nisha Iyer',price:399,age:'6–8',genre:'Adventure',rating:4.8,reviews:19,icon:'🪐',color:'#ef8162',description:'Pippa discovers a tiny planet in her coat pocket — complete with a very worried alien mayor.',available:true},
  {id:3,title:'The Great Mango Mystery',author:'Arjun Mehta',price:299,age:'5–7',genre:'Mystery',rating:4.7,reviews:42,icon:'🥭',color:'#e6a21c',description:'Three best friends follow a trail of sticky clues to solve the tastiest mystery in town.',available:true},
  {id:4,title:'Rumi’s Robot Rainy Day',author:'Anya Das',price:379,age:'3–5',genre:'Friendship',rating:5,reviews:31,icon:'🤖',color:'#4baeb3',description:'Rumi builds a robot to play with — and learns that imperfect rainy days can be the best kind.',available:true},
  {id:5,title:'A Kite for Every Cloud',author:'Zoya Khan',price:329,age:'4–6',genre:'Feelings',rating:4.9,reviews:16,icon:'🪁',color:'#d06c99',description:'A tender story about big feelings, a stubborn breeze, and finding your way back to the sunshine.',available:true},
  {id:6,title:'Nori’s Noisy Orchestra',author:'Tara Bose',price:359,age:'2–4',genre:'Music',rating:4.8,reviews:24,icon:'🎺',color:'#7c9c46',description:'Tap, toot and twirl along as Nori gathers the noisiest orchestra the forest has ever heard.',available:true},
  {id:7,title:'The Cloud Collector',author:'Dev Sen',price:429,age:'7–9',genre:'Nature',rating:4.9,reviews:11,icon:'☁️',color:'#65a6d5',description:'A curious child learns how clouds travel, change and carry stories across the sky.',available:true},
  {id:8,title:'Tara’s Tiny Tea Shop',author:'Leena Kapoor',price:319,age:'3–6',genre:'Pretend',rating:4.7,reviews:36,icon:'🫖',color:'#bd7f9b',description:'Tara opens a tea shop for woodland creatures — but her first customer has a very unusual order.',available:true}
];

const defaultContent={
  announcement:'Hi',

  heroEyebrow:'A little shop full of wonder',
  heroTitle:'Stories that make',
  heroHighlight:'little minds bloom.',
  heroCopy:'Thoughtfully chosen books for curious kids — packed with imagination, kindness, and plenty of giggles.',
  heroButton:'Browse the bookshelf',
  collectionTitle:'A story for every kind of day',
  saleText:'Need a gift? We’ll wrap it with a handwritten note.',
  clubEyebrow:'A fresh story each month',
  clubTitle:'The Little Reader’s Club',
  clubText:'Age-right, joy-packed monthly reading picks, delivered to your door.',
  ageEyebrow:'Built for growing readers',
  ageTitle:'Find their next favourite.',
  ageText:'Browse by age, interest, or the kind of adventure they’re craving today.'
};

const defaultCharacters=[
  {id:101,title:'Animal friends',description:'Gentle, mischievous and wonderfully wild companions.',icon:'🦁',color:'#f8c0cd',target:'Adventure'},
  {id:102,title:'Magic makers',description:'Wands, wishes, moonbeams and a spark of the impossible.',icon:'🧚',color:'#b9e4df',target:'Magic'},
  {id:103,title:'Big adventurers',description:'For explorers ready to travel far without leaving the sofa.',icon:'🚀',color:'#ded2ff',target:'Adventure'}
];

const storedContent=JSON.parse(localStorage.getItem('ss-content')||'null');

const state={
  books:seedBooks,
  cart:JSON.parse(localStorage.getItem('ss-cart')||'[]'),
  shipping:Number(localStorage.getItem('ss-shipping')||799),
  content:{...defaultContent,...storedContent},
characters:defaultCharacters,
  admin:sessionStorage.getItem('ss-admin')==='yes',
  filter:'All',
  editingBook:null,
  editingCharacter:null
};

async function loadBooksFromSupabase() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Could not load books from Supabase:', error);
    return;
  }

  if (Array.isArray(data) && data.length) {
    state.books = data;
    // route later
  }
}


async function loadCharactersFromSupabase() {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Could not load characters from Supabase:', error);
    return;
  }

  if (Array.isArray(data) && data.length) {
    state.characters = data;
    // route later
  }
}


async function loadBookImagesFromSupabase() {
  const { data, error } = await supabase
    .from('book_images')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Could not load book images from Supabase:', error);
    return;
  }

  // Attach images to the correct book
  console.log('BOOK IMAGES LOADED:', data);

  for (const book of state.books) {
    book.images = (data || [])
.filter(image => Number(image.book_id) === Number(book.id))
    .sort((a, b) => a.sort_order - b.sort_order);
  }

  // route later
}


const app=document.querySelector('#app');
const money=n=>`₹${n.toLocaleString('en-IN')}`;

function updateAnnouncement(){
  const banner=document.querySelector('.announcement');
  if(!banner)return;

  const template=
    typeof state.content.announcement==='string'&&state.content.announcement.trim()
      ? state.content.announcement.trim()
      : 'Hi';

  banner.textContent=template.replace('{shipping}',money(state.shipping));
}

function save(){
  localStorage.setItem('ss-books',JSON.stringify(state.books));
  localStorage.setItem('ss-cart',JSON.stringify(state.cart));
  localStorage.setItem('ss-shipping',state.shipping);
  localStorage.setItem('ss-content',JSON.stringify(state.content));
  localStorage.setItem('ss-characters',JSON.stringify(state.characters));
  updateAnnouncement();
  updateCartBadge();
}

function esc(s){
  return String(s).replace(/[&<>"']/g,c=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#039;'
  }[c]));
}

function cover(b, small = false) {
  const imageUrl =
    b.images && b.images.length
      ? b.images[0].image_url
      : b.image;

  const art = imageUrl
    ? `<img class="cover-photo" src="${esc(imageUrl)}" alt="${esc(b.title)}">`
    : `<span class="${small ? 'cart-cover-icon' : 'cover-icon'}">${esc(b.icon)}</span>`;

  return `<div class="${small ? 'cart-cover' : 'cover'}" style="background:${b.color}">${art}${small ? '' : `<span class="cover-title">${esc(b.title)}</span>`}</div>`;
}
function bookCard(b){
  return `<article class="book-card">
    ${cover(b)}
    <div class="book-meta">
      <h3>${esc(b.title)}</h3>
      <p>${esc(b.author)} · Ages ${b.age}</p>
      <div class="book-bottom">
        <span class="price">${money(b.price)}</span>
        <span class="rating">★ ${b.rating} (${b.reviews})</span>
        ${b.available
          ? `<button class="mini-add" onclick="addToCart(${b.id})" aria-label="Add ${esc(b.title)}">+</button>`
          : '<span class="status sold">Sold</span>'}
      </div>
    </div>
  </article>`;
}

function pageHero(eyebrow,title,text){
  return `<section class="page-hero">
    <span class="eyebrow">${eyebrow}</span>
    <h1>${title}</h1>
    <p>${text}</p>
  </section>`;
}

function renderHome(){
  const c=state.content;

  app.innerHTML=`
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">${esc(c.heroEyebrow)}</span>
        <h1>${esc(c.heroTitle)} <i>${esc(c.heroHighlight)}</i></h1>
        <p>${esc(c.heroCopy)}</p>
        <a class="button button-dark" href="#books">${esc(c.heroButton)}</a>
      </div>

      <div class="hero-art logo-hero">
        <img src="assets/tinytotbooks-logo.png" alt="TinyTotBooks">
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>${esc(c.collectionTitle)}</h2>
        <a class="text-link" href="#characters">Meet the collections →</a>
      </div>

      <div class="category-grid">
        ${state.characters.slice(0,4).map(x=>`
          <a class="category" style="background:${x.color}" href="#characters">
            <b>${esc(x.title)}</b>
            ${x.image
              ? `<img class="category-photo" src="${x.image}" alt="">`
              : `<span>${esc(x.icon)}</span>`}
          </a>
        `).join('')}
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="section-head">
        <h2>Fresh from the bookshelf</h2>
        <a class="text-link" href="#books">See all books →</a>
      </div>

      <div class="book-grid">
        ${state.books.filter(b=>b.available).slice(0,4).map(bookCard).join('')}
      </div>
    </section>

    <div class="sale-strip">
      <strong>${esc(c.saleText)}</strong>
      <a class="button button-light" href="#bundles">Explore bundles</a>
    </div>

    <section class="section">
      <div class="feature-grid">
        <article class="feature purple">
          <span class="eyebrow">${esc(c.clubEyebrow)}</span>
          <h2>${esc(c.clubTitle)}</h2>
          <p>${esc(c.clubText)}</p>
          <a class="button button-dark" href="#monthly">See this month’s box</a>
          <span class="doodle">📚</span>
        </article>

        <article class="feature orange">
          <span class="eyebrow">${esc(c.ageEyebrow)}</span>
          <h2>${esc(c.ageTitle)}</h2>
          <p>${esc(c.ageText)}</p>
          <a class="button button-light" href="#ages">Browse by age</a>
          <span class="doodle">🌈</span>
        </article>
      </div>
    </section>
  `;
}

function renderBooks(){
  const genres=['All',...new Set(state.books.map(b=>b.genre))];
  const books=state.filter==='All'
    ? state.books
    : state.books.filter(b=>b.genre===state.filter);

  app.innerHTML=`
    ${pageHero(
      'The full shelf',
      'Books they’ll ask for again and again.',
      'Every title is hand-picked for bright illustrations, memorable characters, and the magic of a page well turned.'
    )}

    <section class="section">
      <div class="filters">
        ${genres.map(x=>`
          <button class="filter ${x===state.filter?'active':''}" onclick="setFilter('${x}')">${x}</button>
        `).join('')}
      </div>

      <div class="book-grid">
        ${books.map(bookCard).join('')}
      </div>
    </section>
  `;
}

function renderCharacters(){
  app.innerHTML=`
    ${pageHero(
      'Browse by mood',
      'Who will they meet next?',
      'Pick a shelf full of characters they already love — and a few new friends waiting to be found.'
    )}

    <section class="section">
      <div class="collection-grid">
        ${state.characters.map(x=>`
          <a class="collection" style="background:${x.color}" href="#books" onclick="filterFromLink('${esc(x.target)}')">
            ${x.image
              ? `<img class="collection-photo" src="${x.image}" alt="${esc(x.title)}">`
              : `<span>${esc(x.icon)}</span>`}
            <h2>${esc(x.title)}</h2>
            <p>${esc(x.description)}</p>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAges(){
  const ages=[
    ['0–2','Board books, rhymes & snuggly read-alouds','🐣'],
    ['3–5','Picture books full of play and possibility','🫧'],
    ['6–8','Early readers and stories to get lost in','🔎'],
    ['9+','Big worlds for independent bookworms','🌍']
  ];

  app.innerHTML=`
    ${pageHero(
      'Just right for right now',
      'Books that grow with them.',
      'Finding the right story at the right moment can make all the difference.'
    )}

    <section class="section">
      <div class="age-grid">
        ${ages.map((a,i)=>`
          <a class="age-card" href="#books" onclick="filterAge('${i===0?'2–4':i===1?'3–5':i===2?'6–8':'7–9'}')">
            <span>${a[2]}</span>
            <h2>Ages ${a[0]}</h2>
            <p>${a[1]}</p>
            <b>Explore →</b>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

function renderMonthly(){
  app.innerHTML=`
    ${pageHero(
      'August reading box',
      'The Little Reader’s Club',
      'A lovely little ritual: three unforgettable stories, chosen for curious readers aged 4–7.'
    )}

    <section class="section">
      <div class="about-grid">
        <div class="about-card">
          <span class="eyebrow">Inside this month</span>
          <h2>Garden magic & good friends</h2>
          <p>August’s box is a warm mix of kindness, mystery and just enough magic for bedtime.</p>
          <ul>
            <li>The Moonbeam Garden</li>
            <li>A Kite for Every Cloud</li>
            <li>The Great Mango Mystery</li>
            <li>Illustrated activity sheet</li>
          </ul>
          <p><b>₹899</b> · Ships free</p>
          <button class="button button-dark" onclick="addBundle([1,5,3])">Add the August box</button>
        </div>

        <div>
          <div class="bundle-art" style="height:100%;min-height:330px;background:#f7bdd0">🌙 🪁 🥭</div>
        </div>
      </div>
    </section>
  `;
}

function renderBundles(){
  const bundles=[
    ['The Bedtime Basket','🌙',['The Moonbeam Garden','Nori’s Noisy Orchestra','A Kite for Every Cloud'],[1,6,5],899],
    ['The Little Explorer','🧭',['Pippa and the Pocket Planet','The Cloud Collector','The Great Mango Mystery'],[2,7,3],999],
    ['Tiny Giggles Gift','🎁',['Rumi’s Robot Rainy Day','Tara’s Tiny Tea Shop'],[4,8],649]
  ];

  app.innerHTML=`
    ${pageHero(
      'Ready-to-give magic',
      'Bundles made for wide eyes.',
      'Thoughtful book pairings for birthdays, holidays, or a just-because surprise.'
    )}

    <section class="section">
      <div class="bundle-grid">
        ${bundles.map(b=>`
          <article class="bundle">
            <div class="bundle-art">${b[1]}</div>
            <h2>${b[0]}</h2>
            <p class="muted">A beautiful set, gift-ready.</p>
            <ul>${b[2].map(x=>`<li>${x}</li>`).join('')}</ul>

            <div class="bundle-footer">
              <strong>${money(b[4])}</strong>
              <button class="button button-dark" onclick="addBundle([${b[3]}])">Add bundle</button>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAbout(){
  app.innerHTML=`
    ${pageHero(
      'Our story',
      'A bookshop for the wonderfully curious.',
      'TinyTotBooks began with a simple belief: every child deserves books that feel like a little door opening.'
    )}

    <section class="section">
      <div class="about-grid">
        <div>
          <h2>Small shop. Big imagination.</h2>
          <p>We’re a tiny, independent children’s bookshop with an enormous soft spot for picture books, peculiar characters, brave feelings and stories that make children look up and say, “Again!”</p>
          <p>Our shelf is deliberately small — so every book earns its place.</p>
        </div>

        <div class="about-card">
          <span style="font-size:4rem">🌱</span>
          <h2>Our promise</h2>
          <p>We choose stories with warmth, wonder and room for young minds to grow. No clutter, no endless scrolling — just genuinely great books.</p>
        </div>
      </div>
    </section>
  `;
}

function renderContact(){
  app.innerHTML=`
    ${pageHero(
      'Let’s talk books',
      'We’d love to hear from you.',
      'Looking for a gift, a school order, or just the perfect story for a particular little reader?'
    )}

    <section class="section">
      <div class="contact-grid">
        <div>
          <h2>Say hello</h2>
          <p><b>Email</b><br>hello@tinytotbooks.example</p>
          <p><b>Hours</b><br>Monday–Saturday · 10am–6pm</p>
          <p><b>For gifts & school orders</b><br>Tell us the age, occasion and budget — we’ll make a lovely shortlist.</p>
        </div>

        <form class="contact-form" onsubmit="sendMessage(event)">
          <label>Your name<input required placeholder="Name" /></label>
          <label>Email<input required type="email" placeholder="you@example.com" /></label>
          <label>Your message<textarea required placeholder="How can we help?"></textarea></label>
          <button class="button button-dark">Send message</button>
          <p class="form-notice" id="contactNotice"></p>
        </form>
      </div>
    </section>
  `;
}

function renderAdmin(){
  if(!state.admin){
    app.innerHTML=`
      ${pageHero(
        'Shop dashboard',
        'Admin sign in',
        'Manage your book shelf, stock status and website content from one simple place.'
      )}

      <section class="section">
        <form class="admin-login" onsubmit="adminLogin(event)">
          <h2>Welcome back</h2>
          <p class="muted">Demo passcode: <b>storybook</b></p>
          <label>Passcode<input id="adminPass" type="password" required placeholder="Enter passcode" /></label>
          <br>
          <button class="button button-dark">Open dashboard</button>
          <p class="form-notice" id="adminNotice"></p>
        </form>
      </section>
    `;
    return;
  }

  const b=state.books.find(x=>x.id===state.editingBook)||{};
  const ch=state.characters.find(x=>x.id===state.editingCharacter)||{};
  const c=state.content;

  app.innerHTML=`
    ${pageHero(
      'Shop dashboard',
      'Hello, bookseller.',
      'Edit your shelf and your storefront without opening code.'
    )}

    <section class="section">
      <div class="admin-wrap">

        <div class="settings">
          <div>
            <h2 style="margin:0">Store settings</h2>
            <p class="muted">Free-shipping threshold</p>
          </div>

          <label>Amount (₹)
            <input id="shippingInput" type="number" min="0" value="${state.shipping}" />
          </label>

          <button class="button button-dark" onclick="saveShipping()">Save setting</button>
          <button class="tiny-button" onclick="adminLogout()">Sign out</button>
        </div>

        <form class="content-editor" onsubmit="saveContent(event)">
          <h2>Home page words</h2>

          <div class="content-grid">
            <label>Announcement<input name="announcement" value="${esc(c.announcement)}" /></label>
            <label>Hero eyebrow<input name="heroEyebrow" value="${esc(c.heroEyebrow)}" /></label>
            <label>Hero title<input name="heroTitle" value="${esc(c.heroTitle)}" /></label>
            <label>Highlighted words<input name="heroHighlight" value="${esc(c.heroHighlight)}" /></label>

            <label class="full">
              Hero text
              <textarea name="heroCopy">${esc(c.heroCopy)}</textarea>
            </label>

            <label>Hero button<input name="heroButton" value="${esc(c.heroButton)}" /></label>
            <label>Collections title<input name="collectionTitle" value="${esc(c.collectionTitle)}" /></label>

            <label class="full">
              Gift-strip message
              <input name="saleText" value="${esc(c.saleText)}" />
            </label>

            <label>Club eyebrow<input name="clubEyebrow" value="${esc(c.clubEyebrow)}" /></label>
            <label>Club title<input name="clubTitle" value="${esc(c.clubTitle)}" /></label>

            <label class="full">
              Club text
              <textarea name="clubText">${esc(c.clubText)}</textarea>
            </label>

            <label>Age card eyebrow<input name="ageEyebrow" value="${esc(c.ageEyebrow)}" /></label>
            <label>Age card title<input name="ageTitle" value="${esc(c.ageTitle)}" /></label>

            <label class="full">
              Age card text
              <textarea name="ageText">${esc(c.ageText)}</textarea>
            </label>
          </div>

          <br>
          <button class="button button-dark">Save home page</button>
        </form>

        <h2 class="admin-section-title">Character & collection cards</h2>

        <form class="admin-form" onsubmit="saveCharacter(event)">
          <h2>${ch.id?'Edit':'Add'} a character card</h2>

          <label>Card title
            <input required name="title" value="${esc(ch.title||'')}" placeholder="Animal friends" />
          </label>

          <label>What it says
            <input required name="description" value="${esc(ch.description||'')}" placeholder="A short description" />
          </label>

          <label>Book genre to open
            <input required name="target" value="${esc(ch.target||'Adventure')}" placeholder="Magic" />
          </label>

          <label>Emoji (if no image)
            <input name="icon" maxlength="4" value="${esc(ch.icon||'✨')}" />
          </label>

          <label>Card colour
            <input name="color" value="${esc(ch.color||'#b9e4df')}" placeholder="#b9e4df" />
          </label>

          <label>Image link (optional)
            <input name="imageUrl" value="${esc(ch.image||'')}" placeholder="https://…" />
          </label>

          <label class="full">
            Or upload a card picture
            <input name="imageFile" type="file" accept="image/*" />
            <span class="photo-note">Use a small image (under 1 MB) in this offline demo.</span>
          </label>

          <button class="button button-dark">${ch.id?'Save card':'Add card'}</button>
          ${ch.id?'<button type="button" class="tiny-button" onclick="cancelCharacterEdit()">Cancel</button>':''}
        </form>

        <div class="collection-grid">
          ${state.characters.map(x=>`
            <article class="collection" style="background:${x.color}">
              ${x.image
                ? `<img class="collection-photo" src="${x.image}" alt="">`
                : `<span>${esc(x.icon)}</span>`}

              <h2>${esc(x.title)}</h2>
              <p>${esc(x.description)}</p>

              <button class="tiny-button" onclick="startCharacterEdit(${x.id})">Edit</button>
              <button class="tiny-button" onclick="deleteCharacter(${x.id})">Remove</button>
            </article>
          `).join('')}
        </div>

        <h2 class="admin-section-title">Books & covers</h2>

        <form class="admin-form" onsubmit="saveBook(event)">
          <h2>${b.id?'Edit':'Add'} a book</h2>

          <label>Title
            <input required name="title" value="${esc(b.title||'')}" placeholder="Book title" />
          </label>

          <label>Author
            <input required name="author" value="${esc(b.author||'')}" placeholder="Author" />
          </label>

          <label>Price (₹)
            <input required type="number" min="1" name="price" value="${b.price||''}" placeholder="349" />
          </label>

          <label>Age group
            <input required name="age" value="${esc(b.age||'')}" placeholder="4–6" />
          </label>

          <label>Genre
            <input required name="genre" value="${esc(b.genre||'')}" placeholder="Adventure" />
          </label>

          <label>Cover colour
            <input name="color" value="${esc(b.color||'#7767c9')}" placeholder="#7767c9" />
          </label>

          <label>Cover emoji (if no image)
            <input name="icon" maxlength="4" value="${esc(b.icon||'📚')}" />
          </label>

          <label>Cover image link (optional)
            <input name="imageUrl" value="${esc(b.image||'')}" placeholder="https://…" />
          </label>

          <label>Rating
            <input type="number" name="rating" min="0" max="5" step="0.1" value="${b.rating||5}" />
          </label>

          <label>Review count
            <input type="number" name="reviews" min="0" value="${b.reviews||0}" />
          </label>

          <label class="full">
            Or upload a custom book cover
            <input name="imageFile" type="file" accept="image/*" />
            <span class="photo-note">Your image will show on the home page, catalogue and book detail. Keep it under 1 MB for reliable browser storage.</span>
          </label>

          <label class="full">
            Description
            <textarea required name="description" placeholder="A short, enticing book description">${esc(b.description||'')}</textarea>
          </label>

          <button class="button button-dark">${b.id?'Save book':'Add book to shelf'}</button>
          ${b.id?'<button type="button" class="tiny-button" onclick="cancelBookEdit()">Cancel</button>':''}
        </form>

        <div class="admin-toolbar">
          <div>
            <h2>Book inventory</h2>
            <p class="muted">${state.books.length} books in your catalogue</p>
          </div>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Price</th>
              <th>Age</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            ${state.books.map(x=>`
              <tr>
                <td>
                  <b>${esc(x.title)}</b><br>
                  <span class="muted">${esc(x.author)}</span>
                </td>
                <td>${money(x.price)}</td>
                <td>${x.age}</td>
                <td>
                  <span class="status ${x.available?'available':'sold'}">
                    ${x.available?'Available':'Sold'}
                  </span>
                </td>
                <td>
                  <button class="tiny-button" onclick="startBookEdit(${x.id})">Edit</button>
                  <button class="tiny-button" onclick="toggleSold(${x.id})">Mark ${x.available?'sold':'available'}</button>
                  <button class="tiny-button" onclick="deleteBook(${x.id})">Remove</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

      </div>
    </section>
  `;
}

function route(){
  const view=location.hash.slice(1).split('/')[0]||'home';

  const pages={
    home:renderHome,
    books:renderBooks,
    characters:renderCharacters,
    ages:renderAges,
    monthly:renderMonthly,
    bundles:renderBundles,
    about:renderAbout,
    contact:renderContact,
    admin:renderAdmin
  };

  (pages[view]||renderHome)();

  document.querySelector('#mainNav').classList.remove('open');
  app.focus();
}

function addToCart(id){
  const book=state.books.find(b=>b.id===id);
  if(!book||!book.available)return;

  const line=state.cart.find(x=>x.id===id);

  line
    ? line.qty++
    : state.cart.push({id,qty:1});

  save();
  openCart();
}

function addBundle(ids){
  ids.forEach(addToCart);
  openCart();
}

function changeQty(id,d){
  const item=state.cart.find(x=>x.id===id);
  if(!item)return;

  item.qty+=d;

  if(item.qty<=0){
    state.cart=state.cart.filter(x=>x.id!==id);
  }

  save();
  renderCart();
}

function updateCartBadge(){
  document.querySelector('#cartCount').textContent=
    state.cart.reduce((n,x)=>n+x.qty,0);
}

function renderCart(){
  const lines=state.cart
    .map(x=>({
      book:state.books.find(b=>b.id===x.id),
      qty:x.qty
    }))
    .filter(x=>x.book);

  const total=lines.reduce(
    (n,x)=>n+x.book.price*x.qty,
    0
  );

  document.querySelector('#cartItems').innerHTML=
    lines.length
      ? lines.map(({book,qty})=>`
          <div class="cart-line">
            ${cover(book,true)}

            <div class="line-info">
              <h3>${esc(book.title)}</h3>
              <p>${money(book.price)}</p>

              <div class="qty">
                <button onclick="changeQty(${book.id},-1)">−</button>
                <b>${qty}</b>
                <button onclick="changeQty(${book.id},1)">+</button>
              </div>
            </div>

            <strong>${money(book.price*qty)}</strong>
          </div>
        `).join('')
      : '<p class="empty">Your bag is waiting for its first story.</p>';

  document.querySelector('#cartTotal').textContent=money(total);

  document.querySelector('#shippingMessage').textContent=
    total===0
      ? 'Add a story to get started.'
      : total>=state.shipping
        ? 'You’ve unlocked free delivery! 🎉'
        : `Add ${money(state.shipping-total)} more for free delivery.`;
}

function openCart(){
  renderCart();

  document.querySelector('#cartDrawer').classList.add('open');
  document.querySelector('#cartDrawer').setAttribute('aria-hidden','false');
  document.querySelector('#overlay').classList.add('show');
}

function closeCart(){
  document.querySelector('#cartDrawer').classList.remove('open');
  document.querySelector('#overlay').classList.remove('show');
}

function openBook(id){
  const b=state.books.find(x=>x.id===id);
  const d=document.querySelector('#bookDialog');

  d.innerHTML=`
    <div class="dialog-head">
      <span class="tag">${b.genre} · Ages ${b.age}</span>
      <button class="close" onclick="bookDialog.close()">×</button>
    </div>

    <div class="book-detail">
      ${cover(b)}

      <div>
        <h1>${esc(b.title)}</h1>
        <p class="muted">
          by ${esc(b.author)} ·
          <span class="rating">★ ${b.rating} from ${b.reviews} readers</span>
        </p>

        <p>${esc(b.description)}</p>
        <p><strong>${money(b.price)}</strong></p>

        ${b.available
          ? `<button class="button button-dark" onclick="addToCart(${b.id});bookDialog.close()">Add to bag</button>`
          : '<span class="status sold">Currently sold out</span>'}
      </div>
    </div>
  `;

  d.showModal();
}

function setFilter(f){
  state.filter=f;
  renderBooks();
}

function filterFromLink(f){
  state.filter=f;
}

function filterAge(a){
  state.filter='All';

  setTimeout(()=>{
    renderBooks();

    document.querySelector('.filters').insertAdjacentHTML(
      'afterend',
      `<p class="muted">Showing all books — look for Ages ${a} in each description.</p>`
    );
  },10);
}

function toggleSold(id){
  const b=state.books.find(x=>x.id===id);
  b.available=!b.available;
  save();
  renderAdmin();
}

function deleteBook(id){
  if(confirm('Remove this book from your shelf?')){
    state.books=state.books.filter(b=>b.id!==id);
    state.cart=state.cart.filter(x=>x.id!==id);
    save();
    renderAdmin();
  }
}

function photoFromForm(form,done){
  const file=form.querySelector('[name="imageFile"]').files[0];

  if(!file){
    done(form.elements.imageUrl.value.trim());
    return;
  }

  if(
    file.size>950000 &&
    !confirm('This photo is over 1 MB. It may not fit in this browser’s local storage. Continue?')
  )return;

  const reader=new FileReader();

  reader.onload=()=>done(reader.result);
  reader.readAsDataURL(file);
}

function saveBook(e){
  e.preventDefault();

  const form=e.currentTarget;
  const f=new FormData(form);

  photoFromForm(form,image=>{
    const old=state.books.find(x=>x.id===state.editingBook);

    const book={
      id:old?.id||Date.now(),
      title:f.get('title').trim(),
      author:f.get('author').trim(),
      price:Number(f.get('price')),
      age:f.get('age').trim(),
      genre:f.get('genre').trim(),
      icon:f.get('icon').trim()||'📚',
      color:f.get('color').trim()||'#7767c9',
      image:image||old?.image||'',
      description:f.get('description').trim(),
      rating:Number(f.get('rating'))||5,
      reviews:Math.max(0,Number(f.get('reviews'))||0),
      available:old?.available??true
    };

    if(old)
      Object.assign(old,book);
    else
      state.books.push(book);

    state.editingBook=null;
    save();
    renderAdmin();
  });
}

function startBookEdit(id){
  state.editingBook=id;
  renderAdmin();
  window.scrollTo({top:0,behavior:'smooth'});
}

function cancelBookEdit(){
  state.editingBook=null;
  renderAdmin();
}

function saveCharacter(e){
  e.preventDefault();

  const form=e.currentTarget;
  const f=new FormData(form);

  photoFromForm(form,image=>{
    const old=state.characters.find(
      x=>x.id===state.editingCharacter
    );

    const item={
      id:old?.id||Date.now(),
      title:f.get('title').trim(),
      description:f.get('description').trim(),
      target:f.get('target').trim()||'All',
      icon:f.get('icon').trim()||'✨',
      color:f.get('color').trim()||'#b9e4df',
      image:image||old?.image||''
    };

    if(old)
      Object.assign(old,item);
    else
      state.characters.push(item);

    state.editingCharacter=null;
    save();
    renderAdmin();
  });
}

function startCharacterEdit(id){
  state.editingCharacter=id;
  renderAdmin();
  window.scrollTo({top:0,behavior:'smooth'});
}

function cancelCharacterEdit(){
  state.editingCharacter=null;
  renderAdmin();
}

function deleteCharacter(id){
  if(confirm('Remove this character card?')){
    state.characters=state.characters.filter(x=>x.id!==id);
    save();
    renderAdmin();
  }
}

function saveContent(e){
  e.preventDefault();

  const f=new FormData(e.currentTarget);

  Object.keys(defaultContent).forEach(
    key=>state.content[key]=(f.get(key)||'').trim()
  );

  save();
  alert('Home page text saved. Open Home to see it.');
}

function saveShipping(){
  state.shipping=Math.max(
    0,
    Number(document.querySelector('#shippingInput').value)||0
  );

  save();
  alert('Free-shipping threshold saved.');
}

function adminLogin(e){
  e.preventDefault();

  if(document.querySelector('#adminPass').value==='storybook'){
    state.admin=true;
    sessionStorage.setItem('ss-admin','yes');
    renderAdmin();
  }else{
    document.querySelector('#adminNotice').textContent=
      'That passcode doesn’t match. Try “storybook”.';
  }
}

function adminLogout(){
  state.admin=false;
  sessionStorage.removeItem('ss-admin');
  renderAdmin();
}

function sendMessage(e){
  e.preventDefault();

  document.querySelector('#contactNotice').textContent=
    'Thanks! In the real site this would send via your email service.';

  e.target.reset();
}

document.querySelector('#menuButton').onclick=()=>{
  document.querySelector('#mainNav').classList.toggle('open');
};

document.querySelector('#cartButton').onclick=openCart;

document.querySelector('#overlay').onclick=closeCart;

document.querySelectorAll('[data-close]').forEach(b=>{
  b.onclick=()=>{
    const id=b.dataset.close;

    id==='cartDrawer'
      ? closeCart()
      : document.querySelector('#'+id).close();
  };
});

document.querySelector('#searchButton').onclick=()=>{
  searchDialog.showModal();
  searchInput.focus();
  searchBooks();
};

document.querySelector('#searchInput').oninput=searchBooks;

function searchBooks(){
  const q=searchInput.value.toLowerCase();
  
if(!q.trim()){
  searchResults.innerHTML='<p class="empty">Start typing to find a story.</p>';
  return;
}
  const list=state.books.filter(
    b=>[b.title,b.author,b.genre,b.age]
      .join(' ')
      .toLowerCase()
      .includes(q)
  );

  searchResults.innerHTML=
    list.map(b=>`
      <div class="result">
        ${cover(b,true)}

        <div>
          <h3>${esc(b.title)}</h3>
          <p>${b.author} · ${money(b.price)}</p>
        </div>

        <button
          class="tiny-button"
          onclick="searchDialog.close();openBook(${b.id})">
          View
        </button>
      </div>
    `).join('')
    || '<p class="empty">No stories found — try a different word.</p>';
}

document.querySelector('#checkoutButton').onclick=()=>{
  if(!state.cart.length)return;

  closeCart();
  checkoutDialog.showModal();
};

document.querySelector('#checkoutForm').onsubmit=e=>{
  e.preventDefault();

  checkoutNotice.textContent=
    'Your details are saved only in this browser demo. No order or payment was placed.';
};

document.addEventListener('click',e=>{
  const card=e.target.closest('.cover');

  if(card){
    const title=card.querySelector('.cover-title')?.textContent;
    const b=state.books.find(x=>x.title===title);

    if(b)openBook(b.id);
  }
});

window.addEventListener('hashchange',route);

save();
route();

async function loadSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) {
    console.error('Could not load site settings:', error);
    return;
  }

  for (const setting of data || []) {
    if (setting.key === 'announcement') {
      state.content.announcement = setting.value || 'Hi';
    }

    if (setting.key === 'heroEyebrow') {
      state.content.heroEyebrow =
        setting.value || state.content.heroEyebrow;
    }
  }

  updateAnnouncement();
  // route later
}

async function initializeApp() {
  await loadSiteSettings();
  await loadBooksFromSupabase();
  await loadCharactersFromSupabase();
  await loadBookImagesFromSupabase();

  updateAnnouncement();
  route();
}

initializeApp();