// je charge le module crypto qui nous permetra de hasher nos chaines de caractere
const crypto = require('crypto');

class BloomFilter{
  constructor(){
    // je crée un tableau de 128 cases rempli de 0
    this.storage = new Array(128).fill(0);
    // je crée un tableau contenant les algorithmes utilisés pour hasher mes entrées
    this.algo = ["sha1", "sha256", "sha512"];
  }

  add(entry){
    // j'envoie la chaine entry à mes fonctions de hash; chaque fonction retourne un nombre index entre 0 et 217, on marque ces index à 1 dans notre tableau storage
    for (let i = 0; i < this.algo.length; i++){
      this.storage[this.hashIt(entry, this.algo[i])] = 1;
    }
  }

  test(testWord){
    // on test si la chaine str est probablement présente dans notre tableau storage
    // pour cela on vérifie dans notre tableau que les valeurs aux index fournis par les functions de hash sont bien des 1 et non des 0
    // si c'est le cas on retourne un boolean true (la chaine str est probablement passer par notre filter)
    // sinon on retourne false: la chaine str n'est jamais passée par notre filter car on a rencontré un 0
    for (let i = 0; i < this.algo.length; i++){
      if (Boolean(this.storage[this.hashIt(testWord, this.algo[i])]) === false){
        return false;
      }
    }
    return true;
  }

  // logPresent(searched){
  //
  // }

  // hash une chaine de caractere, retourne un index généré depuis la chaine hashée, entre 0 et 127
  hashIt(str, algo){
    // création de mon object hasher utilisé pour générer des hash avec l'algorithme passé en paramètre
    let hasher = crypto.createHash(algo);
    // on met à jour le contenu de notre hasher avec la chaine de caractere à hasher
    hasher.update(str);
    // on "digere" le hash de la donnée présente dans le hasher, nous retourne une chaine unique en hexadecimal
    let hash = hasher.digest('hex');
    // je crée une variable coded qui sera égale à la somme des valeurs ascii de ma chaine de caractere hash
    let coded = 0;
    for (let i = 0; i < hash.length; i++){
      coded += hash[i].charCodeAt();
    }
    // je retourne coded modulo 128 arrondi à la valeur entière inférieure, pour m'assurer d'avoir un index compris entre 0 et 127
    return Math.floor(coded % 128);
  }
}

module.exports = BloomFilter;

// test cases
//const filter = new BloomFilter();
// console.log(filter.test("word1")); //-> false
//filter.add("test1");
// console.log(filter.test("word1")); //-> true
// console.log(filter.test("word2")); //-> false
