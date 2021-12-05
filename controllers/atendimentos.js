module.exports = app => {
    app.get('/atendimentos', (req, res) => res.send("Rota de busca de atendimentos (GET)"))

    app.post('/atendimentos', (req, res) => {
        console.log(req.body)
        res.send("Você está na tota de cadastro atendimentos (POST)")
    })
}