import Servico from "../Modelo/servicos.js"



export function criarMessengerCard(){
    return {
        type: "info",
        title: "",
        subtitle: "",
        image: {
            src: {
                rawUrl: ""
            }
        },
        actionLink: ""
    }
}

export function criarCustomCard(){
    return {
        card: {
            title: "",
            subtitle: "",
            imageUri: "",
            buttons: [
                {
                    text: 'botao',
                    postback: ""
                }
            ]
        }
    }
}

export async function obterCardServicos(tipoCard = 'custom'){
    const servicoModel = new Servico();
    const listaServicos = await servicoModel.consultar();
    const listaCards = [];
    for(const servico of listaServicos){
        let cartao;
        if(tipoCard == 'custom'){
            cartao = criarCustomCard();
            cartao.card.title = servico.nomeCat;
            cartao.card.subtitle = `Prazo: ${servico.prazo}, Tecnico: ${servico.tecnico}`
        }else{
            cartao = criarMessengerCard();
            cartao.title = servico.nomeCat;
            cartao.subtitle = `Prazo: ${servico.prazo}, Tecnico: ${servico.tecnico}`
        }
        listaCards.push(cartao);
    }
    return listaCards;
}   	