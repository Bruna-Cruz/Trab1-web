    //
    // (20 pontos) Ao abrir o link, deve aparecer uma tabela de 6x10 de botões (checkbox, ou qualquer coisa que lembre um volante da mega-sena). Ao clicar um botão, o número correspondente deve ser copiado para um elemento "jogo" abaixo da tabela. Ao clicar no número uma segunda vez, o número deve ser eliminado do elemento "jogo". Limite de números no elemento "jogo": 6.
    // (20 pontos) Criar um botão "conferir" que só será habilitado quando o elemento "jogo" tiver exatamente seis números.
    // (20 pontos) Criar um botão "carregar" que, ao ser acionado, deve carregar um arquivo json contendo o resultado de todos resultados da mega sena. Este arquivo (formato csv) pode ser encontrado no site da Caixa. A versão json é definida pelo aluno e pode conter informações compiladas para a aplicação ser mais rápida.
    // (20 pontos) Ao clicar no botão "conferir" deve aparecer a lista de concursos que aquele jogo ganhou a mega-sena, quina e quadra.
    // (10 pontos) Questões estéticas são por conta do aluno.
    // (10 pontos) Incluir alguma ação relevate com o evento "mouseover", como por exemplo o número de concursos que o número foi sorteado.
url = "https://raw.githubusercontent.com/Bruna-Cruz/Trab1-web/main/T4/Todos-os-resultados-da-Mega-Sena-%E2%80%94-Rede-Loteria.csv";
//var csv is the CSV file with headers

const MAX = 60;
var NUM_MAX = 6;
var n_amount = 0; //amount of keys buttons selected

var selected_numbers = []
var index_hits = [];

(function(window, document, undefined){

window.onload = init;

  function init(){
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })


    const display = document.querySelector('.card-keys__display')
    const search = document.getElementById("search-btn");

    ///PREPARE NUMBERS OF LOTTO THAT ARE POSSIBLE TO BE SELECTED AND ADD ITS BUTTONS LINKING ONCLICK FUNCTION AND ITS VALUE////////////////////////////////////////////////////////////////////////////////////////////////////////
    var numbers = [];

    for (var i=1; i <= MAX; i++){
      numbers.push(i);
    }

    //put the buttons and its value from numbers[] on div #keys
    for (var i=0; i < numbers.length; i++){
       var  btn = document.createElement("button")

       btn.className= "btn btn-secondary";
       btn.value = i+1;
       btn.setAttribute("data-toggle", "tooltip");
       btn.setAttribute("data-placement", "bottom");
       btn.setAttribute("data-original-title","");
       btn.setAttribute("title", "");

       //checks if didnt get at num_max yet if not, disable button and add to display
       btn.onclick = function(btn) {
         if (this.classList.contains("selected") == false){
           if (n_amount < NUM_MAX){
             $(this).addClass("selected");
             add_key(this.value); //add to display
             n_amount++;
           }
         }
         else{
           $(this).removeClass("selected");
           remove_key(this.value);
           n_amount--;

           //disable search button
           search.setAttribute("disabled",true);
         }

         //active button to search
         if (n_amount == NUM_MAX){
           search.removeAttribute("disabled");
         }

         if (selected_numbers.length == 4){
           preSelection(selected_numbers)
         }

       };

       btn.appendChild(document.createTextNode(numbers[i]));
       var keys = document.getElementById("keys");

       keys.appendChild(btn);
    }


    /// SAVE AND DISPLAY SELECTED NUMBERS /////////////////////////////////////////////////////////////////////////////////////////////


    //add and remove keys from buttons clicked to display
    function add_key(key){
      selected_numbers.push(key)
      selected_numbers.sort(compare)
      display.textContent = selected_numbers;
    }

    function remove_key(key){
      selected_numbers = selected_numbers.filter(item => item !== key);
      selected_numbers.sort(compare)

      display.textContent = selected_numbers;
    }

    function btnClick(btn) {
      if (this.classList.contains("selected") == false){
        if (n_amount < NUM_MAX){
          $(this).addClass("selected");
          add_key(this.value); //add to display
          n_amount++;
        }
      }
      else{
        $(this).removeClass("selected");
        remove_key(this.value);
        n_amount--;

        //disable search button
        search.setAttribute("disabled",true);
      }

      //active button to search
      if (n_amount == NUM_MAX){
        search.removeAttribute("disabled");
      }

      if (selected_numbers.length == 4){
        preSelection(selected_numbers)
      }

    }

  }
})(window, document, undefined);

function compare (a, b) {
    return a - b;
}

//count every concurso that the number appers
function mouseover(btn){

  value = btn.value
  var result = 0
  for (var i=0; i<json.length; i++){
    if (compareArray([value], json[i].Data) > 0)
      result+=1;
  }
  btn.setAttribute("data-original-title","Vezes sorteado: " + result.toString());
}

//
function updateKeys(){
  var keys = document.getElementById("keys").childNodes;
  for(var i=1;i<keys.length;i++){
    mouseover(keys[i]);
  }

}

//////// LOAD CSV
function loadCsv(){
  json = csvJSON();
  updateKeys();

}

function processData(request){

  var lines= request.responseText.split("\n");
  for(var i=0;i<lines.length-1;i++){
    var line = lines[i];
    var j= line.length-2;

    while(line[j] != "\""){
      j--;
    }
    j--;
    lines[i] = lines[i].replace(lines[i].substring(j, lines.length),"")

    lines[i] = lines[i].replace(/\"/gi, "");

  }
  var result = [];

  var headers=lines[0].split(",");

  var aux=headers
  var headers = aux.slice(0,2);
  headers.push(aux[8]);

  for (var i=1;i<lines.length;i++){

      var obj = {};

      aux=lines[i].split(",");
      var number_winner = aux.slice(2,8);
      var currentline = aux.slice(0,1);

      currentline.push(number_winner);
      currentline.push(aux[8]);

      for (var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }

      result.push(obj);
  }

  return(result); //JSON JavaScript object
}

function csvJSON(){

  var request = new XMLHttpRequest();

  request.open("GET", url, false);
  request.send(null);
  return processData(request)


}

//compare two arrays and return how many elements are shared
function compareArray(numbers, data){
  var hits = 0
  numbers.filter(function(element){
    if (data.includes(element)){
      hits++;
    }
  });
  return hits;
}

//activates when 4 elements are selected making a pre selection in the json
function preSelection(numbers){
  index_hits = []
  console.log(numbers)
  for (var i=0; i< json.length; i++ ){
    if (compareArray(numbers, json[i].Data) >=2) {
      index_hits.push(i)
    }
  }

}

//button conferir (only when there are 6 numbers selected) saves the index of object with all concursos, saves and shows the games that 4, 5 or 6 numbers selected appers
function conferir(numbers){
  index_quadra = []
  index_quina = []
  index_sena = []

  console.log(numbers)
  console.log(index_hits)
  for (i in index_hits){
    var data = json[i].Data

    switch (compareArray(numbers, data)) {
      case 4:
        index_quadra.push(i);
        break;
      case 5:
        index_quina.push(i);
        break;
      case 6:
        index_sena.push(i);
        break;

      default:

    }
  }

  console.log(index_quadra)

  ///////display results
  displayResults(index_quadra, "Quadra")
  displayResults(index_quina, "Quina")
  displayResults(index_sena, "Sena")
}

//gets index of result and calls addResult to put in the table
function displayResults(results, hits){
  console.log(results)
  for (var i of results){
    console.log(i)
    var data = json[i];
    addResult(data, hits)
  }

  //
  var display = document.getElementById("lotto-results");
  display.style.display = "inline";
}

//puts results in the table, adding a line every call
function addResult (data, hits){

  var lottoResults = document.getElementById("results-table");
  var tr = document.createElement("tr");
   tr.classList.add("table-secondary");

  //concurso
  var th = document.createElement("th");
  th.setAttribute("scope", "row");
  th.appendChild(document.createTextNode(data["Conc."]));
  tr.appendChild(th);

  //acertos
  var th = document.createElement("th");
  th.appendChild(document.createTextNode(hits));
  tr.appendChild(th);

  //sorteio
  var th = document.createElement("th");
  th.appendChild(document.createTextNode(data.Data));
  tr.appendChild(th);

  lottoResults.appendChild(tr);

}
