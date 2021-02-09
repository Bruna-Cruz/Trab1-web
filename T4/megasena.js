const url = "https://raw.githubusercontent.com/Bruna-Cruz/Trab1-web/trab4/T4/resultadosMega.json";

var json; //object

//game keys
const MAX = 60;
var NUM_MAX = 6;
var n_amount = 0; //amount of keys buttons selected

var selected_numbers = []
var index_hits = []; //

////FUNCTIONS RELATED TO INICIAL HTML MEGASENA PAGE ///////////////////////////////////////////////////////////////////////////////
(function(window, document, undefined){

window.onload = init;

  function init(){
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })


    const display = document.querySelector('.card-keys__display')
    const search = document.getElementById("search-btn");

    ///PREPARE KEYS NUMBERS (OF LOTTO) THAT ARE POSSIBLE TO BE SELECTED AND ADD ITS BUTTONS LINKING ONCLICK FUNCTION AND ITS VALUE
    var numbers = [];

    for (var i=1; i <= MAX; i++){
      numbers.push(i);
    }

    //put the buttons and its value from numbers[] on div #keys
    for (var i=0; i < numbers.length; i++){
       var  btn = document.createElement("button")

       btn.className= "btn btn-secondary";
       btn.value = i+1;
       btn.disabled = true;
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

    /// SAVE AND DISPLAY SELECTED NUMBERS

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

      if (selected_numbers.length >= 4){
         preSelection(selected_numbers.slice(0,4))
       }
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

////FUNCTIONS RELATED TO THE NUMBERS KEYS AFTER THE JSON IS LOADED///////////////////////////////////////////////////////////////////////////////
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

//called after the csv is loaded, it updates the moseover number keys and enable them
function updateAndEnableKeys(){
  var keys = document.getElementById("keys").childNodes;
  for(var i=1;i<keys.length;i++){
    mouseover(keys[i]);
    keys[i].disabled = false;
  }

}

//FUNCTIONS RELATED TO GET THE CSV AND GET JSON (usado para converter o csv para o json)
// function processCSV(request){
//   var lines= request.split("\n");
//   for(var i=0;i<lines.length-1;i++){
//     var line = lines[i];
//     var j= line.length-2;
//
//     while(line[j] != "\""){
//       j--;
//     }
//     j--;
//     lines[i] = lines[i].replace(lines[i].substring(j, lines.length),"")
//
//     lines[i] = lines[i].replace(/\"/gi, "");
//
//   }
//   var result = [];
//
//   var headers=lines[0].split(",");
//
//   var aux=headers
//   var headers = aux.slice(0,2);
//   headers.push(aux[8]);
//
//   for (var i=1;i<lines.length;i++){
//
//       var obj = {};
//
//       aux=lines[i].split(",");
//       var number_winner = aux.slice(2,8);
//       var currentline = aux.slice(0,1);
//
//       currentline.push(number_winner);
//       currentline.push(aux[8]);
//
//       for (var j=0;j<headers.length;j++){
//           obj[headers[j]] = currentline[j];
//       }
//
//       result.push(obj);
//
//       console.log(result)
//   }
//
//   return(result); //JSON JavaScript object
// }


function getJSON(){

  return $.get(url, function(data, status){
        console.log("loading file", status)
  })

}

// load json into object through ajax jquery when its done calls  update keys
function loadJSON(){

  $.when(getJSON()).done(function(response){
    //APOS SER CARREGADO
    alert("Arquivo carregado com sucesso!")
    json = JSON.parse(response)
    updateAndEnableKeys();
  })

}

//FUNCTIONS RELATED TO SEARCHING THE SELECTED NUMBERS IN THE JSON OBJECT
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
  console.log("Pre selection with first 4 numbers: ", numbers)
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

  console.log("Searching games with the numbers: ", numbers)
  console.log("Index of games in the pre select hits: ", index_hits)

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

  console.log("Quadra index of hits: ", index_quadra)
  console.log("Quina index of hits: ", index_quina)
  console.log("Sena index of hits: ", index_sena)


  ///////display results
  if (index_quadra.length == index_quina.length == index_sena.length != 0){
    displayResults(index_quadra, "Quadra")
    displayResults(index_quina, "Quina")
    displayResults(index_sena, "Sena")
  } else {
    alert("Nenhum jogo encontrado com os números selecionados :(")
  }
}

function cleanResultsTable(){
  var table = document.getElementById("results-table");
  table.innerHTML = '';

  var display = document.getElementById("lotto-results");
  display.style.display = "none";
}

////FUNCTIONS RELATED TO SHOWING THE SEARCH RESULTS///////////////////////////////////////////////////////////////////////////////
//gets index of result and calls addResult to put in the table
function displayResults(results, hits){

  for (var i of results){
    var data = json[i];
    addResult(data, hits)
  }
  var display = document.getElementById("lotto-results");
  display.style.display = "inline";
}

//puts results in the table, adding a line every call
function addResult (data, hits){

  var lottoResults = document.getElementById("results-table");
  var tr = document.createElement("tr");
   tr.classList.add("table-secondary");

  //concurso
  var td = document.createElement("td");
  td.setAttribute("scope", "row");
  td.appendChild(document.createTextNode(data["Conc."]));
  tr.appendChild(td);

  //acertos
  var td = document.createElement("td");
  td.appendChild(document.createTextNode(hits));
  tr.appendChild(td);

  //sorteio
  var td = document.createElement("td");
  td.appendChild(document.createTextNode(data.Data));
  tr.appendChild(td);

  lottoResults.appendChild(tr);

}
