import ServicoDAO from "../Persistencia/servicoDAO.js";



export default class Servico{
    
    #idCat;
    #nomeCat;
    #prazo;
    #tecnico;


    get idCat(){
        return this.#idCat;
    }
    set idCat(idCat){
        this.#idCat = idCat;
    }
    get nomeCat(){
        return this.#nomeCat;
    }
    set nomeCat(nomeCat){
        this.#nomeCat = nomeCat;
    }
    get prazo(){
        return this.#prazo;
    }
    set prazo(prazo){
        this.#prazo = prazo;
    }
    get tecnico(){
        return this.#tecnico;
    }
    set tecnico(tecnico){
        this.#tecnico = tecnico;
    }

    constructor(idCat, nomeCat, prazo, tecnico){
        this.#idCat = idCat;
        this.#nomeCat = nomeCat;
        this.#prazo = prazo;
        this.#tecnico = tecnico;
    }

    toJSON(){
        return{
            'idCat': this.#idCat,
            'nomeCat': this.#nomeCat,
            'prazo': this.#prazo,
            'tecnico': this.#tecnico
        }
    }

    async consultar(termoBusca){
        const servicoDAO = new ServicoDAO();
        return await servicoDAO.consultar(termoBusca);
    }

}