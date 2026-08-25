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
  saleText:'Curious about the little story behind TinyTotBooks?',
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


const state={

  books:seedBooks,

  cart:JSON.parse(localStorage.getItem('ss-cart')||'[]'),

  shipping:Number(localStorage.getItem('ss-shipping')||799),

  content:defaultContent,

  characters:defaultCharacters,

  reviews:[],

  monthlyPicks:[],

  bundles:[],

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

async function loadMonthlyPicksFromSupabase() {
  const { data, error } = await supabase
    .from('monthly_picks')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Could not load monthly picks:', error);
    state.monthlyPicks = [];
    return;
  }

  state.monthlyPicks = data || [];
  console.log('MONTHLY PICKS LOADED:', state.monthlyPicks);
}


async function loadBundlesFromSupabase() {
  const { data, error } = await supabase
    .from('bundles')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Could not load bundles:', error);
    state.bundles = [];
    return;
  }

  state.bundles = data || [];
  console.log('BUNDLES LOADED:', state.bundles);
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

async function loadReviewsFromSupabase(){

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('review_date', { ascending: false });

  if(error){
    console.error('Could not load reviews from Supabase:', error);
    state.reviews = [];
    return;
  }

  state.reviews = Array.isArray(data) ? data : [];

  console.log('REVIEWS LOADED:', state.reviews);
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

  return `
    <article
      class="book-card"
      onclick="openBook(${b.id})"
      style="cursor:pointer"
    >

      ${cover(b)}

      <div class="book-meta">

        <h3>${esc(b.title)}</h3>

        <p>
          ${esc(b.author)} · Ages ${esc(b.age)}
        </p>

        <div class="book-bottom">

          <span class="price">
            ${money(b.price)}
          </span>

          <span class="rating">
            ★ ${b.rating} (${b.reviews})
          </span>

          ${
            b.available
              ? `
                <button
                  class="mini-add"
                  onclick="
                    event.stopPropagation();
                    addToCart(${b.id})
                  "
                  aria-label="Add ${esc(b.title)}"
                >
                  +
                </button>
              `
              : `
                <span class="status sold">
                  Sold
                </span>
              `
          }

        </div>

      </div>

    </article>
  `;
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

<!-- Homepage character collections intentionally hidden.
     They remain available on the dedicated Characters page. -->

    <section class="section" style="padding-top:45px">
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
      <a class="button button-light" href="#about">Our Story →</a>
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

        <article class="feature bundle-feature">

  <span class="eyebrow">
    Ready to share
  </span>

  <h2>
    A little box of magic, all wrapped up.
  </h2>

  <p>
    Discover thoughtful book bundles made for birthdays, surprises, and just-because moments.
  </p>

  <a
    class="button button-dark"
    href="#bundles"
  >
    Explore the bundles →
  </a>

  <span class="doodle">
    🎁
  </span>

</article>
       <article class="feature character-feature">

  <span class="eyebrow">
    Meet the characters
  </span>

  <h2>
    Every story needs a great friend.
  </h2>

  <p>
    From curious animals to magical mischief-makers, find the characters they’ll love meeting next.
  </p>

  <a
    class="button button-dark"
    href="#characters"
  >
    Meet the characters →
  </a>

  <span class="doodle">
    🦊
  </span>

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

  const picks = state.monthlyPicks || [];

  app.innerHTML = `
    ${pageHero(
      'August reading box',
      'The Little Reader’s Club',
      'A lovely little ritual: three unforgettable stories, chosen for curious readers aged 4–7.'
    )}

    <section class="section">

      ${
        picks.length
          ? picks.map(p => `
              <div class="about-grid">

                <div class="about-card">

                  <span class="eyebrow">
                    ${esc(p.eyebrow || '')}
                  </span>

                  <h2>
                    ${esc(p.title || '')}
                  </h2>

                  <p>
                    ${esc(p.description || '')}
                  </p>

                  ${
                    Array.isArray(p.items)
                      ? `
                        <ul>
                          ${p.items.map(item => `
                            <li>${esc(item)}</li>
                          `).join('')}
                        </ul>
                      `
                      : ''
                  }

                  <p>
                    <b>${money(p.price || 0)}</b>
                    · ${esc(p.shipping_text || '')}
                  </p>

                  <button
                    class="button button-dark"
                    onclick="addBundle([${(p.book_ids || []).join(',')}])"
                  >
                    ${esc(p.button_text || 'Add this box')}
                  </button>

                </div>

                <div>
                  <div
                    class="bundle-art"
                    style="
                      height:100%;
                      min-height:330px;
                      background:${esc(p.artwork_color || '#f7bdd0')}
                    "
                  >
                    ${esc(p.artwork || '✨')}
                  </div>
                </div>

              </div>
            `).join('')
          : `
            <div class="about-card">
              <h2>No monthly picks right now</h2>
              <p>Check back soon for the next reading box.</p>
            </div>
          `
      }

    </section>
  `;
}

function renderBundles(){

  const bundles = state.bundles || [];

  app.innerHTML = `
    ${pageHero(
      'Ready-to-give magic',
      'Bundles made for wide eyes.',
      'Thoughtful book pairings for birthdays, holidays, or a just-because surprise.'
    )}

    <section class="section">

      <div class="bundle-grid">

        ${
          bundles.length
            ? bundles.map(b => `
                <article class="bundle">

                  <div class="bundle-art">
                    ${esc(b.icon || '🎁')}
                  </div>

                  <h2>
                    ${esc(b.title || '')}
                  </h2>

                  <p class="muted">
                    ${esc(b.description || '')}
                  </p>

                  ${
                    Array.isArray(b.book_ids)
                      ? `
                        <ul>
                          ${
                            b.book_ids.map(id => {
                              const book = state.books.find(
                                x => Number(x.id) === Number(id)
                              );

                              return book
                                ? `<li>${esc(book.title)}</li>`
                                : '';
                            }).join('')
                          }
                        </ul>
                      `
                      : ''
                  }

                  <div class="bundle-footer">

                    <strong>
                      ${money(b.price || 0)}
                    </strong>

                    <button
                      class="button button-dark"
                      onclick="addBundle([${(b.book_ids || []).join(',')}])"
                    >
                      ${esc(b.button_text || 'Add bundle')}
                    </button>

                  </div>

                </article>
              `).join('')
            : `
                <div class="about-card">
                  <h2>No bundles available</h2>
                  <p>New bundles are coming soon.</p>
                </div>
              `
        }

      </div>

    </section>
  `;
}

function formatReviewDate(date){

  if(!date) return '';

  const parsed = new Date(date);

  if(Number.isNaN(parsed.getTime())){
    return esc(String(date));
  }

  return parsed.toLocaleDateString('en-IN',{
    day:'numeric',
    month:'short',
    year:'numeric'
  });
}


function renderReviews(){

  const reviews = Array.isArray(state.reviews)
    ? state.reviews
    : [];

  app.innerHTML=`

    ${pageHero(
      'Kind words from our readers',
      'Stories that found their way home.',
      'A few lovely words from families who have discovered TinyTotBooks.'
    )}

    <section class="section reviews-page">

      <div class="reviews-intro">

        <span class="eyebrow">
          From our readers
        </span>

        <h2>
          Little books. Big love.
        </h2>

        <p>
          Curious where these came from? find them waiting for you on our Google page <3
        </p>

      </div>


      <div class="reviews-grid">

        ${
          reviews.length
            ? reviews.map((review,index)=>`

              <article
                class="review-card"
                style="--review-delay:${index * 0.06}s"
              >

                <div class="review-top">

                  <div
                    class="review-stars"
                    aria-label="${review.stars} out of 5 stars"
                  >
                    ${'★'.repeat(Number(review.stars))}
                    <span class="review-stars-empty">
                      ${'★'.repeat(5 - Number(review.stars))}
                    </span>
                  </div>

                  <span class="review-date">
                    ${formatReviewDate(review.review_date)}
                  </span>

                </div>


                <p class="review-text">
                  “${esc(review.review)}”
                </p>


                <div class="review-person">

                  <span class="review-avatar">
                    ${esc(
                      String(review.name || '?')
                        .trim()
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </span>

                  <strong>
                    ${esc(review.name)}
                  </strong>

                </div>

              </article>

            `).join('')
            : `

              <div class="about-card review-empty">

                <h2>
                  Our little review shelf is growing.
                </h2>

                <p>
                  We’ll be adding lovely words from TinyTotBooks families soon.
                </p>

              </div>

            `
        }

      </div>

<div class="review-story-cta">

  <div class="review-story-copy">

    <span class="eyebrow">
      A little more about us
    </span>

    <h2>
      Seen the love? Come meet the story behind it.
    </h2>

    <p>
      Every bookshop has a story. Ours began with a simple love
      for wonderful books and little imaginations.
    </p>

  </div>

  <a
    class="button button-dark"
    href="#about"
  >
    Read our story →
  </a>

</div>

      <div class="google-review-cta">

        <span class="eyebrow">
          Want to see more?
        </span>

        <h2>
          See what families are saying on Google.
        </h2>

        <p>
          Read more reviews, share your own experience,
          and say hello over on Google.
        </p>

<a
  class="button button-dark google-review-button"
  href="https://share.google/k90Tm6W3fiV4vgIuf"
  target="_blank"
  rel="noopener noreferrer"
>
  Read our Google reviews ↗
</a>
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

function renderCollabs(){
  app.innerHTML=`
    ${pageHero(
      'Let’s create together',
      'TinyTotBooks loves a good collaboration.',
      'Are you a creator, school, brand, illustrator, storyteller, or simply someone who loves children’s books? We’d love to hear from you.'
    )}

    <section class="section">
      <div class="about-grid">
        <div>
          <span class="eyebrow">Collab with us</span>
          <h2>Let’s make something lovely.</h2>
          <p>
            We’re always open to thoughtful collaborations that bring
            wonderful books and ideas to more little readers.
          </p>
          <p>
            Tell us a little about yourself, what you have in mind,
            and how you think we could work together.
          </p>

          <a
            class="button button-dark"
            href="YOUR_GOOGLE_FORM_LINK_HERE"
            target="_blank"
            rel="noopener"
          >
            Apply to collaborate
          </a>
        </div>

        <div class="about-card">
          <span style="font-size:4rem">🤝</span>
          <h2>Who can collaborate?</h2>
          <p>Creators · Schools · Brands · Illustrators · Authors · Book lovers</p>
        </div>
      </div>
    </section>
  `;
}

function renderBulk(){
  app.innerHTML=`
    ${pageHero(
      'Bulk & Events',
      'Stories for big little moments.',
      'Planning a birthday, school event, exhibition, return gifts, or a large book order? Tell us what you need and we’ll help you put together the perfect shelf.'
    )}

    <section class="section">
      <div class="about-grid">
        <div class="about-card">
          <span class="eyebrow">Your bulk enquiry</span>
          <h2>Let’s build your order.</h2>
          <p class="muted">
            Choose what you’re planning, how many books you need, and the
            books you’re interested in.
          </p>

          <label>
            What is this for?
            <select id="bulkPurpose">
              <option>Birthday party</option>
              <option>Preschool / school</option>
              <option>Exhibition / event</option>
              <option>Return gifts</option>
              <option>Business / corporate gifting</option>
              <option>Bulk purchase</option>
              <option>Something else</option>
            </select>
          </label>

          <label>
            Approximate number of books
            <input
              id="bulkQuantity"
              type="number"
              min="1"
              value="50"
            />
          </label>

          <label>
            Your name
            <input id="bulkName" placeholder="Your name" />
          </label>

          <label>
            City
            <input id="bulkCity" placeholder="Your city" />
          </label>

          <label>
            Anything else?
            <textarea
              id="bulkNote"
              placeholder="Age group, budget, event date, special requirements..."
            ></textarea>
          </label>
        </div>

        <div>
          <div class="about-card">
            <span style="font-size:4rem">📚</span>
            <h2>Choose your books</h2>
            <p class="muted">
              Add the books you’re interested in. You can change the
              quantities before sending your enquiry.
            </p>

            <div id="bulkBooks"></div>

            <div class="total-row" style="margin-top:20px">
              <strong>Total books</strong>
              <strong id="bulkTotal">0</strong>
            </div>

            <button
              class="button button-dark"
              type="button"
              onclick="sendBulkWhatsApp()"
              style="margin-top:20px;width:100%"
            >
              💬 Send enquiry on WhatsApp
            </button>

            <p class="photo-note" style="margin-top:12px">
              Your selections will be added automatically to the WhatsApp
              message. You’ll just need to press Send.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;

  renderBulkBooks();
}

function renderBulkBooks(){
  const container=document.querySelector('#bulkBooks');
  if(!container)return;

  container.innerHTML=state.books.map(book=>`
    <div class="bulk-book">
      <div>
        <strong>${esc(book.title)}</strong>
        <p class="muted">${money(book.price)}</p>
      </div>

      <input
        class="bulk-book-qty"
        data-book-id="${book.id}"
        type="number"
        min="0"
        value="0"
        aria-label="Quantity for ${esc(book.title)}"
        onchange="updateBulkTotal()"
      />
    </div>
  `).join('');

  updateBulkTotal();
}

function updateBulkTotal(){
  const inputs=document.querySelectorAll('.bulk-book-qty');

  let total=0;

  inputs.forEach(input=>{
    total+=Math.max(0,Number(input.value)||0);
  });

  const totalEl=document.querySelector('#bulkTotal');

  if(totalEl){
    totalEl.textContent=total;
  }
}

function sendBulkWhatsApp(){
  const purpose=document.querySelector('#bulkPurpose')?.value||'Bulk order';
  const quantity=Math.max(
    0,
    Number(document.querySelector('#bulkQuantity')?.value)||0
  );
  const name=document.querySelector('#bulkName')?.value.trim()||'';
  const city=document.querySelector('#bulkCity')?.value.trim()||'';
  const note=document.querySelector('#bulkNote')?.value.trim()||'';

  const selections=[...document.querySelectorAll('.bulk-book-qty')]
    .map(input=>{
      const qty=Math.max(0,Number(input.value)||0);
      const book=state.books.find(
        b=>Number(b.id)===Number(input.dataset.bookId)
      );

      return book && qty>0
        ? `• ${book.title} × ${qty}`
        : null;
    })
    .filter(Boolean);

  if(!selections.length){
    alert('Please choose at least one book.');
    return;
  }

  const message=[
    'Hi TinyTotBooks! 👋',
    '',
    'I’d like to enquire about a bulk / event order.',
    '',
    `Purpose: ${purpose}`,
    `Approximate total: ${quantity} books`,
    '',
    'Books I’m interested in:',
    ...selections,
    '',
    name ? `Name: ${name}` : '',
    city ? `City: ${city}` : '',
    note ? `Notes: ${note}` : '',
    '',
    'Could you please share your bulk pricing and availability?'
  ]
    .filter(Boolean)
    .join('\n');

  const whatsappNumber='918789677337';
  const url=
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(url,'_blank','noopener');
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

  const parts = location.hash.slice(1).split('/');
  const view = parts[0] || 'home';

  if(view === 'book'){

    const bookId = Number(parts[1]);

    if(Number.isFinite(bookId)){
      renderBookDetail(bookId);
    }else{
      renderBooks();
    }

  }else{

const pages={
  home:renderHome,
  books:renderBooks,
  characters:renderCharacters,
  ages:renderAges,
  monthly:renderMonthly,
  bundles:renderBundles,
  about:renderAbout,
  collabs:renderCollabs,
  bulk:renderBulk,
  reviews:renderReviews
};
    (pages[view]||renderHome)();

  }

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
     <div
  class="book-detail-cover-link"
onclick="event.stopPropagation(); bookDialog.close(); location.hash='#book/${b.id}'"
  style="cursor:pointer"
  title="View full book details"
>
  ${cover(b)}
</div>

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

/* =========================================================
   BOOK DETAIL PAGE
========================================================= */

function renderBookDetail(id){

  const b = state.books.find(
    x => Number(x.id) === Number(id)
  );

  if(!b){
    renderBooks();
    return;
  }

  const images =
    Array.isArray(b.images) && b.images.length
      ? b.images
      : [];

  const mainImage =
    images.length
      ? images[0].image_url
      : b.image;

  app.innerHTML = `
    <section class="book-detail-page">

      <div class="book-detail-top">
        <button
          class="text-link"
          type="button"
          onclick="location.hash='#books'"
        >
          ← Back to books
        </button>
      </div>

      <div class="book-detail-layout">

        <div class="book-gallery">

          <div
            class="book-detail-main-image"
            id="bookDetailMainImage"
            style="background:${b.color || '#eee'}"
          >
            ${
              mainImage
                ? `<img
                    src="${esc(mainImage)}"
                    alt="${esc(b.title)}"
                  >`
                : `<span class="cover-icon">
                    ${esc(b.icon || '📚')}
                  </span>`
            }
          </div>

          ${
            images.length > 1
              ? `
                <div class="book-thumbnails">
                  ${images.map((image,index)=>`
                    <button
                      type="button"
                      class="book-thumbnail ${index === 0 ? 'active' : ''}"
                      onclick="changeBookDetailImage(${index})"
                      aria-label="View image ${index + 1}"
                    >
                      <img
                        src="${esc(image.image_url)}"
                        alt="${esc(b.title)} image ${index + 1}"
                        loading="${index === 0 ? 'eager' : 'lazy'}"
                      >
                    </button>
                  `).join('')}
                </div>
              `
              : ''
          }

        </div>

        <div class="book-detail-info">

          <span class="tag">
            ${esc(b.genre || 'Children’s book')}
            · Ages ${esc(b.age || '')}
          </span>

          <h1>${esc(b.title)}</h1>

          <p class="book-detail-author">
            by ${esc(b.author)}
          </p>

          <div class="book-detail-rating">
            ${
              b.rating != null
                ? `★ ${esc(b.rating)}`
                : ''
            }
            ${
              b.reviews
                ? ` · ${esc(b.reviews)} readers`
                : ''
            }
          </div>

          <p class="book-detail-description">
            ${esc(b.description || '')}
          </p>

          ${
            b.condition_notes
              ? `
                <div class="book-condition">
                  <h3>Book condition</h3>
                  <p>${esc(b.condition_notes)}</p>
                </div>
              `
              : ''
          }

          <div class="book-detail-purchase">

            <strong class="book-detail-price">
              ${money(b.price)}
            </strong>

            ${
              b.available
                ? `
                  <button
                    class="button button-dark"
                    type="button"
                    onclick="addToCart(${b.id})"
                  >
                    Add to bag
                  </button>
                `
                : `
                  <span class="status sold">
                    Currently sold out
                  </span>
                `
            }

          </div>

        </div>

      </div>

    </section>
  `;

  window.scrollTo({
    top:0,
    behavior:'smooth'
  });
}


/* =========================================================
   BOOK DETAIL IMAGE SWITCHER
========================================================= */

function changeBookDetailImage(index){

  const id =
    Number(location.hash.split('/')[1]);

  const b =
    state.books.find(
      x => Number(x.id) === id
    );

  if(!b || !b.images || !b.images[index]) return;

  const image =
    b.images[index].image_url;

  const main =
    document.querySelector(
      '#bookDetailMainImage'
    );

  if(!main) return;

  main.innerHTML = `
    <img
      src="${esc(image)}"
      alt="${esc(b.title)}"
    >
  `;

  document
    .querySelectorAll('.book-thumbnail')
    .forEach((button,i)=>{
      button.classList.toggle(
        'active',
        i === index
      );
    });

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

    if (!setting.key) continue;

    // Update any matching homepage content field automatically
    if (
      Object.prototype.hasOwnProperty.call(
        state.content,
        setting.key
      )
    ) {
      state.content[setting.key] =
        setting.value ?? state.content[setting.key];
    }

  }

  updateAnnouncement();
}

async function initializeApp() {

  await loadSiteSettings();

  await loadBooksFromSupabase();

  await loadCharactersFromSupabase();

  await loadBookImagesFromSupabase();

  await loadMonthlyPicksFromSupabase();

  await loadBundlesFromSupabase();

  await loadReviewsFromSupabase();


  updateAnnouncement();

  route();

}

initializeApp();