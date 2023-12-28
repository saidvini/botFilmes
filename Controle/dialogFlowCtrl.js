import Pedido from "../Modelo/pedido.js";
import Servico from "../Modelo/servicos.js";
import { obterCardServicos } from "../funcoesDialogFlow/funcoesDLFlow.js";



export default class DialogFlowCtrl{


    processarIntencoes(req, res){

        if(req.method === 'POST'){
            const intencao = req.body.queryResult.intent.displayName;

            const origem = req.body?.originalDetectIntentRequest?.source;

            if(intencao == 'CriarChamado'){
                if(origem){
                    obterCardServicos('custom').then((listaCards) => {
                        let resDF = {
                            "fulfillmentMessages": []
                        }
                        resDF.fulfillmentMessages.push({
                            "text": {
                                "text": [
                                    "Bem vindo a Assistencia Técnica \n",
                                    "Esses são os nosso serviços de assistencia: \n"
                                ]
                            }
                        });
                        resDF.fulfillmentMessages.push(...listaCards);
                        resDF.fulfillmentMessages.push({
                            "text": {
                                "text": [
                                    "Qual assistencia deseja?",
                                ]
                            }
                        })
                        res.json(resDF);
                    }).catch((error) => {
                        let resDF = {
                            "fulfillmentMessages" : [{
                                "text": {
                                    "texto": [
                                        "Erro ao acessar os serviços: \n",
                                        "Não foi possível consultar!",
                                        "Pedimos desculpas pelo ocorrido!"
                                    ]
                                }
                            }]
                        }
                        res.json(resDF);
                    })
                }else{
                    obterCardServicos('messenger').then((listaCards) => {
                        let resDF = {
                            "fulfillmentMessages": []
                        }
                        resDF.fulfillmentMessages.push({
                            "payload": {
                                "richContent": [[{
                                    "type": "description",
                                    "title": "Bem vindo a Assistencia Técnica!",
                                    "text": [
                                        "Ficamos felizes de ver voce por aqui! \n",
                                        "Esses são os nosso serviços de assistencia: \n"
                                    ]
                                }]]
                            }
                        });
                        resDF.fulfillmentMessages[0].payload.richContent[0].push(...listaCards);
                        resDF.fulfillmentMessages[0].payload.richContent[0].push({
                                "type": "description",
                                "title": "Qual assistencia deseja?",
                                "text": []
                            });
                            res.json(resDF);
                    }).catch((error) => {
                        let resDF = {
                            "fulfillmentMessages": []
                        }
                        resDF.fulfillmentMessages.push({
                            "payload": {
                                "richContent": [[{
                                    "type": "description",
                                    "title": "Erro ao recuperar os serviços",
                                    "text": [
                                        "Não foi possível consultar!",
                                        "Pedimos desculpas pelo ocorrido! \n"
                                    ]
                                }]]
                            }
                        });
                    })
                }
            }else if(intencao === 'FimAtendimento'){
                let NomeCat;
                let prioridade;
                let nome;
                let email;

                for(const contexto of req.body.queryResult.outputContexts){
                    if(contexto.parameters.incidente){
                        NomeCat = contexto.parameters.incidente;
                    }
                    if(contexto.parameters.nivelprioridade){
                        prioridade = contexto.parameters.nivelprioridade;
                    }
                    if(contexto.parameters.person.name){
                        nome = contexto.parameters.person.name;
                    }
                    if(contexto.parameters.email){
                        email = contexto.parameters.email;
                    }
                    if (NomeCat && prioridade && nome && email) {
                        break;
                    }
                }

                const pedido = new Pedido(0, NomeCat, prioridade, nome, email);
                pedido.gravarPedido().then(()=> {
                    if(origem){
                        let resDF = {
                            "fulfillmentMessages": [{
                                "text": {
                                    "text": [
                                        `Pedido ${pedido.id} foi registrado com sucesso! \n`,
                                        `Agradecemos o seu contato!`
                                    ]
                                }
                            }]
                        }
                        res.json(resDF);
                    }else{
                        let resDF = {
                            "fulfillmentMessages": []
                        }
                        resDF.fulfillmentMessages.push({
                            "payload": {
                                "richContent": [[{
                                    "type": "description",
                                    "title": `Pedido nº ${pedido.id} foi registrado com sucesso! \n`,
                                    "text": [
                                        `Agradecemos o seu contato!`
                                    ]
                                }]]
                            }
                        });
                        res.json(resDF);
                    }
                }).catch((error) => {
                    if(origem){
                        let resDF = {
                            "fulfillmentMessages" : [{
                                "text": {
                                    "texto": [
                                        `Erro ao registar pedido!\n`,
                                        `Erro: ${error.message}`,
                                        `Agradecemos o seu contato!`
                                    ]
                                }
                            }]
                        }
                        res.json(resDF);
                    }else{
                        let resDF = {
                            "fulfillmentMessages": []
                        }
                        resDF.fulfillmentMessages.push({
                            "payload": {
                                "richContent": [[{
                                    "type": "description",
                                    "title": `Erro ao registar pedido!\n`,
                                    "text": [
                                        `Erro: ${error.message}`,
                                        `Agradecemos o seu contato!`
                                    ]
                                }]]
                            }
                        });
                    }
                })
            }else if(intencao === 'MostrarConsultaChamado'){
                let id;

                for(const contexto of req.body.queryResult.outputContexts){
                    if(contexto.parameters.number){
                        id = contexto.parameters.number;
                    }
                    if(id){
                        break;
                    }
                }

                const pedido = new Pedido(id);
                let resDF;

                pedido.ConsultarPedido(id).then((listaChamados) => {
                    // Aqui você pode formatar a lista de chamados como desejado
                    let resDF = {
                        "fulfillmentMessages": [{
                            "text": {
                                "text": []
                            }
                        }]
                    };
                
                    // Aqui você pode formatar a lista de chamados como desejado
                    if (listaChamados.length > 0) {
                        resDF.fulfillmentMessages[0].text.text.push("Aqui estão os detalhes do chamado:");
                
                        for (const chamado of listaChamados) {
                            resDF.fulfillmentMessages[0].text.text.push(
                                `ID: ${chamado.id}, Prioridade: ${chamado.NomeCat}, Nome: ${chamado.prioridade}, Email: ${chamado.nome}, Categoria: ${chamado.nomeCat}, Técnico: ${chamado.tecnico}, Prazo: ${chamado.prazo} Hora`
                            );
                        }
                    } else {
                        resDF.fulfillmentMessages[0].text.text.push("Nenhum chamado encontrado para o ID fornecido.");
                    }

                    res.json(resDF);
                }).catch((error) => {
                    let resDF = {
                        "fulfillmentMessages": [{
                            "text": {
                                "text": [
                                    `Erro ao consultar o chamado!\n`,
                                    `Erro: ${error.message}`,
                                ]
                            }
                        }]
                    };
                    res.json(resDF);
                });
            }
        }

    }
}