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


//Variáveis globais e listeners
$iconeAbrirMenu.addEventListener('click', abrirMenu);
$iconeFecharMenu.addEventListener('click', fecharMenu);
$novaTransacao.tipoTransacao.addEventListener('change', validarSelect);
$novaTransacao.mercadoria.addEventListener('keyup', validarMercadoria);
$novaTransacao.moeda.addEventListener('keyup', validarValor);
$novaTransacao.moeda.addEventListener('input',(e) => {
    e.target.value = mascaraValor(e.target.value);
});
var produtos = JSON.parse(localStorage.getItem("produtos"));

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
        $novaTransacao.mercadoria.style.marginBottom = '0px'
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
    } else {
        $valorErro.style.display = 'none';
        $novaTransacao.moeda.style.border = '1px solid #979797';
        $novaTransacao.moeda.style.marginBottom = '20px';
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
        valorFormatado = 'R$ ' + valorFormatado;
    }
    return valorFormatado;
}

//Validação transaççao
function adicionarTransacao(){
    let dados = {
        inputSelect: $novaTransacao.tipoTransacao.value,
        inputMercadoria: $novaTransacao.mercadoria.value,
        inputValor: $novaTransacao.moeda.value,
    };
    localStorage.setItem('dados', JSON.stringify(dados));
    dadosJ();
}
function dadosJ(){
    console.log(JSON.parse(localStorage.getItem('dados')));

};



/*
function adicionarTransacao() {
    const validacaoTipo = validarSelect();
    const validacaoMercadoria = validarMercadoria();
    const validacaoValor = validarValor();
    if (validacaoTipo && validacaoMercadoria && validacaoValor) {
        const tipoTransacaoAtual = $novaTransacao.tipoTransacao.value;
        const mercadoriaTransacaoAtual = $novaTransacao.mercadoria.value;
        const valorTransacaoAtual = (tipoTransacaoAtual === 'venda')
            ? formatarValorRealParaMaquina(novaTransacao.valor.value.substr(3))
            : 0 - formatarValorRealParaMaquina(novaTransacao.valor.value.substr(3));
        transacoes.push({
            tipo: tipoTransacaoAtual,
            mercadoria: mercadoriaTransacaoAtual,
            valor: valorTransacaoAtual
        });
        salvarDadosLocalStorage();
        atualizarExtrato();
        calcularTotal();
        //limparCampos();
    }
} */


/*
adicionando, mas sobreescrevendo
function adicionarTransacao(){

    let dados = [{
        inputSelect: $novaTransacao.tipoTransacao.value,
        inputMercadoria: $novaTransacao.mercadoria.value,
        inputValor: $novaTransacao.moeda.value,
    }];
    localStorage.setItem('dados', JSON.stringify(dados));
    dadosJ();
}
function dadosJ(){
    console.log(JSON.parse(localStorage.getItem('dados')));

};  */
