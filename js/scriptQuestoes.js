data = catchDadosUrl()
atual = 0;

// Auxiliares para o post
dados_flag = []
dados_i = 0


// Pega as chaves e valores da url
function catchDadosUrl() {
  var query = location.search.slice(1)
  var partes = query.split('&')
  var data = {}
  partes.forEach(function (parte) {
    var chaveValor = parte.split('=')
    var chave = chaveValor[0]
    var valor = chaveValor[1]
    data[chave] = valor
  })

  return data
}




mountQuiz = () => {

  var quiz = document.getElementById('quiz');

  while (quiz.firstChild) {
    quiz.removeChild(quiz.firstChild);
  } //remove o conteudo da div

  console.log(dados)

  const index = dados.map(x => x.id_video).indexOf(data.id);

  let q = dados[index].questoes[atual];

  if (q.modelo === 'sequencia')
    mountSequencia(q);
  else if (q.modelo === 'alternativa')
    mountAlternativa(q);
  else if (q.modelo === 'pares')
    mountToquePares(q);


  let confirmar = document.getElementById('confirmar');

  confirmar.addEventListener('click', () => {

    atual = atual + 1;
    aux_alert = (atual == dados[index].questoes.length)

    // Armazena o id no post
    str_aux = 'id'.concat(dados_i)
    dados_flag.push({key: str_aux, value: q.id_pergunta})
    console.log(dados_flag)
    if (q.modelo === 'sequencia') {
      checarRespostaSequencia(q);
    }
    else if (q.modelo === 'alternativa') {
      checarRespostaAlternativa(q);
    }
    else {
      checarRespostaToquePares(q);
    }

    if(atual < dados[index].questoes.length)
      mountQuiz();
  });

}

checarRespostaToquePares = ()  => {
  if(respondidos.length === nPares * 2) {//se todas as alternativas foram marcadas como respondidas
    //Carregar modal de acerto

    // Adiciona a flag no post
    str_aux = 'flag'.concat(dados_i)
    dados_flag.push({key: str_aux, value: 1})
    console.log(dados_flag)
    dados_i = dados_i + 1

    alertResposta(true);
  }
  else {
    //Carregar modal de erro

    str_aux = 'flag'.concat(dados_i)
    dados_flag.push({key: str_aux, value: 0})
    console.log(dados_flag)
    dados_i = dados_i + 1

    alertResposta(false);
  }

  resetToquePares();
}

function checarRespostaSequencia(sequencia) {
  formatar()

  let flag = true

  alternativas = sequencia.alternativas

  for (i = 0; i < nAlternativas; i++) {
    if ((formatado.indexOf(formatado[i]) + 1) != alternativas.find(x => x.texto == formatado[i]).posicao) {
      flag = false
    }
  }
  
  // Adiciona a flag no post
  str_aux = 'flag'.concat(dados_i)
  dados_flag.push({key: str_aux, value: (flag ? 1 : 0)})
  console.log(dados_flag)
  dados_i = dados_i + 1

  alertResposta(flag)
}

function checarRespostaAlternativa(alt) {
  let flag = true

  let num = parseInt(alternativa.substr(3, 1))

  flag = alt.alternativas[num - 1].resposta

  // Adiciona a flag no post
  str_aux = 'flag'.concat(dados_i)
  dados_flag.push({key: str_aux, value: (flag ? 1 : 0)})
  console.log(dados_flag)
  dados_i = dados_i + 1

  alertResposta(flag)
}


// Alerta de resposta certa
function alertResposta(flag) {
  if (aux_alert) {
    for (i = 0; i < dados_flag.length; i++) {
      url_redirecionamento = url_redirecionamento + '&id' + i + '=' + dados_flag[i]['value']
      url_redirecionamento = url_redirecionamento + '&flag' + i + '=' + dados_flag[++i]['value']
    }
    console.log(url_redirecionamento)
    if (flag) {
      Swal.fire({
        imageUrl: 'img/vovoCorreto.png',
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: 'Correto',
        animation: false,
        confirmButtonColor: '#3e9b8a',
        confirmButtonText: 'Continuar'
      }).then((result) => {
        Swal.fire({
          imageUrl: 'img/vovoConcluido.png',
          imageWidth: 300,
          imageHeight: 300,
          imageAlt: 'Incorreto',
          animation: false,
          confirmButtonColor: '#3e9b8a',
          confirmButtonText: 'Voltar'
        }).then((result) => {
          if (result.value) {
            window.location.href = url_redirecionamento
          }
        })
      })
    }
    else {
      Swal.fire({
        imageUrl: 'img/vovoIncorreto.png',
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: 'Incorreto',
        animation: false,
        confirmButtonColor: '#3e9b8a',
        confirmButtonText: 'Continuar'
      }).then((result) => {
        Swal.fire({
          imageUrl: 'img/vovoConcluido.png',
          imageWidth: 300,
          imageHeight: 300,
          imageAlt: 'Incorreto',
          animation: false,
          confirmButtonColor: '#3e9b8a',
          confirmButtonText: 'Voltar'
        }).then((result) => {
          if (result.value) {
            window.location.href = url_redirecionamento
          }
        })
      })      
    }
  }
  else if (flag == true) {
    Swal.fire({
      imageUrl: 'img/vovoCorreto.png',
      imageWidth: 300,
      imageHeight: 300,
      imageAlt: 'Correto',
      animation: false,
      confirmButtonColor: '#3e9b8a',
      confirmButtonText: 'Continuar'
    })
  }
  else {
    Swal.fire({
      imageUrl: 'img/vovoIncorreto.png',
      imageWidth: 300,
      imageHeight: 300,
      imageAlt: 'Incorreto',
      animation: false,
      confirmButtonColor: '#3e9b8a',
      confirmButtonText: 'Continuar'
    })
  }
}