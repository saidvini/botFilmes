import Pedido from "../Modelo/pedido.js"
import conectar from "./conexao.js"


export default class PedidoDAO{

    async gravar(pedido) {
        if (pedido instanceof Pedido) {
            const conexao = await conectar();
    
            try {
                const [registros] = await conexao.execute('SELECT idCat FROM categoria WHERE NomeCat LIKE ?', ['%' + pedido.NomeCat + '%']);
    
                if (registros.length > 0) {
                    const idCat = registros[0].idCat;
    
                    const [insercao] = await conexao.execute('INSERT INTO chamado (prioridade, nome, email, fk_categoria) VALUES (?,?,?,?);', [pedido.prioridade, pedido.nome, pedido.email, idCat]);
    
                    pedido.id = insercao.insertId;
                } else {
                    console.error(`Categoria não encontrada para o item: ${pedido.NomeCat}`);
                }
            } catch (error) {
                console.error(`Erro ao gravar chamado: ${error.message}`);
            } finally {
                global.poolConexoes.releaseConnection(conexao);
            }
        }
    }

    async consultar(pedido) {
        let sql = `
            SELECT c.*, cat.tecnico, cat.prazo, cat.NomeCat
            FROM chamado c
            INNER JOIN categoria cat ON c.fk_categoria = cat.idCat
            WHERE c.idChamado = ?
        `;
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql, [pedido]);
        let listaChamados = [];
        for (let registro of registros) {
            let chamado = new Pedido(
                registro["idChamado"],
                registro["prioridade"],
                registro["nome"],
                registro["email"],
                registro["fk_categoria"]
            );
            chamado.tecnico = registro["tecnico"];
            chamado.prazo = registro["prazo"];
            chamado.nomeCat = registro["NomeCat"];
            listaChamados.push(chamado);
        }
        global.poolConexoes.releaseConnection(conexao);
        return listaChamados;
    }
    
     
}