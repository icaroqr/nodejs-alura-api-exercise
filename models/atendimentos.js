const conexao = require("../infraestrutura/conexao")
const moment = require("moment")

class Atendimento {
    adiciona(atendimento, res){
        const dataCriacao = moment().format("YYYY-MM-DD hh:mm:ss")
        const data = moment(atendimento.data, 'DD/MM/YYYY').format("YYYY-MM-DD hh:mm:ss")
        //Verifica se a data de agendamento é anterior a atual
        const dataIsValid = moment(data).isSameOrAfter(dataCriacao)
        //Verifica se o nome do cliente é valido
        const clienteIsValid = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: 'data',
                valido: dataIsValid,
                mensagem: 'Data deve ser maior ou igual a data atual',
            }, 
            {
                nome: 'cliente',
                valido: clienteIsValid,
                mensagem: 'O nome do cliente deve ter ao menos 5 caracteres',
            }, 
            
        ]

        const erros = validacoes.filter(item => !item.valido)
        const existemerros = erros.length

        if(existemerros){
            res.status(400).json(erros)
        }else{
            const atendimentoDatado = {...atendimento, dataCriacao, data}
            const sql = "INSERT INTO Atendimentos SET ?"
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if(erro){
                    res.status(400).json(erro)
                }else{
                    res.status(201).json({...atendimento, resultados})
                }
            })
        }
    }

    listaTodos(res){
        const sql = 'SELECT * FROM Atendimentos'

        conexao.query(sql, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json(resultados)
            }
        })
    }

    buscaPorId(id, res){
        const sql = `SELECT * FROM Atendimentos WHERE id =${id}`

        conexao.query(sql, (erro, resultados) => {
            const atendimento = resultados[0]
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json(atendimento)
            }
        })
    }

    altera(id, valores, res){
        if(valores.data){
            valores.data = moment(valores.data, 'DD/MM/YYYY').format("YYYY-MM-DD hh:mm:ss")
        }
        const sql = `UPDATE Atendimentos SET ? WHERE id=?`

        conexao.query(sql, [valores, id], (erro, resultados) =>{
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json({...valores, id})
            }
        }) 
    }

    deleta(id, res){
        const sql = "DELETE FROM Atendimentos WHERE id=?"

        conexao.query(sql, id, (erro, resultados)=>{
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json({id})
            }
        })
    }
}

module.exports = new Atendimento