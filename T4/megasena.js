    //
    // (20 pontos) Ao abrir o link, deve aparecer uma tabela de 6x10 de botões (checkbox, ou qualquer coisa que lembre um volante da mega-sena). Ao clicar um botão, o número correspondente deve ser copiado para um elemento "jogo" abaixo da tabela. Ao clicar no número uma segunda vez, o número deve ser eliminado do elemento "jogo". Limite de números no elemento "jogo": 6.
    // (20 pontos) Criar um botão "conferir" que só será habilitado quando o elemento "jogo" tiver exatamente seis números.
    // (20 pontos) Criar um botão "carregar" que, ao ser acionado, deve carregar um arquivo json contendo o resultado de todos resultados da mega sena. Este arquivo (formato csv) pode ser encontrado no site da Caixa. A versão json é definida pelo aluno e pode conter informações compiladas para a aplicação ser mais rápida.
    // (20 pontos) Ao clicar no botão "conferir" deve aparecer a lista de concursos que aquele jogo ganhou a mega-sena, quina e quadra.
    // (10 pontos) Questões estéticas são por conta do aluno.
    // (10 pontos) Incluir alguma ação relevate com o evento "mouseover", como por exemplo o número de concursos que o número foi sorteado.
const MAX = 49;
var NUM_MAX = 6;
var n_amount = 0; //amount of keys buttons selected

(function(window, document, undefined){

window.onload = init;

  function init(){

    ///PREPARE NUMBERS OF LOTTO THAT ARE POSSIBLE TO BE SELECTED AND ADD ITS BUTTONS LINKING ONCLICK FUNCTION AND ITS VALUE////////////////////////////////////////////////////////////////////////////////////////////////////////
    var numbers = [];

    for (var i=1; i <= MAX; i++){
      numbers.push(i);
    }

    //put the buttons and its value from numbers[] on div #keys
    for (var i=0; i < numbers.length; i++){
       var  btn = document.createElement("button")
       var search = document.getElementById("search-btn");

       btn.className= "btn btn-secondary";
       btn.value = i+1;

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

       };

       btn.appendChild(document.createTextNode(numbers[i]));
       var keys = document.getElementById("keys");

       keys.appendChild(btn);
    }


    /// SAVE AND DISPLAY SELECTED NUMBERS /////////////////////////////////////////////////////////////////////////////////////////////
    const display = document.querySelector('.card-keys__display')
    var selected_numbers = []

    //add and remove keys from buttons clicked to display
    function add_key(key){
      selected_numbers.push(key)
      display.textContent = selected_numbers;
    }

    function remove_key(key){
      selected_numbers = selected_numbers.filter(item => item !== key);
      display.textContent = selected_numbers;
    }

  }
})(window, document, undefined);










JSONfile = csvJSON("Todos-os-resultados-da-Mega-Sena-—-Rede-Loteria.csv");
console.log(JSONfile)
//var csv is the CSV file with headers
function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

      var obj = {};
      var currentline=lines[i].split(",");

      for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }

      result.push(obj);

  }

  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}

 // document.getElementById("myBtn").disabled = true;
