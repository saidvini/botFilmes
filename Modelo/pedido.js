import PedidoDAO from "../Persistencia/pedidoDAO.js";



export default class Pedido{


    #id;
    #NomeCat;
    #prioridade;
    #nome;
    #email;
    #itensPedidos;

    get id(){
        return this.#id;
    }
    set id(novoId){
        this.#id = novoId;
    }
    get NomeCat(){
        return this.#NomeCat;
    }
    set NomeCat(NomeCat){
        this.#NomeCat = NomeCat;
    }
    get prioridade(){
        return this.#prioridade;
    }
    set prioridade(novaPrioridade){
        this.#prioridade = novaPrioridade;
    }

    get nome(){
        return this.#nome;
    }
    set nome(novoNome){
        this.#nome = novoNome;
    }

    get email(){
        return this.#email;
    }
    set email(novoEmail){
        this.#email = novoEmail;
    }

    get itensPedidos(){
        return this.#itensPedidos;
    }
    set itensPedidos(novosItens){
        this.#itensPedidos = novosItens;
    }

    constructor(id = 0, NomeCat, prioridade, nome, email, itensPedidos=[]){
        this.#id = id;
        this.#NomeCat = NomeCat;
        this.#prioridade = prioridade;
        this.#nome = nome;
        this.#email = email;
        this.#itensPedidos = itensPedidos;
    }

    toJSON(){
        return{
            'id': this.#id,
            'prioridade': this.#prioridade,
            'nome': this.#nome,
            'email': this.#email,
            'itensPedido': this.#itensPedidos
        }
    }

    async gravarPedido(){
        const pedidoDAO = new PedidoDAO();
        return await pedidoDAO.gravar(this);
    }

    async ConsultarPedido(pedido){
        const pedidoDAO = new PedidoDAO();
        return await pedidoDAO.consultar(pedido);
    }

    
}