// je charge le module crypto qui nous permettra de hasher nos chaines de caractere
const crypto = require('crypto');

class BloomFilter{
  constructor(n = 128, k = 3){
    this.size = n;
    // je crée un tableau storage de n size cases, rempli de 0
    this.storage = new Array(this.size).fill(0);
    // je crée deux tableaux: encountered contenant les entry ajoutée et key la map key pour facilement retrouver les entry passée
    this.encountered = [];
    this.key = [];
    for (let i = 0; i < this.size; i++){
        this.key[i] = [];
    }
    // je crée un tableau algo contenant les k algorithmes utilisés pour hasher mes entrées
    const secureHashAlgorithms = ["sha1", "sha256", "sha512"];
    this.algo = [];
    for (let i = 0; i < k && i < secureHashAlgorithms.length; i++){
      this.algo.push(secureHashAlgorithms[i]);
    }
  }

  add(entry){
    // je stock l'indice dans le tableau encountered de la nouvelle entrée
    const entryId = this.encountered.length;
    // je stock la chaine rencontrée si c'est le premier ajout
    if (this.encountered.includes(entry) === false){
      this.encountered.push(entry);
    }
    // j'envoie la chaine entry à mes fonctions de hash; chaque fonction retourne un nombre indice entre 0 et n size
    //on marque ces indice à 1 dans notre tableau storage
    for (let i = 0; i < this.algo.length; i++){
      let hashedId = this.hashToId(entry, this.algo[i]);
      this.storage[hashedId] = 1;
      this.key[hashedId].push(entryId);
    }
  }

  test(testWord){
    // on test si la chaine str est probablement présente dans notre tableau storage
    // pour cela on vérifie dans notre tableau que les valeurs aux indice fournis par les functions de hash sont bien des 1 et non des 0
    // si c'est le cas on retourne un boolean true (la chaine str est probablement passer par notre filter)
    // sinon on retourne false: la chaine str n'est jamais passée par notre filter car on a rencontré un 0
    for (let i = 0; i < this.algo.length; i++){
      if (Boolean(this.storage[this.hashToId(testWord, this.algo[i])]) === false){
        return false;
      }
    }
    return true;
  }

  logPresent(searched){
    // je stock les indices du hash du mot searched
    const searchedIds = [];
    for (let i = 0; i < this.algo.length; i++){
      searchedIds.push(this.hashToId(searched, this.algo[i]));
    }
    // pour chacun des indices trouvés je vais afficher, si elles existent, les chaines présentes ou passées à cet indice
    // avec un chaine logged formatée
    let logged = "";
    for(let i = 0; i < searchedIds.length; i++){
      // je stock les chaines présentes ou passées à cet indice si ils sont différents du mot searched
      let encountered = [];
      for (let u = 0; u < this.key[searchedIds[i]].length; u++){
        if (this.encountered[this.key[searchedIds[i]][u]] !== searched){
          encountered.push(this.encountered[this.key[searchedIds[i]][u]]);
        }
      }
      // si j'en ai trouvé je les affiche sinon j'affiche un message
      if (encountered.length !== 0){
        logged += "pour l'indice "+String(searchedIds[i])+" "+searched+" partage l'indice avec ";
        for (let e = 0; e < encountered.length; e++){
          if (e === encountered.length - 1 && e === 0){
            logged += encountered[e];
          } else if (e === encountered.length - 1){
            logged += " et "+encountered[e];
          } else {
            logged += encountered[e];
            if (e !== encountered.length - 2){
              logged += ", ";
            }
          }
        }
      } else {
        logged += "pour l'indice "+String(searchedIds[i])+" "+searched+" est seul";
      }
      if (i !== searchedIds.length - 1){
        logged += "\n";
      }
    }
    console.log(logged);
    return logged;
  }

  // hash une chaine de caractere, retourne un indice généré depuis la chaine hashée, entre 0 et n size
  hashToId(str, algo){
    // création de mon object hasher utilisé pour générer des hash avec l'algorithme passé en paramètre
    let hasher = crypto.createHash(algo);
    // je mets à jour le contenu de notre hasher avec la chaine de caractere à hasher
    hasher.update(str);
    // on "digere" le hash de la donnée présente dans le hasher, nous retourne une chaine unique en hexadecimal
    const hash = hasher.digest('hex');
    // je crée une variable hashSum qui sera égale à la somme des valeurs ascii de ma chaine de caractere hash
    let hashSum = 0;
    for (let i = 0; i < hash.length; i++){
      hashSum += hash[i].charCodeAt();
    }
    // je retourne hashSum modulo n size arrondi à la valeur entière inférieure, pour m'assurer d'avoir un indice compris entre 0 et n size
    return Math.floor(hashSum % this.size);
  }
}

module.exports = BloomFilter;

// test cases
// const filter = new BloomFilter(6, 3);
// console.log(filter.test("word1")); //-> false
// filter.add("word1");
// filter.add("word2");
// filter.add("word3");
// filter.logPresent("word1");
// filter.logPresent("word2");
// filter.logPresent("word4");
// console.log(filter.test("word1")); //-> true
// console.log(filter.test("word2")); //-> false
// filter.add("word2");
// filter.add("word3");
// filter.add("word4");
// filter.add("word5");
// filter.add("word6");
// filter.add("word7");
// filter.add("word8");
// filter.add("word9");
