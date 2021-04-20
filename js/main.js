//Elementos DOM NAVBAR
const $iconeAbrirMenu = document.querySelector('#abrirmenu');
const $iconeFecharMenu = document.querySelector('#fecharmenu');
const $nav = document.querySelector('#nav');
const $cadastro = document.querySelector('#cadastrobtn');
const $limpar = document.querySelector('#limparbtn');
const $salvarNoServidor = document.querySelector('#salvarbtn');

//Elementos DOM Form
const $novaTransacao = {
    tipoTransacao : document.querySelector('#tipotransacao'),
    mercadoria : document.querySelector('#mercadoria'),
    moeda : document.querySelector('#valor')
};
const $selectErro = document.querySelector('#erroselect');
const $nomeErro = document.querySelector('#erronome');
const $valorErro = document.querySelector('#errovalor');
const $adicionarBtn = document.querySelector('#adicionarbtn');
const $semExtrato = document.querySelector('#psemextrato')
const $prejuizoVermelho = document.querySelector('#balanco')


//Variáveis globais e listeners
$iconeAbrirMenu.addEventListener('click', abrirMenu);
$iconeFecharMenu.addEventListener('click', fecharMenu);
$novaTransacao.tipoTransacao.addEventListener('change', validarSelect);
$novaTransacao.mercadoria.addEventListener('keyup', validarMercadoria);
$novaTransacao.moeda.addEventListener('keyup', validarValor);
$novaTransacao.moeda.addEventListener('input',(e) => {
    e.target.value = mascaraValor(e.target.value);
});
var aluno = "4729"

/*
chamando produtos no localStore
var produtos = JSON.parse(localStorage.getItem("produtos"));
if (produtos == null ) {
    produtos = []
} */

var produtos = []
getTable()

// Functions

//navbar
function abrirMenu(){
    $nav.style.display = "block";
}
function fecharMenu(){
    $nav.style.display = "none";
} 

//validar compo select
function validarSelect(){
    const inputSelect = $novaTransacao.tipoTransacao.value;
    if (inputSelect === 'selecione'){
        $selectErro.style.display = 'block';
        $novaTransacao.tipoTransacao.style.border = '1px solid red';
        $novaTransacao.tipoTransacao.style.marginBottom = '0px';
        return false;
    } else {
        $selectErro.style.display = 'none';
        $novaTransacao.tipoTransacao.style.border = '1px solid #979797';
        $novaTransacao.tipoTransacao.style.marginBottom = '20px';
        return true;
    }
}

//validar campo nome da mercadoria
function validarMercadoria(){
    const inputMercadoria = $novaTransacao.mercadoria.value;
    if (inputMercadoria === ''){
        $nomeErro.style.display = 'block';
        $novaTransacao.mercadoria.style.border = '1px solid red';
        $novaTransacao.mercadoria.style.marginBottom = '0px';
        return false;
    } else{
        $nomeErro.style.display = 'none';
        $novaTransacao.mercadoria.style.border = '1px solid #979797';
        $novaTransacao.mercadoria.style.marginBottom = '20px';
        return true;
    }

}

//validar campo valor
function validarValor(){
    const inputValor = $novaTransacao.moeda.value.toString().substr(3);
    if (inputValor === ''){
        $valorErro.style.display = 'block';
        $novaTransacao.moeda.style.border = '1px solid red';
        $valorErro.style.marginBottom = '20px';
        $novaTransacao.moeda.style.marginBottom = '0px';
        return false;
    } else {
        $valorErro.style.display = 'none';
        $novaTransacao.moeda.style.border = '1px solid #979797';
        $novaTransacao.moeda.style.marginBottom = '20px';
        return true;
    }
}

//mascara de moeda
function mascaraValor(valorCampo) {
    valorCampo = valorCampo.toString().replace(/\D/g, '');
    valorCampo = parseInt(valorCampo.replace(/[.,]/g, '')).toString();
    let valor_pronto = '';
    if (valorCampo === '0') {
        valor_pronto = '';
    } else if (valorCampo.length === 1) {
        valor_pronto += '00' + valorCampo;
    } else if (valorCampo.length === 2) {
        valor_pronto += '0' + valorCampo;
    } else {
        valor_pronto = valorCampo;
    }
    if (valor_pronto.length > 0) {
        const doisUltimos = valor_pronto.substr(-2);
        const resto = valor_pronto.substr(0, valor_pronto.length - 2);
        valor_pronto = resto + ',' + doisUltimos;
        if (valor_pronto.length >= 7) {
            const ultimosSeis = valor_pronto.substr(-6);
            
            const resto = valor_pronto.substr(0, valor_pronto.length - 6);

            valor_pronto = resto + '.' + ultimosSeis;
        }
        if (valor_pronto.length >= 11){
            const ultimosdez = valor_pronto.substr(-10);
            const resto = valor_pronto.substr(0, valor_pronto.length - 10);
            valor_pronto = resto + '.' + ultimosdez;
        }
        valor_pronto = 'R$ ' + valor_pronto;
    }
    return  valor_pronto;

}

function limparDados(){
    var confir = window.confirm(`ATENÇÃO!\nEssa ação irá apagar todos os dados de transações!\nDeseja continuar?`)
    if(confir == true){
    localStorage.clear();
    }
    produtos = [];
    reescreveLista()
}

//Validação transaççao 
function adicionarTransacao(){
    //validando o form para o local Storage
    validarSelect()
    validarMercadoria()
    validarValor()
    if(validarValor() == ""){
        return false
    } 
    if(validarMercadoria() == ""){
        return false
    } 
    if(validarSelect() =="0"){
        return false
    } else{
    //setando produtos no localStorage
    let dados = {
        inputSelect: $novaTransacao.tipoTransacao.value,
        inputMercadoria: $novaTransacao.mercadoria.value,
        inputValor: $novaTransacao.moeda.value,
    };
    produtos.push(dados);
    reescreveLista()
    localStorage.setItem('produtos', JSON.stringify(produtos));
    document.querySelector(".formulario").reset();
    }

    somaExtrato()
    
}


//somar extrato para aparecer lucro ou prejuízo
function somaExtrato(){
    var total = 0;
    for (let i = 0; i < produtos.length; i ++) {
        //Replace R$ VOCÊ NÃO PODE SOMAR LETRAS RAFAEL!!!
        let valorSomado = parseFloat(produtos[i].inputValor.replace(/\./g, "").replace(/\,/g, ".").replace('R$ ',''));
         if(produtos[i].inputSelect != "2") {
             valorSomado *= -1;
         }
         total = total + valorSomado
    }
    return total
    
}

//Reescrevendo o extrato
function reescreveLista(){
    document.querySelector("#extratolinhas").innerHTML = ''
    for (let i = 0; i < produtos.length; i ++){
    var sinais = "+"
     if(produtos[i].inputSelect=="1"){
        sinais = "-"
     }        
     if(produtos.length >= 0){
        document.querySelector(".extratoh1").innerHTML =`Extrato de Transações.`
    }  
    document.querySelector("#extratolinhas").innerHTML += `
    <div class="linhas" id="linhas" onclick="removeItem(event, ` + i + `)">
    <span>` + sinais +`</span><p class="plinha">`+ produtos[i].inputMercadoria +`</p>
       <p class="valorex">` + produtos[i].inputValor + `</p>
       </div>
    `;
    }
    total = somaExtrato()
    lucroOuPrejuizo = "0"

    if(total < 0 ){
        lucroOuPrejuizo = "PREJUÍZO"
        $prejuizoVermelho.style.color = 'red';
    }if(total > 0){
        lucroOuPrejuizo = "LUCRO"
        $prejuizoVermelho.style.color = 'black';
    }

    total_escrito = "R$ "
    total_escrito += total.toLocaleString("pt-BR",)
    total_escrito = total_escrito.replace("-", "")

    document.querySelector('.resultado').innerHTML = total_escrito
    document.querySelector('#balanco').innerHTML = "[" + lucroOuPrejuizo + "]"
}

function removeItem(evt, index){
    //Splice remove um item da lista
    produtos.splice(index, 1);

    //salvando as remoções dos itens no localStorage pra atualizar a lista automaticamente
    localStorage.setItem('produtos',JSON.stringify(produtos));
    reescreveLista();
}

// Jogando os dados na Airtable API 

function salvarDados(){
    //chamar a requisição
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM"
        }
    })
    .then(response => response.json())
    .then(responseJson => {
        existe = responseJson.records.filter((record) => {
            if(aluno == record.fields.Aluno) {
                return true
            } 

            return false
        })
        if (existe.length == 0){
            insereDados()
        } else {
            alteraDados(existe[0].id)
        }
    })
}

function insereDados(){
    var json = JSON.stringify(produtos)

    var body = JSON.stringify({
        "records": [
            {
                "fields": {
                    "Aluno": aluno,
                    "Json": json,
                }
            }
        ]
    })
    
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",{
        method: "POST",
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            "Content-Type" : "application/json"
        },
        body:body
    })
}

function alteraDados(id){
    var json = JSON.stringify(produtos)

    var body = JSON.stringify({
        "records": [
            {
                "id": id,
                "fields": {
                    "Aluno": aluno,
                    "Json": json,
                }
            }
        ]
    })

    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",{
        method: "PATCH",
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            "Content-Type" : "application/json"
        },
        body:body
    })
}

function getTable(){
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM"
        }
    })
    .then(response => response.json())
    .then(responseJson => {
        existe = responseJson.records.filter((record) => {
            if(aluno == record.fields.Aluno) {
                return true
            } 

            return false
        })
        if (existe.length == 0) {
            produtos = []
        } else {
            produtos = JSON.parse(existe[0].fields.Json)
        }
        reescreveLista();
    })
}
