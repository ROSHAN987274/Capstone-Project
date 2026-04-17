function logout() {
  // Clear stored user data
  localStorage.clear();
  sessionStorage.clear();

  // Redirect
  window.location.href = "index.html";
}

function logout() {
  window.location.href = "index.html";
}


// ── CONSTANTS ──
const AVATARS=['🎭','🎬','🍿','🦸','🧙','🥷','👾','🐉','⚡','🌙','🔥','🎯'];
const GENRES=['All','Action','Drama','Comedy','Thriller','Horror','Sci-Fi','Romance','Fantasy','Crime','Adventure','Historical','Supernatural','Mystery','Animation','Psychological'];
const GENRE_EMOJI={Action:'⚔️',Drama:'🎭',Comedy:'😂',Thriller:'🔪',Horror:'👻','Sci-Fi':'🚀',Romance:'❤️',Fantasy:'🐉',Crime:'🕵️',Adventure:'🗺️',Historical:'📜',Supernatural:'👁️',Mystery:'🔍',Animation:'🎨',Psychological:'🧠',Family:'👨‍👩‍👧‍👦',Sport:'⚽',Musical:'🎵'};
const BADGE_CLASSES={POPULAR:'bdg-red','TOP RATED':'bdg-gold',NEW:'bdg-green',CLASSIC:'bdg-gold',LEGENDARY:'bdg-gold','GLOBAL HIT':'bdg-red',HOT:'bdg-red',ICONIC:'bdg-red',ACCLAIMED:'bdg-gold',CULT:'bdg-green'};
const CAT_CONFIG={
  movies:{label:'Hollywood and international movies (English, international cinema)',emoji:'🎥',yearRange:'1970-2024',runtimeHint:'e.g. 2h 15m'},
  anime:{label:'Japanese anime series',emoji:'🍥',yearRange:'1985-2024',runtimeHint:'e.g. 24 min/ep'},
  kdrama:{label:'Korean drama series',emoji:'🇰🇷',yearRange:'2000-2024',runtimeHint:'e.g. 1h 10m/ep'},
  series:{label:'English-language TV series from Netflix, HBO, Amazon, Hulu, Apple TV+',emoji:'📺',yearRange:'1990-2024',runtimeHint:'e.g. 45 min/ep'}
};

// ── STATE ──
let db={movies:[],anime:[],kdrama:[],series:[]};
let wishlist=[];
let renderCount={movies:20,anime:20,kdrama:20,series:20};
let activeGenre='all';
let currentHeroItem=null;
let currentInfoItem=null;
let profile={avatar:'🎭',name:'Guest'};
let totalGenerated=0;
let heroItems=[];
let heroIdx=0;
let heroTimer=null;
let isDark=true;
const TOTAL_TARGET=1000;
const BATCH=50;
const ROUNDS=5;

// ── SEED DATA ──
const SEED={
  movies: [
    {id:"avengers-endgame",title:"Avengers: Endgame",year:"2019",rating:"8.4",runtime:"3h 1m",genres:["Action","Sci-Fi","Adventure"],badge:"POPULAR",desc:"The Avengers assemble one final time to undo Thanos's snap and restore the universe.",director:"Anthony & Joe Russo",cast:["Robert Downey Jr.","Chris Evans","Scarlett Johansson"],language:"English",trailer:"https://www.youtube.com/watch?v=TcMBFSGVi1c",poster:"https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"},
    {id:"dark-knight",title:"The Dark Knight",year:"2008",rating:"9.0",runtime:"2h 32m",genres:["Action","Crime","Thriller"],badge:"TOP RATED",desc:"Batman faces the Joker, a criminal mastermind who unleashes anarchy on Gotham City.",director:"Christopher Nolan",cast:["Christian Bale","Heath Ledger","Gary Oldman"],language:"English",trailer:"https://www.youtube.com/watch?v=EXeTwQWrcwY",poster:"https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg"},
    {id:"interstellar",title:"Interstellar",year:"2014",rating:"8.7",runtime:"2h 49m",genres:["Sci-Fi","Drama","Adventure"],badge:"POPULAR",desc:"A team of explorers travel through a wormhole to ensure humanity's survival.",director:"Christopher Nolan",cast:["Matthew McConaughey","Anne Hathaway","Jessica Chastain"],language:"English",trailer:"https://www.youtube.com/watch?v=zSWdZVtXT7E",poster:"https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/pbrkL804c8yAv3zBZR4QPEafpAR.jpg"},
    {id:"inception",title:"Inception",year:"2010",rating:"8.8",runtime:"2h 28m",genres:["Action","Sci-Fi","Thriller"],badge:"TOP RATED",desc:"A thief steals corporate secrets through dream-sharing technology.",director:"Christopher Nolan",cast:["Leonardo DiCaprio","Joseph Gordon-Levitt","Ellen Page"],language:"English",trailer:"https://www.youtube.com/watch?v=YoHD9XEInc0",poster:"https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"},
    {id:"oppenheimer",title:"Oppenheimer",year:"2023",rating:"8.4",runtime:"3h 0m",genres:["Drama","Historical"],badge:"NEW",desc:"The story of J. Robert Oppenheimer and the creation of the atomic bomb.",director:"Christopher Nolan",cast:["Cillian Murphy","Emily Blunt","Matt Damon"],language:"English",trailer:"https://www.youtube.com/watch?v=uYPbbksJxIg",poster:"https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg"},
    {id:"dune2",title:"Dune: Part Two",year:"2024",rating:"8.5",runtime:"2h 46m",genres:["Sci-Fi","Action","Adventure"],badge:"NEW",desc:"Paul Atreides unites with Chani and the Fremen to seek revenge.",director:"Denis Villeneuve",cast:["Timothée Chalamet","Zendaya","Rebecca Ferguson"],language:"English",trailer:"https://www.youtube.com/watch?v=Way9Dexny3w",poster:"https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg"},
    {id:"dhurandhar",title:"Dhurandhar",year:"2025",rating:"8.9",runtime:"3h 32m",genres:["Action","Thriller","Crime"],badge:"POPULAR",desc:"A mysterious traveler slips into the heart of Karachi's underbelly and rises through its ranks with lethal precision, only to tear the notorious ISI-Underworld nexus apart from within.",director:"Aditya Dhar",cast:["Ranveer Singh","Akshaye Khanna","Sanjay Dutt","Arjun Rampal","R. Madhavan"],language:"Hindi",trailer:"https://www.youtube.com/watch?v=BKOVzHcjEIo",tmdbId:1291608,poster:"https://image.tmdb.org/t/p/w500/po7U3As6Jp2zG9RopavoZMkdnr1.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/2DzMAbkxZwsKcTjYE9HNl6d94ED.jpg"},    
    {id:"dhurandhar-revenge",title:"Dhurandhar: The Revenge",year:"2026",rating:"7.3",runtime:"3h 49m",genres:["Action","Thriller","Crime"],badge:"NEW",desc:"As rival gangs, corrupt officials and a ruthless Major Iqbal close in, Hamza's mission for his country spirals into a bloody personal war where the line between patriot and monster disappears.",director:"Aditya Dhar",cast:["Ranveer Singh","Arjun Rampal","R. Madhavan","Sanjay Dutt"],language:"Hindi",trailer:"https://www.youtube.com/watch?v=0_E78sstQj8",tmdbId:1582770,poster:"https://image.tmdb.org/t/p/w500/ov8vrRLZGoXHpYjSY9Vpv1tHJX7.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/lJzjeBNdx1jFgLIOXEbJsKvtCnn.jpg"}, 
    {id:"animal",title:"Animal",year:"2023",rating:"6.8",runtime:"3h 21m",genres:["Action","Crime","Drama"],badge:"POPULAR",desc:"A violent man’s obsession with his father leads him into a dark path.",director:"Sandeep Reddy Vanga",cast:["Ranbir Kapoor","Anil Kapoor","Rashmika Mandanna"],language:"Hindi",trailer:"https://www.youtube.com/watch?v=8FkLRUJj-o0",poster:"https://image.tmdb.org/t/p/w500/hr9rjR3J0xBBKmlJ4n3gHId9ccx.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/lprsAHkwMxk2iC6VZxNmV0H7g1t.jpg"},
    {id:"kgf-1",title:"K.G.F: Chapter 1",year:"2018",rating:"8.2",runtime:"2h 36m",genres:["Action","Drama"],badge:"POPULAR",desc:"In the 1970s, a gangster named Rocky goes undercover as a slave to assassinate the owner of a notorious gold mine.",director:"Prashanth Neel",cast:["Yash","Srinidhi Shetty"],language:"Kannada",trailer:"https://www.youtube.com/watch?v=-KfsY-qwBS0",poster:"https://image.tmdb.org/t/p/w500/ltHlJwvxKv7d0ooCiKSAvfwV9tX.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/n0z49k6qSB9QilogdbMHblUSZxp.jpg"},
    {id:"kgf-2",title:"K.G.F: Chapter 2",year:"2022",rating:"8.4",runtime:"2h 48m",genres:["Action","Drama"],badge:"TOP RATED",desc:"Rocky builds his empire in the Kolar Gold Fields while facing powerful enemies and government threats.",director:"Prashanth Neel",cast:["Yash","Sanjay Dutt","Raveena Tandon"],language:"Kannada",trailer:"https://www.youtube.com/watch?v=JKa05nyUmuQ",poster:"https://image.tmdb.org/t/p/w500/khNVygolU0TxLIDWff5tQlAhZ23.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/sKIA8Gk8Ai4E59OhBcGiFBBPtgR.jpg"},
    {id:"bahubali-1",title:"Baahubali: The Beginning",year:"2015",rating:"8.0",runtime:"2h 39m",genres:["Action","Drama","Fantasy"],badge:"POPULAR",desc:"In ancient India, a young man learns about his royal heritage and rises to reclaim his kingdom.",director:"S. S. Rajamouli",cast:["Prabhas","Rana Daggubati","Anushka Shetty"],language:"Telugu",trailer:"https://www.youtube.com/watch?v=3NQRhE772b0",poster:"https://image.tmdb.org/t/p/w500/9BAjt8nSSms62uOVYn1t3C3dVto.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/9L4sn5Ikh28Hy1qTGtJH2Ej9jSF.jpg"},
    {id:"bahubali-2",title:"Baahubali 2: The Conclusion",year:"2017",rating:"8.2",runtime:"2h 47m",genres:["Action","Drama","Fantasy"],badge:"TOP RATED",desc:"Shivudu learns why Kattappa killed Baahubali and avenges his father's death.",director:"S. S. Rajamouli",cast:["Prabhas","Rana Daggubati","Anushka Shetty"],language:"Telugu",trailer:"https://www.youtube.com/watch?v=G62HrubdD6o",poster:"https://image.tmdb.org/t/p/w500/21sC2assImQIYCEDA84Qh9d1RsK.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/yGk5RLnWX53Jve7HHVCNQaLF28h.jpg"},
    {id:"jawan",title:"Jawan",year:"2023",rating:"7.0",runtime:"2h 49m",genres:["Action","Thriller"],badge:"TRENDING",desc:"A man sets out to correct the wrongs in society in his own unique way while facing a ruthless villain.",director:"Atlee",cast:["Shah Rukh Khan","Nayanthara","Vijay Sethupathi"],language:"Hindi",trailer:"https://www.youtube.com/watch?v=k8YiqM0Y-78",poster:"https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/qGJhiG86pJUISlui6XKsnbHg43v.jpg"},   
    {id:"titanic",title:"Titanic",year:"1997",rating:"7.9",runtime:"3h 14m",genres:["Drama","Romance"],badge:"CLASSIC",desc:"A romance blooms between a first-class passenger and a poor artist aboard the doomed ship.",director:"James Cameron",cast:["Leonardo DiCaprio","Kate Winslet","Billy Zane"],language:"English",trailer:"https://www.youtube.com/watch?v=2e-eXJ6HgkQ",poster:"https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"},
    {id:"spiderman-nwh",title:"Spider-Man: No Way Home",year:"2021",rating:"8.2",runtime:"2h 28m",genres:["Action","Adventure","Sci-Fi"],badge:"POPULAR",desc:"Spider-Man crosses the multiverse when a spell goes catastrophically wrong.",director:"Jon Watts",cast:["Tom Holland","Zendaya","Benedict Cumberbatch"],language:"English",trailer:"https://www.youtube.com/watch?v=JfVOs4VSpmA",poster:"https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg"},
    {id:"parasite",title:"Parasite",year:"2019",rating:"8.5",runtime:"2h 12m",genres:["Crime","Drama","Thriller"],badge:"TOP RATED",desc:"A poor family schemes to infiltrate a wealthy household with devastating results.",director:"Bong Joon-ho",cast:["Song Kang-ho","Lee Sun-kyun","Cho Yeo-jeong"],language:"Korean",trailer:"https://www.youtube.com/watch?v=5xH0HfJHsaY",poster:"https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg"},
    {id:"shawshank",title:"The Shawshank Redemption",year:"1994",rating:"9.3",runtime:"2h 22m",genres:["Drama","Crime"],badge:"TOP RATED",desc:"Two imprisoned men bond over years, finding solace and redemption through decency.",director:"Frank Darabont",cast:["Tim Robbins","Morgan Freeman","Bob Gunton"],language:"English",trailer:"https://www.youtube.com/watch?v=6hB3S9bIaco",poster:"https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg"},
    {id:"pulp-fiction",title:"Pulp Fiction",year:"1994",rating:"8.9",runtime:"2h 34m",genres:["Crime","Drama"],badge:"CLASSIC",desc:"The lives of criminals in Los Angeles intertwine in a series of unconventional storylines.",director:"Quentin Tarantino",cast:["John Travolta","Uma Thurman","Samuel L. Jackson"],language:"English",trailer:"https://www.youtube.com/watch?v=s7EdQ4FqbhY",poster:"https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg"},
    {id:"the-batman",title:"The Batman",year:"2022",rating:"7.8",runtime:"2h 56m",genres:["Action","Crime","Thriller"],badge:"NEW",desc:"Batman uncovers corruption as a serial killer targets Gotham's elite.",director:"Matt Reeves",cast:["Robert Pattinson","Zoë Kravitz","Paul Dano"],language:"English",trailer:"https://www.youtube.com/watch?v=mqqft2x_Aa4",poster:"https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg"},
    {id:"fight-club",title:"Fight Club",year:"1999",rating:"8.8",runtime:"2h 19m",genres:["Drama","Thriller","Psychological"],badge:"CLASSIC",desc:"An insomniac and a soap salesman build an underground fight club that evolves into something far more dangerous.",director:"David Fincher",cast:["Brad Pitt","Edward Norton","Helena Bonham Carter"],language:"English",trailer:"https://www.youtube.com/watch?v=qtRKdVHc-cE",poster:"https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg"},
    {id:"avatar2",title:"Avatar: The Way of Water",year:"2022",rating:"7.6",runtime:"3h 12m",genres:["Sci-Fi","Action","Adventure"],badge:"NEW",desc:"Jake Sully and Neytiri protect their family from an unexpected threat.",director:"James Cameron",cast:["Sam Worthington","Zoe Saldana","Sigourney Weaver"],language:"English",trailer:"https://www.youtube.com/watch?v=d9MyW72ELq0",poster:"https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"},
    {id:"joker",title:"Joker",year:"2019",rating:"8.4",runtime:"2h 2m",genres:["Crime","Drama","Thriller"],badge:"ACCLAIMED",desc:"The origin story of Arthur Fleck, a failed comedian who descends into madness.",director:"Todd Phillips",cast:["Joaquin Phoenix","Robert De Niro","Zazie Beetz"],language:"English",trailer:"https://www.youtube.com/watch?v=zAGVQLHvwOY",poster:"https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"},
    {id:"forrest-gump",title:"Forrest Gump",year:"1994",rating:"8.8",runtime:"2h 22m",genres:["Drama","Romance"],badge:"CLASSIC",desc:"The extraordinary life of a man with low IQ who witnesses major American historical events.",director:"Robert Zemeckis",cast:["Tom Hanks","Robin Wright","Gary Sinise"],language:"English",trailer:"https://www.youtube.com/watch?v=bLvqoHBptjg",poster:"https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/qdIMHd4sEfJSckfVJfKQvisL02a.jpg"},
    {id:"matrix",title:"The Matrix",year:"1999",rating:"8.7",runtime:"2h 16m",genres:["Sci-Fi","Action"],badge:"CLASSIC",desc:"A hacker discovers reality is a simulation and joins a rebellion against machine oppressors.",director:"The Wachowskis",cast:["Keanu Reeves","Laurence Fishburne","Carrie-Anne Moss"],language:"English",trailer:"https://www.youtube.com/watch?v=m8e-FF8MsqU",poster:"https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg"},
    {id:"goodfellas",title:"GoodFellas",year:"1990",rating:"8.7",runtime:"2h 26m",genres:["Crime","Drama"],badge:"CLASSIC",desc:"The story of Henry Hill and his rise and fall in the American Mafia.",director:"Martin Scorsese",cast:["Ray Liotta","Robert De Niro","Joe Pesci"],language:"English",trailer:"https://www.youtube.com/watch?v=qo5jJpHtI1Y",poster:"https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/sw7mordbZxgITU877yTpZCud90M.jpg"},
    {id:"schindlers-list",title:"Schindler's List",year:"1993",rating:"9.0",runtime:"3h 15m",genres:["Drama","Historical"],badge:"TOP RATED",desc:"A businessman saves over 1,000 Jewish lives during the Holocaust.",director:"Steven Spielberg",cast:["Liam Neeson","Ralph Fiennes","Ben Kingsley"],language:"English",trailer:"https://www.youtube.com/watch?v=gG22XNhtnoY",poster:"https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg"},
    {id:"whiplash",title:"Whiplash",year:"2014",rating:"8.5",runtime:"1h 46m",genres:["Drama","Musical"],badge:"ACCLAIMED",desc:"A promising young drummer battles an abusive music teacher to reach the top.",director:"Damien Chazelle",cast:["Miles Teller","J.K. Simmons","Melissa Benoist"],language:"English",trailer:"https://www.youtube.com/watch?v=7d_jQycdQGo",poster:"https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/fRGxZuo7jJUWQsVg9PREb98Aclp.jpg"},
    {id:"la-la-land",title:"La La Land",year:"2016",rating:"8.0",runtime:"2h 8m",genres:["Romance","Musical","Drama"],badge:"ACCLAIMED",desc:"A jazz musician and an aspiring actress fall in love in Los Angeles.",director:"Damien Chazelle",cast:["Ryan Gosling","Emma Stone","John Legend"],language:"English",trailer:"https://www.youtube.com/watch?v=0pdqf4P9MB8",poster:"https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg"},
    {id:"gladiator",title:"Gladiator",year:"2000",rating:"8.5",runtime:"2h 35m",genres:["Action","Drama","Adventure"],badge:"CLASSIC",desc:"A Roman general seeks revenge against the corrupt emperor who murdered his family.",director:"Ridley Scott",cast:["Russell Crowe","Joaquin Phoenix","Connie Nielsen"],language:"English",trailer:"https://www.youtube.com/watch?v=owK1qxDselE",poster:"https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"},
    {id:"wolf-wall",title:"The Wolf of Wall Street",year:"2013",rating:"8.2",runtime:"3h 0m",genres:["Crime","Drama","Comedy"],badge:"POPULAR",desc:"The rise and fall of stockbroker Jordan Belfort, who became known for corruption on Wall Street.",director:"Martin Scorsese",cast:["Leonardo DiCaprio","Jonah Hill","Margot Robbie"],language:"English",trailer:"https://www.youtube.com/watch?v=iszwuX1AK6A",poster:"https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg"},
    {id:"silence-lambs",title:"The Silence of the Lambs",year:"1991",rating:"8.6",runtime:"1h 58m",genres:["Crime","Drama","Thriller"],badge:"CLASSIC",desc:"A young FBI cadet seeks the help of an imprisoned killer to catch another serial killer.",director:"Jonathan Demme",cast:["Jodie Foster","Anthony Hopkins","Scott Glenn"],language:"English",trailer:"https://www.youtube.com/watch?v=W6Mm8Sbe__o",poster:"https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/mfwq2nMBzArzQ7Y9RKE8SKeeTkg.jpg"},
    {id:"black-panther",title:"Black Panther",year:"2018",rating:"7.3",runtime:"2h 14m",genres:["Action","Adventure","Sci-Fi"],badge:"POPULAR",desc:"T'Challa returns home to Wakanda to take his place as king but finds his reign challenged.",director:"Ryan Coogler",cast:["Chadwick Boseman","Michael B. Jordan","Lupita Nyong'o"],language:"English",trailer:"https://www.youtube.com/watch?v=xjDjIWPwcPU",poster:"https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/b6ZJZHUdMEFECvGiDpJjlfUWela.jpg"},
    {id:"alien",title:"Alien",year:"1979",rating:"8.5",runtime:"1h 57m",genres:["Horror","Sci-Fi"],badge:"CLASSIC",desc:"The crew of a commercial spacecraft encounter a deadly extraterrestrial lifeform.",director:"Ridley Scott",cast:["Sigourney Weaver","Tom Skerritt","John Hurt"],language:"English",trailer:"https://www.youtube.com/watch?v=LjLamj-b0I8",poster:"https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/AmR3JG1VQVxU8TfAvljUhfSFUOx.jpg"},
    {id:"spirited-away",title:"Spirited Away",year:"2001",rating:"8.6",runtime:"2h 5m",genres:["Animation","Adventure","Fantasy"],badge:"ACCLAIMED",desc:"A young girl enters the spirit world and must work to free herself and her parents.",director:"Hayao Miyazaki",cast:["Daveigh Chase","Suzanne Pleshette","Miyu Irino"],language:"Japanese",trailer:"https://www.youtube.com/watch?v=ByXuk9QqQkk",poster:"https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg"},
    {id:"1917",title:"1917",year:"2019",rating:"8.3",runtime:"1h 59m",genres:["Action","Drama","Historical"],badge:"ACCLAIMED",desc:"Two British soldiers are sent on a near-impossible mission to deliver a message in WWI.",director:"Sam Mendes",cast:["George MacKay","Dean-Charles Chapman","Mark Strong"],language:"English",trailer:"https://www.youtube.com/watch?v=YqNYrYUiMfg",poster:"https://image.tmdb.org/t/p/w500/iZf0KyrE25z1sage4SYFLCCrMi9.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/iZf0KyrE25z1sage4SYFLCCrMi9.jpg"},
    {id:"oldboy",title:"Oldboy",year:"2003",rating:"8.4",runtime:"2h",genres:["Mystery","Thriller","Drama"],badge:"CULT",desc:"A man imprisoned for 15 years with no reason given is suddenly released and seeks answers.",director:"Park Chan-wook",cast:["Choi Min-sik","Yoo Ji-tae","Kang Hye-jung"],language:"Korean",trailer:"https://www.youtube.com/watch?v=2iSCeRCNREI",poster:"https://image.tmdb.org/t/p/w500/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg"},
    {id:"memento",title:"Memento",year:"2000",rating:"8.4",runtime:"1h 53m",genres:["Mystery","Thriller","Psychological"],badge:"CULT",desc:"A man with short-term memory loss uses notes and tattoos to hunt his wife's killer.",director:"Christopher Nolan",cast:["Guy Pearce","Carrie-Anne Moss","Joe Pantoliano"],language:"English",trailer:"https://www.youtube.com/watch?v=0vS0E9bBSL0",poster:"https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg"},
    {id:"requiem",title:"Requiem for a Dream",year:"2000",rating:"8.3",runtime:"1h 42m",genres:["Drama","Psychological","Thriller"],badge:"CULT",desc:"Four people in New York City whose lives unravel as their addictions destroy them.",director:"Darren Aronofsky",cast:["Ellen Burstyn","Jared Leto","Jennifer Connelly"],language:"English",trailer:"https://www.youtube.com/watch?v=1SqVvknVBCQ",poster:"https://image.tmdb.org/t/p/w500/nOd6vjEmzCT0k4VYqsA2hwyi87C.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/nOd6vjEmzCT0k4VYqsA2hwyi87C.jpg"},
    {id:"mad-max",title:"Mad Max: Fury Road",year:"2015",rating:"8.1",runtime:"2h",genres:["Action","Adventure","Sci-Fi"],badge:"ACCLAIMED",desc:"In a post-apocalyptic world, Max and a rebel warrior make their way through a wasteland.",director:"George Miller",cast:["Tom Hardy","Charlize Theron","Nicholas Hoult"],language:"English",trailer:"https://www.youtube.com/watch?v=hEJnMQG9ev8",poster:"https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg"},
    {id:"leon",title:"Léon: The Professional",year:"1994",rating:"8.5",runtime:"1h 50m",genres:["Crime","Action","Drama"],badge:"CLASSIC",desc:"A professional hitman takes in a young girl after her family is murdered.",director:"Luc Besson",cast:["Jean Reno","Natalie Portman","Gary Oldman"],language:"English",trailer:"https://www.youtube.com/watch?v=E0YQ5ZRzFe0",poster:"https://image.tmdb.org/t/p/w500/yI6X2cCM5YPJtxMhUd3dPGqDAhw.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/yI6X2cCM5YPJtxMhUd3dPGqDAhw.jpg"},
    {id:"braveheart",title:"Braveheart",year:"1995",rating:"8.3",runtime:"2h 58m",genres:["Action","Drama","Historical"],badge:"CLASSIC",desc:"Scottish warrior William Wallace leads a rebellion against English rule.",director:"Mel Gibson",cast:["Mel Gibson","Sophie Marceau","Patrick McGoohan"],language:"English",trailer:"https://www.youtube.com/watch?v=fOhxPVixN8A",poster:"https://image.tmdb.org/t/p/w500/or1gBugydmjToAEq7OZY0owwFk.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/or1gBugydmjToAEq7OZY0owwFk.jpg"},
    {id:"inglourious",title:"Inglourious Basterds",year:"2009",rating:"8.3",runtime:"2h 33m",genres:["Action","Drama","Historical"],badge:"POPULAR",desc:"In Nazi-occupied France, two plots to assassinate Hitler converge.",director:"Quentin Tarantino",cast:["Brad Pitt","Christoph Waltz","Mélanie Laurent"],language:"English",trailer:"https://www.youtube.com/watch?v=KnrRy6kSFF0",poster:"https://image.tmdb.org/t/p/w500/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg"},
    {id:"truman",title:"The Truman Show",year:"1998",rating:"8.2",runtime:"1h 43m",genres:["Drama","Comedy","Sci-Fi"],badge:"CLASSIC",desc:"An ordinary man discovers his entire life is a TV show.",director:"Peter Weir",cast:["Jim Carrey","Ed Harris","Laura Linney"],language:"English",trailer:"https://www.youtube.com/watch?v=dlnmQbPGuls",poster:"https://image.tmdb.org/t/p/w500/vuza0WqY239yBXOadKlGwJsZJFE.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/vuza0WqY239yBXOadKlGwJsZJFE.jpg"},
    {id:"12-angry",title:"12 Angry Men",year:"1957",rating:"9.0",runtime:"1h 36m",genres:["Crime","Drama"],badge:"CLASSIC",desc:"Twelve jurors deliberate the murder case of an 18-year-old accused of killing his father.",director:"Sidney Lumet",cast:["Henry Fonda","Lee J. Cobb","Ed Begley"],language:"English",trailer:"https://www.youtube.com/watch?v=pUhbJTHANDU",poster:"https://image.tmdb.org/t/p/w500/ppd84D2i9W8jXmsyInGyihiSyqz.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/qqHQsStV6exghCM7zbObuYBiYxw.jpg"},
    {id:"there-will-be-blood",title:"There Will Be Blood",year:"2007",rating:"8.2",runtime:"2h 38m",genres:["Drama","Historical"],badge:"ACCLAIMED",desc:"A silver miner becomes a wealthy oil tycoon through ruthless dealings.",director:"Paul Thomas Anderson",cast:["Daniel Day-Lewis","Paul Dano","Kevin J. O'Connor"],language:"English",trailer:"https://www.youtube.com/watch?v=B1F1PiDOBB0",poster:"https://image.tmdb.org/t/p/w500/fa0RDkAlCec0STeMNAhPaF89q6U.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/fa0RDkAlCec0STeMNAhPaF89q6U.jpg"},
    {id:"lawrence-arabia",title:"Lawrence of Arabia",year:"1962",rating:"8.3",runtime:"3h 47m",genres:["Adventure","Historical","Drama"],badge:"CLASSIC",desc:"The story of T.E. Lawrence's role in the Arab Revolt against the Ottoman Empire.",director:"David Lean",cast:["Peter O'Toole","Alec Guinness","Anthony Quinn"],language:"English",trailer:"https://www.youtube.com/watch?v=dpwdO0DOXKU",poster:"https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/uxzzxijgPIY7slzFvMotPv8wjKA.jpg"},
    {id:"boyhood",title:"Boyhood",year:"2014",rating:"7.9",runtime:"2h 45m",genres:["Drama"],badge:"ACCLAIMED",desc:"A film shot over 12 years following a boy from age 5 to 18.",director:"Richard Linklater",cast:["Ellar Coltrane","Patricia Arquette","Ethan Hawke"],language:"English",trailer:"https://www.youtube.com/watch?v=IiKPD4KMGsI",poster:"https://image.tmdb.org/t/p/w500/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg"},
    {id:"blade-runner-2049",title:"Blade Runner 2049",year:"2017",rating:"8.0",runtime:"2h 44m",genres:["Sci-Fi","Mystery","Drama"],badge:"ACCLAIMED",desc:"A new blade runner unearths a buried secret that could unravel society.",director:"Denis Villeneuve",cast:["Ryan Gosling","Harrison Ford","Ana de Armas"],language:"English",trailer:"https://www.youtube.com/watch?v=gCcx85zbxz4",poster:"https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg"},
    {id:"apocalypse-now",title:"Apocalypse Now",year:"1979",rating:"8.4",runtime:"2h 27m",genres:["Drama","Historical","Action"],badge:"CLASSIC",desc:"A special ops officer travels upriver to Cambodia to assassinate a rogue colonel.",director:"Francis Ford Coppola",cast:["Martin Sheen","Marlon Brando","Robert Duvall"],language:"English",trailer:"https://www.youtube.com/watch?v=XFq5e8cQxLs",poster:"https://image.tmdb.org/t/p/w500/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg"},
    {id:"beautiful-mind",title:"A Beautiful Mind",year:"2001",rating:"8.2",runtime:"2h 15m",genres:["Drama","Psychological"],badge:"ACCLAIMED",desc:"The story of Nobel Prize winner John Nash's struggles with schizophrenia.",director:"Ron Howard",cast:["Russell Crowe","Ed Harris","Jennifer Connelly"],language:"English",trailer:"https://www.youtube.com/watch?v=YSAoZGPhLb4",poster:"https://image.tmdb.org/t/p/w500/yI6X2cCM5YPJtxMhUd3dPGqDAhw.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/yI6X2cCM5YPJtxMhUd3dPGqDAhw.jpg"},
    {id:"coco",title:"Coco",year:"2017",rating:"8.4",runtime:"1h 45m",genres:["Animation","Adventure","Family"],badge:"ACCLAIMED",desc:"A boy travels to the Land of the Dead and enlists help from an unlikely spirit guide.",director:"Lee Unkrich",cast:["Anthony Gonzalez","Gael García Bernal","Benjamin Bratt"],language:"English",trailer:"https://www.youtube.com/watch?v=Rvr68u6k5sI",poster:"https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/askg3SMvhqEl4OL52YuvdtY40Yb.jpg"},
    {id:"princess-mononoke",title:"Princess Mononoke",year:"1997",rating:"8.4",runtime:"2h 14m",genres:["Animation","Adventure","Fantasy"],badge:"ACCLAIMED",desc:"A young warrior becomes involved in a struggle between forest gods and a mining colony.",director:"Hayao Miyazaki",cast:["Yoji Matsuda","Yuriko Ishida","Yuko Tanaka"],language:"Japanese",trailer:"https://www.youtube.com/watch?v=4OiMPZ9NmY8",poster:"https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"},
    {id:"the-shining",title:"The Shining",year:"1980",rating:"8.4",runtime:"2h 26m",genres:["Horror","Thriller","Mystery"],badge:"CLASSIC",desc:"A family heads to an isolated hotel for the winter where a previous caretaker went insane.",director:"Stanley Kubrick",cast:["Jack Nicholson","Shelley Duvall","Danny Lloyd"],language:"English",trailer:"https://www.youtube.com/watch?v=S014oGZiSdI",poster:"https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg"},
    {id:"psycho",title:"Psycho",year:"1960",rating:"8.5",runtime:"1h 49m",genres:["Horror","Mystery","Thriller"],badge:"CLASSIC",desc:"A secretive woman checks into a remote motel owned by a peculiar young man under his mother's influence.",director:"Alfred Hitchcock",cast:["Anthony Perkins","Janet Leigh","Vera Miles"],language:"English",trailer:"https://www.youtube.com/watch?v=qbHnMsL4gXI",poster:"https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg"},
    {id:"seven-samurai",title:"Seven Samurai",year:"1954",rating:"8.6",runtime:"3h 27m",genres:["Action","Drama","Adventure"],badge:"CLASSIC",desc:"A poor village hires seven samurai to combat bandits who steal their crops.",director:"Akira Kurosawa",cast:["Toshirô Mifune","Takashi Shimura","Keiko Tsushima"],language:"Japanese",trailer:"https://www.youtube.com/watch?v=7Au6rikYpJ8",poster:"https://image.tmdb.org/t/p/w500/8OKmBV5BUFzmozIC3pPWKHy17kx.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/8OKmBV5BUFzmozIC3pPWKHy17kx.jpg"},
  ],

  anime: [   
    {id:"naruto-shippuden",title:"Naruto: Shippuden",year:"2007",rating:"8.7",runtime:"23 min/ep",genres:["Action","Adventure","Fantasy"],badge:"POPULAR",desc:"Naruto Uzumaki returns after training to face powerful enemies and protect his village while pursuing his dream of becoming Hokage.",director:"Hayato Date",cast:["Junko Takeuchi","Chie Nakamura","Noriaki Sugiyama"],language:"Japanese",trailer:"https://www.youtube.com/watch?v=22R0j8UKRzY",poster:"https://image.tmdb.org/t/p/w500/zAYRe2bJxpWTVrwwmBc00VFkAf4.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/nAeS7F2B22XQOLh5HVNXn8G3ZRk.jpg"},
    {id:"aot",title:"Attack on Titan",year:"2013",rating:"9.1",runtime:"24 min/ep",genres:["Action","Fantasy","Horror"],badge:"TOP RATED",desc:"Humanity lives behind walls to survive giant humanoid creatures known as Titans.",director:"Tetsuro Araki",cast:["Yuki Kaji","Marina Inoue","Yui Ishikawa"],language:"Japanese",trailer:"https://www.youtube.com/watch?v=MGRm4IzK1SQ",poster:"https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/wYisyC5IeuAN5WB5X81eMDcUdwu.jpg"},
    {id:"fma-b",title:"Fullmetal Alchemist: Brotherhood",year:"2009",rating:"9.1",runtime:"24 min/ep",genres:["Action","Adventure","Fantasy"],badge:"TOP RATED",desc:"Two brothers search for a Philosopher's Stone after a failed alchemy ritual.",director:"Yasuhiro Irie",cast:["Vic Mignogna","Maxey Whitehead","Travis Willingham"],language:"Japanese",trailer:"https://www.youtube.com/watch?v=--IcmZkvL0Q",poster:"https://image.tmdb.org/t/p/w500/8H4ej2NpujYVBPsW2smmzC8d2xU.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/8H4ej2NpujYVBPsW2smmzC8d2xU.jpg"},
    {id:"demon-slayer",title:"Demon Slayer",year:"2019",rating:"8.7",runtime:"24 min/ep",genres:["Action","Adventure","Supernatural"],badge:"POPULAR",desc:"Tanjiro Kamado becomes a demon slayer to cure his sister who was turned into a demon.",director:"Haruo Sotozaki",cast:["Natsuki Hanae","Akari Kito","Yoshitsugu Matsuoka"],language:"Japanese",trailer:"https://www.youtube.com/watch?v=VQGCKyvzIM4",poster:"https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg"},
    {id:"jujutsu-kaisen",title:"Jujutsu Kaisen",year:"2020",rating:"8.6",runtime:"24 min/ep",genres:["Action","Supernatural"],badge:"POPULAR",desc:"A boy joins a secret organization to fight cursed spirits.",director:"Sunghoo Park",cast:["Junya Enoki","Yuma Uchida"],language:"Japanese",trailer:"https://www.youtube.com/watch?v=pkKu9hLT-t8",poster:"https://image.tmdb.org/t/p/w500/fHpKWq9ayzSk8nSwqRuaAUemRKh.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/9CsTtHlvErQ93jvIWIjs06G0Abe.jpg"},
    {id:"one-piece",title:"One Piece",year:"1999",rating:"9.0",runtime:"24 min/ep",genres:["Action","Adventure","Fantasy"],badge:"TOP RATED",desc:"Monkey D. Luffy sails with his crew to find the ultimate treasure, the One Piece, and become the Pirate King.",director:"Kōnosuke Uda",cast:["Mayumi Tanaka","Kazuya Nakai","Akemi Okamura"],language:"Japanese",trailer:"https://www.youtube.com/watch?v=MCb13lbVGE0",poster:"https://image.tmdb.org/t/p/w500/e3NBGiAifW9Xt8xD5tpARskjccO.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/2rmK7mnchw9Xr3XdiTFSxTTLXqv.jpg"},
    {id:"chainsaw-man",title:"Chainsaw Man",year:"2022",rating:"8.5",runtime:"24 min/ep",genres:["Action","Horror","Fantasy"],badge:"NEW",desc:"Denji merges with his chainsaw devil dog and works for a secret government agency.",director:"Ryū Nakayama",cast:["Kikunosuke Toya","Tomori Kusunoki","Fairouz Ai"],language:"Japanese",trailer:"https://www.youtube.com/watch?v=q9nGNf5WWQU",poster:"https://image.tmdb.org/t/p/w500/npdB6eFzizki0WaZ1OvKcJrWe97.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/npdB6eFzizki0WaZ1OvKcJrWe97.jpg"},
  ],

  kdrama: [
    {id:"squid-game",title:"Squid Game",year:"2021",rating:"8.0",runtime:"55 min/ep",genres:["Thriller","Drama"],badge:"GLOBAL HIT",desc:"Hundreds of cash-strapped contestants compete in children's games with deadly consequences.",director:"Hwang Dong-hyuk",cast:["Lee Jung-jae","Park Hae-soo","HoYeon Jung"],language:"Korean",trailer:"https://www.youtube.com/watch?v=oqxAJKy0ii4",poster:"https://image.tmdb.org/t/p/w500/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/2meX1NmdScFOoV4370rqHWKmXhY.jpg"},
    {id:"crash-landing",title:"Crash Landing on You",year:"2019",rating:"8.7",runtime:"1h 20m/ep",genres:["Romance","Drama","Comedy"],badge:"TOP RATED",desc:"A South Korean heiress accidentally crash-lands in North Korea and falls in love.",director:"Lee Jung-hyo",cast:["Hyun Bin","Son Ye-jin","Kim Jung-hyun"],language:"Korean",trailer:"https://www.youtube.com/watch?v=ME-2yXDYPEw",poster:"https://image.tmdb.org/t/p/w500/fgBNLPr6mC8pxuR79ENAJY4nBmj.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/o3Htmlg6BfNs8Ew7yjsRzVnYSEs.jpg"},
    {id:"goblin",title:"Goblin (Guardian)",year:"2016",rating:"8.8",runtime:"1h 20m/ep",genres:["Romance","Fantasy","Drama"],badge:"CLASSIC",desc:"A 939-year-old goblin and a young woman with the ability to see ghosts form an unusual bond.",director:"Lee Eung-bok",cast:["Gong Yoo","Kim Go-eun","Lee Dong-wook"],language:"Korean",trailer:"https://www.youtube.com/watch?v=eiwJCQCZEpE",poster:"https://image.tmdb.org/t/p/w500/sPkxHNw5BFvuCFGWw825TS7n6X3.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/smSbK5cd8T9XHcxEUcems23BDEF.jpg"},
    {id:"vincenzo",title:"Vincenzo",year:"2021",rating:"8.7",runtime:"1h 20m/ep",genres:["Crime","Comedy","Drama"],badge:"TOP RATED",desc:"An Italian-Korean mafia consigliere returns to Korea and fights corruption his way.",director:"Kim Hee-won",cast:["Song Joong-ki","Jeon Yeo-been","Ok Taec-yeon"],language:"Korean",trailer:"https://www.youtube.com/watch?v=RBPGkOWCNFM",poster:"https://image.tmdb.org/t/p/w500/qbkSS1cTjT4DzIwD44bdhTuYgdT.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/sf7NCqyVUNoyjYuwW5oJke1Tij.jpg"},
    {id:"the-glory",title:"The Glory",year:"2022",rating:"8.5",runtime:"1h/ep",genres:["Thriller","Drama"],badge:"NEW",desc:"A woman who was brutally bullied in school meticulously plans revenge as an adult.",director:"Ahn Gil-ho",cast:["Song Hye-kyo","Lee Do-hyun","Lim Ji-yeon"],language:"Korean",trailer:"https://www.youtube.com/watch?v=G1e8aROGXaM",poster:"https://image.tmdb.org/t/p/w500/uUM4LVlPgIrww07OoEKrGWlS1Ej.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/AjwoDj77HLlqcpwKTiA9Z8O0gdi.jpg"},
    {id:"its-okay",title:"It's Okay to Not Be Okay",year:"2020",rating:"8.6",runtime:"1h 10m/ep",genres:["Romance","Drama","Psychological"],badge:"NEW",desc:"A psychiatric caregiver and an antisocial children's author find healing in each other.",director:"Park Shin-woo",cast:["Kim Soo-hyun","Seo Ye-ji","Oh Jung-se"],language:"Korean",trailer:"https://www.youtube.com/watch?v=yCh_oIZmSP8",poster:"https://image.tmdb.org/t/p/w500/8XSJfLeImX8NszDUFnK1lbseCi8.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/4IzdfRrxgbvtnE0ZBO7Z0pTmN9b.jpg"},
    {id:"woo-atty",title:"Extraordinary Attorney Woo",year:"2022",rating:"8.7",runtime:"1h 20m/ep",genres:["Drama","Legal"],badge:"NEW",desc:"A young attorney with autism spectrum disorder joins a prestigious law firm.",director:"Yoo In-shik",cast:["Park Eun-bin","Kang Tae-oh","Kang Ki-young"],language:"Korean",trailer:"https://www.youtube.com/watch?v=FPnHHKFf5aA",poster:"https://image.tmdb.org/t/p/w500/zuNOQVI4rEaqwknrfQUVKtlKE2C.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/tmgtlnBnoFvk52xZBO7Z0pTmN9b.jpg"},
    {id:"my-love-star",title:"My Love from the Star",year:"2013",rating:"8.5",runtime:"1h/ep",genres:["Romance","Sci-Fi","Comedy"],badge:"POPULAR",desc:"An alien who has lived on Earth for 400 years falls in love with an actress.",director:"Jang Tae-yoo",cast:["Kim Soo-hyun","Jun Ji-hyun","Park Hae-jin"],language:"Korean",trailer:"https://www.youtube.com/watch?v=WCHDPUfQ3uI",poster:"https://image.tmdb.org/t/p/w500/o5EYVYCVtDUdajP4rWfv6q0BTmm.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/A1G1EgLHk6u8bNMxfH9RPFr5V5e.jpg"},
    {id:"misaeng",title:"Misaeng: Incomplete Life",year:"2014",rating:"8.9",runtime:"1h/ep",genres:["Drama"],badge:"ACCLAIMED",desc:"A young man who failed his dream enters the corporate world and struggles to survive.",director:"Kim Won-seok",cast:["Im Si-wan","Lee Sung-min","Kang So-ra"],language:"Korean",trailer:"https://www.youtube.com/watch?v=h4v3bKEEzus",poster:"https://image.tmdb.org/t/p/w500/2ZAquQpSHOBWZNjPM0jmqqKv8X8.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/b4UmLXS2GZ0dRr6jC3Kv2LpGpgK.jpg"},
    {id:"mr-sunshine",title:"Mr. Sunshine",year:"2018",rating:"8.9",runtime:"1h 20m/ep",genres:["Historical","Romance","Action"],badge:"ACCLAIMED",desc:"A Korean boy born into slavery returns as an American soldier during the Japanese occupation.",director:"Lee Eung-bok",cast:["Lee Byung-hun","Kim Tae-ri","Yoo Yeon-seok"],language:"Korean",trailer:"https://www.youtube.com/watch?v=ME-2yXDYPEw",poster:"https://image.tmdb.org/t/p/w500/p7ljjykSsiyWstGVAwIkbdfPzRV.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/gQwa6X2nmTHkmDgAifU4wacNqp4.jpg"},
    {id:"flower-of-evil",title:"Flower of Evil",year:"2020",rating:"8.8",runtime:"1h/ep",genres:["Thriller","Romance","Drama"],badge:"TOP RATED",desc:"A detective suspects her own husband of being a serial killer she's been hunting.",director:"Kim Cheol-kyu",cast:["Lee Joon-gi","Moon Chae-won","Jang Hee-jin"],language:"Korean",trailer:"https://www.youtube.com/watch?v=G1e8aROGXaM",poster:"https://image.tmdb.org/t/p/w500/ozPDfBmsrJDFF9ZhwQNxcGLXvzm.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/3rP5OCR8nCUlC960GGkYxV0RPp5.jpg"},
    {id:"sky-castle",title:"SKY Castle",year:"2018",rating:"8.8",runtime:"1h/ep",genres:["Drama","Thriller"],badge:"TOP RATED",desc:"Competitive upper-class families in an elite estate will do anything to get their children into top universities.",director:"Jo Hyun-tak",cast:["Yeom Jung-ah","Lee Tae-ran","Yoon Se-ah"],language:"Korean",trailer:"https://www.youtube.com/watch?v=G1e8aROGXaM",poster:"https://image.tmdb.org/t/p/w500/tE2b4DKYteipIBE51re62jLi6RU.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/fEJcw7RsYP6VaExWEQTDsrQwXTk.jpg"},
    {id:"hospital-playlist",title:"Hospital Playlist",year:"2020",rating:"9.0",runtime:"1h 20m/ep",genres:["Drama","Romance","Comedy"],badge:"TOP RATED",desc:"Five doctors who have been friends since med school navigate life, love and medicine together.",director:"Shin Won-ho",cast:["Jo Jung-suk","Yoo Yeon-seok","Jung Kyung-ho"],language:"Korean",trailer:"https://www.youtube.com/watch?v=i6y7SBCHpn8",poster:"https://image.tmdb.org/t/p/w500/8MSjQkH2FrG0t4l84L5HmiSFrS7.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/ji7KaBHhxb6ngHEHxXHcfEzi9bu.jpg"},
    {id:"stranger",title:"Stranger",year:"2017",rating:"9.0",runtime:"1h/ep",genres:["Crime","Thriller","Drama"],badge:"TOP RATED",desc:"A prosecutor who cannot feel emotions teams with a detective to expose a conspiracy.",director:"Ahn Gil-ho",cast:["Cho Seung-woo","Bae Doona","Lee Joon-hyuk"],language:"Korean",trailer:"https://www.youtube.com/watch?v=G1e8aROGXaM",poster:"https://image.tmdb.org/t/p/w500/blbbtx7DyvZ3JTGyc9MCArDL79b.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/xuf7G4srLSFcC7Q8YbX7HHEmXG2.jpg"},
    {id:"prison-playbook",title:"Prison Playbook",year:"2017",rating:"9.0",runtime:"1h 20m/ep",genres:["Drama","Comedy"],badge:"TOP RATED",desc:"A baseball star is sent to prison the day before his professional debut.",director:"Shin Won-ho",cast:["Park Hae-soo","Jung Kyung-ho","Kang Ha-neul"],language:"Korean",trailer:"https://www.youtube.com/watch?v=h4v3bKEEzus",poster:"https://image.tmdb.org/t/p/w500/vlPZbMxbEAxQG67TOAYFMYwMBjo.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/kdsvRpXal5Xa1Ldq7m2qzQmYsBa.jpg"},
    {id:"business-proposal",title:"Business Proposal",year:"2022",rating:"8.4",runtime:"1h/ep",genres:["Romance","Comedy"],badge:"HOT",desc:"A woman in disguise goes on a blind date to scare off the man and ends up dating her boss.",director:"Park Sun-ho",cast:["Ahn Hyo-seop","Kim Se-jeong","Kim Min-kyu"],language:"Korean",trailer:"https://www.youtube.com/watch?v=yxPf0hyO5-Y",poster:"https://image.tmdb.org/t/p/w500/iLh7L8ZuvgdxFaM9sImyv2iKYLe.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/lq0YqJuffMuZhoKTiC5xDqvtCSn.jpg"},
    {id:"hometown-cha",title:"Hometown Cha-Cha-Cha",year:"2021",rating:"8.5",runtime:"1h/ep",genres:["Romance","Comedy","Drama"],badge:"NEW",desc:"A dentist moves to a seaside village and falls for the town's all-around helper.",director:"Yoo Je-won",cast:["Shin Min-a","Kim Seon-ho","Lee Sang-yi"],language:"Korean",trailer:"https://www.youtube.com/watch?v=ME-2yXDYPEw",poster:"https://image.tmdb.org/t/p/w500/en6lrlJ1DhyvkeZEqrk3R6EJz1p.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/2avhn5tACIdOp9F5EhNytbChJib.jpg"},
    {id:"voice",title:"Voice 3",year:"2017",rating:"8.6",runtime:"1h/ep",genres:["Crime","Thriller","Drama"],badge:"TOP RATED",desc:"A detective whose wife was murdered and a 112 dispatcher with extraordinary hearing team up.",director:"Kim Hong-sun",cast:["Jang Hyuk","Lee Ha-na","Baek Sung-hyun"],language:"Korean",trailer:"https://www.youtube.com/watch?v=G1e8aROGXaM",poster:"https://image.tmdb.org/t/p/w500/gMgzUEvNljCkNjUDlGaYyLn2zyz.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/i8iujCYtGOG8f6ui90ADs5NxHKb.jpg"},
    {id:"moon-lovers",title:"Moon Lovers: Scarlet Heart Ryeo",year:"2016",rating:"8.5",runtime:"1h/ep",genres:["Historical","Romance","Fantasy"],badge:"POPULAR",desc:"A modern woman is transported to the Goryeo era and becomes entangled with princes.",director:"Kim Kyu-tae",cast:["Lee Joon-gi","IU","Kang Ha-neul"],language:"Korean",trailer:"https://www.youtube.com/watch?v=yxPf0hyO5-Y",poster:"https://image.tmdb.org/t/p/w500/pjdPGHqUe60ZGQJR1TItVNaV4it.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/yMEHwomIKzfFEq0xaHVHtyEuKBM.jpg"}
  ],

  series: [
    {id:"breaking-bad",title:"Breaking Bad",year:"2008",rating:"9.5",runtime:"47 min/ep",genres:["Crime","Drama","Thriller"],badge:"TOP RATED",desc:"A high school chemistry teacher turns to making and selling methamphetamine after a terminal cancer diagnosis.",director:"Vince Gilligan",cast:["Bryan Cranston","Aaron Paul","Anna Gunn"],language:"English",trailer:"https://www.youtube.com/watch?v=HhesaQXLuRY",poster:"https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg"},
    {id:"game-of-thrones",title:"Game of Thrones",year:"2011",rating:"9.3",runtime:"57 min/ep",genres:["Fantasy","Drama","Action"],badge:"LEGENDARY",desc:"Noble families fight for control of the Iron Throne while an ancient enemy threatens from the north.",director:"David Benioff",cast:["Emilia Clarke","Kit Harington","Peter Dinklage"],language:"English",trailer:"https://www.youtube.com/watch?v=KPLWWIOCOOQ",poster:"https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/suopoADq0k8YZr4dQXcU6pToj6s.jpg"},
    {id:"stranger-things",title:"Stranger Things",year:"2016",rating:"8.7",runtime:"51 min/ep",genres:["Sci-Fi","Horror","Drama"],badge:"POPULAR",desc:"When a boy disappears, a small town uncovers a mystery involving secret experiments and supernatural forces.",director:"The Duffer Brothers",cast:["Millie Bobby Brown","Finn Wolfhard","David Harbour"],language:"English",trailer:"https://www.youtube.com/watch?v=b9EkMc79ZSU",poster:"https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg"},
    {id:"the-wire",title:"The Wire",year:"2002",rating:"9.3",runtime:"59 min/ep",genres:["Crime","Drama","Thriller"],badge:"TOP RATED",desc:"The Baltimore drug scene is portrayed from both sides of the law in this landmark crime drama.",director:"David Simon",cast:["Dominic West","Idris Elba","Lance Reddick"],language:"English",trailer:"https://www.youtube.com/watch?v=a0s7CRShBak",poster:"https://image.tmdb.org/t/p/w500/4lbclFySvugI51fwsyxBTOm4DqK.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/63XiJnqIbrjTiZHSNXNZ0UXARNH.jpg"},
    {id:"sopranos",title:"The Sopranos",year:"1999",rating:"9.2",runtime:"55 min/ep",genres:["Crime","Drama"],badge:"LEGENDARY",desc:"A New Jersey mob boss navigates the competing demands of his criminal family and his real family.",director:"David Chase",cast:["James Gandolfini","Edie Falco","Lorraine Bracco"],language:"English",trailer:"https://www.youtube.com/watch?v=NlmVmTGnZMY",poster:"https://image.tmdb.org/t/p/w500/rTc7ZXdroqjkKivFPvCPX0Ru7uw.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/bvJOpyHYWACnuVjDKhMjbHnScHk.jpg"},
    {id:"chernobyl",title:"Chernobyl",year:"2019",rating:"9.4",runtime:"70 min/ep",genres:["Historical","Drama","Thriller"],badge:"TOP RATED",desc:"The true story of the 1986 nuclear disaster and the sacrifices made to contain it.",director:"Johan Renck",cast:["Jared Harris","Stellan Skarsgård","Emily Watson"],language:"English",trailer:"https://www.youtube.com/watch?v=s9APLXM9Ei8",poster:"https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/sHnMGGKTm3OROS2HJKJJ2PNLXHJ.jpg"},
    {id:"the-last-of-us",title:"The Last of Us",year:"2023",rating:"8.8",runtime:"60 min/ep",genres:["Drama","Horror","Sci-Fi"],badge:"NEW",desc:"A hardened survivor and a teenage girl traverse a post-pandemic America in search of safety.",director:"Craig Mazin",cast:["Pedro Pascal","Bella Ramsey","Anna Torv"],language:"English",trailer:"https://www.youtube.com/watch?v=uLtkt8BonwM",poster:"https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/9PqD3wSIjntyJDBzMNuxuKHcMbJ.jpg"},
    {id:"succession",title:"Succession",year:"2018",rating:"8.9",runtime:"60 min/ep",genres:["Drama","Comedy"],badge:"TOP RATED",desc:"The Roy family battles for control of their global media empire as the patriarch's health declines.",director:"Jesse Armstrong",cast:["Brian Cox","Jeremy Strong","Sarah Snook"],language:"English",trailer:"https://www.youtube.com/watch?v=OflSpPT8Z8g",poster:"https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/bkpPTZUdq31UGDovmszsg2CchiI.jpg"},
    {id:"the-boys",title:"The Boys",year:"2019",rating:"8.7",runtime:"60 min/ep",genres:["Action","Comedy","Sci-Fi"],badge:"POPULAR",desc:"A group of vigilantes set out to take down corrupt superheroes who abuse their powers.",director:"Eric Kripke",cast:["Karl Urban","Jack Quaid","Antony Starr"],language:"English",trailer:"https://www.youtube.com/watch?v=M1bhOaLV4FU",poster:"https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/mGVrXeIjyecj6TKmwPVpHlscEmw.jpg"},
    {id:"mandalorian",title:"The Mandalorian",year:"2019",rating:"8.7",runtime:"40 min/ep",genres:["Action","Sci-Fi","Adventure"],badge:"POPULAR",desc:"A lone bounty hunter in the outer reaches of the galaxy encounters a mysterious child.",director:"Jon Favreau",cast:["Pedro Pascal","Gina Carano","Carl Weathers"],language:"English",trailer:"https://www.youtube.com/watch?v=aOC8E8z_ifw",poster:"https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/9ijMGlJKqcslswWUzTEwScm82Gs.jpg"},
    {id:"dark",title:"Dark",year:"2017",rating:"8.8",runtime:"60 min/ep",genres:["Sci-Fi","Mystery","Thriller"],badge:"ACCLAIMED",desc:"A family saga with a supernatural twist set in a fictional German town where the disappearance of children reveals time travel.",director:"Baran bo Odar",cast:["Louis Hofmann","Oliver Masucci","Karoline Eichhorn"],language:"German",trailer:"https://www.youtube.com/watch?v=ESEUoa-mz2c",poster:"https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",backdrop:"https://image.tmdb.org/t/p/w1280/kbaM4K3ICm4MKOlJUdY95yrGiqt.jpg"},
  ]
};

// ── TMDB ID MAPPING FOR EMBED ──
// Maps SEED item IDs to TMDb IDs for the embed player
// Movies use movie IDs, Anime/K-Dramas/Series use TV show IDs
const TMDB_IDS = {
  // === MOVIES ===
  "avengers-endgame": 299534,
  "dark-knight": 155,
  "interstellar": 157336,
  "inception": 27205,
  "oppenheimer": 872585,
  "dune2": 693134,
  "dhurandhar": 1291608,
  "dhurandhar-revenge": 1582770,
  "animal": 781732,
  "kgf-1": 564147,
  "kgf-2": 587412,
  "bahubali-1": 256040,
  "bahubali-2": 350312,
  "jawan": 872906,
  "titanic": 597,
  "spiderman-nwh": 634649,
  "parasite": 496243,
  "shawshank": 278,
  "pulp-fiction": 680,
  "the-batman": 414906,
  "fight-club": 550,
  "avatar2": 76600,
  "joker": 475557,
  "forrest-gump": 13,
  "matrix": 603,
  "godfather": 238,
  "goodfellas": 769,
  "schindlers-list": 424,
  "whiplash": 84365,
  "la-la-land": 313369,
  "gladiator": 98,
  "wolf-wall": 106646,
  "silence-lambs": 274,
  "black-panther": 284054,
  "alien": 348,
  "spirited-away": 129,
  "1917": 530915,
  "oldboy": 87516,
  "memento": 77,
  "requiem": 641,
  "mad-max": 76341,
  "leon": 244786,
  "braveheart": 197,
  "inglourious": 16869,
  "truman": 37165,
  "12-angry": 389,
  "there-will-be-blood": 7345,
  "lawrence-arabia": 947,
  "boyhood": 85350,
  "blade-runner-2049": 335984,
  "apocalypse-now": 28,
  "beautiful-mind": 453,
  "coco": 18955,
  "princess-mononoke": 129,
  "the-shining": 694,
  "psycho": 539,
  "seven-samurai": 204,

  // === ANIME (TV Shows) ===
  "naruto-shippuden": 31910,
  "aot": 1429,
  "fma-b": 31911,
  "demon-slayer": 85937,
  "jujutsu-kaisen": 126310,
  "one-piece": 37854,
  "chainsaw-man": 97441,

  // === K-DRAMAS (TV Shows) ===
  "squid-game": 93405,
  "crash-landing": 94796,
  "goblin": 67915,
  "vincenzo": 121957,
  "the-glory": 129828,
  "its-okay": 107349,
  "woo-atty": 135972,
  "my-love-star": 62741,
  "misaeng": 62649,
  "mr-sunshine": 72879,
  "flower-of-evil": 110316,
  "sky-castle": 85271,
  "hospital-playlist": 135145,
  "stranger": 66825,
  "prison-playbook": 74208,
  "business-proposal": 135977,
  "hometown-cha": 125470,
  "voice": 1396,
  "moon-lovers": 65814,

  // === SERIES (TV Shows) ===
  "breaking-bad": 1396,
  "game-of-thrones": 1399,
  "stranger-things": 66732,
  "the-wire": 2316,
  "sopranos": 1398,
  "chernobyl": 87108,
  "the-last-of-us": 100088,
  "succession": 139264,
  "the-boys": 71593,
  "mandalorian": 82856,
  "dark": 70523,
};

// ── UTILS ──
function getPosterGradient(title) {
  let h = 0;
  for (const c of title) h = ((h << 5) - h + c.charCodeAt(0)) | 0;
  const hue = ((h >>> 0) % 360);
  return `linear-gradient(160deg, hsl(${hue},55%,18%) 0%, hsl(${(hue+55)%360},65%,10%) 100%)`;
}


function getGenreEmoji(genres) {
  for (const g of (genres || [])) if (GENRE_EMOJI[g]) return GENRE_EMOJI[g];
  return '🎬';
}

function trailerURL(item) {
  if (item.trailer && item.trailer.includes('youtube.com/watch')) return item.trailer;
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent((item.title || '') + ' official trailer');
}

function makeId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6);
}

function starsHTML(rating) {
  const r = parseFloat(rating) || 0;
  const full = Math.floor(r / 2);
  const half = (r / 2 - full) >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '<div class="stars-row">'
    + '<i class="fa-solid fa-star star"></i>'.repeat(full)
    + (half ? '<i class="fa-solid fa-star-half-stroke star half"></i>' : '')
    + '<i class="fa-regular fa-star star empty"></i>'.repeat(empty)
    + '</div>';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── IMAGE URL HELPER (FIX #1) ──
// Handles both full URLs (already have https://) and bare paths (/abc.jpg)
// Prevents the double-prefix bug that broke all TMDB images
function getImageUrl(path, size = 'w500') {
  if (!path) return null;
  if (path.startsWith('http')) return path;                          // already a full URL — use as-is
  if (path.startsWith('/')) return `https://image.tmdb.org/t/p/${size}${path}`; // bare TMDB path
  return null;
}

// ── THEME ──
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? '' : 'light');
  document.getElementById('themeTog').innerHTML = isDark
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';
}

// ── API GENERATION ──
async function callAPI(prompt) {
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await resp.json();
    const text = (data.content || []).map(b => b.text || '').join('');
    const clean = text.replace(/```(?:json)?\n?/g, '').replace(/```\n?/g, '').trim();
    const arr = JSON.parse(clean);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error('API err:', e);
    return [];
  }
}

async function generateBatch(category) {
  const cfg = CAT_CONFIG[category];
  const existing = db[category].slice(-20).map(x => x.title).join(', ');
  const prompt = `Generate exactly ${BATCH} unique ${cfg.label} as a JSON array. Do NOT include: ${existing || 'none'}.
Each item: title(string), year("YYYY" in ${cfg.yearRange}), rating("X.X" 6.0-9.5), genres(2-3 from [Action,Drama,Comedy,Thriller,Horror,Sci-Fi,Romance,Fantasy,Crime,Adventure,Historical,Supernatural,Mystery,Animation,Psychological,Family,Sport]), description(2-3 sentences), director(string), cast(3 names), language(string), runtime(${cfg.runtimeHint}).
CRITICAL: Return ONLY a valid JSON array starting with [ and ending with ]. No markdown, no explanation.`;

  const items = await callAPI(prompt);
  const typed = items.slice(0, BATCH).map(it => ({
    id: makeId(it.title || 'item'),
    title: it.title || 'Unknown',
    year: String(it.year || '2023'),
    rating: String(parseFloat(it.rating) || '7.5'),
    runtime: it.runtime || '—',
    genres: Array.isArray(it.genres) ? it.genres.slice(0, 3) : ['Drama'],
    type: { movies: 'Movie', anime: 'Anime', kdrama: 'K-Drama', series: 'Series' }[category],
    badge: 'POPULAR',
    desc: it.description || it.desc || '',
    director: it.director || '',
    cast: Array.isArray(it.cast) ? it.cast.slice(0, 3) : [],
    language: it.language || 'English',
    trailer: trailerURL({ title: it.title, trailer: null }),
    poster: null,     // AI-generated items have no poster — will use gradient fallback
    backdrop: null
  }));

  db[category].push(...typed);
  totalGenerated += typed.length;
  updateProgress();
  renderSection(category);
  updateStats();
  buildTrending();
  return typed.length;
}

let genRound = 0;
async function runGenRound() {
  if (genRound >= ROUNDS) { hideProgress(); return; }
  genRound++;
  await Promise.all(Object.keys(db).map(cat => generateBatch(cat)));
  if (genRound < ROUNDS) { await sleep(800); runGenRound(); } else { hideProgress(); }
}

function updateProgress() {
  const fill = Math.min(100, (totalGenerated / TOTAL_TARGET) * 100);
  document.getElementById('genFill').style.width = fill + '%';
  const total = db.movies.length + db.anime.length + db.kdrama.length + db.series.length;
  document.getElementById('genCountLabel').textContent = total + ' / 1000+';
}

function hideProgress() { document.getElementById('genProgress').style.display = 'none'; }

// ── STATS ──
function updateStats() {
  document.getElementById('s-movies').textContent = db.movies.length;
  document.getElementById('s-anime').textContent = db.anime.length;
  document.getElementById('s-kdrama').textContent = db.kdrama.length;
  document.getElementById('s-series').textContent = db.series.length;
  document.getElementById('s-total').textContent = db.movies.length + db.anime.length + db.kdrama.length + db.series.length;
}

// ── TRENDING STRIP ──
function buildTrending() {
  const all = [...db.movies, ...db.anime, ...db.kdrama, ...db.series];
  const top = all.slice().sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 10);
  const strip = document.getElementById('trendingItems');
  strip.innerHTML = '';
  top.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 't-item';
    el.innerHTML = `<span class="t-rank">${i + 1}</span><div class="t-info"><div class="t-name">${item.title}</div><div class="t-meta">⭐ ${item.rating} · ${item.year}</div></div>`;
    el.onclick = () => openInfoModal(item);
    strip.appendChild(el);
  });
}

// ── SORT ──
function getSortedItems(category) {
  const items = [...filteredItems(category)];
  const sort = document.getElementById('sortSel').value;
  if (sort === 'rating') items.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  else if (sort === 'year-new') items.sort((a, b) => parseInt(b.year) - parseInt(a.year));
  else if (sort === 'year-old') items.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  else if (sort === 'title') items.sort((a, b) => a.title.localeCompare(b.title));
  return items;
}

// ── CARD BUILDER (FIX #2, #3) ──
// Fixed: getImageUrl() prevents double-prefix bug
// Fixed: fallback poster now shows genre emoji + full title + year (visually rich)
// Fixed: img uses opacity fade-in instead of display toggle for smoother UX
function buildCard(item, showRemove = false, small = false) {
  const div = document.createElement('div');
  div.className = 'movie-card' + (small ? ' small' : '');
  const inWl = isInWL(item.id);
  const bdgClass = BADGE_CLASSES[item.badge] || 'bdg-red';
  const grad = getPosterGradient(item.title);
  const emoji = getGenreEmoji(item.genres);

  // FIX: use getImageUrl() — no more double-prefix
  const imageUrl = getImageUrl(item.poster);

  div.innerHTML = `
    <div class="poster" style="${grad}">
      ${imageUrl ? `
        <img
          src="${imageUrl}"
          alt="${item.title}"
          loading="lazy"
          style="opacity:0;transition:opacity .45s ease"
          onload="this.style.opacity='1';this.nextElementSibling.style.display='none'"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
        >` : ''}
      <div class="poster-fb" style="${imageUrl ? 'display:none' : 'display:flex'};flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:16px;text-align:center;">
        <span style="font-size:2.8rem;line-height:1">${emoji}</span>
        <span style="font-size:.78rem;font-weight:700;color:#fff;opacity:.95;line-height:1.3;word-break:break-word">${item.title}</span>
        <span style="font-size:.7rem;opacity:.55;color:#fff">${item.year}${item.runtime ? ' · ' + item.runtime : ''}</span>
      </div>
      ${item.badge ? `<span class="card-bdg ${bdgClass}">${item.badge}</span>` : ''}
      <span class="rtg-bdg">⭐ ${item.rating}</span>
      <div class="poster-ov">
        <div class="play-circle"><i class="fa-solid fa-play"></i></div>
      </div>
      ${showRemove ? `<button class="rm-btn" title="Remove"><i class="fa-solid fa-xmark"></i></button>` : ''}
    </div>
    <div class="card-info">
      <div class="card-title">${item.title}</div>
      <div class="card-meta">
        <span class="card-rtg">⭐ ${item.rating}</span>
        <span>${item.year}</span>
        <span>${item.runtime || ''}</span>
      </div>
      <div class="card-btns">
        <a class="cbtn cb-play" href="${trailerURL(item)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
          <i class="fa-brands fa-youtube"></i> Trailer
        </a>
        <button class="cbtn cb-wl ${inWl ? 'active' : ''}" title="Wishlist">
          <i class="fa-solid fa-heart"></i>
        </button>
        <button class="cbtn cb-info" title="More Info">
          <i class="fa-solid fa-circle-info"></i>
        </button>
      </div>
    </div>`;

  div.querySelector('.poster-ov').addEventListener('click', e => {
    e.stopPropagation();
    window.open(trailerURL(item), '_blank');
  });

  div.querySelector('.cb-wl').addEventListener('click', e => {
    e.stopPropagation();
    toggleWL(item);
    div.querySelector('.cb-wl').classList.toggle('active', isInWL(item.id));
    syncHeroWL();
    syncInfoWL();
  });

  div.querySelector('.cb-info').addEventListener('click', e => {
    e.stopPropagation();
    openInfoModal(item);
  });

  div.addEventListener('click', () => openInfoModal(item));

  if (showRemove) {
    div.querySelector('.rm-btn').addEventListener('click', e => {
      e.stopPropagation();
      toggleWL(item);
      renderWL();
    });
  }

  return div;
}

// ── RENDER SECTION ──
function renderSection(category) {
  const row = document.getElementById(category + 'Row');
  const items = getSortedItems(category);
  const count = renderCount[category];
  row.innerHTML = '';
  items.slice(0, count).forEach(item => row.appendChild(buildCard(item)));
  const el = document.getElementById(category + '-count');
  if (el) el.textContent = items.length;
  const moreBtn = document.getElementById(category + '-more');
  if (moreBtn) moreBtn.disabled = count >= items.length;
}

function filteredItems(category) {
  const items = db[category];
  if (activeGenre === 'all') return items;
  return items.filter(it => (it.genres || []).some(g => g.toLowerCase() === activeGenre.toLowerCase()));
}

function loadMore(category) { renderCount[category] += 20; renderSection(category); }
function renderAll() { ['movies', 'anime', 'kdrama', 'series'].forEach(renderSection); }

// ── RANDOM PICK ──
function randomPick() {
  const all = [...db.movies, ...db.anime, ...db.kdrama, ...db.series];
  if (!all.length) return;
  const pick = all[Math.floor(Math.random() * all.length)];
  openInfoModal(pick);
  showToast('🎲 Random pick: ' + pick.title, 'success');
}

// ── WISHLIST ──
function isInWL(id) { return wishlist.some(w => w.id === id); }

function toggleWL(item) {
  if (isInWL(item.id)) {
    wishlist = wishlist.filter(w => w.id !== item.id);
    showToast('Removed from Wishlist', 'error');
  } else {
    wishlist.push(item);
    showToast('Added to Wishlist ❤️', 'success');
  }
  updateWLBadge();
  renderWL();
}

function updateWLBadge() {
  const bdg = document.getElementById('wlBdg');
  bdg.textContent = wishlist.length;
  bdg.classList.toggle('show', wishlist.length > 0);
}

function renderWL() {
  const grid = document.getElementById('wlGrid');
  const empty = document.getElementById('wlEmpty');
  grid.innerHTML = '';
  if (!wishlist.length) { empty.style.display = 'flex'; return; }
  empty.style.display = 'none';
  wishlist.forEach(item => grid.appendChild(buildCard(item, true)));
}

function clearAllWishlist() {
  if (!wishlist.length) return;
  wishlist = [];
  updateWLBadge();
  renderWL();
  showToast('Wishlist cleared');
}

// ── SEARCH ──
let srchOpen = false;

function toggleSearch() {
  srchOpen = !srchOpen;
  document.getElementById('srchIW').classList.toggle('open', srchOpen);
  if (srchOpen) setTimeout(() => document.getElementById('srchInput').focus(), 200);
  else clearSearch();
}

function clearSearch() {
  document.getElementById('srchInput').value = '';
  document.getElementById('searchSec').style.display = 'none';
}

function doSearch(q) {
  q = q.trim().toLowerCase();
  const sec = document.getElementById('searchSec');
  const grid = document.getElementById('srchGrid');
  const empty = document.getElementById('srchEmpty');
  const countEl = document.getElementById('srchCount');
  if (!q) { sec.style.display = 'none'; return; }
  sec.style.display = 'block';
  const all = [...db.movies, ...db.anime, ...db.kdrama, ...db.series];
  const res = all.filter(it =>
    (it.title || '').toLowerCase().includes(q) ||
    (it.desc || '').toLowerCase().includes(q) ||
    (it.genres || []).join(' ').toLowerCase().includes(q) ||
    (it.language || '').toLowerCase().includes(q) ||
    (it.director || '').toLowerCase().includes(q) ||
    (it.cast || []).join(' ').toLowerCase().includes(q)
  );
  grid.innerHTML = '';
  countEl.textContent = res.length + ' result' + (res.length !== 1 ? 's' : '');
  empty.style.display = res.length === 0 ? 'flex' : 'none';
  res.forEach(it => grid.appendChild(buildCard(it)));
  sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── GENRE FILTER ──
function buildGenreBar() {
  const bar = document.getElementById('genreBar');
  bar.innerHTML = '';
  GENRES.forEach(g => {
    const chip = document.createElement('span');
    chip.className = 'g-chip' + (g.toLowerCase() === activeGenre ? ' active' : '');
    chip.textContent = g;
    chip.onclick = () => {
      activeGenre = g.toLowerCase() === 'all' ? 'all' : g;
      document.querySelectorAll('.g-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderCount = { movies: 20, anime: 20, kdrama: 20, series: 20 };
      renderAll();
    };
    bar.appendChild(chip);
  });
}

// ── INFO MODAL (FIX #4) ──
// Fixed: getImageUrl() for backdrop and poster — no more double-prefix
// Fixed: modal poster panel shows image when available, gradient+emoji when not
function openInfoModal(item) {
  currentInfoItem = item;
  const grad = getPosterGradient(item.title);
  const emoji = getGenreEmoji(item.genres);
  const hero = document.getElementById('infoHero');

  // FIX: use getImageUrl() for backdrop/poster
  const backdropUrl = getImageUrl(item.backdrop, 'original') || getImageUrl(item.poster, 'w780');
  if (backdropUrl) {
    hero.style.backgroundImage = `url(${backdropUrl})`;
  } else {
    hero.style.backgroundImage = '';
    hero.style.background = grad;
  }

  // FIX: info panel poster
  const pg = document.getElementById('infoPg');
  const posterUrl = getImageUrl(item.poster);
  if (posterUrl) {
    pg.style.backgroundImage = `url(${posterUrl})`;
    pg.style.backgroundSize = 'cover';
    pg.style.backgroundPosition = 'center';
    pg.style.background = ''; // clear any gradient
    pg.textContent = '';
  } else {
    pg.style.backgroundImage = '';
    pg.style.background = grad;
    pg.textContent = emoji;
  }

  document.getElementById('infoTags').innerHTML =
    `<span class="itag itag-type">${item.type || 'Movie'}</span>` +
    (item.genres || []).map(g => `<span class="itag itag-g">${getGenreEmoji([g])} ${g}</span>`).join('');

  document.getElementById('infoTitle').textContent = item.title || '';
  document.getElementById('infoMeta').innerHTML =
    starsHTML(item.rating) +
    `<span class="info-rtg">⭐ ${item.rating}/10</span>` +
    `<span>· ${item.year}</span>` +
    (item.runtime ? `<span>· ${item.runtime}</span>` : '') +
    (item.language ? `<span>· 🌐 ${item.language}</span>` : '');

  document.getElementById('infoDesc').textContent = item.desc || item.description || '';

  const extras = [];
  if (item.director) extras.push(`🎬 Director: ${item.director}`);
  if (item.cast && item.cast.length) extras.push(`🎭 Cast: ${item.cast.join(', ')}`);
  document.getElementById('infoExtras').innerHTML = extras.map(e => `<span class="info-extra-tag">${e}</span>`).join('');

  document.getElementById('infoTrailerBtn').href = trailerURL(item);

  // Load embed if available (check item.tmdbId first, then fallback to TMDB_IDS)
  const embedDiv = document.getElementById('infoEmbed');
  const embedFrame = document.getElementById('embedFrame');
  const tmdbId = item.tmdbId || TMDB_IDS[item.id];
  if (tmdbId) {
    embedDiv.style.display = 'block';
    embedFrame.src = `https://www.vidking.net/embed/movie/${tmdbId}`;
  } else {
    embedDiv.style.display = 'none';
    embedFrame.src = '';
  }

  const all = [...db.movies, ...db.anime, ...db.kdrama, ...db.series];
  const genre = (item.genres || [])[0];
  const similar = all.filter(x => x.id !== item.id && (x.genres || []).includes(genre)).slice(0, 6);
  const simGrid = document.getElementById('simGrid');
  simGrid.innerHTML = '';
  const infoSim = document.getElementById('infoSimilar');
  if (similar.length) {
    infoSim.style.display = 'block';
    similar.forEach(s => simGrid.appendChild(buildCard(s, false, true)));
  } else {
    infoSim.style.display = 'none';
  }

  syncInfoWL();
  openModal('infoBg');
}

function syncInfoWL() {
  if (!currentInfoItem) return;
  const btn = document.getElementById('infoWlBtn');
  const inWl = isInWL(currentInfoItem.id);
  btn.classList.toggle('active', inWl);
  btn.innerHTML = inWl
    ? '<i class="fa-solid fa-heart-crack"></i> Remove from Wishlist'
    : '<i class="fa-solid fa-heart"></i> Add to Wishlist';
}

function infoWlToggle() {
  if (!currentInfoItem) return;
  toggleWL(currentInfoItem);
  syncInfoWL();
  syncHeroWL();
  renderAll();
}

function playEmbed() {
  const embedDiv = document.getElementById('infoEmbed');
  if (embedDiv && embedDiv.style.display !== 'none') {
    embedDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── HERO CAROUSEL (FIX #5) ──
// Fixed: getImageUrl() for backdrop/poster — no more double-prefix
function buildHero() {
  const pool = [...db.movies, ...db.anime, ...db.kdrama, ...db.series]
    .filter(x => x.backdrop || x.poster).slice(0, 8);
  if (!pool.length) return;
  heroItems = pool;
  heroIdx = 0;
  buildHeroDots();
  setHero(heroItems[0]);
  clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    heroIdx = (heroIdx + 1) % heroItems.length;
    setHero(heroItems[heroIdx]);
    updateHeroDot();
  }, 7000);
}

function setHero(item) {
  currentHeroItem = item;
  const heroBg = document.getElementById('heroBg');

  // FIX: use getImageUrl() — handles full URLs correctly
  const bgUrl = getImageUrl(item.backdrop, 'original') || getImageUrl(item.poster, 'w780');
  if (bgUrl) {
    heroBg.style.backgroundImage = `url(${bgUrl})`;
  } else {
    heroBg.style.backgroundImage = '';
    heroBg.style.background = getPosterGradient(item.title);
  }

  document.getElementById('heroBadge').textContent = '🔥 ' + (item.type || 'Featured');
  document.getElementById('heroTitle').textContent = item.title || 'Movies Center';
  document.getElementById('heroStars').textContent = '⭐ ' + item.rating;
  document.getElementById('heroYear').textContent = item.year || '';
  document.getElementById('heroGenre').textContent = (item.genres || []).slice(0, 2).join(' · ');
  document.getElementById('heroDesc').textContent = item.desc || '';
  document.getElementById('heroTrailerBtn').href = trailerURL(item);
  syncHeroWL();
}

function buildHeroDots() {
  const dots = document.getElementById('heroDots');
  dots.innerHTML = '';
  heroItems.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'h-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => {
      clearInterval(heroTimer);
      heroIdx = i;
      setHero(heroItems[i]);
      updateHeroDot();
      heroTimer = setInterval(() => {
        heroIdx = (heroIdx + 1) % heroItems.length;
        setHero(heroItems[heroIdx]);
        updateHeroDot();
      }, 7000);
    };
    dots.appendChild(d);
  });
}

function updateHeroDot() {
  document.querySelectorAll('.h-dot').forEach((d, i) => d.classList.toggle('active', i === heroIdx));
}

function syncHeroWL() {
  if (!currentHeroItem) return;
  const btn = document.getElementById('heroWlBtn');
  const inWl = isInWL(currentHeroItem.id);
  btn.classList.toggle('active', inWl);
  btn.innerHTML = inWl
    ? '<i class="fa-solid fa-heart-crack"></i> Remove'
    : '<i class="fa-solid fa-heart"></i> Add to Wishlist';
}

function heroWlToggle() { if (!currentHeroItem) return; toggleWL(currentHeroItem); syncHeroWL(); }
function heroInfoOpen() { if (currentHeroItem) openInfoModal(currentHeroItem); }

// ── MODALS ──
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-bg').forEach(bg => {
  bg.addEventListener('click', e => { if (e.target === bg) bg.classList.remove('open'); });
});

// ── PROFILE ──
function buildAvatarGrid() {
  const grid = document.getElementById('avGrid');
  grid.innerHTML = '';
  AVATARS.forEach(av => {
    const span = document.createElement('span');
    span.className = 'av-i' + (av === profile.avatar ? ' sel' : '');
    span.textContent = av;
    span.onclick = () => {
      profile.avatar = av;
      document.getElementById('bigAv').textContent = av;
      document.querySelectorAll('.av-i').forEach(a => a.classList.remove('sel'));
      span.classList.add('sel');
    };
    grid.appendChild(span);
  });
}

function saveProfile() {
  profile.avatar = document.getElementById('bigAv').textContent;
  profile.name = document.getElementById('pfName').value || 'Guest';
  document.getElementById('hdrAv').textContent = profile.avatar;
  document.getElementById('hdrNm').textContent = profile.name;
  document.getElementById('saveMsg').textContent = '✅ Profile saved!';
  setTimeout(() => { document.getElementById('saveMsg').textContent = ''; }, 2500);
}

// ── TOAST ──
let toastTimer;
function showToast(msg, type = '') {
  clearTimeout(toastTimer);
  const t = document.getElementById('toast');
  const icon = document.getElementById('toastIcon');
  const txt = document.getElementById('toastTxt');
  txt.textContent = msg;
  icon.textContent = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  t.className = '';
  t.classList.add('show');
  if (type) t.classList.add('toast-' + type);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ── SCROLL REVEAL ──
function setupReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05 });
  document.querySelectorAll('.section').forEach(s => obs.observe(s));
}

// ── NAV ──
function navTo(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }

// ── BACK TO TOP ──
window.addEventListener('scroll', () => {
  document.getElementById('siteHeader').classList.toggle('solid', window.scrollY > 50);
  document.getElementById('bttBtn').classList.toggle('show', window.scrollY > 600);
});

// ── KEYBOARD SHORTCUTS ──
document.addEventListener('keydown', e => {
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (e.key === 's' || e.key === 'S') { e.preventDefault(); toggleSearch(); }
  if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleTheme(); }
  if (e.key === 'w' || e.key === 'W') { e.preventDefault(); openModal('wlModal'); }
  if (e.key === 'r' || e.key === 'R') { e.preventDefault(); randomPick(); }
  if (e.key === 'Escape') { ['infoBg', 'wlModal', 'profBg'].forEach(id => document.getElementById(id).classList.remove('open')); }
  if (e.key === 'ArrowRight') { heroIdx = (heroIdx + 1) % Math.max(1, heroItems.length); setHero(heroItems[heroIdx]); updateHeroDot(); }
  if (e.key === 'ArrowLeft') { heroIdx = (heroIdx - 1 + heroItems.length) % Math.max(1, heroItems.length); setHero(heroItems[heroIdx]); updateHeroDot(); }
});

// ── INIT ──
document.getElementById('srchTog').addEventListener('click', toggleSearch);
document.getElementById('themeTog').addEventListener('click', toggleTheme);

function init() {
  db.movies = [...SEED.movies];
  db.anime  = [...SEED.anime];
  db.kdrama = [...SEED.kdrama];
  db.series = [...(SEED.series || [])];

  buildGenreBar();
  buildAvatarGrid();
  updateStats();
  renderAll();
  renderWL();
  buildHero();
  buildTrending();
  setupReveal();

  document.getElementById('genProgress').style.display = 'flex';
  runGenRound();
}

window.addEventListener('load', init);