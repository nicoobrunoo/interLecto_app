export const SAMPLE_BOOKS = [
  { id:"b1", title:"Rayuela", author:"Julio Cortázar", condition:"Muy bueno", city:"CABA",
    owner:"Sofi", contact:"mailto:sofi@example.com", prefs:"Busco novelas latinoamericanas",
    tags:["Ficción","Clásico","LatAm"], otherLikedYou:true,
    img:"https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop"
  },
  { id:"b2", title:"Sapiens", author:"Yuval Noah Harari", condition:"Como nuevo", city:"Pilar",
    owner:"Lucas", contact:"https://wa.me/5491100000000", prefs:"Divulgación histórica / ciencia",
    tags:["Ensayo","Historia"], otherLikedYou:false,
    img:"https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=800&auto=format&fit=crop"
  },
  { id:"b3", title:"El nombre del viento", author:"Patrick Rothfuss", condition:"Bueno", city:"San Isidro",
    owner:"Mica", contact:"mailto:mica@example.com", prefs:"Fantasía épica o urbana",
    tags:["Fantasía","Best Seller"], otherLikedYou:true,
    img:"https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop"
  },
  { id:"b4", title:"1984", author:"George Orwell", condition:"Con señales de uso", city:"Vicente López",
    owner:"Juan", contact:"mailto:juan@example.com", prefs:"Distopías / Sci-Fi",
    tags:["Distopía","Política"], otherLikedYou:false,
    img:"https://images.unsplash.com/photo-1519681398057-4c59bfbbe3a8?q=80&w=800&auto=format&fit=crop"
  },
  { id:"b5", title:"Ficciones", author:"Jorge Luis Borges", condition:"Muy bueno", city:"Moreno",
    owner:"Nati", contact:"https://wa.me/5491177777777", prefs:"Cuentos, antologías",
    tags:["Cuentos","Clásico","LatAm"], otherLikedYou:true,
    img:"https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop"
  },
  { id:"b6", title:"El psicoanalista", author:"John Katzenbach", condition:"Bueno", city:"Tigre",
    owner:"Leo", contact:"mailto:leo@example.com", prefs:"Thriller / policial",
    tags:["Thriller"], otherLikedYou:false,
    img:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"
  },
];

export const K = {
  liked:        "bookswap-liked",
  passed:       "bookswap-passed",
  matches:      "bookswap-matches",
  mine:         "bookswap-mine-list",
  deck:         "bookswap-deck",

  // Premium & publicación
  premium:      "bookswap-premium",           // boolean
  publishedIds: "bookswap-published-ids",     // array de ids publicados (nuevo)
  published:    "bookswap-published-id",      // compatibilidad con versión anterior (string)
};
