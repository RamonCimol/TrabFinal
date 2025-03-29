document.addEventListener('DOMContentLoaded', () => {
    const copiarBtn = document.getElementById("copiar");
    const novaSenhaBtn = document.getElementById("nova-senha");
    const senhaDisplay = document.getElementById("senha");
    const baixarBtn = document.getElementById("baixar-senha");
    const palavraInput = document.getElementById("palavra");
    const palavraChaveCheckbox = document.getElementById("palavra-chave");
    const maiusculasCheckbox = document.getElementById("maiúsculas");
    const minusculasCheckbox = document.getElementById("minúsculas");
    const numerosCheckbox = document.getElementById("números");
    const simbolosCheckbox = document.getElementById("símbolos");
    const tamanhoSenhaInput = document.getElementById("tamanho-senha");
    const valorTamanho = document.getElementById("valor-tamanho");
    const forcaDisplay = document.getElementById("forca-senha");
    const diminuirBtn = document.getElementById("diminuir");
    const aumentarBtn = document.getElementById("aumentar");
    const voltarSenhaBtn = document.getElementById("voltar-senha");
    const whatsappBtn = document.getElementById("whatsapp");

    let historicoSenhas = [];
    let indiceSenhaAtual = -1;

    // Atualiza o valor exibido do tamanho da senha
    tamanhoSenhaInput.addEventListener('input', () => {
        valorTamanho.textContent = tamanhoSenhaInput.value;
    });

    diminuirBtn.addEventListener('click', () => atualizarTamanho(-1));
    aumentarBtn.addEventListener('click', () => atualizarTamanho(1));

    function atualizarTamanho(incremento) {
        let novoValor = parseInt(tamanhoSenhaInput.value) + incremento;
        novoValor = Math.max(tamanhoSenhaInput.min, Math.min(tamanhoSenhaInput.max, novoValor));
        tamanhoSenhaInput.value = novoValor;
        valorTamanho.textContent = novoValor;
    }

    function avaliarForcaSenha(senha) {
        if (!senha) {
            forcaDisplay.textContent = "";
            forcaDisplay.className = "forca-senha";
            return;
        }

        const contemMaiuscula = /[A-Z]/.test(senha);
        const contemMinuscula = /[a-z]/.test(senha);
        const contemNumero = /[0-9]/.test(senha);
        const contemSimbolo = /[!@#$%&*_|+-?]/.test(senha);
        const tamanho = senha.length;

        if ((!contemMaiuscula || !contemMinuscula || !contemNumero || !contemSimbolo)) {
            forcaDisplay.textContent = "Fraca";
            forcaDisplay.className = "forca-senha fraca";
        } else if (tamanho < 12) {
            forcaDisplay.textContent = "Média";
            forcaDisplay.className = "forca-senha media";
        } else if (tamanho > 11 && contemMaiuscula && contemMinuscula && contemNumero && contemSimbolo) {
            forcaDisplay.textContent = "Forte";
            forcaDisplay.className = "forca-senha forte";
        }
    }

    function substituirPorNumeros(palavra) {
        const mapaSubstituicao = {
            a: "@", e: "&", i: "1", o: "8", s: "5", l: "|", t: "7"
        };
        return palavra
            .toLowerCase()
            .split("")
            .map(char => mapaSubstituicao[char] || char)
            .join("");
    }

    function gerarSenha() {
        let senha = "";
        const tamanho = parseInt(tamanhoSenhaInput.value);
        const palavra = palavraChaveCheckbox.checked ? palavraInput.value.toLowerCase() : "";

        limparErros();

        if (palavraChaveCheckbox.checked && (palavra.length < 2 || palavra.length > 10)) {
            mostrarErro(palavraInput, "A palavra-chave deve ter entre 2 e 10 caracteres.");
            return;
        }

        const caracteresMaiusculos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const caracteresMinusculos = "abcdefghijklmnopqrstuvwxyz";
        const numeros = "0123456789";
        const simbolos = "!@#$%&*_|+-?";

        let caracteresDisponiveis = "";
        let selecoesValidas = 0;

        if (maiusculasCheckbox.checked) {
            caracteresDisponiveis += caracteresMaiusculos;
            selecoesValidas++;
        }
        if (minusculasCheckbox.checked) {
            caracteresDisponiveis += caracteresMinusculos;
            selecoesValidas++;
        }
        if (numerosCheckbox.checked) {
            caracteresDisponiveis += numeros;
            selecoesValidas++;
        }
        if (simbolosCheckbox.checked) {
            caracteresDisponiveis += simbolos;
            selecoesValidas++;
        }

        if (selecoesValidas < 2) {
            mostrarErro([maiusculasCheckbox, minusculasCheckbox, numerosCheckbox, simbolosCheckbox], "Por favor, escolha pelo menos duas opções.");
            return;
        }

        for (let i = 0; i < tamanho; i++) {
            senha += caracteresDisponiveis.charAt(Math.floor(Math.random() * caracteresDisponiveis.length));
        }

        if (palavraChaveCheckbox.checked && palavra.length > 0) {
            const palavraAlterada = substituirPorNumeros(palavra);
            const posicaoAleatoria = Math.floor(Math.random() * senha.length);
            senha = senha.slice(0, posicaoAleatoria) + palavraAlterada + senha.slice(posicaoAleatoria);
            senha = senha.slice(0, tamanho);
        }

        senhaDisplay.value = senha;
        avaliarForcaSenha(senha);
        historicoSenhas.push(senha);
        indiceSenhaAtual = historicoSenhas.length - 1;
    }

    function voltarSenha() {
        if (historicoSenhas.length > 1 && indiceSenhaAtual > 0) {
            indiceSenhaAtual--;
            senhaDisplay.value = historicoSenhas[indiceSenhaAtual];
        } else {
            alert("Não há senhas anteriores disponíveis.");
        }
    }

  
    function mostrarErro(campos, mensagem) {
        if (Array.isArray(campos)) {
            campos.forEach(campo => {
                if (!campo.classList.contains("erro-input")) {
                    const erro = document.createElement("div");
                    erro.classList.add("erro");
                    erro.textContent = mensagem;
                    campo.parentElement.appendChild(erro);
                    campo.classList.add("erro-input");

                    campo.addEventListener("change", () => {
                        if (campo.checked) {
                            limparErros();
                        }
                    });
                }
            });
        } else {
            const erro = document.createElement("div");
            erro.classList.add("erro");
            erro.textContent = mensagem;
            campos.parentElement.appendChild(erro);
            campos.classList.add("erro-input");

            campos.addEventListener("change", () => {
                if (campos.checked) {
                    limparErros();
                }
            });
        }
    }

    function limparErros() {
        const erros = document.querySelectorAll('.erro');
        erros.forEach(erro => erro.remove());
        const camposErro = document.querySelectorAll('.erro-input');
        camposErro.forEach(campo => campo.classList.remove('erro-input'));
    }

    novaSenhaBtn.addEventListener('click', gerarSenha);
    copiarBtn.addEventListener('click', () => {
        senhaDisplay.select();
        document.execCommand("copy");
    });

    baixarBtn.addEventListener('click', () => {
        const blob = new Blob([senhaDisplay.value], { type: "text/plain" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "senha.txt";
        link.click();
    }); 

    novaSenhaBtn.addEventListener('click', gerarSenha);
    voltarSenhaBtn.addEventListener('click', voltarSenha);

    gerarSenha();
    
});

document.addEventListener('DOMContentLoaded', () => {
    const whatsappBtn = document.getElementById("whatsapp");
    const modal = document.getElementById("modal-whatsapp");
    const fecharModalBtn = document.getElementById("fechar-modal");
    const enviarCodigoBtn = document.getElementById("enviar-codigo");
    const confirmarCodigoBtn = document.getElementById("confirmar-codigo");
    const numeroInput = document.getElementById("numero-telefone");
    const erroTelefone = document.getElementById("erro-telefone");
    const codigoContainer = document.getElementById("codigo-container");                              
    const codigoInput = document.getElementById("codigo-verificacao");
    const erroCodigo = document.getElementById("erro-codigo");

    /* nome senha */
    const nomeContainer = document.getElementById("nome-container");
    const nomeSenha = document.getElementById("nome-senha");
    const enviarSenhaBtn = document.getElementById("enviar-senha");

    let codigoGerado = "";
    let telefone;

    whatsappBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    fecharModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
        numeroInput.disabled = false;
        codigoInput.disabled = false;
        limparCampos();
    });

    enviarCodigoBtn.addEventListener("click", () => {
        const telefone = numeroInput.value.trim();
        if (!validarTelefone(telefone)) {
            erroTelefone.textContent = "Número inválido. Use formato DDD"+
            "+ número (ex: 11987654321).";
            return;
        }
        //erro aqui
        erroTelefone.textContent = "";
        
        // Gerar código aleatório de 6 dígitos
        codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Enviar mensagem via WhatsApp
        const mensagem = `Seu código de verificação: *${codigoGerado}*. Use este código para confirmar seu número no site, retorne até ele e digite seu código.`;
        window.open(`https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`, "_blank");

        

        // Exibir campo para inserir código
        codigoContainer.style.display = "block";
    });

    confirmarCodigoBtn.addEventListener("click", () => {
        if (codigoInput.value.trim() !== codigoGerado) {
            erroCodigo.textContent = "Código incorreto. Tente novamente.";
            return;
        }
        erroCodigo.textContent = "";

        // Enviar segunda mensagem via WhatsApp
        telefone = numeroInput.value.trim();
        const mensagemSeguranca = "volte ao site para concluir, não esqueça de ativar a proteção em duas etapas no WhatsApp para maior segurança. Acesse: Configurações > Conta > Confirmação em duas etapas.";
        window.open(`https://wa.me/55${telefone}?text=${encodeURIComponent(mensagemSeguranca)}`, "_blank");

        //alert("Código confirmado! Mensagem de segurança enviada.");

        nomeContainer.style.display = "block";
        numeroInput.disabled = true;
        codigoInput.disabled = true;
        
        /*
        // Perguntar se deseja receber a senha via WhatsApp
        setTimeout(() => {
            const desejaReceberSenha = confirm("Deseja receber sua senha gerada via WhatsApp?");
            if (desejaReceberSenha) {
                enviarSenhaViaWhatsApp(telefone);
            } else {
                alert("Operação finalizada!");
            }
            modal.style.display = "none";
            limparCampos();
        }, 1000);
        */
    });

    enviarSenhaBtn.addEventListener("click", () => {
        console.log("enviar!")
        const senhaGerada = document.getElementById("senha").value;
        let nome;
        if(nomeSenha.value===""){
            nome = "sem nome";
        }else{
            nome = nomeSenha.value;
        }
        const mensagemSenha = `Sua senha *${nome}* está aqui: *${senhaGerada}*. Lembre-se de mantê-la segura!`;
        window.open(`https://wa.me/55${telefone}?text=${encodeURIComponent(mensagemSenha)}`, "_blank");
    });

    /*
    function enviarSenhaViaWhatsApp(numero) {
        const senhaGerada = document.getElementById("senha").value;
        const mensagemSenha = `Aqui está sua senha gerada: *${senhaGerada}*. Lembre-se de mantê-la segura!`;
        window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(mensagemSenha)}`, "_blank");
    }
    */

    function validarTelefone(numero) {
        return /^\d{2}\d{8,9}$/.test(numero);
    }

    function limparCampos() {
        numeroInput.value = "";
        erroTelefone.textContent = "";
        codigoInput.value = "";
        erroCodigo.textContent = "";
        codigoContainer.style.display = "none";
        codigoGerado = "";
    }
});
