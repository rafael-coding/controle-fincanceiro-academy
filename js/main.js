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


//Variáveis globais e listeners
$iconeAbrirMenu.addEventListener('click', abrirMenu);
$iconeFecharMenu.addEventListener('click', fecharMenu);
$novaTransacao.tipoTransacao.addEventListener('change', validarSelect);
$novaTransacao.mercadoria.addEventListener('keyup', validarMercadoria);
$novaTransacao.moeda.addEventListener('keyup', validarValor);
$novaTransacao.moeda.addEventListener('input',(e) => {
    e.target.value = mascaraValor(e.target.value);
});

//chamando produtos no localStore
var produtos = JSON.parse(localStorage.getItem("produtos"));
if (produtos == null ) {
    produtos = []
}

//Chamando função para reenscrever lista após o refresh
reescreveLista();

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
    let valorFormatado = '';
    if (valorCampo === '0' || valorCampo === 'NaN') {
        valorFormatado = '';
    } else if (valorCampo.length === 1) {
        valorFormatado += '00' + valorCampo;
    } else if (valorCampo.length === 2) {
        valorFormatado += '0' + valorCampo;
    } else {
        valorFormatado = valorCampo;
    }
    if (valorFormatado.length > 0) {
        const doisUltimos = valorFormatado.substr(-2);
        const resto = valorFormatado.substr(0, valorFormatado.length - 2);
        valorFormatado = resto + ',' + doisUltimos;
        if (valorFormatado.length >= 7) {
            const ultimosSeis = valorFormatado.substr(-6);
            const resto = valorFormatado.substr(0, valorFormatado.length - 6);
            valorFormatado = resto + '.' + ultimosSeis;
        }
        if(valorFormatado.length >= 11){
            const ultimosdez = valorFormatado.substr(-10);
            const resto = valorFormatado.substr(0, valorFormatado.length - 10);
            valorFormatado = resto + '.' + ultimosdez;
        }
        valorFormatado = 'R$ ' + valorFormatado;
    }
    return valorFormatado;
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
    }

    somaExtrato()
}

//somar extrato para aparecer lucro ou prejuízo
function somaExtrato(){
    var total = 0
    for (let i = 0; i < produtos.length; i ++) {
        let valorSomado = parseFloat(produtos[i].inputValor.replace(/\./g, "").replace(/,/g, "."))
         if(produtos[i].inputSelect != "2") {
             valorSomado *= -1
         }
         total += total + valorSomado
    }
    return total
    console.log(total)
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
    document.querySelector('.resultado').innerHTML = total
}

function removeItem(evt, index){
    //Splice remove um item da lista
    produtos.splice(index, 1);

    //salvando as remoções dos itens no localStorage pra atualizar a lista automaticamente
    localStorage.setItem('produtos',JSON.stringify(produtos));
    reescreveLista();
}

