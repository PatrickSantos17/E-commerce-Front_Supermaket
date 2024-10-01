// var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

let listaSalva = JSON.parse(localStorage.getItem("produtos"));

// Verifica se existe algo salvo e exibe a lista
if (listaSalva) {
    console.log(listaSalva); // ["Produto1", "Produto2", "Produto3"]
} else {
    console.log("Nenhum produto salvo");
}