# Introdução

Informações básicas do projeto.

* **Projeto:** envelhecerdigital
* **Repositório GitHub:** [LINK PARA O REPOSITÓRIO NO GITHUB]
* **Membros da equipe:**

  * [Anthony](https://github.com/anthonyfreitasborges) 
  * [Fábio Garcia](https://github.com/Fabiogarcia02) 
  * [ Francisco Sacchetto](https://github.com/cicrano) 
  * [João Pedro](https://github.com/fulano) 
  * [João Vitor Porto Lorencini](https://github.com/jvplorencini) 
  * [Caio Vieira Da Costa Leal](https://github.com/cronos-caio-vieira/gamifica-o.git)

A documentação do projeto é estruturada da seguinte forma:

1. Introdução :
2. Contexto: 
3. Product Discovery 
4. Product Design
5. Metodologia
6. Solução
7. Referências Bibliográficas

# Contexto

Nosso grupo ficou responsável por desenvolver uma solução que auxilie na acessibilidade digital para idosos nas redes sociais e nos principais aplicativos que eles usam. Para isso, elaboramos uma pesquisa para entender as principais dificuldades enfrentadas por esse público.Durante a investigação, entrevistamos pessoas idosas para saber como se sentem ao usar tecnologias digitais. Observamos que muitos se sentem excluídos do ambiente digital e encontram obstáculos tanto em atividades simples, como fazer transferências bancárias, quanto em momentos de lazer. Muitos precisam recorrer à ajuda de familiares, o que gera desconforto e sensação de incapacidade. Assim sendo, decidimos criar uma aplicação web simples, dinâmica e eficaz, com a proposta de ensinar os idosos a utilizar os principais aplicativos de redes sociais e bancos, como a Caixa e o Banco do Brasil por exemplo.
Como nosso projeto é voltado para idosos que têm dificuldades em utilizar tecnologias digitais, o objetivo é tornar esse ambiente mais acessível para eles.

## Problema

Muitos idosos enfrentam dificuldades para utilizar tecnologias digitais, especialmente aplicativos de redes sociais e bancos, o que os leva a depender da ajuda de terceiros e gera sentimentos de exclusão, insegurança e incapacidade no uso do ambiente digital.


## Objetivos

Desenvolver uma aplicação web simples, dinâmica e acessível que auxilie idosos a utilizarem os principais aplicativos de redes sociais e bancos, promovendo inclusão digital e autonomia no uso da tecnologia.
>

## Justificativa

Com o avanço da tecnologia e a digitalização de serviços essenciais, como bancos e redes sociais, muitos idosos têm enfrentado dificuldades para acompanhar essas mudanças. Esse público, em grande parte, não foi incluído no processo de alfabetização digital, o que gera exclusão, dependência de terceiros e sentimentos de insegurança ao utilizar esses recursos.po.

## Público-Alvo

Idosos que possuem dificuldades em utilizar tecnologias digitais


## Etapa de Entendimento


>
> * **Matriz CSD**:
>   ![image](https://github.com/user-attachments/assets/ece3ae1d-1013-40bf-a94d-03277b06ec2a)

> * **Mapa de stakeholders**:
>   ![image](https://github.com/user-attachments/assets/018f2fda-5fd2-44ca-ae13-c844f56eabf9)

> * *Entrevistas qualitativas*:
>   ![image](https://github.com/user-attachments/assets/8c2f5db1-a02f-4cb9-9e67-f5ed8a7dc101)
>   
> * *Highlights de pesquisa*:
>   ![image](https://github.com/user-attachments/assets/b96d4f79-c484-4054-a365-cccd4ee62ef7)

### Personas

![image](https://github.com/user-attachments/assets/0b53e55b-2130-473c-8756-6766b4c44d4b)
![image](https://github.com/user-attachments/assets/c1c8fc41-4bbb-456a-94e3-b5f2986b1dff)
![image](https://github.com/user-attachments/assets/5d758ee3-aab2-48c6-b87c-ab32996e3cfb)


## Histórias de Usuários

![image](https://github.com/user-attachments/assets/5110cbdf-cdcd-4b51-97f0-822fb4187e8c)

## Proposta de Valor

![image](https://github.com/user-attachments/assets/257bef66-7544-4967-8583-28b536ad31c8)

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais
| ID     | Descrição do Requisito                                                                            | Prioridade |
| ------ | ------------------------------------------------------------------------------------------------- | ---------- |
| RF-001 | Permitir que o usuário faça login com nome de usuário e senha.                                    | ALTA       |
| RF-002 | Exibir instruções claras e acessíveis antes de iniciar cada jogo.                                 | ALTA       |
| RF-003 | Permitir que o idoso selecione entre os jogos disponíveis: quiz, jogo da memória e caça-palavras. | ALTA       |
| RF-004 | Registrar a pontuação de cada usuário ao final de cada jogo.                                      | ALTA       |
| RF-005 | Exibir um ranking com os melhores desempenhos dos usuários nos diferentes jogos.                  | MÉDIA      |
| RF-006 | Armazenar os dados dos usuários e suas pontuações utilizando JSON Server.                         | ALTA       |
| RF-007 | Exibir uma tela com as conquistas desbloqueadas pelo usuário.                                     | MÉDIA      |
| RF-008 | Permitir filtragem de conquistas por tipo de jogo (quiz, memória ou caça-palavras).               | MÉDIA      |
| RF-009 | Implementar um sistema de metas e níveis com base na pontuação obtida nos jogos.                  | ALTA       |
| RF-010 | Oferecer feedback visual e sonoro durante os jogos para reforço positivo.                         | MÉDIA      |


### Requisitos não Funcionais
| ID      | Descrição do Requisito                                                                                | Prioridade |
| ------- | ----------------------------------------------------------------------------------------------------- | ---------- |
| RNF-001 | O sistema deve ser responsivo, adaptando-se a diferentes tamanhos de tela (desktop, tablet, celular). | ALTA       |
| RNF-002 | A interface deve ser simples, intuitiva e com elementos visuais adequados para idosos.                | ALTA       |
| RNF-003 | O carregamento das páginas deve ocorrer em até 3 segundos em redes comuns.                            | MÉDIA      |
| RNF-004 | O sistema deve funcionar em navegadores modernos como Chrome, Firefox e Edge.                         | ALTA       |
| RNF-005 | As informações de pontuação e conquistas devem ser persistidas localmente via JSON Server.            | ALTA       |
| RNF-006 | Deve conter texto com fonte ampliada e bom contraste de cores para acessibilidade.                    | ALTA       |
| RNF-007 | A navegação entre as telas deve ser fluida e funcionar corretamente após o login.                     | MÉDIA      |
| RNF-008 | O sistema deve armazenar os dados de login localmente para manter a sessão ativa durante o uso.       | MÉDIA      |


## Projeto de Interface

Artefatos relacionados com a interface e a interacão do usuário na proposta de solução.

### Wireframes

Estes são os protótipos de telas do sistema.

Imagem da página de home

![Exemplo de wireframe](images/home.jpg)

Imagem da página de login

![Exemplo de wireframe](images/login.jpg)

Imagem da página com jogos divertidos e educativos

![Exemplo de wireframe](images/jogos.jpg)

Imagem da página com as conquistas adquiridas nos jogos

![Exemplo de wireframe](images/conquistas.jpg)

Imagem da página com os tutoriais para cada dúvida e dificuldade dos idosos

![Exemplo de wireframe](images/tutoriais.jpg)

### User Flow

![image](https://github.com/user-attachments/assets/4270f2f0-96a0-4f75-b45c-25d5e270642f)



### Protótipo Interativo

✅ [Protótipo Interativo (Figma)](https://www.figma.com/proto/NwIAn7SpSR8UA2bTcbS95L/Untitled?node-id=1-1743&p=f&t=0ThCFXdTcf1R02HR-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A1618)

# Metodologia

Nos do grupo do projeto EnvelhecerDigital opetamos por ultilizar os principios da metodologia agil scrum, em algum dia da semana nos reunimos para saber como esta o andamento do trabalho e o que nos podemos fazer para ajudar o trabalho a ser feito mais rapido, uma das ideias foi separa  com papéis divididos com base nas competências e interesses individuais é assim fizemos a tabela:

| integrante   |  Função  |
| ------------ | -------- |
| Anthony      | Desenvolvimento Front-end |
| Fabio        | Designer UX/UI, apoi no Front-end |
| Francisco    | Desenvolvimento Front-end, pesquisa sobre como fazer jogos com js         |
| João Pedro   | Designer UX/UI |
| João Vitor   | Pesquisa e criação de jogos com js, apoio no Front-end |

O acompanhamento das tarefas foi feito através de um quadro Kanban no trello, estruturado em colunas representando o progresso das atividades.

## Ferramentas

Relação de ferramentas empregadas pelo grupo durante o projeto.

| Ambiente                    | Plataforma         | Link de acesso                                     |
| --------------------------- | ------------------ | -------------------------------------------------- |
| Processo de Design Thinking | Miro               | https://miro.com/app/dashboard/       |
| Repositório de código       | GitHub             | https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2025-1-ti1-0385100-envelhecerdigital |
| Protótipo Interativo        | Figma              | https://www.figma.com/design/NwIAn7SpSR8UA2bTcbS95L/Untitled?node-id=0-1&p=f&t=pAvYgJBmjWdhqCcp-0 |
| Editor de Código            | Visual Studio Code | - |
| Comunicação                 | Discord e WhatsApp | - |
| Gerenciamento de Tarefas    | Trello             | https://trello.com/b/I8ZQLtsw/kanban-quadro-modelo |

## Gerenciamento do Projeto
👍
Divisão de papéis no grupo e apresentação da estrutura da ferramenta de controle de tarefas (Kanban).

![Exemplo de Kanban](images/kanban-trello_1.png)![Exemplo de Kanban](images/kanban-trello_2.png)
>
# Solução Implementada

Esta seção apresenta todos os detalhes da solução criada no projeto.

## Vídeo do Projeto

O vídeo a seguir traz uma apresentação do problema que a equipe está tratando e a proposta de solução. ⚠️ EXEMPLO ⚠️

[![Vídeo do projeto](images/video.png)](https://www.youtube.com/embed/70gGoFyGeqQ)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> O video de apresentação é voltado para que o público externo possa conhecer a solução. O formato é livre, sendo importante que seja apresentado o problema e a solução numa linguagem descomplicada e direta.
>
> Inclua um link para o vídeo do projeto.

## Funcionalidades

##### Funcionalidade 1 -Carrosel de jogos 

Uma seção que quando usuario clicar em jogar ira redirecionar para a pagina de jogo especifica.

* **Estrutura de dados:** [Contatos](#ti_ed_contatos)
* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse a pagina  principal e escolha a um dos jogos do carrosel
 
* **Tela da funcionalidade**:

![image](https://github.com/user-attachments/assets/a913bc34-0238-42e9-8ae5-be8ac022e195)


##### Funcionalidade 2 - Jogo da memoria

Permite o usuario exercitar a sua memoria jogando o jogo da memoria 

* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o jogo da memoria pelo carrosel
* **Tela da funcionalidade**:
<img width="325" alt="{77A56033-07F1-43C6-B2D5-D97C12A80A46}" src="https://github.com/user-attachments/assets/2b2d0907-8934-4aa5-b43a-c6f0b28fb41e" />

##### Estrutura de Dados - jogo da memoria  

Contatos da aplicação

```json
{
      "id": "1",
      "tipo": "jogo-memoria",
      "niveis": [
        {
          "id": 1,
          "nivel": 1,
          "cartas": [
            {
              "id": 1,
              "imagem": "assets/images/img-memoria/spotify.png",
              "descricao": "Rádio na internet onde você pode ouvir músicas de todos os tipos, quando quiser"
            },
            {
              "id": 2,
              "imagem": "assets/images/img-memoria/youtube.png",
              "descricao": "Aplicativo para assistir a vídeos de todos os tipos, a qualquer hora que quiser"
            },
            {
              "id": 3,
              "imagem": "assets/images/img-memoria/netflix.png",
              "descricao": "Aplicativo de streaming"
            },
            {
              "id": 4,
              "imagem": "assets/images/img-memoria/tiktok.png",
              "descricao": "Aplicativo onde as pessoas fazem vídeos curtos e divertidos"
            },
            {
              "id": 5,
              "imagem": "assets/images/img-memoria/maps.png",
              "descricao": "Ajuda a encontrar lugares e traçar caminhos"
            },
            {
              "id": 6,
              "imagem": "assets/images/img-memoria/googlefotos.png",
              "descricao": "Guarda todas as fotos de forma segura na internet"
            },
            {
              "id": 7,
              "imagem": "assets/images/img-memoria/uber.png",
              "descricao": "Aplicativo para pedir carro com motorista, seguro e fácil"
            },
            {
              "id": 8,
              "imagem": "assets/images/img-memoria/ifood.png",
              "descricao": "Aplicativo que serve para pedir comida pronta, sem sair de casa."
            },
            {
              "id": 9,
              "imagem": "assets/images/img-memoria/instagram.png",
              "descricao": "Aplicativo para ver e compartilhar fotos, vídeos e mensagens com amigos e familiares"
            },
            {
              "id": 10,
              "imagem": "assets/images/img-memoria/globoplay.png",
              "descricao": "Usado para ver novelas, jornais, programas e filmes da Globo."
            },
            {
              "id": 11,
              "imagem": "assets/images/img-memoria/amazon.png",
              "descricao": "Aplicativo onde os produtos são entregues na porta da sua casa, um shopping virtual"
            },
            {
              "id": 12,
              "imagem": "assets/images/img-memoria/olx.png",
              "descricao": "Um site e aplicativo onde as pessoas podem comprar e vender coisas usadas"
            }
          ]
        },
        {
          "nivel": 2,
          "cartas": [
            {
              "imagem": "teste",
              "descricao": "teste"
            },
            {
              "imagem": "teste",
              "descricao": "teste"
            },
            {
              "imagem": "teste",
              "descricao": "teste"
            },
            {
              "imagem": "teste",
              "descricao": "teste"
            },
            {
              "imagem": "teste",
              "descricao": "teste"
            },
            {
              "imagem": "teste",
              "descricao": "teste"
            },
            {
              "imagem": "teste",
              "descricao": "teste"
            },
            {
              "imagem": "teste",
              "descricao": "teste"
            },
            {
              "imagem": "teste",
              "descricao": "teste"
            },
            {
              "imagem": "tetset",
              "descricao": "tetse"
            },
            {
              "imagem": "tetse",
              "descricao": "teste"
            },
            {
              "imagem": "reste",
              "descricao": "teste"
            }
          ]
        }
      ]
    },
```




##### Funcionalidade 3 - Caça palavras 


* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o jogo pelo carrosel 

* **Tela da funcionalidade**:

![image](https://github.com/user-attachments/assets/d23b52f2-9271-464b-9bdd-8ab7f9c2bedb)


## Estruturas de Dados caça palavras

```json
{
      "id": "2",
      "tipo": "caca-palavras",
      "niveis": [
        {
          "id": 1,
          "titulo": "Caça-palavras",
          "nivel": 1,
          "palavras": [
            "SENHA",
            "LOGIN",
            "USUÁRIO",
            "ACESSO",
            "CONTA",
            "PÁGINA",
            "AJUDA",
            "BOTÃO"
          ]
        },
        {
          "id": 2,
          "titulo": "Caça-palavras",
          "nivel": 2,
          "palavras": [
            "CAIXA",
            "BRADESCO",
            "EXTRATO",
            "PIX",
            "SALDO",
            "AGÊNCIA",
            "TRANSFERÊNCIA",
            "DEPÓSITO"
          ]
        },
        {
          "id": 3,
          "titulo": "Caça-palavras",
          "nivel": 3,
          "palavras": [
            "SITE",
            "OLX",
            "NAVEGAR",
            "MENU",
            "FONTE",
            "CONTRASTE",
            "LINK",
            "TELA"
          ]
        },
        {
          "id": 4,
          "titulo": "Caça-palavras",
          "nivel": 4,
          "palavras": [
            "APLICATIVO",
            "DOWNLOAD",
            "WHATSAPP",
            "TELAFÁCIL",
            "SOM",
            "VOZ",
            "TOQUE",
            "TUTORIAL"
          ]
        },
        {
          "id": 5,
          "titulo": "Caça-palavras",
          "nivel": 5,
          "palavras": [
            "SENHA",
            "SEGURANÇA",
            "CONFIRMAR",
            "VERIFICA",
            "AUTENTICA",
            "RECUPERA",
            "CÓDIGO",
            "ACESSÍVEL"
          ]
        },
        {
          "id": 6,
          "titulo": "Caça-palavras",
          "nivel": 6,
          "palavras": [
            "BANCO",
            "AGENDAMENTO",
            "CONSULTA",
            "SALDO",
            "DEPÓSITO",
            "EXTRATO",
            "PAGAMENTO",
            "FATURA"
          ]
        },
        {
          "id": 7,
          "titulo": "Caça-palavras",
          "nivel": 7,
          "palavras": [
            "SITE",
            "AJUDA",
            "MENU",
            "TECLADO",
            "MOUSE",
            "TELA",
            "ACESSO",
            "FUNÇÃO"
          ]
        },
        {
          "id": 8,
          "titulo": "Caça-palavras",
          "nivel": 8,
          "palavras": [
            "APP",
            "VOZ",
            "TOQUE",
            "AJUSTE",
            "CONFIG",
            "INSTRUTOR",
            "TELAFÁCIL",
            "TELAFUNDO"
          ]
        },
        {
          "id": 9,
          "titulo": "Caça-palavras",
          "nivel": 9,
          "palavras": [
            "SENHA",
            "VALIDAÇÃO",
            "AUTENTICA",
            "SEGURANÇA",
            "CONFIRMA",
            "CÓDIGO",
            "ACESSO",
            "PRIVACIDADE"
          ]
        },
        {
          "nivel": 10,
          "palavras": [
            "BANCO",
            "TRANSFERÊNCIA",
            "PIX",
            "EXTRATO",
            "PAGAMENTO",
            "AGÊNCIA",
            "CARTÃO",
            "SALDO"
          ]
        }
      ]
    },
```


##### Funcionalidade 4 - Quiz 

* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o jogo pelo carrosel da pagina  principal 

* **Tela da funcionalidade**:

![image](https://github.com/user-attachments/assets/ba1826fa-8c3f-4e34-a690-dd70b59dcfe7)


## Estruturas de Dados do quiz

```json
     {
      "id": "3",
      "tipo": "quiz",
      "niveis": [
        {
          "id": 1,
          "nivel": 1,
          "pergunta": "Como você pode identificar se um e-mail é falso (golpe)?",
          "respostas": [
            {
              "texto": "Se o e-mail tem muitas imagens bonitas",
              "correta": false
            },
            {
              "texto": "Se o remetente é desconhecido e pede dados pessoais",
              "correta": true
            },
            {
              "texto": "Se o e-mail começa com “Olá, tudo bem?”",
              "correta": false
            },
            {
              "texto": "Se o e-mail tem letras grandes",
              "correta": false
            },
            {
              "texto": "Se o e-mail fala sobre promoções",
              "correta": false
            },
            {
              "texto": "Se o e-mail vem de um banco conhecido",
              "correta": false
            }
          ],
          "erros": 0
        },
        {
          "id": 2,
          "nivel": 2,
          "pergunta": "Qual é o lugar mais seguro para guardar suas senhas?",
          "respostas": [
            {
              "texto": "Escrever num papel e deixar perto do computador",
              "correta": false
            },
            {
              "texto": "Enviar por WhatsApp para alguém de confiança",
              "correta": false
            },
            {
              "texto": "Salvar em um bloco de notas no celular",
              "correta": false
            },
            {
              "texto": "Decorar ou usar um gerenciador de senhas seguro",
              "correta": true
            },
            {
              "texto": "Colar em um post-it na geladeira",
              "correta": false
            },
            {
              "texto": "Compartilhar com familiares em um grupo do WhatsApp",
              "correta": false
            }
          ],
          "erros": 0
        },
        {
          "id": 3,
          "nivel": 3,
          "pergunta": "O que é necessário para fazer uma videochamada?",
          "respostas": [
            {
              "texto": "Um rádio ligado",
              "correta": false
            },
            {
              "texto": "Uma televisão com antena",
              "correta": false
            },
            {
              "texto": "Um telefone de disco",
              "correta": false
            },
            {
              "texto": "Um computador ou celular com câmera e internet",
              "correta": true
            },
            {
              "texto": "Um ventilador ligado",
              "correta": false
            },
            {
              "texto": "Um controle remoto com pilhas novas",
              "correta": false
            }
          ],
          "erros": 0
        },
        {
          "id": 4,
          "nivel": 4,
          "pergunta": "O que significa clicar em um 'link suspeito'?",
          "respostas": [
            {
              "texto": "Ver uma imagem engraçada",
              "correta": false
            },
            {
              "texto": "Abrir uma foto de família",
              "correta": false
            },
            {
              "texto": "Clicar em algo que pode levar a um golpe ou vírus",
              "correta": true
            },
            {
              "texto": "Jogar um joguinho online",
              "correta": false
            },
            {
              "texto": "Receber um presente virtual",
              "correta": false
            },
            {
              "texto": "Ler uma receita de bolo",
              "correta": false
            }
          ],
          "erros": 0
        },
        {
          "id": 5,
          "nivel": 5,
          "pergunta": "Para fazer uma compra online com segurança, é importante:",
          "respostas": [
            {
              "texto": "Comprar de qualquer site que apareça",
              "correta": false
            },
            {
              "texto": "Clicar em propagandas de redes sociais",
              "correta": false
            },
            {
              "texto": "Passar o cartão por telefone para o vendedor",
              "correta": false
            },
            {
              "texto": "Usar sites confiáveis e verificar se tem 'cadeado' na barra de endereço",
              "correta": true
            },
            {
              "texto": "Pedir para o vizinho comprar para você",
              "correta": false
            },
            {
              "texto": "Só pagar depois que o produto chegar",
              "correta": false
            }
          ],
          "erros": 0
        },
        {
          "id": 6,
          "nivel": 6,
          "pergunta": "O que é o botão 'sair' ou 'logout' em um site?",
          "respostas": [
            {
              "texto": "Um botão que fecha o navegador",
              "correta": false
            },
            {
              "texto": "Um botão que apaga seu computador",
              "correta": false
            },
            {
              "texto": "Um botão que reinicia a página",
              "correta": false
            },
            {
              "texto": "Um botão para sair da sua conta com segurança",
              "correta": true
            },
            {
              "texto": "Um botão que salva sua senha",
              "correta": false
            },
            {
              "texto": "Um botão que apaga todas as mensagens",
              "correta": false
            }
          ],
          "erros": 0
        },
        {
          "id": 7,
          "nivel": 7,
          "pergunta": "testet",
          "respostas": [
            {
              "texto": "tste",
              "correta": true
            },
            {
              "texto": "teste",
              "correta": false
            },
            {
              "texto": "tweste",
              "correta": false
            },
            {
              "texto": "testet",
              "correta": false
            },
            {
              "texto": "wtsatw",
              "correta": false
            }
          ],
          "erros": 1
        }
      ]
    }
  ],
```


## Funcionalidades

Esta seção apresenta as funcionalidades da solução.Info

##### Funcionalidade 1 - Cadastro de Contatos ⚠️ EXEMPLO ⚠️

Permite a inclusão, leitura, alteração e exclusão de contatos para o sistema

* **Estrutura de dados:** [Contatos](#ti_ed_contatos)
* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o menu principal e escolha a opção Cadastros
  * Em seguida, escolha a opção Contatos
* **Tela da funcionalidade**:

![Tela de Funcionalidade](images/exemplo-funcionalidade.png)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente cada uma das funcionalidades que a aplicação fornece tanto para os usuários quanto aos administradores da solução.
>
> Inclua, para cada funcionalidade, itens como: (1) titulos e descrição da funcionalidade; (2) Estrutura de dados associada; (3) o detalhe sobre as instruções de acesso e uso.

## Estruturas de Dados

Descrição das estruturas de dados utilizadas na solução com exemplos no formato JSON.Info

##### Estrutura de Dados - Contatos   ⚠️ EXEMPLO ⚠️

Contatos da aplicação

```json
  {
    "id": 1,
    "nome": "Leanne Graham",
    "cidade": "Belo Horizonte",
    "categoria": "amigos",
    "email": "Sincere@april.biz",
    "telefone": "1-770-736-8031",
    "website": "hildegard.org"
  }
  
```

##### Estrutura de Dados - Usuários  ⚠️ EXEMPLO ⚠️

Registro dos usuários do sistema utilizados para login e para o perfil do sistema

```json
  {
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    email: "admin@abc.com",
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    login: "admin",
    nome: "Administrador do Sistema",
    senha: "123"
  }


## Funcionalidades

Esta seção apresenta as funcionalidades da solução.Info

##### Funcionalidade 1 - Cadastro de Contatos ⚠️ EXEMPLO ⚠️

Permite a inclusão, leitura, alteração e exclusão de contatos para o sistema

* **Estrutura de dados:** [Contatos](#ti_ed_contatos)
* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o menu principal e escolha a opção Cadastros
  * Em seguida, escolha a opção Contatos
* **Tela da funcionalidade**:

![Tela de Funcionalidade](images/exemplo-funcionalidade.png)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente cada uma das funcionalidades que a aplicação fornece tanto para os usuários quanto aos administradores da solução.
>
> Inclua, para cada funcionalidade, itens como: (1) titulos e descrição da funcionalidade; (2) Estrutura de dados associada; (3) o detalhe sobre as instruções de acesso e uso.

## Estruturas de Dados

Descrição das estruturas de dados utilizadas na solução com exemplos no formato JSON.Info

##### Estrutura de Dados - Contatos   ⚠️ EXEMPLO ⚠️

Contatos da aplicação

```json
  {
    "id": 1,
    "nome": "Leanne Graham",
    "cidade": "Belo Horizonte",
    "categoria": "amigos",
    "email": "Sincere@april.biz",
    "telefone": "1-770-736-8031",
    "website": "hildegard.org"
  }
  
```

##### Estrutura de Dados - Usuários  ⚠️ EXEMPLO ⚠️

Registro dos usuários do sistema utilizados para login e para o perfil do sistema

```json
  {
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    email: "admin@abc.com",
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    login: "admin",
    nome: "Administrador do Sistema",
    senha: "123"
  }


## Funcionalidades

Esta seção apresenta as funcionalidades da solução.Info

##### Funcionalidade 1 - Cadastro de Contatos ⚠️ EXEMPLO ⚠️

Permite a inclusão, leitura, alteração e exclusão de contatos para o sistema

* **Estrutura de dados:** [Contatos](#ti_ed_contatos)
* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o menu principal e escolha a opção Cadastros
  * Em seguida, escolha a opção Contatos
* **Tela da funcionalidade**:

![Tela de Funcionalidade](images/exemplo-funcionalidade.png)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente cada uma das funcionalidades que a aplicação fornece tanto para os usuários quanto aos administradores da solução.
>
> Inclua, para cada funcionalidade, itens como: (1) titulos e descrição da funcionalidade; (2) Estrutura de dados associada; (3) o detalhe sobre as instruções de acesso e uso.

## Estruturas de Dados

Descrição das estruturas de dados utilizadas na solução com exemplos no formato JSON.Info

##### Estrutura de Dados - Contatos   ⚠️ EXEMPLO ⚠️

Contatos da aplicação

```json
  {
    "id": 1,
    "nome": "Leanne Graham",
    "cidade": "Belo Horizonte",
    "categoria": "amigos",
    "email": "Sincere@april.biz",
    "telefone": "1-770-736-8031",
    "website": "hildegard.org"
  }
  
```

##### Estrutura de Dados - Usuários  ⚠️ EXEMPLO ⚠️

Registro dos usuários do sistema utilizados para login e para o perfil do sistema

```json
  {
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    email: "admin@abc.com",
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    login: "admin",
    nome: "Administrador do Sistema",
    senha: "123"
  }

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente as estruturas de dados utilizadas na solução tanto para dados utilizados na essência da aplicação quanto outras estruturas que foram criadas para algum tipo de configuração
>
> Nomeie a estrutura, coloque uma descrição sucinta e apresente um exemplo em formato JSON.
>
> **Orientações:**
>
> * [JSON Introduction](https://www.w3schools.com/js/js_json_intro.asp)
> * [Trabalhando com JSON - Aprendendo desenvolvimento web | MDN](https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Objects/JSON)

## Módulos e APIs

Esta seção apresenta os módulos e APIs utilizados na solução

**Images**:

* Unsplash - [https://unsplash.com/](https://unsplash.com/) ⚠️ EXEMPLO ⚠️

**Fonts:**

* Icons Font Face - [https://fontawesome.com/](https://fontawesome.com/) ⚠️ EXEMPLO ⚠️

**Scripts:**

* jQuery - [http://www.jquery.com/](http://www.jquery.com/) ⚠️ EXEMPLO ⚠️
* Bootstrap 4 - [http://getbootstrap.com/](http://getbootstrap.com/) ⚠️ EXEMPLO ⚠️

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente os módulos e APIs utilizados no desenvolvimento da solução. Inclua itens como: (1) Frameworks, bibliotecas, módulos, etc. utilizados no desenvolvimento da solução; (2) APIs utilizadas para acesso a dados, serviços, etc.

# Referências

As referências utilizadas no trabalho foram:

* https://oimparcial.com.br/negocios/2024/11/desafios-tecnologicos-comuns-enfrentados-pelos-idosos/
* https://www.mapfre.com/pt-br/actualidade/sustentabilidade/como-e-a-relacao-entre-idosos-e-tecnologia/
* https://www.editorarealize.com.br/editora/anais/cieh/2019/TRABALHO_EV125_MD1_SA9_ID1712_27052019125015.pdf

