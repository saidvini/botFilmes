import conectar from "./conexao.js";
import Servico from "../Modelo/servicos.js";


export default class ServicoDAO{


    async consultar(termoBusca){
        let sql = "";
        if(termoBusca){
            sql = `SELECT * FROM categoria WHERE NomeCat LIKE '%${termoBusca}%' `;
        }else{
            sql = `SELECT * FROM categoria`;
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql);
        let listaServicos = [];
        for(let registro of registros){
            let servico = new Servico(registro["idCat"], registro["NomeCat"], registro["prazo"], registro["tecnico"]);
            listaServicos.push(servico);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaServicos;
    }
}